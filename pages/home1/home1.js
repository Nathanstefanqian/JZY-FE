const job = wx.cloud.database().collection('job')
const user = wx.cloud.database().collection('buser')
const { imageUrl } = require('../../config/index')
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  var lat1Rad = degreesToRadians(lat1);
  var lat2Rad = degreesToRadians(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = earthRadiusKm * c;

  return distance.toFixed(1); // 保留一位小数
}
Page({
  data: {
    imageUrl,
    job: [],
    location: '选择当前位置',
    loc: null,
    screenShow: false,
    mainActiveIndex: '',
    activeId: '',
    activeList: ['', ''],
    timeList: [],
    nearList: [],
    items: [{
      text: '结算方式',
      children: [
        { text: '日结', id: 1 },
        { text: '周结', id: 2 },
        { text: '月结', id: 3 },
        { text: '完工结', id: 4 }
      ]
    }, {
      text: '兼职类型',
      children: [
        { text: '全职', id: 5 },
        { text: '兼职', id: 6 }
      ]
    }]
  },
  onShow() {
    this.onLoad()
  },
  async onLoad() {
    if(!wx.getStorageSync('isLogin')) {
      wx.showToast({ title: '请先登录', icon: 'error' })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 获取当前用户所在位置
    let { loc } = this.data
    if(!loc) {
      loc = await wx.getLocation({
        type: 'wgs84'
      })
    }
    const res = await job.get()
    console.log(res)
    // 获取列表信息
    const jobList = await Promise.all(res.data.map(async item => {
      let result = await user.where({ _openid: item._openid }).get()
      item['user'] = result.data[0]
      // 经度和纬度
      const { latitude, longitude } = item.workPlace
      const { latitude: la, longitude: lo } = loc
      const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
      item.distance = distance
      return item
    }))
    const timeList = jobList
    const nearList = jobList
    timeList.sort((a,b) => b.time - a.time)
    nearList.sort((a,b) => a.distance - b.distance)
    this.setData({
      job: jobList,
      loc,
      timeList,
      nearList
    }, () => wx.hideLoading())

  },
  onDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  },
  onChooseLocation() {
    wx.chooseLocation({
      success: res => {
        var name = res.name; // 位置名称
        var address = res.address; // 详细地址
        var latitude = res.latitude; // 纬度
        var longitude = res.longitude; // 经度
        console.log("位置名称：" + name);
        this.setData({
          location: name,
          loc: res
        })
        console.log(res)
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