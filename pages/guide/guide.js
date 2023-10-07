Page({
  data: {
    isActive: 0,
    list: [{
        url: '../../assets/guide1.svg',
        title: '得到你梦想的工作',
        subtitle: '在我们的应用中的小工具中获取工作推荐、搜索和保存工作机会',
        show: true
    },
    {
        url: '../../assets/guide2.svg',
        title: '方便在您随时方便使用',
        subtitle: '在我们的应用中的小工具中获取工作推荐、搜索和保存工作机会',
        show: false
    },
    {
        url: '../../assets/guide3.svg',
        title: '轻松管理简历',
        subtitle: '在我们的应用中的小工具中获取工作推荐、搜索和保存工作机会',
        show: false
    }
	]
  },
  onLoad(options) {
  },

  toggle() {
      let { list } = this.data
      let index = list.findIndex(item => item.show === true)
      list[index].show = false
      list[index+1].show = true
      this.setData({
          list: list,
          isActive: index+1
      })
	},
	
	login() {
		wx.switchTab({
			url: '../home/home'
		})
	},

	register() {
		wx.navigateTo({
			url: '../register/register'
		})
	}
})