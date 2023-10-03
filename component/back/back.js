// component/back/back.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1,
        fail: () => wx.reLaunch({ url: '../../pages/home/home' })
      })
    }
  }
})
