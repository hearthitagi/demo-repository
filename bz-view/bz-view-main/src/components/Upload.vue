<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { ArchiveOutline } from '@vicons/ionicons5'
import { uploadFile } from '@/services/api'


let fileList = ref<any[]>([])

const picBlob = (item: any) => {
    return window.URL.createObjectURL(item.file)
}
// 选择文件
const handleUploadChange = (data: any) => {
    console.log(data);
    fileList.value = data.fileList
}
// 清空
const emptyList = () => {
    fileList.value = []
}
// 上传
const uploadArray = () => {
    fileList.value.reduce((previousValue, currentValue) => {
        return previousValue.then(() => {
            return upload(currentValue)
        }).catch(() => {
            return upload(currentValue)
        })
    }, Promise.resolve())
}
const upload = (fileItem: any) => {
    return new Promise<void>((resolve, reject) => {
        let file = fileItem.file;
        let uploadBody = {
            uploadUrl: JSON.parse(<string>localStorage.getItem('bz-view-uploadInfo')).uploadUrl,
            token: JSON.parse(<string>localStorage.getItem('bz-view-uploadInfo')).authorizationToken,
            suffix: file.type.split("/")[1],
        };
        const fileData = new FormData()
        fileData.append("file_", file)

        fileItem.uploadStatus = 2
        uploadFile(fileData, uploadBody).then((res: any) => {
            if (res.state == 200) {
                fileItem.uploadStatus = 1
                resolve()
            } else {
                fileItem.ploadStatus = 0
                reject()
            }
        })
    })
}
</script>

<template>
    <div class="upload-wrap">
        <n-upload multiple directory-dnd :default-upload="false" :show-file-list="false" v-model:file-list="fileList"
            @change="handleUploadChange" :max="10" class="upload-area">
            <n-upload-dragger>
                <div style="margin-bottom: 12px">
                    <n-icon size="48" :depth="3">
                        <ArchiveOutline />
                    </n-icon>
                </div>
                <span>点击或者拖动文件到该区域来上传</span>
            </n-upload-dragger>
        </n-upload>

        <n-list v-if="fileList.length > 0" bordered hoverable class="file-list-wrap">
            <n-list-item v-for="(item, index) in fileList" :key="index" class="file-list-item">
                <template #prefix>
                    <img :src="picBlob(item)" class="file-list-pic">
                </template>
                <div>{{ item.name }}</div>
                <span v-if="item.uploadStatus == 1 || item.uploadStatus == 0">
                    {{ item.uploadStatus == 1 ? "上传成功" : "上传失败0.o?" }}
                </span>
                <span v-else-if="item.uploadStatus == 2">
                    <n-spin size="small" />
                </span>

                <template #suffix>
                    <n-button>删除</n-button>
                </template>
            </n-list-item>

        </n-list>
        <div class="upload-button">
            <n-space>
                <n-button @click="emptyList">清空</n-button>
                <n-button @click="uploadArray">上传</n-button>
            </n-space>
        </div>
    </div>
</template>
<style lang="less" scoped>
.upload-wrap {
    flex: 1;
    margin: 20px 25px 20px 0;
    padding-bottom: 20px;
    border-radius: 10px;
    height: calc(100vh - 60px);
    background-color: #fff;

    .upload-area {
        margin: 20px 30px;
        width: auto;
    }

    .file-list-wrap {
        margin: 20px 30px;
        display: flex;
        flex-flow: row wrap;

        .file-list-item {
            width: 50%;

            .file-list-pic {
                width: 100px;
                height: 70px;
                object-fit: cover;
            }
        }
    }

    .upload-button {
        float: right;
        margin-right: 30px;
    }
}

@media screen and (max-width:800px) {
    .upload-wrap {
        margin: 20px 25px;
    }
}
</style>
