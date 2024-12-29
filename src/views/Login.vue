<template>
    <div class="mx-auto min-w-80 max-w-sm py-10 px-5">
        <div class="w-32 h-32 mx-auto mb-10">
            <div class="flex items-center justify-center w-full h-full">
                <div class="relative group w-32 h-32 flex items-center justify-center">
                    <div
                        class="absolute inset-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-500 border-l-green-500 animate-spin-slow"
                    ></div>
                    <div
                        class="absolute inset-4 w-full h-full rounded-full border-4 border-transparent border-b-purple-500 border-r-yellow-500 animate-spin-reverse"
                    ></div>
                    <div
                        class="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse shadow-lg"
                    >
                        <span
                            class="absolute inset-0 flex items-center justify-center text-white font-bold text-xl group-hover:text-yellow-400 transition-colors duration-300"
                        >
                            V3
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <Form name="basic" autocomplete="off" @finish="onFinish" :model="formState">
            <FormItem name="username" :rules="[{ required: true, message: '请输入您的用户名' }]">
                <Input
                    size="large"
                    v-model:value="formState.username"
                    placeholder="请输入您的用户名"
                    :disabled="loading"
                >
                    <template #prefix>
                        <UserOutlined class="site-form-item-icon" />
                    </template>
                </Input>
            </FormItem>
            <FormItem name="password" :rules="[{ required: true, message: '请输入您的密码' }]">
                <InputPassword
                    size="large"
                    v-model:value="formState.password"
                    placeholder="请输入您的密码"
                    :disabled="loading"
                >
                    <template #prefix>
                        <LockOutlined class="site-form-item-icon" />
                    </template>
                </InputPassword>
            </FormItem>
            <Button
                size="large"
                type="primary"
                html-type="submit"
                class="mt-5"
                :disabled="loading"
                :loading="loading"
                block
            >
                登录
            </Button>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { API } from '@/api'
import { useUser } from '@/stores/useUser'
import { Form, FormItem, Input, InputPassword, Button, message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

const router = useRouter()

interface FormState {
    username: string
    password: string
}

const formState = reactive<FormState>({
    username: '',
    password: '',
})

const loading = ref(false)

const onFinish = async () => {
    loading.value = true
    const res = await API.login(formState)
    loading.value = false
    if (res?.code === 10000) {
        const { setToken, setUserInfo } = useUser()
        message.success(res.msg)
        setToken(res.data?.Token!)
        setUserInfo(res.data?.UserInfo!)
        router.push('/')
    }
}
</script>

<style scoped lang="scss">
@keyframes spin-slow {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes spin-reverse {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}

.animate-spin-slow {
    animation: spin-slow 4s linear infinite;
}

.animate-spin-reverse {
    animation: spin-reverse 3s linear infinite;
}
</style>
