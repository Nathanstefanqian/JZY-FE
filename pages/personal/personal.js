Page({
  data: {
    show: false,
    index: 0,
    actions: [],
    title: '',
    avatarUrl: wx.getStorageSync('avatarUrl'),
    nickName: wx.getStorageSync('nickName'),
    major: wx.getStorageSync('major'),
    schoolId: wx.getStorageSync('schoolId'),
    name: wx.getStorageSync('name'),
    grade: wx.getStorageSync('grade'),
    phone: wx.getStorageSync('phone'),
    sex: wx.getStorageSync('sex'),
    select: wx.getStorageSync('select'),
    school: wx.getStorageSync('school')
  },
  onLoad() {

  },
  onClose() {
    this.setData({
      show: false
    })
  }
})