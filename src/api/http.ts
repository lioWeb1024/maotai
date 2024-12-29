import { useUser } from '@/stores/useUser'
import Local from '@/utils/Local'
import { message } from 'ant-design-vue'
import axios from 'axios'
import type { AxiosResponse } from 'axios'

let service = axios.create({
    baseURL: '/',
})

service.interceptors.request.use(
    config => {
        // http request 拦截器
        config.data = JSON.stringify(config.data)
        ;(config as any).headers = {
            'Content-Type': 'application/json',
            Token: useUser().Token,
        }
        return config
    },
    error => Promise.reject(error)
)

service.interceptors.response.use((response: AxiosResponse) => {
    // http response 拦截器
    switch (response.data.code) {
        case 10000:
            break
        case 202:
            message.warning(response.data.msg, 1.5, () => {
                Local.clear()
                window.location.replace('/login')
            })
            break
        default:
            message.error(response.data.msg)
            break
    }
    return response.data
})

export const http = <T>(fetch: 'get' | 'post', url: string, data: object = {}): Promise<T> => {
    //统一接口处理，返回数据
    if (!/(get|post)/.test(fetch)) throw new Error('接口请求方式出错，请使用 get|post')
    return new Promise((resolve, reject) => {
        const types = {
            get: { params: data },
            post: data,
        }
        service[fetch](url, types[fetch])
            .then(response => {
                resolve(response as T)
            })
            .catch(error => reject(error))
    })
}

export default http
