import mongoose from "mongoose"

let test488Schema = new mongoose.Schema({
  // 首页配置
  title: {type: String, default: "这是测试的名字"},
  coverUrl: {type: String, default: "default-cover.jpg"},
  description: {type: String, default: "测试的描述"},
  inputPlaceHolder: {type: String, default: "请输入你的资料"},
  startText: {type: String, default: "开始测试"},
  shareText: {type: String, default: "分享"},
  addOn: {type: String, default: "<div style='display: none;'>more</div>"}, //插入广告和样式
  createdAt: {type: Date, default: Date.now},

  // 测试结果
  resultDescription: {type: String, default: "测试结果是："},
  resultStartText: {type: String, default: "点击测试"},
  resultShareText: {type: String, default: "分享"},
  resultAddOn: {type: String, default: "<div style='display: none;'>more</div>"}, //插入广告和样式

  results: [{
    coverUrl: {type: String, default: "default-cover.jpg"},
    resultMoreWording: {type: String, default: "不错的结果哦！"},
    result: {type: String, default: "呵呵"},
    addOn: {type: String, default: "<div style='display: none;'>more</div>"}
  }]
})


let Test488 = mongoose.model("Test488", test488Schema)

// for(var i = 0; i < 10; i++) {
//   let t = new Test488({title: `测试${i}`})
//   t.save(function(err, model) {
//     if (err) console.log(err)
//     console.log(model)
//   })
// }

export default Test488