var express = require('express');
var router = express.Router();

// process.cwd() 表示命令执行的文件路径
const { getUpload,upload } = require(process.cwd() + '/controller/Upload')
router.post('/',upload.single('file_'), getUpload)

module.exports = router;