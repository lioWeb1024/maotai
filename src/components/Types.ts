export interface Mdl {
    Note: string
    Password: string
    User: string
    Price: string
    Price2: string
    UPAgentId: number
    Status: number
    Id?: number
}

export interface MdlAgent {
    Rmb: string
    ToUid: number
}

export interface ResetModel {
    password: string
    User: string
}
