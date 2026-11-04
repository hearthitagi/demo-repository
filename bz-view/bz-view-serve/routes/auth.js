var express = require('express');
var router = express.Router();

// process.cwd() 表示命令执行的文件路径
const { getAuth } = require(process.cwd() + '/controller/Auth')
router.post('/', getAuth)

module.exports = router;