//文件列表
const { requestAuth } = require(process.cwd() + "/common/axios")

const getImgList = async (req, res, next) => {
    requestAuth({
        url: `${req.body.apiUrl}/b2api/v3/b2_list_file_names`,
        method: 'get',
        headers: { 'Authorization': req.headers.authorization },
        params: { bucketId: req.body.bucketId }
    }).then(response => {
        sendJson(res, 200, "操作成功", response)
    }).catch(response=>{
        sendJson(res, 500, "获取列表失败0.o?", {})
    })
}

module.exports = {
    getImgList
}