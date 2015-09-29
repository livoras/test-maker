import Maker from "./components/maker"
import Preview from "./components/preview"
import SideBar from "./components/side-bar"
import {clone} from "./common/util"
import config from "./common/config"

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tests,
      activeTestIndex: 0
    }
  }
  activateTest(activeTest, index) {
    this.setState({activeTestIndex: index})
  }
  onTestUpdated(test) {
    let tests = this.state.tests
    tests.splice(this.state.activeTestIndex, 1, test)
    this.setState({tests})
  }
  onTestDeleted(test) {
    let tests = this.state.tests
    let index = this.state.activeTestIndex
    tests.splice(index, 1)
    if (!tests[index]) index--
    this.setState({tests, activeTestIndex: index})
  }
  onNewTest() {
    let newTest = clone(config.test)
    let tests = this.state.tests
    tests.unshift(newTest)
    this.setState({tests, activeTestIndex: 0})
  }
  render() {
    let activeTest = this.state.tests[this.state.activeTestIndex] 
    return (
      <div>
        <div className="wrapper">
          <SideBar tests={this.state.tests} 
                   activateTest={this.activateTest.bind(this)}
                   activeTest={activeTest}
                   onNewTest={this.onNewTest.bind(this)}/>
          <Maker activeTest={activeTest}
                 onUpdated={this.onTestUpdated.bind(this)}
                 onDeleted={this.onTestDeleted.bind(this)}/>
        </div>
        <Preview/>
      </div>
    )
  }
}

React.render(<Page/>, document.getElementById("page"))
