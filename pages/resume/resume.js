const { jobRequire } = require('../../data/data')
const user = wx.cloud.database().collection('user')
const uploadFile = url => {
  const name = url.substring(url.lastIndexOf('/') + 1).toLowerCase()
  console.log(name)
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: `user/${name}`, // 文件名为临时文件的名称
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
Page({
  data: {
    job: {
      isPeriod: '',
      worktime: '',
      workday: '',
      workperiod: '',
      name: ''
    },
    personal: {
      sex: '男',
      age: '',
      id: ''
    },
    name: '',
    contact: {
      phone: '',
      email: '',
      wx: '',
      qq: ''
    },
    experience: {
      name: '',
      startTime: '',
      endTime: '',
      desc: '',
      index: ''
    },
    skill: {
      skillName: '',
      fileList: [],
      index: ''
    },
    experienceList: [],
    skillList: [],
    skillFileUrl: [],
    photoUrl: [],
    minDate: 1577808000000,
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    startTime: '',
    endTime: '',
    time: '',
    contactName: '点击查看联系方式',
    jobName: '',
    jobLookingFor: '你想要找的工作',
    show: [false, false, false, false, false],
    skillShow: false,
    jobValue: ["0", "0", "0", "0"],
    timeShow: false,
    timeSelectShow: false,
    loading: true,
    isExperienceModify: false,
    isSkillModify: false
  },
  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    let res = await user.where({ _openid: openid }).get()
    res = res.data[0]

    this.setData({
      sex: res.sex,
      avatarUrl: res.avatarUrl || '',
      contact: res.contact || {},
      experienceList: res.experienceList || [],
      job: res.job || {},
      personal: res.personal || {},
      skillList: res.skillList || [],
      photoUrl: res.photoUrl || [],
      jobLookingFor: res.job ? res.job.isPeriod + ' ; ' + res.job.worktime + ' ; ' + res.job.workday + ' ; ' + res.job.workperiod + ' ; ' + res.job.name + ' ; ' : '点击添加你想要找的工作'
    }, () => wx.hideLoading())
  },
  // 表单输入方法
  onPersonalChange(e) {
    let { personal } = this.data
    const key = ['在校学生党']
    const value = Number(e.detail)
    personal.id = key[value]
    this.setData({ personal })
  },
  onAgeInput(e) {
    let { personal } = this.data
    personal.age = e.detail.value
    this.setData({ personal: personal })
  },
  onJobNameInput(e) {
    this.setData({
      jobName: e.detail.value
    })
  },
  onPhoneInput(e) {
    const { contact } = this.data
    contact.phone = e.detail.value
    this.setData({
      contact: contact
    })
  },
  onEmailInput(e) {
    const { contact } = this.data
    contact.email = e.detail.value
    this.setData({
      contact: contact
    })
  },
  onWxInput(e) {
    const { contact } = this.data
    contact.wx = e.detail.value
    this.setData({
      contact: contact
    })
  },
  onQQInput(e) {
    const { contact } = this.data
    contact.qq = e.detail.value
    this.setData({
      contact: contact
    })
  },
  onCompanyNameInput(e) {
    let { experience } = this.data
    experience.name = e.detail.value
    this.setData({
      experience: experience
    })
  },
  onTimeInput(e) {
    let { experience } = this.data
    experience.time = e.detail.value
    this.setData({
      experience: experience
    })
  },
  onJobDescInput(e) {
    let { experience } = this.data
    experience.desc = e.detail.value
    this.setData({
      experience: experience
    })
  },
  onSkillInput(e) {
    let { skill } = this.data
    const skillName = e.detail.value
    skill.skillName = skillName
    this.setData({
      skill
    })
  },

  // 菜单展示方法
  onTimeSelectShow(e) {
    this.setData({
      timeSelectShow: true
    })
  },
  onTimeShow() {
    this.setData({
      timeShow: true
    })
  },
  onPersonal() {
    const { show } = this.data
    show[4] = true
    this.setData({
      show: show
    })
  },
  onJob() {
    let show = [true, false, false, false, false]
    this.setData({
      show
    })
  },
  onExper() {
    let show = [false, true, false, false, false]
    this.setData({
      show: show,
      time: '',
      startTime: '',
      endTime: '',
      experience: {
        name: '',
        startTime: '',
        endTime: '',
        desc: '',
        index: ''
      }
    }) // 清除缓存
  },
  onEducation() {
    let show = [false, false, true, false, false]
    this.setData({
      show: show
    })
  },
  onSkill() {
    let show = [false, false, true, false, false]
    this.setData({
      show: show,
      skill: {
        skillName: '',
        fileList: [],
        index: ''
      },
      isSkillModify: false
    }) // 重置并开启
  },
  onContact() {
    let show = [false, false, false, true, false]
    this.setData({
      show: show
    })
  },
  onSkillDetailShow(e) {
    let show = [false, false, true, false, false]
    const { item } = e.currentTarget.dataset
    let skill = item
    this.setData({ skill, show, isSkillModify: true })
  },

  // 本地数据存储
  onPersonalConfirm() {
    this.onClose()
  },
  onJobLookingForConfirm() {
    const { jobValue, jobName } = this.data
    let { job } = this.data
    console.log(job)
    job.isPeriod = jobRequire[0][Number(jobValue[0])]
    job.worktime = jobRequire[1][Number(jobValue[1])]
    job.workday = jobRequire[2][Number(jobValue[2])]
    job.workperiod = jobRequire[3][Number(jobValue[3])]
    job.name = jobName
    const jobLookingFor = jobRequire[0][Number(jobValue[0])] + " ; " + jobRequire[1][Number(jobValue[1])] + " ; " + jobRequire[2][Number(jobValue[2])] + " ; " + jobRequire[3][Number(jobValue[3])] + " ; " + jobName + " ; "
    this.setData({
      jobLookingFor,
      job,
      show: [false, false, false, false]
    })
  },
  onTimePickerConfirm(e) {
    const { startTime } = this.data
    const timestamp = e.detail
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需要加1
    const day = date.getDate();
    const standardDate = `${year}/${month}/${day}`;
    if (!startTime) {
      this.setData({
        timeSelectShow: false,
        startTime: standardDate,
        minDate: timestamp
      })
    }
    else {
      this.setData({
        timeSelectShow: false,
        endTime: standardDate,
        minDate: 1577808000000
      })
    }
  },
  onTimeConfirm(e) {
    const { startTime, endTime } = this.data
    let { experience } = this.data
    const time = startTime + ' - ' + endTime
    experience.startTime = startTime
    experience.endTime = endTime
    this.setData({
      time: time,
      experience: experience,
      timeShow: false
    })
  },
  onContactConfirm() {
    let { phone, email, wx, qq } = this.data.contact
    if (!phone) phone = '暂无'
    if (!email) email = '暂无'
    if (!qq) qq = '暂无'
    if (!wx) wx = '暂无'
    const name = " 电话: " + phone + "; 微信: " + wx + "; 邮箱: " + email + "; QQ: " + qq + ";"
    this.setData({
      contactName: name,
      show: [false, false, false, false]
    })
  },
  onSkillConfirm() {
    let { skill, skillList } = this.data
    skill.index = skillList.length + 1
    skillList.push(skill)
    this.setData({ skillList })
    this.onClose()
  },
  onSkillModify() {
    const { skill } = this.data
    let { skillList } = this.data
    let index = skillList.findIndex(item => item.index == skill.index) // 查找下标
    skillList[index] = skill
    this.setData({ skillList }, () => wx.showToast({ title: '修改成功' }))
    this.onClose()
  },
  onSkillDelete() {
    let { skill, skillList } = this.data

    let index = skillList.findIndex(item => item.index == skill.index) // 查找下标
    skillList.splice(index, 1)
    this.setData({ skillList }, () => wx.showToast({ title: '删除成功' }))

    this.onClose()
  },
  onExperienceConfirm() {
    let { experience } = this.data
    let { experienceList } = this.data
    experience.index = experienceList.length + 1
    experienceList.unshift(experience) // 往头部添加
    this.setData({
      experienceList
    })
    this.onClose()
  },
  onExperienceModify() {
    const { experience } = this.data
    let { experienceList } = this.data
    let index = experienceList.findIndex(item => item.index == experience.index) // 查找下标
    experienceList[index] = experience
    this.setData({ experienceList }, () => wx.showToast({ title: '修改成功' }))
    this.onClose()
  },
  onExperienceDelete() {
    const { experience } = this.data
    let { experienceList } = this.data
    let index = experienceList.findIndex(item => item.index == experience.index) // 查找下标
    experienceList.splice(index, 1)
    this.setData({ experienceList }, () => wx.showToast({ title: '删除成功' }))
    this.onClose()
  },
  //

  // 服务器上传
  async onUpdateConfirm() {
    const { personal, experienceList, skillList, contact, photoUrl, job } = this.data
    const openid = wx.getStorageSync('openid')
    // 更新数据
    await user.where({ _openid: openid }).update({
      data: {
        personal,
        photoUrl,
        experienceList,
        skillList,
        contact,
        job
      }
    }).then(res => wx.showToast({ title: '成功更新' }))
  },
  onExperienceDetail(e) {
    let show = [false, true, false, false, false]
    let isExperienceModify = true
    const { item } = e.currentTarget.dataset
    let time = item.startTime + ' - ' + item.endTime
    this.setData({ show, experience: item, time, isExperienceModify })
  },
  async uploadSkill(e) {
    // 存放url的fileList中的地址
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    let { file } = e.detail
    let { skill } = this.data
    const { url } = file
    const res = await uploadFile(url) // 上传技能文件
    file.url = res
    skill.fileList.push(file) // 存放到fileList的是文件在云端的地址
    console.log(skill)
    this.setData({ skill }, () => {
      wx.showToast({
        title: '上传成功'
      })
      wx.hideLoading()
    })
  },
  deleteSkill(e) {
    let { skill } = this.data
    const { index } = e.detail
    skill.fileList.splice(index, 1)
    this.setData({ skill }, () => wx.showToast({ title: '删除成功' }))
  },
  async uploadPhoto(e) {
    // 存放url的fileList中的地址
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    let { file } = e.detail
    let { photoList = [] } = this.data
    const { url } = file
    const res = await uploadFile(url)
    file.url = res
    photoList.push(file) // 存放到fileList的是文件在云端的地址
    this.setData({ photoList }, () => {
      wx.showToast({
        title: '上传成功'
      })
      wx.hideLoading()
    })
  },
  deletePhoto() {

  },
  onTimeSelect(e) {
    console.log(e)
  },
  onUploadPhoto() {
    const that = this
    wx.chooseMedia({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      async success(res) {
        wx.showLoading({
          title: '上传中',
        })
        const url = res.tempFiles[0].tempFilePath
        const result = await uploadFile(url) // 上传
        let { photoUrl } = that.data
        photoUrl = [...photoUrl, result]
        that.setData({
          photoUrl
        }, () => {
          wx.showToast({ title: '上传成功' })
          wx.hideLoading()
        })
      }
    })
  },
  onClose() {
    let show = [false, false, false, false]
    this.setData({
      show: show,
      skillShow: false,
      isExperienceModify: false
    })
  },
  onChange(e) {
    const radio = Number(e.currentTarget.dataset.radio)
    const value = e.detail
    const jobValue = this.data.jobValue
    jobValue[radio] = value
    this.setData({
      jobValue: jobValue
    }, () => console.log(jobValue))
  },
  onTimeClose() {
    this.setData({
      timeShow: false
    })
  },
  onTimeSelectorClose() {
    this.setData({
      timeSelectShow: false
    })
  },
  onLongPress(e) {
    const { index } = e.currentTarget.dataset
    const that = this
    wx.showModal({
      title: '确认删除吗',
      icon: 'error',
      complete: res => {
        if (res.confirm) {
          let { photoUrl } = that.data
          photoUrl.splice(index, 1)
          this.setData({ photoUrl }, () => wx.showToast({ title: '删除成功' }))
        }
      }
    })
  },
  onPhotoPreview(event) {
    var { index } = event.currentTarget.dataset; // 获取当前点击的图片链接
    const { photoUrl } = this.data
    console.log(photoUrl[index])
    wx.previewImage({
      current: photoUrl[index],
      urls: photoUrl // 当前显示图片的链接
    })
  }
})