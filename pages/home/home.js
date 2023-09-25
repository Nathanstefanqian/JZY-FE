Page({
  data: {
    active: 0,
    list: [1, 2, 3],
    isRefreshing: false,
    list: [{
        url: '../../assets/design.svg',
        title: '设计'
    },
    {
        url: '../../assets/develop.svg',
        title: '开发'
    },
    {
        url: '../../assets/running.svg',
        title: '运维'
    },
    {
        url: '../../assets/test.svg',
        title: '测试'
    },
    {
        url: '../../assets/anno.svg',
        title: '运营'
    },
    {
        url: '../../assets/depa.svg',
        title: '行政'
    },
    {
        url: '../../assets/data.svg',
        title: '数据'
    },   
    {
        url: '../../assets/more.svg',
        title: '更多'
    }
]
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
        url: '../cover/cover',
      })
  }
})