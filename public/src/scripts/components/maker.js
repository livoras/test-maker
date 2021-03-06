import {clone} from "../common/util"
import config from "../common/config"
import ResultMaker from "./result-maker"
import UploadImage from "./upload-image"
import eventbus from "../common/eventbus"

let Maker = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    let state = this.getState()
    if (state && !state.activeResultIndex) state.activeResultIndex = 0
    return state
  },
  componentWillReceiveProps: function(props) {
    let state = this.getState(props)
    if (state && !state.activeResultIndex) state.activeResultIndex = 0
    this.replaceState(state)
  },
  getState: function(props) {
    props = props || this.props
    return props.activeTest || null
  },
  addResult: function() {
    let results = this.state.results
    results.push(clone(config.result))
    this.state.activeResultIndex = results.length - 1
    this.setState(this.state)
  },
  onDeleteResult: function() {
    let results = this.state.results
    let index = this.state.activeResultIndex
    results.splice(index, 1)
    if (!results[index]) index--
    this.setState({results, activeResultIndex: index})
  },
  selectResult: function(i) {
    this.setState({
      activeResultIndex: i
    })
  },
  saveTest: function() {
    if (this.state._id) {
      this.updateTest()
    } else {
      this.createTest()
    }
  },
  updateTest: function(cb) {
    $.ajax({
      url: `/test488/${this.state._id}`,
      type: "PUT",
      data: {
        test: JSON.stringify(this.state)
      },
      success: (data) => {
        if (data.result === "success") {
          this.alertSave()
          this.props.onUpdated(this.state)
          cb && cb()
        }
      },
      error: function(err) {
        alert("更新失败！" + err.msg)
      }
    })
  },
  createTest: function() {
    $.ajax({
      url: `/test488`,
      type: "POST",
      data: {
        test: JSON.stringify(this.state)
      },
      success: (data) => {
        if (data.result === "success") {
          this.alertSave()
          this.setState({_id: data.test._id})
          this.props.onUpdated(this.state)
        }
      },
      error: function(err) {
        alert("保存失败！" + err.msg)
      }
    })
  },
  alertSave: function() {
    let btn = React.findDOMNode(this.refs.saveBtn)
    btn.innerText = "OK"
    setTimeout(function() {
      btn.innerText = "保存"
    }, 1000)
  },
  deleteTest: function() {
    if (!confirm("确认删除？")) return;
    $.ajax({
      url: `/test488/${this.state._id}`,
      type: "DELETE",
      data: {
        test: JSON.stringify(this.state)
      },
      success: (data) => {
        if (data.result === "success") {
          alert("删除成功")
          this.props.onDeleted(this.state)
        }
      },
      error: function(err) {
        alert("删除失败！" + err.msg)
      }
    })
  },
  onUploadedImage: function(coverUrl) {
    this.setState({coverUrl})
  },
  preview: function(url) {
    eventbus.emit("preview", url)
  },
  previewResult: function() {
    eventbus.emit("preview", `/test488/${this.state._id}/results/膜蛤/?rank=${this.state.activeResultIndex}`)
  },
  render: function() {
    if (!this.state) {
      return (
        <div className="maker">
          <div>空空如也</div>
        </div>
      )
    }
    return (
      <div className="maker">

      <h2>
        测试配置: <a className="tmt-fc_link" href={"/test488/" + this.state._id} target="_blank">{this.state.title}</a>
      </h2>
      <div className="home-config">
        <h3>首页页面配置</h3>
        <div className="field">
          <span className="name">id</span>
          <span className="name">{this.state._id}</span>
        </div>

        <div className="field">
          <span className="name">标题</span>
          <input className="tmt-input" valueLink={this.linkState("title")}/>
        </div>

        <div className="field">
          <span className="name">封面</span>
          <span>{this.state.coverUrl}</span><br/>
          <UploadImage 
            onUploaded={this.onUploadedImage}
            oldFileName={this.state.coverUrl}/>
        </div>

        <div className="field">
          <span className="name">描述</span>
          <textarea className="tmt-input" valueLink={this.linkState("description")}/>
        </div>

        <div className="field">
          <span className="name">输入提示</span>
          <input className="tmt-input" valueLink={this.linkState("inputPlaceHolder")}/>
        </div>

        <div className="field">
          <span className="name">开始按钮</span>
          <input className="tmt-input" valueLink={this.linkState("startText")}/>
        </div>

        <div className="field">
          <span className="name">分享按钮</span>
          <input className="tmt-input" valueLink={this.linkState("shareText")}/>
        </div>

        <div className="field">
          <span className="name">首页插入内容</span>
          <textarea className="tmt-input" valueLink={this.linkState("addOn")}/>
        </div>

      </div>

      <div className="result-config">
        <h3>测试页面配置</h3>
        <div className="field">
          <span className="name">测试结果话术</span>
          <textarea className="tmt-input" valueLink={this.linkState("resultDescription")}/>
        </div>

        <div className="field">
          <span className="name">开始按钮</span>
          <input className="tmt-input" valueLink={this.linkState("resultStartText")}/>
        </div>

        <div className="field">
          <span className="name">分享按钮</span>
          <input className="tmt-input" valueLink={this.linkState("resultShareText")}/>
        </div>

        <div className="field">
          <span className="name">测试结果页插入内容</span>
          <textarea className="tmt-input" valueLink={this.linkState("resultAddOn")}/>
        </div>

      </div>

      <div className="results-page">
        <h3>测试结果</h3>
        <div className="results-nav">
          <ul>
            <li className="btn" onClick={this.addResult}>新增</li>
            {this.state.results.map((result, i) => {
              let className = "result-nav-item"
              if (i === this.state.activeResultIndex) {
                className += " active"
              }
              return (
                <li onClick={this.selectResult.bind(this, i)} className={className} key={i}>结果{i + 1}</li>
              )
            })}
          </ul>
        </div>

        <ResultMaker 
          onDeleteResult={this.onDeleteResult}
          previewResult={this.previewResult.bind(this)}
          result={this.state.results[this.state.activeResultIndex]}/>
      </div>


      <div className="btns">
        <a className="tmt-btn tmt-btn_m tmt-btn_positive" onClick={this.saveTest} ref="saveBtn">保存</a>
        <a className="tmt-btn tmt-btn_m tmt-btn_positive" onClick={this.preview.bind(this, "/test488/" + this.state._id + "?")}>预览首页</a>
        <a className="tmt-btn tmt-btn_m tmt-btn_negative" onClick={this.deleteTest}>删除</a>
      </div>

      </div>
    )
  }
})

export default Maker