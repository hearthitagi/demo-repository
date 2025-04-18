<template>
  <div class="compose-container">
    <el-button type="primary" @click="newCompose">
          新建
    </el-button>
    <el-dialog v-model="dialogVisible" :title="confirmType === 'create' ? '新建组合' : '编辑组合'" width="30%">
        <el-form :model="form" label-width="120px">
            <el-form-item label="组合名称">
                <el-input v-model="form.name" placeholder="请输入组合名称"></el-input>
            </el-form-item>
            <el-form-item label="前端仓库">
                <el-input v-model="form.frontendRepo" placeholder="请输入前端仓库"></el-input>
            </el-form-item>
            <el-form-item label="前端分支">
                <el-input v-model="form.frontendBranch" placeholder="请输入前端分支"></el-input>
            </el-form-item>
            <el-form-item label="后端仓库">
                <el-input v-model="form.backendRepo" placeholder="请输入后端仓库"></el-input>
            </el-form-item>
            <el-form-item label="后端分支">
                <el-input v-model="form.backendBranch" placeholder="请输入后端分支"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="confirmCompose">{{ confirmType === 'create' ? '创建' : '编辑' }}</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
        </template>
    </el-dialog>

    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column width="250" show-overflow-tooltip property="name" label="组合名称"></el-table-column>
        <el-table-column  show-overflow-tooltip property="frontendRepo" label="前端仓库"></el-table-column>
        <el-table-column width="240" show-overflow-tooltip property="frontendBranch" label="前端分支"></el-table-column>
        <el-table-column  show-overflow-tooltip property="backendRepo" label="后端仓库"></el-table-column>
        <el-table-column width="200" show-overflow-tooltip property="backendBranch" label="后端分支"></el-table-column>
        <el-table-column  show-overflow-tooltip property="opt" label="操作">
            <template #default="scope">
                <el-button type="primary" @click="editCompose(scope.row)">编辑</el-button>
                <el-button type="danger" @click="deleteCompose(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
const tableData = ref(JSON.parse(localStorage.getItem('tableData') || '[]'))
const confirmType = ref('create')

const dialogVisible = ref(false)
const form = ref({
    name: '',
    frontendRepo: '',
    frontendBranch: '',
    backendRepo: '',
    backendBranch: '',
})
const confirmCompose = () => {
    if (confirmType.value === 'create' && form.value.name) {
        if (tableData.value.filter(item => item.name === form.value.name).length > 0) {
            ElMessage.error('组合名称已存在')
            return
        } else {
            tableData.value.push(form.value)
            localStorage.setItem('tableData', JSON.stringify(tableData.value))
            ElMessage.success('创建成功')
        }
    } else if (confirmType.value === 'edit' && form.value.name) {
        tableData.value = tableData.value.map(item => item.name === form.value.name ? form.value : item)
        localStorage.setItem('tableData', JSON.stringify(tableData.value))
        ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
}
const newCompose = () => {
  console.log('新建')
  dialogVisible.value = true
  form.value = {
    name: '',
    frontendRepo: '',
    frontendBranch: '',
    backendRepo: '',
    backendBranch: '',
  }
}
const editCompose = (row) => {
  confirmType.value = 'edit'
  dialogVisible.value = true
  form.value = row
}
const deleteCompose = (row) => {
    ElMessageBox.confirm('确定删除该组合吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    }).then(() => {
        tableData.value = tableData.value.filter(item => item.name !== row.name)
        localStorage.setItem('tableData', JSON.stringify(tableData.value))
        ElMessage.success('删除成功')
    })
}

onMounted(() => {
  
})

</script>

<style scoped>
.compose-container{
    padding: 20px;
    height: 100%;
}
</style> 