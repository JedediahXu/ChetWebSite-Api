// 文章的处理函数模块
const path = require('path')
const db = require('../db/index')

// 发布文章的处理函数
exports.addArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // TODO：证明数据都是合法的，可以进行后续业务逻辑的处理
  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename).replaceAll("\\", "//"),
    pub_date: new Date().toLocaleDateString(),
    visitor_volume: 0,
  }
  const sql = `insert into ev_articles set ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布新文章失败！')
    res.cc('发布文章成功！', 0)
  })
}

// 查找文章的处理函数
exports.queryArticle = (req, res) => {
  const sql = `select * from ev_articles`
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章数据成功！',
      data: results,
    })
  })
}

// 分类id查找文章
exports.queryIdArticle = (req, res) => {
  const sql = `select * from ev_articles  where cate_id=? order by Id`
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '分类获取文章数据成功！',
      data: results,
    })
  })
}

//queryPagination 分页查找文章
exports.queryPagination = (req, res) => {
  const page_num = req.query.page_num
  const page_size = req.query.page_size
  const page_id = req.query.page_id
  const value = req.query.text

  if (page_id !== '0') {
    var params = [page_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size),]
    var sql = `select * from ev_articles where content like '%${value}%'  and cate_id=?  order by Id desc limit ?,? `
  } else {
    var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size),]
    var sql = `select * from ev_articles where content like '%${value}%' order by Id desc limit ?,?`
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      res.json({
        code: 1,
        message: '查询失败'
      })
    } else {
      if (page_id !== '0') {
        var sqlTotal = `select count(*) as id from ev_articles where  content like '%${value}%' and cate_id=? order by Id`
        db.query(sqlTotal, page_id, function (error, among) {
          if (error) {
            console.log(error);
          } else {
            let total = among[0]['id']
            res.json({
              result: 1,
              status: 200,
              message: "success",
              data: result,
              paging: {
                page_num: page_num,
                page_size: page_size,
                total: total
              }
            })
          }
        })
      } else {
        var sqlTotal = `select count(*) as id from ev_articles where content like '%${value}%' order by Id`
        db.query(sqlTotal, function (error, among) {
          if (error) {
            console.log(error);
          } else {
            let total = among[0]['id']
            res.json({
              result: 1,
              status: 200,
              message: "success",
              data: result,
              paging: {
                page_num: page_num,
                page_size: page_size,
                total: total
              }
            })
          }
        })
      }
    }
  })
}

//模糊查询文章
exports.queryVague = (req, res) => {
  const value = req.query.text
  var sql = `select * from ev_articles where content like '%${value}%' order by Id`
  db.query(sql, (err, result) => {
    if (err) {
      res.json({
        code: 1,
        message: '查询失败'
      })
    } else {
      res.json({
        result: 1,
        status: 200,
        message: "success",
        data: result,
      })
    }
  })
}

//添加照片 
exports.addPhoto = (req, res) => {
  const articleInfos = {
    photo: path.join('/uploads', req.files.photo[0].filename).replaceAll("\\", "//"),
    thumbnail_photo: path.join('/uploads', req.files.thumbnail_photo[0].filename).replaceAll("\\", "//"),
    pub_date: new Date(),
    author_id: 'ChetSerenade'
  }
  const sql = `insert into ev_photo set?`
  db.query(sql, articleInfos, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        message: '添加失败！'
      })
    } else {
      res.send({
        status: 200,
        message: "添加成功！",
        data: 'http://127.0.0.1:3007' + articleInfos.photo,
      })
    }
  })
}

//文章添加照片 
exports.mdPhoto = (req, res) => {
  if (!req.file || req.file.fieldname !== 'photo') return res.cc('必须上传照片！')
  const articleInfos = {
    photo: path.join('/uploads', req.file.filename).replaceAll("\\", "//"),
    pub_date: new Date(),
    name: 'ChetSerenade'
  }
  const sql = `insert into ev_mdphoto set?`
  db.query(sql, articleInfos, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        message: '添加失败！'
      })
    } else {
      res.send({
        status: 200,
        message: "添加成功！",
        name: req.file.originalname,
        data: 'http://127.0.0.1:3007' + articleInfos.photo,
      })
    }
  })
}

//查询照片
exports.queryPhoto = (req, res) => {
  var sql = `select * from ev_Photo`
  db.query(sql, (err, result) => {
    if (err) {
      res.send({
        code: 1,
        message: '查询失败'
      })
    } else {
      res.send({
        result: 1,
        status: 200,
        message: "success",
        data: result,
      })
    }
  })
}


//添加友情链接
exports.addLink = (req, res) => {
  const articleInfo = {
    ...req.body,
  }
  const sql = `insert into ev_link set?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        message: '添加失败！'
      })
    } else {
      res.send({
        status: 200,
        message: "添加成功！",
        data: results.insertId,
      })
    }
  })
}


//获取友情链接
exports.queryLink = (req, res) => {
  const sql = `select * from ev_link`
  db.query(sql, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        message: '获取失败！'
      })
    } else {
      res.send({
        status: 200,
        message: "获取成功！",
        data: results
      })
    }
  })
}


// 根据 Id 更新文章分类的处理函数
exports.updateVolume = (req, res) => {
  const sql = 'update ev_articles  set  visitor_volume=visitor_volume+1 where Id=?'
  // 执行更新文章分类的 SQL 语句
  db.query(sql, req.query.Id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('增加阅读成功！')
    res.cc('增加阅读成功！', 0)
  })
}
