const job = wx.cloud.database().collection('job')
const user = wx.cloud.database().collection('buser')
const takeaway = wx.cloud.database().collection('takeaway')
const { imageUrl } = require('../../config/index')
/* 
0代表兼职 1代表跑腿 2代表家教
*/
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

// sort为0代表时间，1代表距离
// status 1代表加载中， 2代表加载完成
Page({
  data: {
    currentPage: 1,
    status: 0,
    sortMethod: 0,
    imageUrl,
    job: [],
    location: '选择当前位置',
    loc: null,
    screenShow: false,
    takeawayList: [],
    active: 0,
    actions: [
      {
        name: '离我最近',
        id: 0
      },
      {
        name: '最新发布',
        id: 1
      }
    ]
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
    // 如果没有选择位置的话，获取当前位置
    let { loc } = this.data
    if(!loc) {
      loc = await wx.getLocation({
        type: 'wgs84'
      })
    }

    // 获得列表
    const { active, sortMethod } = this.data
    if(active == 0) {
      let jobList = (await job.where({ isTeacher: 0, state: 0 }).limit(10).get()).data
      jobList = await Promise.all(jobList.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 经度和纬度
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      // 进行排序
      if(!sortMethod) {
        jobList.sort((a,b) => b.updateTime - a.updateTime)

      } else {
        jobList.sort((a,b) => b.distance - a.distance)
      }
      this.setData({ job: jobList }, () => wx.hideLoading())
    }
    else if (active ==1) {
      let takeawayList = (await takeaway.where({ state: 0 }).limit(10).get()).data
      takeawayList = await Promise.all(takeawayList.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 计算取货地距离用户的位置
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      this.setData({ takeawayList }, () => wx.hideLoading())
      if(!sortMethod) {
        takeawayList.sort((a,b) => b.updateTime - a.updateTime)
      } else {
        takeawayList.sort((a,b) => b.distance - a.distance)
      }
    }
    else {
      let homeList = (await job.where({ isTeacher: 1, state: 0 }).limit(10).get()).data
      homeList = await Promise.all(homeList.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 经度和纬度
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      if(!sortMethod) {
        homeList.sort((a,b) => b.updateTime - a.updateTime)
      } else {
        homeList.sort((a,b) => b.distance - a.distance)
      }
      this.setData({ homeList }, () => wx.hideLoading())
    }
    this.setData({
      loc
    })
  },

  handleTabs(e) {
    console.log(e)
    this.setData({ currentPage: 1, active: e.detail.index })
    this.onLoad()
  },

  handleScroll(e) {
    const { index } = e.currentTarget.dataset

    // 获取滚动条的滚动位置
    var scrollTop = e.detail.scrollTop;

    // 获取内层容器的实际高度
    var scrollHeight = e.detail.scrollHeight;

    // 判断滚动条是否已经到达底部
    if (scrollHeight - scrollTop < 500) {
      const that = this
      this.setData({ status: 1 }, () => {
        that.loadMore(index)
      })
    }
  },

  async loadMore(index) {
    let { currentPage, job: jobList, homeList, takeawayList, loc } = this.data
    let skip = currentPage * 10
    if(index == 0) {
      let res = (await job.where({ state: 0, isTeacher: 0 }).skip(skip).limit(10).get()).data
      if(!res.length)  { 
        this.setData({ status: 2 }) 
        return 
      }
      // 后处理
      res = await Promise.all(res.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 经度和纬度
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      jobList = [...jobList, ...res]
      const { sortMethod } = this.data
      if(!sortMethod) {
        jobList.sort((a,b) => b.updateTime - a.updateTime)
      } else {
        jobList.sort((a,b) => b.distance - a.distance)
      }
      this.setData({ job: jobList, status: 0 })
    }
    else if(index == 1) {
      let res = (await takeaway.where({ state: 0 }).skip(skip).limit(10).get()).data
      if(!res.length)  { 
        this.setData({ status: 2 }) 
        return 
      }
      // 后处理
      res = await Promise.all(res.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 经度和纬度
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      takeawayList = [...takeawayList, ...res]
      const { sortMethod } = this.data
      if(!sortMethod) {
        takeawayList.sort((a,b) => b.updateTime - a.updateTime)
      } else {
        takeawayList.sort((a,b) => b.distance - a.distance)
      }
      this.setData({ takeawayList, status: 0 })
    }
    else if(index == 2) {
      let res = (await job.where({ state: 0, isTeacher: 1 }).skip(skip).limit(10).get()).data
      if(!res.length)  { 
        this.setData({ status: 2 }) 
        return 
      }
      // 后处理
      res = await Promise.all(res.map(async item => {
        let result = await user.where({ _openid: item._openid }).get()
        item['user'] = result.data[0]
        // 经度和纬度
        const { latitude, longitude } = item.workPlace
        const { latitude: la, longitude: lo } = loc
        const distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, la, lo)
        item.distance = distance
        return item
      }))
      homeList = [...homeList, ...res]
      const { sortMethod } = this.data
      if(!sortMethod) {
        homeList.sort((a,b) => b.updateTime - a.updateTime)
      } else {
        homeList.sort((a,b) => b.distance - a.distance)
      }
      this.setData({ homeList, status: 0 })
    }
    currentPage += 1
    this.setData({ currentPage })
  },

  onSelect(e) {
    const { id } = e.detail
    this.setData({ sortMethod: id },() => {
      this.onLoad()
    })
  },

  onDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  },

  onTeacherDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../teacher-detail/teacher-detail?id=${id}`
    })
  },

  onTakeAwayDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../takeaway-detail/takeaway-detail?id=${id}`
    })
  },

  onChooseLocation() {
    const that = this
    wx.chooseLocation({
      success: res => {
        this.setData({
          loc: res
        }, () => that.onLoad())
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