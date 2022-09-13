const express = require('express')
const router = express.Router()

// 导入文章分类的路由处理函数模块
const artCate_handler = require('../router_handler/artcate')
const multer = require('multer')
const path = require('path')
// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

router.get('/deletecate/:id', expressJoi(delete_cate_schema), artCate_handler.deleteCateById)
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handler.getArtCateById)
router.get('/cates', artCate_handler.getArtCates)

router.post('/updatecate', uploads.single('cate_photos'), expressJoi(update_cate_schema), artCate_handler.updateCateById)
router.post('/addcates', uploads.single('cate_photos'), expressJoi(add_cate_schema), artCate_handler.addArticleCates)

router.post('/nuggetsArticles', artCate_handler.nuggetsArticles)

module.exports = router
