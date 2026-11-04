var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');//跨域
const bodyParser = require('body-parser')//post


// 创建app对象
var app = express();
require(process.cwd() + '/common/utils.js')

// ************************************************中间件
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({ extended:true,limit:'5mb' }));
app.use(express.static(path.join(__dirname, 'public/dist')));//托管静态文件


// ************************************************路由配置
// 导入
var authRoute = require('./routes/auth');//登录
var imgListRoute = require('./routes/imgList');//图片列表
var uploadRoute = require('./routes/upload');//上传
var delRoute = require('./routes/delPic');//删除

// 激活
app.use(cors())//跨域中间件
app.use('/auth',authRoute);//登录
app.use('/imgList',imgListRoute);//图片列表
app.use('/upload',uploadRoute);//上传
app.use('/delPic',delRoute);//删除


// *************************************************错误
// 捕获错误并发送到错误控制
app.use(function (req, res, next) {
  next(createError(404));
});
// 错误控制
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3131,()=>{
  console.log('服务器启动成功')
})