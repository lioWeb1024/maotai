export interface Login {
    UserInfo: UserInfo
    Token: string
    KuaiYan: boolean
}

export interface UserInfo {
    Id: number
    User: string
    PassWord: string
    Phone: string
    Email: string
    Qq: string
    SuperPassWord: string
    Status: number
    Rmb: number
    Note: string
    RealNameAttestation: string
    UPAgentId: number
    AgentDiscount: number
    LoginAppid: number
    LoginIp: string
    LoginTime: number
    RegisterIp: string
    RegisterTime: number
    Price: number
    TestCharge: number
    Price2: number
    TeamUser?: number
    TeamSaleCount?: number
    TeamRmb?: number
}

export interface GetAgentInfo {
    AgentInfo: AgentInfo
    UserMsgNoRead: number
    功能权限: any[]
}

export interface AgentInfo extends UserInfo {}

export interface AgentIndex {
    TeamCount: number
    TeamUser: number
    TeamProfit: number
    TeamRmb: number
    NewAgent: number
    TeamSaleCount: number
    MeSaleCount: number
    LoginIp: string
    Balance: number
    Stock: number
    Publish: string
    Order: Order[]
}

export interface Order {
    Title: string
    Name: string
    Type: string
    Price: number
    Descript: string
}

export interface AgentCharge {
    data: DataClass
    message: string
    request_id: string
    status_code: number
}

export interface DataClass {
    actual_amount: number
    amount: number
    expiration_time: number
    order_id: string
    payment_url: string
    token: string
    trade_id: string
}

export interface GetAgentUserList {
    List: UList[]
    Count: number
}

export interface UList {
    Id: number
    User: string
    Status: number
    Rmb: number
    RealNameAttestation: string
    UPAgentId: number
    AgentDiscount: number
    LoginTime: number
    LoginIp: string
    Role: number
    Price: number
    Price2: number
    VipTime: number
    AgentId: number
    AgentName: string
    DailySale: string
    TotalSale: string
}

export interface GetList {
    List: GList[]
    Count: number
}

export interface GList {
    Id: number
    Uid: number
    User: string
    Time: number
    Ip: string
    Count: number
    Note: string
}

export interface GetAgentReChargeOrderList {
    List: OList[]
    Count: number
}

export interface OList {
    Id: number
    Uid: number
    Name: string
    Amount: number
    Time: number
    PayTime: number
    Trade_id: string
    From_address: string
    To_address: string
    Status: number
    BackRate: number
    PayUsdt: number
    Payurl: string
    Bill_userid: number
    Pay: number
    type: number
}

export interface QueryPaymentInfo extends OList {}

export interface PostChangePassword {
    password: string
}
