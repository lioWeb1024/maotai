import { useUser } from '@/stores/useUser'
import { encrypt, decrypt } from './cryptoJS'

class Local {
    set(key: string, value: any) {
        if (!key.trim()) return
        window.localStorage.setItem(key, encrypt(JSON.stringify(value)))
    }
    get(key: string) {
        if (!key.trim()) return
        try {
            const json = <string>window.localStorage.getItem(key)
            if (!json) return
            return JSON.parse(decrypt(json)!)
        } catch (error) {
            this.remove(key)
        }
    }
    remove(key: string) {
        if (!key.trim()) return
        window.localStorage.removeItem(key)
    }
    clear() {
        window.localStorage.clear()
        useUser().$reset()
    }
}

export default new Local()
