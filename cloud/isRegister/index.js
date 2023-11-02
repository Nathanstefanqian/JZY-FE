// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud1-1ghsd84v3284f24b' })
// 云函数入口函数
exports.main = async (event, context) => {
  const { openId } = event.userInfo
  const db = cloud.database()
  const c = db.collection('user')
  const res = await c.where({ openId: openId }).get()
  return res
}
