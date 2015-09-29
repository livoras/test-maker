import eventbus from "../common/eventbus"

let Preview = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      url: "about:blank",
      isHide: true
    }
  },
  toggle: function() {
    this.setState({isHide: !this.state.isHide})
  },
  componentDidMount: function() {
    eventbus.on("preview", (url) => {
      this.setState({url: url + "&" + Math.random(), isHide: false})
    })
  },
  render() {
    let previewClass = "preview"
    if (this.state.isHide) {
      previewClass += " hide"
    }
    return (
      <div className={previewClass}>
        <div className="toggle" onClick={this.toggle}>{this.state.isHide ? "展开预览":  "收起预览"}</div>
        <iframe className="" src={this.state.url}/>
      </div>
    )
  }
})

export default Preview