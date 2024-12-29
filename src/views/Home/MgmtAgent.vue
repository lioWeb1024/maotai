<!-- 代理管理 -->
<template>
    <Card>
        <div class="flex items-center flex-wrap">
            <div class="mr-5 mb-2">
                <Button
                    :key="index"
                    :disabled="loading"
                    v-for="(item, index) in dateList"
                    :type="item.value?.[0]?.unix() == dateActive ? 'primary' : undefined"
                    @click="changeTime(item)"
                >
                    {{ item.label }}
                </Button>
            </div>
            <div class="mr-5 mb-2">
                <DatePicker
                    show-time
                    :disabled="loading"
                    v-model:value="state.RegisterTime[0]"
                    :disabled-date="disabledStartDate"
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Start"
                    @openChange="handleStartOpenChange"
                />
                <DatePicker
                    show-time
                    :disabled="loading"
                    v-model:value="state.RegisterTime[1]"
                    :disabled-date="disabledEndDate"
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="End"
                    :open="endOpen"
                    @openChange="handleEndOpenChange"
                />
            </div>
            <div class="flex items-center mb-2">
                <Input
                    class="mr-3"
                    placeholder="请输入用户名"
                    v-model:value="state.Keywords"
                    :disabled="loading"
                />
                <Button
                    type="primary"
                    @click="GetAgentUserList"
                    :loading="loading"
                    :disabled="loading"
                >
                    查询
                </Button>
                <Button @click="resetTime" class="ml-2" :disabled="loading"> 重置 </Button>
            </div>
        </div>
    </Card>
    <Card class="mt-5">
        <Button class="mb-5" type="primary" @click="handleAdd"> 添加代理 </Button>
        <Spin :spinning="loading">
            <Table
                :scroll="{ x: true }"
                :columns="columns"
                :data-source="orderList"
                :pagination="state"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'Status'">
                        <Switch
                            checked-children="开启"
                            un-checked-children="锁定"
                            @change="changeStatusData($event, record)"
                            :checked="record.Status === 1 ? true : false"
                        />
                    </template>
                    <template v-if="column.key === 'cuozuo'">
                        <Button
                            size="small"
                            class="mr-2"
                            type="primary"
                            @click="createAgent(record)"
                        >
                            修改
                        </Button>
                        <Button size="small" class="mr-2" type="primary" @click="addRmb(record)"
                            >加减款</Button
                        >
                        <Popconfirm
                            title="是否确认删除?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="changeStatus(record)"
                        >
                            <Button size="small" type="primary">删除</Button>
                        </Popconfirm>
                    </template>
                </template>
            </Table>
        </Spin>
        <AddCreateForm
            :visible="visible"
            :model="mdl"
            :loading="confirmLoading"
            @close="handleCancel"
            @submit="handleOk"
        />
        <TransferForm
            :visible="visibleAgent"
            :model="mdlAgent"
            :loading="AgentLoading"
            @close="AgentCancel"
            @submit="AgentOk"
        />
    </Card>
</template>

<script setup lang="ts">
import { API } from '@/api'
import AddCreateForm from '@/components/AddCreateForm.vue'
import TransferForm from '@/components/TransferForm.vue'
import type { ISetAgentUserStatus } from '@/api/Agent/interface'
import type { UList } from '@/api/Agent/types'
import { useUser } from '@/stores/useUser'
import {
    DatePicker,
    Card,
    Input,
    Button,
    Table,
    Spin,
    Popconfirm,
    Switch,
    message,
    type TablePaginationConfig,
} from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import { storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import type { Mdl, MdlAgent } from '@/components/Types'

const { setUserInfo } = useUser()
const { userInfo } = storeToRefs(useUser())

const state = reactive({
    Keywords: '',
    Page: 1,
    Size: 10,
    Status: 0,
    Type: 2,
    RegisterTime: [dayjs().startOf('month'), dayjs().endOf('day')],
    UserType: 1,
    Role: 0,
    Order: 1,
    total: 0,
})

const loading = ref(false)
const endOpen = ref(false)
const visible = ref(false)
const visibleAgent = ref(false)
const confirmLoading = ref(false)
const AgentLoading = ref(false)
const mdl = ref<Mdl>({
    Note: '',
    Password: '',
    Price: '',
    Price2: '',
    Status: 1,
    UPAgentId: userInfo.value?.Id!,
    User: '',
})
const mdlAgent = ref<MdlAgent>({
    Rmb: '',
    ToUid: 0,
})
const dateActive = ref(dayjs().startOf('month').unix())
const dateList = ref([
    { label: '当月', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    {
        label: '上月',
        value: [
            dayjs().subtract(1, 'month').startOf('month'),
            dayjs().subtract(1, 'month').endOf('month'),
        ],
    },
    {
        label: '近半年',
        value: [dayjs().subtract(6, 'month').startOf('day'), dayjs().endOf('day')],
    },
])
const orderList = ref<UList[]>()
const columns = ref([
    {
        title: '用户名',
        dataIndex: 'User',
        key: 'User',
        scopedSlots: { customRender: 'name' },
        width: 120,
    },
    {
        title: '备注',
        dataIndex: 'Note',
        key: 'Note',
        ellipsis: true,
        width: 120,
    },
    {
        title: '状态',
        dataIndex: 'Status',
        key: 'Status',
        scopedSlots: { customRender: 'Status' },
        width: 120,
    },
    {
        title: '余额（元）',
        dataIndex: 'Rmb',
        key: 'Rmb',
        ellipsis: true,
        width: 120,
    },
    {
        title: '上级代理',
        dataIndex: 'UPAgentId',
        key: 'UPAgentId',
        ellipsis: true,
        width: 100,
    },
    {
        title: '代理名称',
        dataIndex: 'AgentName',
        key: 'AgentName',
        width: 100,
    },
    {
        title: '代理价格',
        dataIndex: 'Price',
        key: 'Price',
        width: 100,
    },
    {
        title: '托号价格',
        dataIndex: 'Price2',
        key: 'Price2',
        width: 100,
    },
    {
        title: '操作',
        dataIndex: 'cuozuo',
        key: 'cuozuo',
        scopedSlots: { customRender: 'cuozuo' },
    },
])

const changeTime = (item: (typeof dateList.value)[0]) => {
    dateActive.value = item.value[0].unix()
    state.RegisterTime = item.value?.map(dayjs) as [Dayjs, Dayjs]
}

const disabledStartDate = (startValue: Dayjs) => {
    if (!startValue.unix() || !state.RegisterTime[1].unix()) return false
    return startValue.unix() > state.RegisterTime[1].unix()
}
const disabledEndDate = (endValue: Dayjs) => {
    if (!endValue.unix() || !state.RegisterTime[0]) return false
    return state.RegisterTime[0].unix() >= endValue.unix()
}

const handleStartOpenChange = (open: boolean) => {
    if (!open) endOpen.value = true
}
const handleEndOpenChange = (open: boolean) => {
    endOpen.value = open
}

const GetAgentInfo = async () => {
    const res = await API.GetAgentInfo()
    if (res.code === 1000) {
        setUserInfo(res.data?.AgentInfo!)
    }
}

const resetTime = async () => {
    dateActive.value = dayjs().startOf('month').unix()
    state.RegisterTime = [dayjs().startOf('month'), dayjs().endOf('day')]
    GetAgentUserList()
}

const handleTableChange = (item: TablePaginationConfig) => {
    state.Page = item.current!
    state.Size = item.pageSize!
    GetAgentUserList()
}

const handleCancel = () => {
    visible.value = false
}

const handleOk = async (value: Mdl) => {
    if (!value.User) return message.error('请输入登录账号')
    if (!value.Id) {
        if (!value.Password) return message.error('请输入密码')
    }
    if (!+value.Price) return message.error('请输入代理价格')
    if (!+value.Price2) return message.error('请输入托号价格')
    confirmLoading.value = true
    const res = await API.NewAgentUser({
        ...value,
        Price: Number(value.Price),
        Price2: Number(value.Price2),
        Id: undefined,
    })
    confirmLoading.value = false
    if (res.code === 10000) {
        message.success(value.Id ? '修改成功' : '新增成功')
        visible.value = false
        GetAgentUserList()
    }
}

const AgentCancel = () => {
    visibleAgent.value = false
}

const AgentOk = async (value: MdlAgent) => {
    if (!value.Rmb) return message.error('请输入金额')
    AgentLoading.value = true
    const res = await API.PostTrasnfer({ Rmb: value.Rmb, ToUid: value.ToUid })
    AgentLoading.value = false
    if (res.code === 10000) {
        message.success(res.msg)
        visibleAgent.value = false
        GetAgentUserList()
    }
}

const handleAdd = () => {
    visible.value = true
    mdl.value = {
        Note: '',
        Password: '',
        Price: '',
        Price2: '',
        Status: 1,
        UPAgentId: userInfo.value?.Id!,
        User: '',
    }
}

const addRmb = <T extends Partial<UList>>(item: T) => {
    mdlAgent.value = {
        Rmb: '',
        ToUid: item.Id!,
    }
    visibleAgent.value = true
}

const changeStatus = async <T extends Partial<UList>>(item: T) => {
    const res = await SetAgentUserStatus({ Id: [item.Id!], Status: -1 })
    if (res.code === 10000) {
        message.success(res.msg)
    }
    GetAgentUserList()
}

const createAgent = <T extends Partial<UList>>(item: T) => {
    visible.value = true
    mdl.value = {
        Note: '',
        Password: '',
        Price: String(item.Price)!,
        Price2: String(item.Price2)!,
        Status: item.Status!,
        UPAgentId: item.UPAgentId!,
        User: item.User!,
        Id: item.Id,
    }
}

type CheckedType = boolean | string | number
const changeStatusData = async <T extends Partial<UList>>($event: CheckedType, item: T) => {
    $event ? (item.Status = 1) : (item.Status = 2)
    const res = await SetAgentUserStatus({ Id: [item.Id!], Status: item.Status })
    if (res.code === 10000) {
        GetAgentUserList()
    }
}

const SetAgentUserStatus = async (params: ISetAgentUserStatus) => {
    const res = await API.SetAgentUserStatus(params)
    return res
}

const GetAgentUserList = async () => {
    loading.value = true
    const res = await API.GetAgentUserList({
        ...state,
        total: undefined,
        RegisterTime: [String(state.RegisterTime[0].unix()), String(state.RegisterTime[1].unix())],
    })
    loading.value = false
    if (res.code === 10000) {
        orderList.value = res.data?.List!
        state.total = res.data?.Count!
    }
}

GetAgentInfo()
GetAgentUserList()
</script>
