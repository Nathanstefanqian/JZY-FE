// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onEdit() {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },
  onTap() {
    wx.navigateTo({
      url: '../star/star',
    })
  }
})