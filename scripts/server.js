/* eslint-disable */
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get(`/api/test/validate/:fieldName`, (req, res) => {
  const { value } = req.query;
  if (value && value.length < 3) {
    res.json('此用户已经被注销').end();
  } else {
    res.end();
  }
});

app.post('/api/test/form', (req, res) => {
  res.json({
    code: '501',
    msg: { password: '密码错误' },
  });
});

app.listen(5000, (error) => {
  if (error) {
    console.error('启动服务器失败', error);
  } else {
    console.log('启动服务器成功');
  }
});
