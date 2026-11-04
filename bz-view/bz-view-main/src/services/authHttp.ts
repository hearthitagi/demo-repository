import axios from 'axios'

const requestAuth = axios.create({
    // API 请求的默认前缀
    baseURL: process.env.NODE_ENV == "production" ? "/" : '/noAuth',
    timeout: 12000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: any) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status === 403) {
            console.log('Forbidden');
        }
        if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
            console.log('Unauthorized');
        }
    }
    return Promise.reject(error)
}

// 请求拦截
requestAuth.interceptors.request.use((config: any) => {
    return config
}, errorHandler)

// 响应拦截
requestAuth.interceptors.response.use((response) => {
    if (response.data) {
        return response.data
    } else {
        return response
    }

}, errorHandler)

export default requestAuth
