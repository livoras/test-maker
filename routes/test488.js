import express from 'express'
import Test488 from "../models/test488"
import config from "../config"
import fs from "fs"
import uuid from "uuid"
import path from "path"

let router = express.Router()

/* GET users listing. */
router.get('/', function(req, res, next) {
  Test488.find({}).sort({createdAt: -1}).exec(function(error, tests) {
    if (error) return res.status(500).send("Server Error")
    res.render('test488', {
      tests,
      title: '测试生成器488'
    })
  })
})

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
  req.busboy.on("file", function(fieldName, file, fileName) {
    let newFileName = uuid.v4()
    let ext = path.extname(fileName)
    let newFilePath = `${config.IMAGES_UPLOAD}/${newFileName}${ext}`
    let stream = fs.createWriteStream(newFilePath)
    stream.on("close", function() {
      res.json({result: "success", name: `${newFileName}${ext}`})
    })
    file.pipe(stream)
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
  Test488.remove({_id: req.params.id}, function(err, data) {
    if (err) return res.status(404).json({result: "fail", msg: err})
    res.json({"result": "success", "msg": "OK", test: data})
  })
})

module.exports = router
