import http from '../http'
import type { Res } from '../types'
import type {
    IAddUser,
    IAgentCharge,
    IAgentIndex,
    IGetAgentReChargeOrderList,
    IGetAgentUserList,
    IGetList,
    IJbcharge,
    ILogin,
    INewAgentUser,
    INewPassword,
    IPostChangePassword,
    IPostTrasnfer,
    IQueryPaymentInfo,
    ISetAgentUserStatus,
} from './interface'
import type {
    AgentCharge,
    AgentIndex,
    GetAgentInfo,
    GetAgentReChargeOrderList,
    GetAgentUserList,
    GetList,
    Login,
    PostChangePassword,
    QueryPaymentInfo,
} from './types'

export const Agent = {
    login: (data: ILogin): Promise<Res<Login>> => http('post', '/Agent/Base/Login', data),

    OutLogin: (): Promise<Res<Login>> => http('post', '/Agent/Menu/OutLogin'),

    GetAgentInfo: (): Promise<Res<GetAgentInfo>> => http('get', '/Agent/Menu/GetAgentInfo'),

    AgentIndex: (data: IAgentIndex): Promise<Res<AgentIndex>> =>
        http('post', '/Agent/Agent/Index', data),

    AgentCharge: (data: IAgentCharge): Promise<Res<AgentCharge>> =>
        http('post', '/Agent/Agent/AgentCharge', data),

    GetAgentUserList: (data: IGetAgentUserList): Promise<Res<GetAgentUserList>> =>
        http('post', '/Agent/Agent/GetAgentUserList', data),

    GetList: (data: IGetList): Promise<Res<GetList>> =>
        http('post', '/Agent/LogMoney/GetList', data),

    GetAgentReChargeOrderList: (
        data: IGetAgentReChargeOrderList
    ): Promise<Res<GetAgentReChargeOrderList>> =>
        http('post', '/Agent/Agent/GetAgentReChargeOrderList', data),

    NewPassword: (data: INewPassword): Promise<Res<{}>> =>
        http('post', '/Agent/Menu/NewPassword', data),

    QueryPaymentInfo: (data: IQueryPaymentInfo): Promise<Res<QueryPaymentInfo>> =>
        http('post', '/Agent/Agent/QueryPaymentInfo', data),

    SetAgentUserStatus: (data: ISetAgentUserStatus): Promise<Res<{}>> =>
        http('post', '/Agent/Agent/SetAgentUserStatus', data),

    PostTrasnfer: (data: IPostTrasnfer): Promise<Res<{}>> =>
        http('post', '/Agent/Agent/PostTrasnfer', data),

    NewAgentUser: (data: INewAgentUser): Promise<Res<{}>> =>
        http('post', '/Agent/Agent/NewAgentUser', data),

    Jbcharge: (data: IJbcharge): Promise<Res<{}>> => http('post', '/Agent/Agent/Jbcharge', data),

    PostChangePassword: (data: IPostChangePassword): Promise<Res<PostChangePassword>> =>
        http('post', '/Agent/Agent/PostChangePassword', data),

    AddUser: (data: IAddUser): Promise<Res<{}>> => http('post', '/Agent/Agent/AddUser', data),
}
