<!-- 转账|加减款 -->
<template>
    <Modal
        title="转账"
        v-bind="$attrs"
        :open="visible"
        :confirmLoading="loading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <Spin :spinning="loading">
            <Form ref="form" :model="model">
                <FormItem
                    name="Rmb"
                    label="金额"
                    :rules="[{ required: true, message: '请输入金额！' }]"
                >
                    <InputNumber
                        class="w-full"
                        v-model:value="model.Rmb"
                        placeholder="请输入金额"
                        :disabled="loading"
                    />
                </FormItem>
            </Form>
        </Spin>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, Spin, Form, FormItem, InputNumber, type FormInstance } from 'ant-design-vue'
import { ref } from 'vue'
import type { MdlAgent } from './Types'

const emits = defineEmits<{
    (e: 'submit', value: MdlAgent): void
    (e: 'close'): void
}>()

const props = defineProps<{
    visible: boolean
    loading: boolean
    model: MdlAgent
}>()
const form = ref<FormInstance>()
const handleOk = () => {
    const value = form.value?.getFieldsValue() as MdlAgent
    emits('submit', { ...props.model, ...value })
}

const handleCancel = () => {
    emits('close')
}
</script>
