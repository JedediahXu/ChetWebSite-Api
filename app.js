const express = require('express')
const app = express()
const joi = require('joi')
const cors = require('cors')

app.use(cors())

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: true }))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 封装 res.cc 函数
app.use((req, res, next) => {
  // status 默认值为 1，表示失败的情况
  // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')

app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
// 查询接口
const userinfoApiRouter = require('./router/userinfo')
app.use('/api', userinfoApiRouter)

// 文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)
// 查询接口
const artCateApiRouter = require('./router/artcate')
app.use('/api/article', artCateApiRouter)

// 文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)
// 查询接口
const articleApiRouter = require('./router/article')
app.use('/api/article', articleApiRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof joi.ValidationError) return res.cc(err)
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  res.cc(req)
})

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})
