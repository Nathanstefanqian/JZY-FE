// component/back/back.js
const { imageUrl }  = require('../../config/index')

Component({
  data: {
    imageUrl
  },
  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1,
        fail: () => wx.reLaunch({ url: '../../pages/home/home' })
      })
    }
  }
})
