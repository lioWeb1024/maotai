<!-- 会员管理 -->
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
        <Button class="mb-5" type="primary" @click="handleAdd"> 新增会员 </Button>
        <Spin :spinning="loading">
            <Table
                :scroll="{ x: true }"
                :columns="columns"
                :data-source="orderList"
                :pagination="state"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'VipTime'">
                        {{ getTime(record.VipTime) }}
                    </template>
                    <template v-if="column.key === 'LoginTime'">
                        {{ getTime(record.LoginTime) }}
                    </template>
                    <template v-if="column.key === 'Status'">
                        <Popover trigger="hover">
                            <template #content>
                                <RadioGroup
                                    name="radioGroup"
                                    v-model:value="record.Status"
                                    @change="changeStatus(record)"
                                >
                                    <Radio :value="1"> 正常 </Radio>
                                    <Radio :value="2"> 锁定 </Radio>
                                </RadioGroup>
                            </template>
                            <Button size="small" type="primary" :danger="record.Status !== 1">
                                {{ record.Status == 1 ? '正常' : '锁定' }}
                            </Button>
                        </Popover>
                    </template>
                    <template v-if="column.key === 'cuozuo'">
                        <Popover trigger="hover">
                            <template #content>
                                <div class="">登录账号： {{ record.User }}</div>
                                <div class="">
                                    续费时长：
                                    <Select default-value="jack" class="w-32" size="small">
                                        <SelectOption value="jack"> 30天 </SelectOption>
                                    </Select>
                                </div>
                                <div class="mt-2 flex justify-center">
                                    <Button
                                        type="primary"
                                        size="small"
                                        @click="changeJbcharge(record)"
                                    >
                                        确定续费
                                    </Button>
                                </div>
                            </template>
                            <Button size="small" class="mr-2" type="primary">充值续费</Button>
                        </Popover>
                        <Popconfirm
                            title="是否确认重置?"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="confirm(record)"
                        >
                            <Button size="small" type="primary">密码重置</Button>
                        </Popconfirm>
                    </template>
                </template>
            </Table>
        </Spin>
        <CreateUser
            :visible="visible"
            :loading="confirmLoading"
            :model="model"
            @close="handleCancel"
            @submit="handleOk"
        />
        <ResetSuccess
            :visible="resetVisible"
            :model="resetModel"
            @close="closeResetModal"
            @submit="closeResetModal"
        />
    </Card>
</template>

<script setup lang="ts">
import { API } from '@/api'
import type { UList } from '@/api/Agent/types'
import {
    Card,
    Popover,
    Button,
    RadioGroup,
    Radio,
    message,
    DatePicker,
    Input,
    Table,
    Popconfirm,
    Select,
    Spin,
    SelectOption,
    type TablePaginationConfig,
} from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import { reactive, ref } from 'vue'
import type { IAddUser, ISetAgentUserStatus } from '@/api/Agent/interface'
import { getTime } from '@/utils/getTime'
import CreateUser from '@/components/CreateUser.vue'
import ResetSuccess from '@/components/ResetSuccess.vue'
import type { ResetModel } from '@/components/Types'

const state = reactive({
    Keywords: '',
    Page: 1,
    Size: 10,
    Status: 0,
    Type: 1,
    RegisterTime: [dayjs().startOf('month'), dayjs().endOf('day')],
    UserType: 1,
    Role: 0,
    Order: 1,
    total: 0,
})

const loading = ref(false)
const endOpen = ref(false)
const visible = ref(false)
const resetVisible = ref(false)
const confirmLoading = ref(false)
const model = ref<IAddUser>({
    note: '',
    password: '',
    user: '',
    vip_type: 1,
})
const resetModel = ref<ResetModel>({
    password: '',
    User: '',
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
        title: '账号',
        dataIndex: 'User',
        key: 'User',
        scopedSlots: { customRender: 'name' },
        width: 120,
    },
    {
        title: '登陆时间',
        dataIndex: 'LoginTime',
        key: 'LoginTime',
        ellipsis: true,
        scopedSlots: { customRender: 'LoginTime' },
        width: 120,
    },
    {
        title: '到期时间',
        dataIndex: 'VipTime',
        key: 'VipTime',
        ellipsis: true,
        scopedSlots: { customRender: 'VipTime' },
        width: 200,
    },
    {
        title: '上级代理',
        dataIndex: 'AgentName',
        key: 'AgentName',
        ellipsis: true,
        width: 100,
    },
    {
        title: '账号备注',
        dataIndex: 'address',
        key: 'address 3',
        ellipsis: true,
        width: 100,
    },
    {
        title: '账号状态',
        dataIndex: 'Status',
        key: 'Status',
        scopedSlots: { customRender: 'operation' },
        width: 100,
    },
    {
        title: '操作',
        dataIndex: 'cuozuo',
        key: 'cuozuo',
        scopedSlots: { customRender: 'cuozuo' },
    },
])

const handleAdd = () => {
    model.value = {
        note: '',
        password: '',
        user: '',
        vip_type: 1,
    }
    visible.value = true
}

const handleCancel = () => {
    visible.value = false
}

const handleOk = async (value: IAddUser) => {
    if (!value.user) return message.error('请输入账号')
    if (!value.password) return message.error('请输入密码')
    confirmLoading.value = true
    const res = await API.AddUser(value)
    confirmLoading.value = false
    if (res.code === 10000) {
        message.success(res.msg)
        visible.value = false
        GetAgentUserList()
    }
}

const changeJbcharge = async <T extends Partial<UList>>(item: T) => {
    const res = await API.Jbcharge({ user: item.User!, Id: item.Id! })
    if (res.code === 10000) {
        message.success(res.msg)
    }
}

const closeResetModal = () => {
    resetVisible.value = false
}

const confirm = async <T extends Partial<UList>>(item: T) => {
    const res = await API.PostChangePassword({ id: item.Id! })
    if (res.code === 10000) {
        resetModel.value = {
            password: res.data?.password!,
            User: item.User!,
        }
        message.success(res.msg)
        resetVisible.value = true
    }
}

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

const resetTime = async () => {
    dateActive.value = dayjs().startOf('month').unix()
    state.RegisterTime = [dayjs().startOf('month'), dayjs().endOf('day')]
    GetAgentUserList()
}

const changeStatus = async <T extends Partial<UList>>(item: T) => {
    const res = await SetAgentUserStatus({ Id: [item.Id!], Status: item.Status! })
    if (res.code === 10000) {
        message.success(res.msg)
    }
    GetAgentUserList()
}

const handleTableChange = (item: TablePaginationConfig) => {
    state.Page = item.current!
    state.Size = item.pageSize!
    GetAgentUserList()
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

GetAgentUserList()
</script>
