<!-- 修改密码 -->
<template>
    <Card title="修改密码">
        <Form
            name="basic"
            autocomplete="off"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 12 }"
            @finish="NewPassword"
            :model="formState"
        >
            <FormItem
                label="新密码"
                name="NewPassword"
                :rules="[{ required: true, message: 'Please input your password!' }]"
            >
                <InputPassword
                    :disabled="loading"
                    v-model:value="formState.NewPassword"
                    placeholder="请输入新密码"
                />
            </FormItem>
            <FormItem
                label="确认新密码"
                name="againPassword"
                :rules="[{ required: true, message: 'Please input your password!' }]"
            >
                <InputPassword
                    :disabled="loading"
                    v-model:value="formState.againPassword"
                    placeholder="请再次输入新密码"
                />
            </FormItem>
            <Button :disabled="loading" type="primary" html-type="submit" class="ml-[30%]">
                立即修改
            </Button>
        </Form>
    </Card>
</template>

<script setup lang="ts">
import { API } from '@/api'
import { Card, Form, InputPassword, FormItem, message, Button } from 'ant-design-vue'
import { reactive, ref } from 'vue'

const loading = ref<boolean>(false)
const formState = reactive({
    NewPassword: '',
    againPassword: '',
})

const NewPassword = async () => {
    if (formState.NewPassword !== formState.againPassword) {
        message.error('两次输入的密码不一致')
        return
    }
    loading.value = true
    const res = await API.NewPassword({ NewPassword: formState.NewPassword })
    loading.value = false
    if (res?.code === 10000) {
        formState.NewPassword = ''
        formState.againPassword = ''
        message.success(res.msg)
    }
}
</script>
