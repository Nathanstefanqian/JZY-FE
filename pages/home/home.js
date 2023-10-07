Page({
  data: {
    active: 0,
    show: false,
    list: [1, 2, 3],
    isRefreshing: false,
    cardList: ['1', '2', '3', '4'],
    value1: 0,
    value2: 'a',    
    mainActiveIndex: 0,
    activeId: null,
    items: [
      {
        text: '职位类型',
        badge: 3,
        dot: true,
        // 禁用选项
        // 该导航下所有的可选项
        children: [
          {
            text: '全职',
            id: 1,
          },
          {
            text: '兼职',
            id: 2,
          }
        ]
      },
      {
        text: '结算类型',
        badge: 3,
        dot: true,
        // 禁用选项
        // 该导航下所有的可选项
        children: [
          {
            text: '日结',
            id: 1,
          },
          {
            text: '月结',
            id: 2,
          }
        ]
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