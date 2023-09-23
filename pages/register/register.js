Page({
    data() {
        radio: ''
    },
    login() {
        wx.navigateTo({
          url: '../login/login',
        })
    }
})