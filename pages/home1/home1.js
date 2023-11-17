const job = wx.cloud.database().collection('job')
const user = wx.cloud.database().collection('buser')
Page({
  data: {
    job: [],
    location: '选择当前位置',
    screenShow: false,
    mainActiveIndex: '',
    activeId: '',
    activeList: ['', ''],
    items: [{
      text: '结算方式',
      children:[
        {text: '日结', id: 1},
        {text: '周结', id: 2},
        {text: '月结', id: 3},
        {text: '完工结', id: 4}
      ]
    },{
    text: '兼职类型',
    children:[
      {text: '全职', id: 5},
      {text: '兼职', id: 6}
    ]
  }]
  },
  async onLoad() {
    const res = await job.get()
    console.log(res)
    // 获取列表信息
    let jobList = []
    await Promise.all(res.data.map(async item => {
      const res = await user.where({ _openid: item._openid }).get()
      item['user'] = res.data[0]
      jobList.push(item)
      console.log(item)
    }))
    this.setData({
      job: jobList
    })
    // 获取当前用户所在位置
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        console.log(res)
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log("经度：" + longitude + "，纬度：" + latitude)
      },
      fai: res => {
        console.log(res)
      }
    })
  },
  onDetail(e) {
    console.log(e)
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  },
  onChooseLocation() {
    console.log('111')
    wx.chooseLocation({
      success: res => {
        var name = res.name; // 位置名称
        var address = res.address; // 详细地址
        var latitude = res.latitude; // 纬度
        var longitude = res.longitude; // 经度
        console.log("位置名称：" + name);
        this.setData({
          location: name
        })
        console.log("详细地址：" + address);
        console.log("纬度：" + latitude);
        console.log("经度：" + longitude);
      },
      fail: err => {
        console.log("选择位置失败：" + err.errMsg);
      }
    })
  },
  onScreenOut() {
    console.log('123')
    this.setData({
      screenShow: true
    })
  },
  onClickNav({ detail = {} }) {
    let { activeList, activeId } = this.data
    activeId = activeList[detail.index]
    console.log(activeList[detail.index])
    this.setData({
      mainActiveIndex: detail.index || 0,
      activeId
    });
  },
  onClickItem({ detail = {} }) {
    let { activeId, activeList, mainActiveIndex } = this.data;
    console.log(detail.id)
    activeId = detail.id
    activeList[mainActiveIndex] = activeId
    this.setData({ activeId, activeList })
  },
  onScreenOutConfirm() {
    // 选完之后需要刷新列表
    this.setData({ screenShow: false })
  },
  onSearch() {
    wx.navigateTo({ url: '../search/index' })
  },
  onClose() {
    this.setData({ screenShow: false })
  }
})