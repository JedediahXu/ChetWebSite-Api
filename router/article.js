const express = require('express')
const router = express.Router()

// 导入需要的处理函数模块
const article_handler = require('../router_handler/article')
// 导入 multer 和 path
const multer = require('multer')
const path = require('path')
// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_article_schema } = require('../schema/article')

router.get('/queryArticle', article_handler.queryArticle)
router.get('/queryIdArticle/:id', article_handler.queryIdArticle)
router.get('/queryPagination', article_handler.queryPagination)
router.get('/queryVague', article_handler.queryVague)
router.get('/queryPhoto', article_handler.queryPhoto)

router.post('/addPhoto', uploads.single('photo'), article_handler.addPhoto)
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

module.exports = router
