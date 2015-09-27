class SideBar extends React.Component {
  constructor(props) {
    super(props)
  }
  onClickTest(i, event) {
    this.props.activateTest(this.props.tests[i], i)
  }
  onClickNew() {
    this.props.onNewTest()
  }
  render() {
    return (
      <div className="side-bar">
        <div className="tmt-ui-mt_xxl tmt-ui-flex btn sample__bb_1px">
          <a href="#" 
             onClick={this.onClickNew.bind(this)}
             className="tmt-btn tmt-btn_l tmt-btn_positive tmt-ui-flex__item tmt-ui-mr-m">新增</a>
        </div>
        <ul>
          {this.props.tests.map((test, i) => {
            let className = "test-item"
            if (this.props.activeTest === test) className += " active"
            return (
              <li className={className} onClick={this.onClickTest.bind(this, i)} key={i}>
                <span className="num">{i + 1}. </span>{test.title}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default SideBar
