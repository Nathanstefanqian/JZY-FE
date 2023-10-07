// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

exports.main = async (event, context) => {
  const { data } = event
  const db = cloud.database()
  let result = ''
  db.collection('user').add({
    data: data,
    success: res => result = res,
    fail: err => result = err
  })

  return {
    result
  }
}