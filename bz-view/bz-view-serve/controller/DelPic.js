//文件列表
const { requestAuth } = require(process.cwd() + "/common/axios")

const getDelPic = async (req, res, next) => {
    requestAuth({
        url: `${req.body.apiUrl}/b2api/v3/b2_delete_file_version`,
        method: 'post',
        headers: { 'Authorization': req.headers.authorization },
        data: { fileName: req.body.fileName, fileId: req.body.fileId }
    }).then(response => {
        sendJson(res, 200, "删除成功", response)
    }).catch(response=>{
        sendJson(res, 500, "删除失败0.o?", {})
    })
}

module.exports = {
    getDelPic
}