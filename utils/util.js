const { params } = require('../data/data')
const checkParams = (name, index) => {
  if(!name) {
    wx.showToast({
      title: `${params[index]}没填哦！`,
      icon: 'error'
    })
    return false
  }
  return true
}

module.exports = {
  checkParams
}
