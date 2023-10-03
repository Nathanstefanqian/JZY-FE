Page({
  data: {
    active: 0,
  },
  onAssign() {
    wx.navigateTo({
      url: '../assign/assign',
    })
  }
});
