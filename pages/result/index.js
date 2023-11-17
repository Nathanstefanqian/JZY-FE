const app = getApp()
const { imageCdn } = app.globalData

Page({
  data: {
    keyword: '',
    imageCdn: imageCdn,
    jobList: [],
    option1: [
      { text: '全部', value: 0 },
      { text: '招聘中', value: 1 },
      { text: '待发布', value: 2 },
      { text: '已下线', value: 3 },
      { text: '审核驳回', value: 4 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a'
  },

  onLoad(query) {
    const { keyword } = query
  },

  handleSearch(e) {
    const { value } = e.detail
    wx.navigateTo({
      url: `../result/index?keyword=${value}`,
    })
  },

  handleDetail(e) {
    // console.log('跳转详情', e)
    let { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/index?id=${index}`
    })
  }
})