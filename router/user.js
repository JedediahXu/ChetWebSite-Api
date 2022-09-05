const express = require('express')
const router = express.Router()
// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

router.get('/list', user_handler.list)
router.get('/buttons', user_handler.buttons)

module.exports = router
