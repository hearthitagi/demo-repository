<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { s3Imglist, s3DelImg } from '@/services/api'
import { useMessage } from 'naive-ui'

const message = useMessage()

let imgList = ref<any>([])
let picIdList = ref<any>([])
let spinLoading = ref<boolean>(false)
const customUrl = computed(() => {
    return JSON.parse(<string>localStorage.getItem('bz-view-token')).customUrl
})
// 图片列表
let bucketInfo = <string>localStorage.getItem('bz-view-authInfo')
// 删除图片
const delPic = (file: any) => {
    return new Promise<void>((resolve, reject) => {
        s3DelImg({ fileName: file.fileName, fileId: file.fileId, apiUrl: JSON.parse(bucketInfo).apiUrl }).then((res: any) => {
            if (res.state == 200) {
            } else {
                message.error(res.message)
            }
            resolve()
        })
    })
};
const delList = () => {
    let delList = imgList.value.filter((item: any) => picIdList.value.includes(item.fileId))
    let proResList = delList.map((item: any) => { return delPic(item) })
    Promise.all(proResList).then(() => {
        message.success("删除成功！")
        getImgList()
    })
}
// 图片列表
const getImgList = () => {
    if (bucketInfo) {
        spinLoading.value = true
        s3Imglist({ bucketId: JSON.parse(bucketInfo).apiInfo.storageApi.bucketId, apiUrl: JSON.parse(bucketInfo).apiInfo.storageApi.apiUrl }).then((res: any) => {
            if (res) {
                imgList.value = res.data.files.sort((a:any,b:any)=>{
                    return b.uploadTimestamp - a.uploadTimestamp
                })
            } else {
                message.error(res.message)
            }
            spinLoading.value = false
        })
    } else {
        message.info('请先去登录!')
    }
}
getImgList()


</script>

<template>
    <div class="gallery-wrap">
        <n-button @click="delList">删除</n-button>
        <n-spin :show="spinLoading">
            <n-checkbox-group v-model:value="picIdList">
                <div class="pic-wrap">
                    <n-space class="gap-wrap">
                        <div class="pic-item-wrap" v-for="item, index in imgList" :key="index">
                            <n-checkbox class="pic-check" :value="item.fileId" />
                            <n-image class="image-item" lazy :src="`${customUrl}${item.fileName}`">
                            </n-image>
                        </div>
                    </n-space>
                </div>
            </n-checkbox-group>
        </n-spin>
    </div>
</template>
<style lang="less" scoped>
.gallery-wrap {
    flex: 1;
    margin: 20px 25px 20px 0;
    padding: 25px;
    border-radius: 10px;
    background-color: #fff;

    .pic-wrap {
        display: flex;
        flex-flow: row wrap;
        margin-top: 15px;
        overflow: auto;
        max-height: calc(100vh - 165px);

        .gap-wrap {
            width: 100%;

            &>div {
                width: 13%;
            }

            .pic-item-wrap {
                width: 200px;
                position: relative;
                border: 1px solid #d8e3e7;
                border-radius: 10px;
                overflow: hidden;
                line-height: 0;
                border-top-left-radius: 3px;

                .pic-check {
                    position: absolute;
                    padding: 15px;
                    top: -18px;
                    left: -15px;
                    z-index: 9;
                }
            }
        }

        .image-item {
            width: 100%;
            padding-bottom: 60%;
            height: 0;
            position: relative;

            :deep(img) {
                position: absolute;
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
            }
        }
    }
}

@media screen and (max-width:800px) {
    .gallery-wrap {
        margin: 20px 25px;
    }

    .gap-wrap>div {
        width: calc(50% - 12px) !important;
    }
}
</style>
