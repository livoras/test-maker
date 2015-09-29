import UploadImage from "./upload-image"
import eventbus from "../common/eventbus"

let ResultMaker = React.createClass({
  getInitialState: function() {
    return this.getState(this.props)
  },
  componentWillReceiveProps: function(props) {
    return this.replaceState(this.getState(props))
  },
  getState: function(props) {
    props = props || this.props 
    return props.result || {}
  },
  setAttr: function(attr, event) {
    let val = event.currentTarget.value
    this.setState({[attr]: val})
    this.props.result[attr] = val
  },
  deleteResult: function() {
    if (!confirm("删除该测试结果页面？")) return
    this.props.onDeleteResult()
  },
  onUploadedImage: function(coverUrl) {
    this.setState({coverUrl})
    this.props.result.coverUrl = coverUrl
  },
  previewResult: function() {
    this.props.previewResult()
  },
  render: function() {
    if (!this.props.result) return (<div/>);
    return (
      <div className="result-maker-config">

        <div className="field">
          <span className="name">封面</span>
          <span>{this.state.coverUrl}</span><br/>
          <UploadImage 
            onUploaded={this.onUploadedImage}
            oldFileName={this.state.coverUrl}/>
        </div>

        <div className="field">
          <span className="name">结果</span>
          <input className="tmt-input" 
                 value={this.state.result}
                 onChange={this.setAttr.bind(this, "result")}/>
        </div>

        <div className="field">
          <span className="name">煽动话术</span>
          <input className="tmt-input" 
                 value={this.state.resultMoreWording}
                 onChange={this.setAttr.bind(this, "resultMoreWording")}/>
        </div>

        <div className="field">
          <span className="name">此结果插入内容</span>
          <textarea className="tmt-input" 
                    value={this.state.addOn}
                    onChange={this.setAttr.bind(this, "addOn")}/>
        </div>

        <a className="tmt-btn tmt-btn_m tmt-btn_negative" onClick={this.deleteResult}>删除</a>
        <a className="tmt-btn tmt-btn_m tmt-btn_positive" onClick={this.previewResult}>预览该结果页</a>
      </div>
    )
  }
})

export default ResultMaker