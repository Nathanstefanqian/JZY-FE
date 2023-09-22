Page({
  data: {
    active: 0,
    list: [1, 2, 3],
    isRefreshing: false,
    option1: [
      { text: '全部任务', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '距离排序', value: 'a' },
      { text: '时间排序', value: 'b' },
    ],
    value1: 0,
    value2: 'a'
  },
  onPullDownRefresh() {
    this.setData({
      isRefreshing: true
    })
    setTimeout(() => {
      this.setData({
        isRefreshing: false
      })
      wx.stopPullDownRefresh()
    }, 2000);
  },
  onChange(event) {
    console.log(event)
    wx.showToast({
      title: `切换到${event.detail.title}`,
      icon: 'none',
    })
    this.setData({
      active: !active
    })
  },
  onSearch(event) {
      wx.navigateTo({
        url: '../search/search',
      })
  }
})