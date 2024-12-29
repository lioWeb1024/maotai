import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '../api/Agent/types'
import Local from '@/utils/Local'

interface Istate {
    userInfo: UserInfo | null
    Token: string
}

export const useUser = defineStore('useUser', {
    state(): Istate {
        return {
            Token: Local.get('Token') || '',
            userInfo: Local.get('UserInfo') || null,
        }
    },
    actions: {
        setToken(value: string) {
            this.Token = value
            Local.set('Token', value)
        },
        setUserInfo(value: UserInfo | null) {
            this.userInfo = value
            Local.set('UserInfo', value)
        },
    },
})
