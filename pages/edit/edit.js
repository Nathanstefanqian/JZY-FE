const { colleges, sex } = require('../../data/data')
Page({
  data: {
    show: false,
    actions: [],
    title: ''
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  schoolHandler() {
    this.setData({
      title: '请选择学院',
      show: true,
      actions: colleges
    })
  },
  sexHandler() {
    this.setData({
      title: '请选择性别',
      show: true,
      actions: sex
    })
  }
})