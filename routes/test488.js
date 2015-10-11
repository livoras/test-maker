import express from 'express'
import Test488 from "../models/test488"
import config from "../config"
import fs from "fs"
import uuid from "uuid"
import path from "path"
import escape from "escape-html"
import wesign from "wesign"
import crypto from "crypto"

let router = express.Router()

router.get('/admin', function(req, res, next) {
  Test488.find({}).sort({createdAt: -1}).exec(function(error, tests) {
    if (error) return res.status(500).send("Server Error")
    res.render('test488', {
      tests,
      title: '测试生成器488'
    })
  })
})

router.get('/:id', function(req, res, next) {
  let url = `http://${req.headers.host}${req.originalUrl}`
  Test488.findOne({_id: req.params.id}, function(error, test) {
    if (error) return res.status(404).send("Not Found.")
    let signature = wesign.signature(url)
    res.render('test488-index', {
      title: test.title,
      imagePath: "/upload/images/",
      test, signature, config
    })
  })
})

router.get('/:id/results/:value', function(req, res, next) {
  let url = `http://${req.headers.host}${req.originalUrl}`
  Test488.findOne({_id: req.params.id}, function(error, test) {
    if (error) return res.status(404).send("Not Found.")
    if (test.results.length === 0) return res.redirect(`/test488/${test._id}`)
    let signature = wesign.signature(url)
    let value = req.params.value
    let index = (req.query.rank === void 666)
      ? nbHash(value.slice(0, 3), test.results.length)
      : req.query.rank % test.results.length
    let result = test.results[index]
    let normalDesc = test.resultDescription.replace(/xxx/g, escape(value))
    normalDesc = normalDesc.replace(/yyy/g, result.result)

    let resultDescription = test.resultDescription.replace(/xxx/g, `<span class="value">${escape(value)} </span>`)
    test.resultDescription = resultDescription.replace(/yyy/g, `<span class="result">${result.result}</span>`)

    res.render('test488-result', {
      title: normalDesc,
      imagePath: "/upload/images/",
      normalDesc, result, test, signature, config
    })
  })
})

function nbHash(val, constrain) {
  let shasum = crypto.createHash("sha1")
  shasum.update(val)

  let str = shasum.digest("hex")
  let forEach = [].forEach;

  let num = 0
  forEach.call(str, function(bit, i) {
    num += str.charCodeAt(i)
  })

  return num  % constrain
}

router.post('/', function(req, res, next) {
  let data = JSON.parse(req.body.test)
  let newTest = Test488(data)
  newTest.save(function(err, data) {
    if (err) return res.status(404).json({result: "fail", msg: err})
    res.json({"result": "success", "msg": "OK", test: data})
  })
})

router.post('/images', function(req, res, next) {
  // 删除旧的文件
  req.busboy.on("field", function(name, value) {
    if (name === "oldFileName") {
      if (value.match(/default/)) {
        return console.log("Never remove default cover.")
      }
      fs.unlink(`${config.IMAGES_UPLOAD}/${value}`, function(err) {
        if (err) return
        console.log("DELETE file ok!")
      })
    }
  })
  // 新增文件
  let newFileName = ""
  let ext = ""
  req.busboy.on("file", function(fieldName, file, fileName) {
    newFileName = uuid.v4()
    ext = path.extname(fileName)
    let newFilePath = `${config.IMAGES_UPLOAD}/${newFileName}${ext}`
    let stream = fs.createWriteStream(newFilePath)
    file.on("data", function(data) {
      console.log(data, '...')
    })
    file.pipe(stream)
  })
  req.busboy.on("finish", function() {
    res.json({result: "success", name: `${newFileName}${ext}`})
  })
  req.pipe(req.busboy);
})

router.put("/:id", function(req, res) {
  let data = JSON.parse(req.body.test)
  Test488.update({_id: req.params.id}, data, function(err, data) {
    if (err) return res.status(404).json({result: "fail", msg: err})
    res.json({"result": "success", "msg": "OK", test: data})
  })
})

router.delete("/:id", function(req, res) {
  // TODO: Delete relevant images.
  Test488.remove({_id: req.params.id}, function(err, data) {
    if (err) return res.status(404).json({result: "fail", msg: err})
    res.json({"result": "success", "msg": "OK", test: data})
  })
})

module.exports = router
