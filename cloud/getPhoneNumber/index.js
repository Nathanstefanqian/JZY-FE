// 云函数入口文件
// const wx = require('weixin-js-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { code } = event
  let result = null
  wx.request({
    url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber',
    method: post,
    data: {
      code: code
    },
    complete: res => result = res
  })

  return {
    result
  }
}