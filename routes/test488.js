import express from 'express'
import Test488 from "../models/test488"

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
