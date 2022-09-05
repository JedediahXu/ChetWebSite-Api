const joi = require('@hapi/joi')
const name = joi.string().required()
const alias = joi.string().required()
const id = joi.string().required()
const describe = joi.string().required()
// 向外共享验证规则对象
exports.add_cate_schema = {
  body: {
    name,
    alias,
    describe,
  },
}

// 删除分类
exports.delete_cate_schema = {
  params: {
    id,
  },
}

// 根据 Id 获取文章分类
exports.get_cate_schema = {
  params: {
    id,
  },
}

// 更新分类
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias,
    describe,
  },
}
