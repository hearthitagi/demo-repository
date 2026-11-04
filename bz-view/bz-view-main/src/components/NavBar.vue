<script setup lang="ts">

const emit = defineEmits(['changeAreaFlag'])

const changeArea = (flag: any) => {
    emit('changeAreaFlag', flag)
}
</script>

<template>
    <div class="bar-wrap">
        <div class="bar-icon">
            <div @click="changeArea(0)">上传</div>
        </div>
        <div class="bar-icon">
            <div @click="changeArea(1)">相册</div>
        </div>
        <div class="bar-icon">
            <div @click="changeArea(2)">配置</div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.bar-wrap {
    margin: 20px 25px;
    width: 5%;
    min-width: 70px;
    background-color: #fff;
    border-radius: 10px;

    .bar-icon {
        width: 100%;
        padding-bottom: 100%;
        position: relative;

        div {
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #d8e3e7;
            cursor: pointer;
        }
    }
}

@media screen and (max-width:800px) {
    .bar-wrap {
        display: flex;
        margin: 20px 25px 0 25px;
        min-width: 0;
        min-height: 0;
        width: auto;
        height: 70px;
        border-radius: 10px;

        .bar-icon {
            width: calc(100% / 3);
            height: 0;
            padding-bottom: 70px;
            position: relative;
            border-right: 1px solid #d8e3e7;
            div {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom: none;
                cursor: pointer;
            }
        }
        .bar-icon:nth-of-type(3){
            border-right: none;
        }
    }
}
</style>
