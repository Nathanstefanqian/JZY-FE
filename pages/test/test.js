Page({
  data: {
    latitude: 0,
    longitude: 0
  },
  onLoad: function() {
  },
  // A小程序点击开始记录位置按钮的事件处理函数
// A小程序点击开始记录位置按钮的事件处理函数
startRecordingLocation: function() {
  const db = wx.cloud.database();
  const userLocations = db.collection('userLocations');
  const openid = wx.getStorageSync('openid');
  const that = this;
  
  let lastUpdateTime = 0; // 初始化上次更新时间为0
  const updateInterval = 10000; // 设置更新间隔为10秒

  userLocations.add({
    data: {}
  });

  wx.startLocationUpdate({
    success: function(res) {
      wx.onLocationChange(function(loc) {
        const currentTime = new Date().getTime();
        if (currentTime >= (lastUpdateTime + updateInterval)) {
          console.log('更新一次了')
          lastUpdateTime = currentTime; // 更新上一次更新时间
          that.setData({ latitude: loc.latitude, longitude: loc.longitude });
          
          userLocations.where({_openid: openid}).update({
            data: {
              latitude: loc.latitude,
              longitude: loc.longitude,
              timestamp: db.serverDate() // 使用服务器时间戳
            }
          }).then(() => {
            console.log('位置信息已更新到云数据库');
          }).catch((err) => {
            console.error('更新位置信息失败', err);
          });
        }
      });
    },
    fail: function(err) {
      console.error('开始记录位置失败', err);
    }
  });
},
onUnload: function() {
  // 停止监听位置变化，非常重要，以免耗费资源
  wx.stopLocationUpdate();
}
});