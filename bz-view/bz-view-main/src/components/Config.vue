<script setup lang="ts">
import { s3Login } from '@/services/api'
import { reactive, ref, computed } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()


let cfgForm = ref({
    applicationKeyId: '',
    applicationKey: '',
    customUrl: '',
    bucketName: '',
})

// 登录
const auth =(form: any)=> {
    s3Login(form).then((res: any) => {
        if (res.state == 200) {
            message.success(res.message)
            localStorage.setItem('bz-view-token', JSON.stringify(form))
            localStorage.setItem('bz-view-authInfo', JSON.stringify(res.data.authInfo))
            localStorage.setItem('bz-view-uploadInfo', JSON.stringify(res.data.uploadInfo))
        } else {
            message.error(res.message)
        }
    })
}


if (localStorage.getItem('bz-view-token')) {
    cfgForm.value = JSON.parse(<string>localStorage.getItem('bz-view-token'))
}
</script>

<template>
    <div class="config-wrap">
        <n-form ref="formRef" :model="cfgForm" label-placement="left" label-width="120">
            <n-form-item path="applicationKeyId" label="存储桶keyId">
                <n-input v-model:value="cfgForm.applicationKeyId" placeholder="存储桶applicationKeyId" />
            </n-form-item>
            <n-form-item path="applicationKey" label="存储桶key">
                <n-input v-model:value="cfgForm.applicationKey" placeholder="存储桶applicationKey" />
            </n-form-item>
            <n-form-item path="customUrl" label="自定义域名">
                <n-input v-model:value="cfgForm.customUrl" placeholder="自定义域名" />
            </n-form-item>
            <n-form-item path="bucketName" label="存储桶名称">
                <n-input v-model:value="cfgForm.bucketName" placeholder="存储桶名称" />
            </n-form-item>
            <n-button @click="auth(cfgForm)">登录</n-button>
        </n-form>
    </div>
</template>
<style lang="less" scoped>
.config-wrap {
    flex: 1;
    margin: 20px 25px 20px 0;
    padding: 25px;
    border-radius: 10px;
    height: calc(100vh - 90px);
    background-color: #fff;
}
@media screen and (max-width:800px) {
    .config-wrap {
        margin: 20px 25px;
    }
}
</style>
