//文件列表
const { requestAuth } = require(process.cwd() + "/common/axios")
const sha1 = require('crypto-js/sha1');

const multer = require('multer')//post formdata
const storage = multer.memoryStorage();
const upload = multer({ storage:storage })

const getUpload = async (req, res, next) => {
    requestAuth({
        url: `${req.headers["x-bz-info-uploadurl"]}`,
        method: 'post',
        headers: { 
            'Authorization': req.headers["authorization"],
            'X-Bz-File-Name': `${Date.now()}.${req.headers["suffix"]}`,
            'Content-Type': "b2/x-auto",
            'X-Bz-Content-Sha1': 'do_not_verify',
            // 'X-Bz-Content-Sha1': sha1(req.file.buffer).toString(),
            'X-Bz-Info-Author': 'unknown',
            'X-Bz-Server-Side-Encryption': 'AES256'
        },
        data: req.file.buffer
    }).then(response => {
        sendJson(res, 200, "上传成功！", response)
    }).catch(response=>{
        sendJson(res, 500, "上传失败0.o?", {})
    })
}

module.exports = {
    getUpload,upload
}