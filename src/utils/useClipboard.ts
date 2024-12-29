import { message } from 'ant-design-vue'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()

// 复制
export const copyText = async (value: string = '', successText: string = '复制成功') => {
    try {
        await toClipboard(value)
        message.success(successText)
    } catch (error) {
        message.error('复制失败')
    }
}
