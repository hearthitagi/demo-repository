import requestAuth from './authHttp';
import requestCom from './commonHttp';

// 登录
export function s3Login(auth: any) {
    return requestAuth({
        url: '/auth',
        method: 'post',
        data: { applicationKeyId: auth.applicationKeyId, applicationKey: auth.applicationKey }
    })
}
// 查看文件列表
export function s3Imglist(bucket: any) {
    return requestCom({
        url: '/imglist',
        method: 'post',
        data: { bucketId: bucket.bucketId, apiUrl: bucket.apiUrl }
    })
}
// 上传文件
export function uploadFile(file: any, uploadBody: any) {
    console.log(uploadBody);
    return requestAuth({
        url: '/upload',
        method: 'post',
        headers: {
            'Authorization': uploadBody.token,
            'X-Bz-Info-UploadUrl': uploadBody.uploadUrl,
            'suffix': uploadBody.suffix,
        },
        data: file
    })
}
// 删除文件
export function s3DelImg(file: any) {
    return requestCom({
        url: '/delPic',
        method: 'post',
        data: { fileName: file.fileName, fileId: file.fileId, apiUrl:file.apiUrl }
    })
}