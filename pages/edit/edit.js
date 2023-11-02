const { colleges, sex, grade } = require('../../data/data')
const user = wx.cloud.database().collection('user')
const user_job = wx.cloud.database().collection('user_job')
const uploadFile = url => {
  const name = url.substring(url.lastIndexOf('/') + 1).toLowerCase()
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: `avatar/${name}`, // 头像名用户openid命名
      filePath: url, // 选择的图片临时文件路径
      success: res => {
        console.log('图片上传成功', res.fileID)
        resolve(res.fileID)
      },
      fail: err => {
        console.error('图片上传失败', err)
        reject(err)
      }
    })
  })
}
const { checkParams } = require('../../utils/util')
Page({
  data: {
    show: false,
    index: 0,
    actions: [],
    title: '',
    avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
    nickName: wx.getStorageSync('nickName') || '1',
    major: wx.getStorageSync('major') || '1',
    schoolId: wx.getStorageSync('schoolId') || '1',
    name: wx.getStorageSync('name') ||'1',
    grade: wx.getStorageSync('grade') ||'1',
    phone: wx.getStorageSync('phone') ||'1',
    sex: wx.getStorageSync('sex') ||'1',
    select: '1',
    school: wx.getStorageSync('school') ||'1'
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
        const url = res.tempFilePaths[0]
        that.setData({
          avatarUrl: url
        }, () => {
          wx.showToast({ title: '选择成功' })
        })
      }
    })
  },
  onName(e) {
    const { value } = e.detail
    this.setData({
      name: value
    })
  },
  onNickName(e) {
    const { value } = e.detail
    this.setData({
      nickName: value
    })
  },
  onGrade() {
    this.setData({
      title: '请选择年级',
      show: true,
      actions: grade,
      index: 2
    })
  },
  onSchool() {
    this.setData({
      title: '请选择学院',
      show: true,
      actions: colleges,
      index: 1
    })
  },
  onSex() {
    this.setData({
      title: '请选择性别',
      show: true,
      actions: sex,
      index: 0
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
    const rawData = JSON.parse(e.detail.rawData)
    this.setData({
      nickName: rawData.nickName,
      avatarUrl: rawData.avatarUrl
    })
  },
  onSelect(e) {
    const { name } = e.detail
    const { index } = this.data
    const list = ['sex', 'school', 'grade']
    const vari = list[index]
    this.setData({
      [vari]: name
    })
  },
  async onSubmit() {
    const { nickName, name, grade, sex, schoolId, school, major, phone, avatarUrl } = this.data
    wx.showLoading({
      title: '加载中', // 可自定义加载提示文字
      mask: false // 是否显示遮罩层
    })
    const res = await uploadFile(avatarUrl).catch(err => { wx.hideLoading() })
    const data = [ nickName, res, name, grade, sex, schoolId, school, major, phone ]
    for(let i = 0; i < data.length; i++) {
      if(!checkParams(data[i], i)) return;
    }
    const obj = { nickName, name, grade, sex, schoolId, school, major, phone, avatarUrl: res }
    // 在需要显示加载中效果的地方调用
    user.add({
      data: obj,
      complete: res =>  {
        wx.hideLoading()
        wx.showToast({ title: '注册成功' })
        wx.setStorageSync('key', data)
        for(let key in obj) {
          wx.setStorageSync(key, obj[key])
        }
        wx.setStorageSync('isLogin', true)
        wx.navigateBack()
    }})
  }
})