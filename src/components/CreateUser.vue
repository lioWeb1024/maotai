<!-- 创建托号|新增会员 -->
<template>
    <Modal
        title="创建托号"
        :open="visible"
        :confirmLoading="loading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <Spin :spinning="loading">
            <Form :form="form" v-bind="formLayout" ref="form" :model="model">
                <FormItem
                    label="登录账号"
                    name="user"
                    :rules="[{ required: true, min: 0, message: '请输入至少五个人数！' }]"
                >
                    <Input v-model:value="model.user" />
                </FormItem>
                <FormItem
                    label="登录密码"
                    name="password"
                    :rules="[{ required: true, min: 0, message: '请输入密码！' }]"
                >
                    <Input v-model:value="model.password" />
                </FormItem>
                <FormItem label="续费充值" name="vip_type">
                    <Select :default-value="1" v-model:value="model.vip_type">
                        <SelectOption :value="1"> 4小时 </SelectOption>
                        <SelectOption :value="2"> 12小时 </SelectOption>
                        <SelectOption :value="3"> 24小时 </SelectOption>
                        <SelectOption :value="4"> 30天 </SelectOption>
                    </Select>
                </FormItem>
                <FormItem label="账号备注" name="note">
                    <Textarea :rows="6" v-model:value="model.note" />
                </FormItem>
            </Form>
        </Spin>
    </Modal>
</template>

<script setup lang="ts">
import type { IAddUser } from '@/api/Agent/interface'
import {
    Input,
    Modal,
    Spin,
    Form,
    FormItem,
    SelectOption,
    Select,
    Textarea,
    type FormInstance,
} from 'ant-design-vue'
import { ref } from 'vue'

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

const props = defineProps<{
    visible: boolean
    loading: boolean
    model: IAddUser
}>()
const emits = defineEmits<{
    (e: 'submit', value: IAddUser): void
    (e: 'close'): void
}>()

const handleOk = async () => {
    const value = form.value?.getFieldsValue() as IAddUser
    emits('submit', { ...props.model, ...value })
}

const handleCancel = () => {
    emits('close')
}
</script>
