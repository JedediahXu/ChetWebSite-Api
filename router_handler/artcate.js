const path = require('path')
const db = require('../db/index')
const axios = require('axios')

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
  const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results,
    })
  })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cate_photos') return res.cc('分类封面是必选参数！')
  const sql = `select * from ev_article_cate where name=? or alias=?`
  db.query(sql, [req.body.name, req.body.alias, req.body.describe], (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 2) return res.cc('分类名称与分类别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与分类别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

    const sql = `insert into ev_article_cate set ?`

    const articleInfo = {
      ...req.body,
      cate_photos: path.join('/uploads', req.file.filename).replaceAll("\\", "//"),
    }

    db.query(sql, articleInfo, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
      res.cc('新增文章分类成功！', 0)
    })
  })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  const sql = `update ev_article_cate set is_delete=1 where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
    res.cc('删除文章分类成功！', 0)
  })
}

// 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章分类数据失败！')
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results[0],
    })
  })
}

// 根据 Id 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cate_photos') return res.cc('分类封面是必选参数！')
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
  db.query(sql, [req.body.Id, req.body.name, req.body.alias, req.body.describe], (err, results) => {
    if (err) return res.cc(err)

    // 判断名称和别名被占用的4种情况
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

    // 定义更新文章分类的 SQL 语句
    const sql = `update ev_article_cate set ? where Id=?`

    const articleInfo = {
      ...req.body,
      cate_photos: path.join('/uploads', req.file.filename),
    }

    // 执行更新文章分类的 SQL 语句
    db.query(sql, [articleInfo, req.body.Id, req.body.describe], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      res.cc('更新文章分类成功！', 0)
    })
  })
}

//获取掘金文章
exports.nuggetsArticles = (req, res) => {
  axios({
    method: 'post',
    url: 'https://api.juejin.cn/content_api/v1/article/query_list?aid=2608&uuid=7068557831083017764&spider=0',
    data: {
      "cursor": "0",
      "sort_type": 2,
      "user_id": "3685218709411085"
    },
    headers: {
      'Cookie': '_ga=GA1.2.1321116537.1645776876; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227068557831083017764%2522%252C%2522user_unique_id%2522%253A%25227068557831083017764%2522%252C%2522timestamp%2522%253A1645776876510%257D; sid_guard=40a3b00b7c04117360d96107c3dbd0b7%7C1651028323%7C31536000%7CThu%2C+27-Apr-2023+02%3A58%3A43+GMT; uid_tt=8c0d342341fae0823c5d3ec1bcd53fa9; uid_tt_ss=8c0d342341fae0823c5d3ec1bcd53fa9; sid_tt=40a3b00b7c04117360d96107c3dbd0b7; sessionid=40a3b00b7c04117360d96107c3dbd0b7; sessionid_ss=40a3b00b7c04117360d96107c3dbd0b7; sid_ucp_v1=1.0.0-KGQ1MGNiMDJiYTgwNTQ5Yjg4MTAwNzljMWFiYWYyYWI2NjJhMjI5NDIKFwiNquDA_fXFBhDj4qKTBhiwFDgCQPEHGgJsZiIgNDBhM2IwMGI3YzA0MTE3MzYwZDk2MTA3YzNkYmQwYjc; ssid_ucp_v1=1.0.0-KGQ1MGNiMDJiYTgwNTQ5Yjg4MTAwNzljMWFiYWYyYWI2NjJhMjI5NDIKFwiNquDA_fXFBhDj4qKTBhiwFDgCQPEHGgJsZiIgNDBhM2IwMGI3YzA0MTE3MzYwZDk2MTA3YzNkYmQwYjc; MONITOR_WEB_ID=f9f18b45-5e19-40ee-b91f-3a153a1ac7fc; _tea_utm_cache_2608={%22utm_source%22:%22infinitynewtab.com%22}; _gid=GA1.2.48546881.1662785778',
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then(({ data }) => {
    res.send({
      status: 0, data: data, message: '成功'
    })
  })
}
