Page({
  data: {
    show: false
  },
  onPersonal() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  }
})