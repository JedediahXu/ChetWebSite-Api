const express = require("express");
const cookieParser = require("cookie-parser");
const mysql = require('mysql')
const app = new express();
app.use(cookieParser());
const cors = require('cors')
app.use(cors())

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'my_db_01',
})

app.get('/api/article/queryAmount', function (req, res) {
  res.cookie("name", "zhangsan", { maxAge: 9000000 });
  const sql = 'update ev_statistics set total_amount=total_amount+1'
  db.query(sql, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        message: '获取失败！'
      })
    } else {
      const sql = `select * from ev_statistics`
      db.query(sql, (err, results) => {
        if (err) {
          res.send({
            code: 1,
            message: '添加失败！'
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
  })
});

app.listen(3008, () => {
  console.log('api server running at http://127.0.0.1:3008')
})
