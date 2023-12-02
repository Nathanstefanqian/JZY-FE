// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid, // 接收消息的用户openid
      templateId: event.templateId, // 模板消息id
      page: 'pages/home1/home1', // 点击模板消息后跳转的页面
      data: {
        character_string1: {
          value: 'hello'
        },
        amount2: {
          value: '198'
        }
      }
    })
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}