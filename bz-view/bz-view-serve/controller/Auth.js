//登录
const { requestAuth } = require(process.cwd() + "/common/axios")

const getAuth = async (req, res, next) => {
    requestAuth({
        url: 'https://api.backblazeb2.com/b2api/v3/b2_authorize_account',
        method: 'post',
        headers: { 'Authorization': 'Basic ' + Buffer.from(`${req.body.applicationKeyId}:${req.body.applicationKey}`).toString('base64') },
        data: {}
    }).then(response => {
        requestAuth({
            url: `${response.apiInfo.storageApi.apiUrl}/b2api/v3/b2_get_upload_url`,
            method: 'get',
            headers: { 'Authorization': response.authorizationToken },
            params: { bucketId: response.apiInfo.storageApi.bucketId }
        }).then(resInfo => {
            sendJson(res, 200, "登录成功！", { uploadInfo: resInfo, authInfo: response })
        })
    }).catch(response=>{
        sendJson(res, 500, "登录失败0.o?", {})
    })
}

module.exports = {
    getAuth
}