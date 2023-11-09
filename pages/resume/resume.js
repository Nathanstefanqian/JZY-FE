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
      desc: ''
    },
    skillShowItem: {
      skillName: '',
      skillFileUrl: '',
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
    contactName: '',
    jobName: '',
    jobLookingFor: '你想要找的工作',
    show: [false, false, false, false, false],
    skillShow: false,
    jobValue: ["0","0","0","0"],
    timeShow: false,
    timeSelectShow: false,
    loading: true
  },
  onLoad() {
    user.where({
      _openid: 'oGJPU5X4rWM6geXlgV3C9WRAazf4'
    }).get().then(res => {
      res = res.data[0]
      console.log(res)
      this.setData({
        avatarUrl: res.avatarUrl,
        contact: res.contact,
        experienceList: res.experienceList,
        job: res.job,
        personal: res.personal,
        skillList: res.skillList,
        photoUrl: res.photoUrl
      })
    })
  },
  async onUpdateConfirm() {
    const { personal, experienceList, skillList, contact, photoUrl, job } = this.data
    // 上传用户生活照到云资源的userPhoto文件夹中
    let photoUrlTemp = []
    await Promise.all(photoUrl.map(async url => {
      if(url.includes("tmp")) {
        const res = await uploadFile(url)
        photoUrlTemp.push(res)
      } else {
        photoUrlTemp.push(url)
      }
    }))
    console.log('生活照列表', photoUrlTemp)
    // 上传用户的技能证书到云资源的userPhoto文件夹中
    let skillListTemp = []
    await Promise.all(skillList.map(async item => {
      let skillTemp = item
      let skillFileUrlTemp = []
      await Promise.all(item.skillFileUrl.map(async url => {
        if(url.includes("tmp")) {
          const res = await uploadFile(url)
          skillFileUrlTemp.push(res)
        } else {
          skillFileUrlTemp.push(url)
        }
      }))
      skillTemp.skillFileUrl = skillFileUrlTemp
      skillListTemp.push(skillTemp)
    }))
    console.log('技能列表', skillListTemp)
    await user.where({ _openid: "oGJPU5X4rWM6geXlgV3C9WRAazf4" }).update({
      data: {
        personal: personal,
        photoUrl: photoUrlTemp,
        experienceList: experienceList,
        skillList: skillListTemp,
        contact: contact,
        job: job
      }
    }).then( res => wx.showToast({ title: '成功更新'}))
  },
  imageOnLoad() {
    this.setData({
      loading: false
    })
  },
  onPersonalConfirm() {
    this.onClose()
  },
  onTimePickerConfirm(e) {
    const { startTime } = this.data
    console.log(e)
    const timestamp = e.detail
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需要加1
    const day = date.getDate();
    const standardDate = `${year}/${month}/${day}`;
    if(!startTime) {
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
    const time = startTime + ' - ' +  endTime
    experience.startTime = startTime
    experience.endTime = endTime
    this.setData({
      time: time,
      experience: experience,
      timeShow: false
    })
  },
  onContactConfirm() {
    const { phone, email, wx, qq } = this.data.contact
    const name = " 电话: " + phone + "; 微信: " + wx + "; 邮箱: " + email + "; QQ: " + qq + ";"
    this.setData({
      contactName: name,
      show: [false, false, false, false]
    })
  },
  onSkillConfirm() {
    const { skillName, skillFileUrl } = this.data
    let { skillList } = this.data
    skillList.push({ skillName, skillFileUrl })
    this.setData({
      skillList: skillList
    })
    this.onClose()
  },
  onExperienceConfirm() {
    const { experience } = this.data
    let  { experienceList }  = this.data
    experienceList.unshift(experience)
    this.setData({
      experienceList: experienceList,
      time: '',
      startTime: '',
      endTime: '',
      experience: {
        name: '',
        startTime: '',
        endTime: '',
        desc: ''
      }
    })
    this.onClose()
  },
  onJobLookingForConfirm() {
    const { jobValue, jobName } = this.data
    let { job } = this.data
    job.isPeriod = jobRequire[0][Number(jobValue[0])]
    job.worktime = jobRequire[1][Number(jobValue[1])]
    job.workday = jobRequire[2][Number(jobValue[2])]
    job.workperiod = jobRequire[3][Number(jobValue[3])]
    job.name = jobName
    const jobLookingFor = jobRequire[0][Number(jobValue[0])] + " ; " + jobRequire[1][Number(jobValue[1])] + " ; " + jobRequire[2][Number(jobValue[2])] + " ; " + jobRequire[3][Number(jobValue[3])] + " ; " + jobName + " ; "
    this.setData({
      jobLookingFor: jobLookingFor,
      job: job,
      show: [false, false, false, false]
    })
  },
  onPersonalChange(e) {
    let { personal } = this.data
    const key= ['在校学生党']
    const value = Number(e.detail)
    personal.id = key[value]
    this.setData({
      personal: personal
    })
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
  onTimeSelect(e) {
    console.log(e)
  },
  onTimeSelectShow(e) {
    this.setData({
      timeSelectShow: true
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
      show: show
    })
  },
  onExper() {
    let show = [false, true, false, false, false]
    this.setData({
      show: show
    })
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
      show: show
    })
  },
  onSkillDetailShow(e) {
    let { skillList,skillShowItem } = this.data
    const { index } = e.target.dataset
    console.log(skillList[index])
    skillShowItem = skillList[index]
    skillShowItem.index = index
    this.setData({
      skillShowItem: skillShowItem,
      skillShow: true
    })
  },
  onSkillInput(e) {
    const skillName = e.detail.value
    this.setData({
      skillName: skillName
    })
  },
  onUploadSkill() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      success(res) {
        console.log(res)
        const url = res.tempFilePaths[0]
        let { skillFileUrl } = that.data
        skillFileUrl = [...skillFileUrl, url]
        that.setData({
          skillFileUrl: skillFileUrl
        }, () => {
          wx.showToast({ title: '选择成功' })
        })
      }
    })
  },
  onUploadPhoto() {
    const that = this
    wx.chooseImage({
      count: 1, // 最多可选择的图片数量
      sizeType: ['compressed'], // 所选的图片的尺寸压缩方式
      sourceType: ['album', 'camera'], // 选择图片的来源，可以从相册选择或使用相机拍摄
      success(res) {
        console.log(res)
        const url = res.tempFilePaths[0]
        let { photoUrl } = that.data
        photoUrl = [...photoUrl, url]
        that.setData({
          photoUrl: photoUrl
        }, () => {
          wx.showToast({ title: '选择成功' })
        })
      }
    })
  },
  onContact() {
    let show = [false, false, false, true, false]
    this.setData({
      show: show
    })
  },
  onTimeShow() { 
    this.setData({
      timeShow: true
    })
  },
  onClose() {
    let show = [false, false, false, false]
    this.setData({
      show: show,
      skillShow: false
    })
  },
  onChange(e) {
    const radio = Number(e.currentTarget.dataset.radio)
    const value = e.detail
    const jobValue= this.data.jobValue
    jobValue[radio] = value
    this.setData({
      jobValue: jobValue
    },() => console.log(jobValue))
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
  onDeleteSkill() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '是否删除该技能',
      success: res => {
        let { skillList, skillShowItem } = that.data
        const { index } = skillShowItem
        skillList.splice(index, 1)
        that.setData({
          skillList: skillList,
          skillShow: false
        })
      }
    })

  }
})