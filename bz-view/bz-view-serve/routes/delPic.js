var express = require('express');
var router = express.Router();

// process.cwd() 表示命令执行的文件路径
const { getDelPic } = require(process.cwd() + '/controller/DelPic')
router.post('/', getDelPic)

module.exports = router;