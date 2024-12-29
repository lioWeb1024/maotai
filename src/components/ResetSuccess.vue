<template>
    <Modal
        title="密码重置成功"
        v-bind="$attrs"
        :open="visible"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <p class="my-3">账号：{{ model.User }}</p>
        <p class="mb-3">密码：{{ model.password }}</p>
        <Button type="primary" @click="copyText(model.password)">复制密码</Button>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, Button } from 'ant-design-vue'
import { ref } from 'vue'
import type { ResetModel } from './Types'
import { copyText } from '@/utils/useClipboard'

defineProps<{
    visible: boolean
    model: ResetModel
}>()
const emits = defineEmits<{
    (e: 'close'): void
}>()

const handleOk = async () => {
    emits('close')
}

const handleCancel = () => {
    emits('close')
}
</script>
