const colleges = [
  {
    name: '文学院'
  },
  {
    name: '理学院'
  },
  {
    name: '马克思主义学院'
  },
  {
    name: '经济与管理学院'
  },
  {
    name: '教育科学学院'
  },
  {
    name: '教师教育学院'
  },
  {
    name: '外国语学院'
  },
  {
    name: '化学化工学院'
  },
  {
    name: '机械工程学院'
  },
  {
    name: '信息科学技术学院'
  },
  {
    name: '电气工程学院'
  },
  {
    name: '纺织服装学院'
  },
  {
    name: '医学院'
  },
  {
    name: '公共卫生学院'
  },
  {
    name: '体育科学学院'
  },
  {
    name: '艺术学院'
  },
  {
    name: '地理科学学院'
  },
  {
    name: '交通与土木工程学院'
  },
  {
    name: '药学院'
  },
  {
    name: '国际教育学院'
  },
  {
    name: '张謇学院'
  },
  {
    name: '通科微电子学院'
  }
]

const sex = [
  {
    name: '男'
  },
  {
    name: '女'
  }
]

const grade = [
  {
    name: '大一'
  },
  {
    name: '大二'
  },
  {
    name: '大三'
  },
  {
    name: '大四'
  }
]

const params = [
  '微信名','头像', '姓名', '年级', '性别', '学号','学院', '专业', '手机号'
]

const jobRequire = [
  ["长期工作", "短期工作"],["工作日", "节假日", "寒暑假", "都可以"],["早班", "白班", "晚班", "都可以"],
  ["1-2天", "3-4天", "5天以上", "都可以"]
]
module.exports = {
  colleges,
  sex,
  grade,
  params,
  jobRequire
}