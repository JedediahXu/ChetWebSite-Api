// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 导入生成 Token 的包
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body

  // 对表单中的数据，进行合法性的校验
  // if (!userinfo.username || !userinfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不合法！' })
  // }

  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // 调用 bcrypt.hashSync() 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      res.cc('注册成功！', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单的数据
  const userinfo = req.body
  console.log(userinfo);
  const sql = `select * from ev_users where username=?`
  db.query(sql, userinfo.username, (err, results) => {
    console.log(err);
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc({
      code: 500,
      message: '登录失败！',
    })

    // TODO：判断密码是否正确
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    console.log(compareResult);
    if (!compareResult) return res.cc({
      code: 403,
      message: '登录失败！',
    })

    // TODO：在服务器端生成 Token 的字符串
    const user = { ...results[0], password: '', user_pic: '' }
    // 对用户的信息进行加密，生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 调用 res.send() 将 Token 响应给客户端
    res.send({
      status: 0,
      code: 200,
      message: '登录成功！',
      data: {
        "access_token": 'Bearer ' + tokenStr,
      },
    })
  })
}


exports.list = (req, res) => {
  res.send({
    code: 200,
    data: [{
      "icon": "HomeOutlined",
      "title": "管理后台",
      "path": "/home/index"
    },
    {
      "icon": "AreaChartOutlined",
      "title": "超级看板",
      "path": "/dataScreen/index"
    },
    {
      "icon": "PieChartOutlined",
      "title": "照片上传",
      "path": "/dataPhoto/index",
    },
    {
      "icon": "FileTextOutlined",
      "title": "轨迹地图",
      "path": "/dataMaobox/index",
    },
    {
      "icon": "FundOutlined",
      "title": "文章撰写",
      "path": "/article",
      "children": [{
        "icon": "AppstoreOutlined",
        "path": "/article/classification",
        "title": "分类管理"
      },
      {
        "icon": "AppstoreOutlined",
        "path": "/article/newarticle",
        "title": "新撰文章"
      }
      ]
    },
    {
      "icon": "PaperClipOutlined",
      "title": "外部链接",
      "path": "/link",
      "children": [{
        "icon": "AppstoreOutlined",
        "path": "/link/github",
        "title": "GitHub 仓库",
        "isLink": "https://github.com/ChetSerenade"
      },
      {
        "icon": "AppstoreOutlined",
        "path": "/link/juejin",
        "title": "掘金文档",
        "isLink": "https://juejin.cn/user/3685218709411085"
      },
      {
        "icon": "AppstoreOutlined",
        "path": "/link/myBlog",
        "title": "个人博客",
        "isLink": "https://www.gaoyuzi.cn/"
      }
      ]
    }
    ],
    message: '成功！',
  })
}

exports.buttons = (req, res) => {
  res.send({
    code: 200,
    data: {
      "useHooks": {
        "add": true,
        "delete": true
      }
    },
    message: '成功！',
  })
}
