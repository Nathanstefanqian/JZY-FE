// pages/home/home.js
/*
0 已报名 待录取
1 通过初筛
2 已录取 已结束
3 已拒绝
*/
const user_take = wx.cloud.database().collection('user_take')
const takeaway = wx.cloud.database().collection('takeaway')
const userLocation = wx.cloud.database().collection('userLocation')
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, '') // 将小数点及 'Z' 删除
  return formattedTime
}

const uploadFile = url => {
  const name = url.substring(url.lastIndexOf('/') + 1).toLowerCase()
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: `takeaway/${name}`, // 头像名用户openid命名
      filePath: url, // 选择的图片临时文件路径
      success: res => {
        console.log('图片上传成功', res.fileID)
        resolve(res.fileID)
      },
      fail: err => {
        console.error('图片上传失败', err)
        reject(err)
      }
    })
  })
}
const getCurrentLocation = () => {

}
/**
 * 跑腿平台工作台
 * 当有接单的时候，开始位置记录每隔20s更新一次记录
 * 1. 前往取餐点取餐，上传照片照片将同步到需求方
 * 2. 前往送餐点，送餐后上传照片同步到需求方
 *  图片都将保存到服务器以便后期查询
 * 3. 送餐完成后，需求方将订单state = 2 代表已结束
 * 此时该单结束，可以继续接下一单跑腿
 * state 0 已接单 1 已送达 2已结束
 * progress 0 已接单 1 已拿到 2 已送达 3 已结束
 */
Page({
  data: {
    isEmpty: false,
    isTaken: false,
    currentTakeaway: null,
    show: false,
    contactShow: false,
    phone: '',
    locationData: {},
    progress: 1,
    markers: []
  },
  // todo 接单后，该业务员的位置将一直保持更新
  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (wx.getStorageSync('isLogin')) {
      // 当前用户的位置获取
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          let latitude = res.latitude
          let longitude = res.longitude
          this.setData({ locationData: { latitude, longitude}})
        }
      })


      const openid = wx.getStorageSync('openid')
      /**
       *  user_take item.state = 0 已接单 1 已送达 2 已结束
       */

      // 获取用户当前是否有接单正在进行中
      let currentTaken
      let res = await user_take.where({ _openid: openid }).get()
      res.data.map(item => {
        if(item.state == 0) currentTaken = item
      })
      let currentTakeaway // 初始化对象take
      let isTaken = false
      await Promise.all(res.data.map(async item => {
        if (item.state == 0 || item.state == 1) {
          let res = await takeaway.where({ _id: item.jobId }).get()
          currentTakeaway = res.data[0]
          isTaken = true
        }
      }))
      this.setData({ isTaken })
      
      // 无正在进行
      if (!isTaken) {
        wx.hideLoading()
        return
      }

      // 如果有正在进行的接单，我们将取餐点和送达点标记在地图上
      const { workPlace, destPlace } = currentTakeaway
      let markers = [{ id: 1, latitude: workPlace.latitude, longitude: workPlace.longitude,
      callout:{ content: '取货地', display: 'ALWAYS'}, width: '25px', height: '25px' },
      { id: 2, latitude: destPlace.latitude, longitude: destPlace.longitude,
        callout:{ content: '送货地', display: 'ALWAYS'}, width: '25px', height: '25px' }
      ]
      this.setData({ currentTakeaway, markers })

      // 查看当前进度
      if(currentTaken.progress) {
        this.setData({ progress: currentTaken.progress })
      }
      wx.hideLoading()
    }
    else {
      wx.hideLoading()
      wx.showToast({ title: '请先登录', icon: 'error' })
    }
  },

  onShow() {
    this.onLoad()
  },

  onLog() {
    wx.navigateTo({
      url: '../log/log'
    })
  },

  onClose() {
    this.setData({
      show: false,
      contactShow: false
    })
  },

  onPhoneCalling() {
    const { currentTakeaway } = this.data
    this.setData({ contactShow: true, phone: currentTakeaway.contactValue })
  },

  onClipboard(e) {
    const { phone } = this.data
    wx.setClipboardData({
      data: phone,
      success: function (res) {
        wx.showToast({
          title: '电话已复制',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  onIhaveTaken() {
    const openid = wx.getStorageSync('openid')

    // 用户上传一张图片，并将url更新到user_take的表中，用户提前订阅该提醒，当骑手拿到单时，上传图片给管理端
    
    const { currentTakeaway } = this.data
    const that = this
    // 上传已接单并通知提醒
    wx.chooseMedia({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      async success(res) {
        const url = res.tempFiles[0].tempFilePath
        const ihaveTakenUrl = await uploadFile(url)

        // 更新到表中
        await user_take.where({ jobId: currentTakeaway._id }).update({
          data: {
            ihaveTakenUrl,
            progress: 2
          }
        })
        that.setData({ progress: 2  },() => {
          wx.showModal({ title: '已推送照片给商家', showCancel: false })
        })
        console.log('通知方的openid', currentTakeaway._openid)
        that.onLoad()
        // 消息通知 todo
        // wx.cloud.callFunction({
        //   name: 'sendTemplateMessage',
        //   data: {
        //     openid: currentTakeaway._openid, // 接收消息的用户openid
        //   }
        // })
      },

    })
  },

  onIhaveDelivered() {
    const openid = wx.getStorageSync('openid')

    // 用户上传一张图片，并将url更新到user_take的表中，用户提前订阅该提醒，当骑手拿到单时，上传图片给管理端
    
    const { currentTakeaway } = this.data
    const that = this
    // 上传已接单并通知提醒
    wx.chooseMedia({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      async success(res) {
        const url = res.tempFiles[0].tempFilePath
        const ihaveDeliveredUrl = await uploadFile(url)

        // 更新到表中
        await user_take.where({ jobId: currentTakeaway._id }).update({
          data: {
            ihaveDeliveredUrl,
            progress: 3
          }
        })
        that.setData({ progress: 3  },() => {
          wx.showModal({ title: '已推送照片给商家', showCancel: false })
        })
        console.log('通知方的openid', currentTakeaway._openid)
        that.onLoad()
        // 消息通知 todo
        // wx.cloud.callFunction({
        //   name: 'sendTemplateMessage',
        //   data: {
        //     openid: currentTakeaway._openid, // 接收消息的用户openid
        //   }
        // })
      },

    })
  },

  onDetail(e) {
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../resume/resume?id=${index}`
    })
  }
})