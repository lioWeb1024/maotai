<!-- 创建代理|修改代理 -->
<template>
    <Modal
        :title="model.Id ? '修改代理' : '创建代理'"
        v-bind="$attrs"
        :confirmLoading="loading"
        :open="visible"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <Spin :spinning="loading">
            <Form :formLayout="formLayout" :model="model" ref="form">
                <FormItem
                    label="登录账号"
                    name="User"
                    :rules="[{ required: true, message: '请输入账号!' }]"
                >
                    <Input v-model:value="model.User" :disabled="loading" />
                </FormItem>
                <FormItem
                    label="登录密码"
                    name="Password"
                    :rules="[{ required: model.Id ? false : true, message: '请输入密码！' }]"
                >
                    <Input
                        v-model:value="model.Password"
                        :disabled="model.Id || loading ? true : false"
                    />
                </FormItem>
                <FormItem label="账号备注" name="Note">
                    <Textarea :rows="6" v-model:value="model.Note" :disabled="loading" />
                </FormItem>
                <FormItem
                    label="代理价格"
                    name="Price"
                    :rules="[{ required: true, message: '请输入代理价格！' }]"
                >
                    <InputNumber
                        class="w-full"
                        suffix="元"
                        v-model:value="model.Price"
                        :disabled="loading"
                    />
                </FormItem>
                <FormItem
                    label="托号价格"
                    name="Price2"
                    :rules="[{ required: true, message: '请输入托号价格！' }]"
                >
                    <InputNumber
                        class="w-full"
                        suffix="元"
                        v-model:value="model.Price2"
                        :disabled="loading"
                    />
                </FormItem>
                <FormItem label="账号状态" name="Status">
                    <RadioGroup v-model:value="model.Status" :disabled="loading">
                        <Radio :value="1"> 正常 </Radio>
                        <Radio :value="2"> 锁定 </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Spin>
    </Modal>
</template>

<script setup lang="ts">
import {
    Input,
    InputNumber,
    Modal,
    Spin,
    Form,
    FormItem,
    RadioGroup,
    Radio,
    Textarea,
    type FormInstance,
} from 'ant-design-vue'
import { ref } from 'vue'
import type { Mdl } from './Types'

const props = defineProps<{
    visible: boolean
    loading: boolean
    model: Mdl
}>()
const emits = defineEmits<{
    (e: 'submit', value: Mdl): void
    (e: 'close'): void
}>()
const form = ref<FormInstance>()
const formLayout = ref({
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
    },
})

const handleOk = async () => {
    const value = form.value?.getFieldsValue() as Mdl
    emits('submit', { ...props.model, ...value })
}

const handleCancel = () => {
    emits('close')
}
</script>
