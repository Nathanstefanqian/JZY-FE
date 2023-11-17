let app = getApp()
const { imageCdn } = app.globalData

Page({
  data: {
    imageCdn: imageCdn,
    dialogVisible: false,
    dialogMessage: '确认清除历史记录吗？',
    searchHistory: []
  },

  onLoad() {
    this.setData({
      searchHistory: wx.getStorageSync('searchHistory') || []
    })
  },

  handleShowClearHistory() {
    this.setData({
      dialogVisible: true,
    })
  },

  handleDialogConfirm() {
    this.setData({
      searchHistory: [],
      dialogVisible: false
    })
    wx.setStorageSync('searchHistory', [])
  },

  handleDialogClose() {
    this.setData({
      dialogVisible: false
    })
  },

  handleSearch(e) {
    const { value } = e.detail
    if(!this.data.searchHistory.includes(value)) {
      this.setData({ searchHistory: [value,...this.data.searchHistory]
      },() => {
        wx.setStorageSync('searchHistory', this.data.searchHistory )
      })
    }
    // 跳转到一个搜索结果页
    wx.navigateTo({
      url: `../result/index?keyword=${value}`
    })
  },

  handleHistoryTap(e) {
    const { searchHistory } = this.data
    const { dataset } = e.currentTarget
    const keyword = searchHistory[dataset.index || 0 ] || ''
    if(keyword) {
      wx.navigateTo({
        url: `../result/index?keyword=${keyword}`
      })
    }
  }

/*
寄件
校外，校内
*/
})
