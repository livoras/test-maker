class UploadImage extends React.Component {
  constructor(props) {
    super(props)
  } 
  componentDidMount() {
    let $btn = $(React.findDOMNode(this.refs.btn))
    let form = React.findDOMNode(this.refs.form)
    $btn.on("click", (event) => {
      event.preventDefault()

      let formData = new FormData(form)
      // ajax upload: http://stackoverflow.com/questions/21044798/how-to-use-formdata-for-ajax-file-upload
      formData.append("oldFileName", this.props.oldFileName)
      $.ajax({
        async: false,
        type: "POST",
        url: '/test488/images',
        data: formData,
        // THIS MUST BE DONE FOR FILE UPLOADING
        contentType: false,
        processData: false,
        // ... Other options like success and etc
        success: (data) => {
          this.props.onUploaded(data.name)
        },
        error: (data) => {
          alert("上传失败！" + data.msg)
        }
      })
    })
  }
  render() {
    return (
      <form ref="form" encType="multipart/form-data" method="POST">
        <input name="image" type="file" ref="input"/>
        <button ref="btn">上传</button>
      </form>
    )
  }
}

export default UploadImage