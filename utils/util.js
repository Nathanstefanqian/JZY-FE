const { params } = require('../data/data')
const checkParams = (name, index) => {
  if(!name) {
    wx.showToast({
      title: `请检查填写！`,
      icon: 'error'
    })
    return false
  }
  return true
}

module.exports = {
  checkParams
}
