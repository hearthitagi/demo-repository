var express = require('express');
var router = express.Router();

// process.cwd() 表示命令执行的文件路径
const { getImgList } = require(process.cwd() + '/controller/ImgList')
router.post('/', getImgList)

module.exports = router;