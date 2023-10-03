Page({
  data: {
    active: 0,
    show: false,
    list: [1, 2, 3],
    isRefreshing: false,
    cardList: ['1', '2', '3', '4'],
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' },
    ],
    value1: 0,
    value2: 'a',    
    mainActiveIndex: 0,
    activeId: null,
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
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
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
  onSelect() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onSearch() {
      wx.navigateTo({
        url: '../cover/cover',
      })
  },
  onClick() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  }
})