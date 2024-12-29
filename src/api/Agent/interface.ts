import type { MdlAgent } from '@/components/Types'

export interface ILogin {
    password: string
    username: string
}

export interface IAgentIndex {
    RegisterTime: string[]
}

export interface IAgentCharge {
    Amount: number
}

export interface IGetAgentUserList {
    Page: number
    Size: number
    RegisterTime: string[]
    Keywords: string
    Order: number
    Role: number
    Status: number
    Type: number
    UserType: number
    total?: number
}

export interface IGetList extends Omit<IGetAgentUserList, 'Order' | 'Role' | 'UserType'> {
    total?: number
}

export interface IGetAgentReChargeOrderList {
    Page: number
    Size: number
    total?: number
}

export interface INewPassword {
    NewPassword: string
}

export interface IQueryPaymentInfo {
    Trade_id: string
}

export interface ISetAgentUserStatus {
    Id: number[]
    Status: number
}

export interface IPostTrasnfer extends MdlAgent {}

export interface INewAgentUser {
    Price: number
    Price2: number
    Status: number
    UPAgentId: number
    User: string
    Id?: number
}

export interface IJbcharge {
    user: string
    Id?: number
}

export interface IPostChangePassword {
    id: number
}

export interface IAddUser {
    note: string
    password: string
    user: string
    vip_type: number
}
