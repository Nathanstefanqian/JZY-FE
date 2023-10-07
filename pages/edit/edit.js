const { colleges, sex, grade } = require('../../data/data')
Page({
  data: {
    show: false,
    actions: [],
    title: '',
    avatarUrl: '../../assets/avatar.svg',
    nickName: '',
    major: '',
    schoolId: '',
    name: '',
    grade: '',
    phone: '',
    sex: ''
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onUpload() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      success(res) {
        console.log(res)
        const url = res.tempFilePaths[0] // 选择的图片临时文件路径，可能为数组（count > 1）
        that.setData({
          avatarUrl: url
        }, () => {
          wx.showToast({ title: '选择成功' })
        })
        const name = url.substring(url.lastIndexOf('/') + 1).toLowerCase(); // 获取最后一个斜杠后面到最后一个点号之间的内容
        // wx.cloud.uploadFile({
        //   cloudPath: `avatar/${name}`, // 头像名用户openid命名
        //   filePath: url, // 选择的图片临时文件路径
        //   success: res => {
        //     // 上传成功后的处理逻辑
        //     console.log('图片上传成功', res.fileID)
        //   },
        //   fail: err => {
        //     // 上传失败后的处理逻辑
        //     console.error('图片上传失败', err)
        //   }
        // })
      }
    })

  },
  onName(e) {
    const { value } = e.detail
    this.setData({
      name: value
    })
  },
  onGrade() {
    this.setData({
      title: '请选择年级',
      show: true,
      actions: grade
    })
  },
  onSchool() {
    this.setData({
      title: '请选择学院',
      show: true,
      actions: colleges
    })
  },
  onSex() {
    this.setData({
      title: '请选择性别',
      show: true,
      actions: sex
    })
  },
  onSchoolId(e) {
    const { value } = e.detail
    this.setData({
      schoolId: value
    })
  },
  onMajor(e) {
    const { value } = e.detail
    this.setData({
      major: value
    })
  },
  onPhone(e) {
    const { value } = e.detail
    this.setData({
      phone: value
    })
  },
  onGetUserInfo(e) {
    const rawData= JSON.parse(e.detail.rawData)
    this.setData({
      nickName: rawData.nickName,
      avatarUrl: rawData.avatarUrl
    })
  },
  onSubmit() {
    const data = { name: "钱卢骏"}
    console.log('123')
    wx.cloud.callFunction({
      name: 'register',
      data: data,
      complete: res => console.log(res)
    })
  }
})