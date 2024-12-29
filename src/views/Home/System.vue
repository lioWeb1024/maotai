<!-- 系统首页 -->
<template>
    <div class="flex flex-col">
        <div class="grid grid-cols-3 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
            <Card
                :title="item.title"
                size="small"
                class="px-3"
                v-for="(item, index) in list"
                :key="index"
            >
                <p class="py-2">{{ item.value }}{{ item.unit }}</p>
            </Card>
        </div>
        <Card title="充值中心" class="mt-5">
            <InputNumber
                class="w-full"
                v-model:value="Amount"
                placeholder="请输入金额"
                :disabled="chargeLoading"
            />
            <div class="flex mt-2 items-center">
                <Button
                    type="primary"
                    @click="AgentCharge"
                    class="mr-3"
                    :disabled="chargeLoading"
                    :loading="chargeLoading"
                >
                    去充值 💰
                </Button>
                <span>
                    代理价格：
                    <b class="text-green-400 mr-3"> {{ userInfo?.Price }}元 </b>
                </span>
                <span>
                    托号价格：
                    <b class="text-blue-400 mr-3"> {{ userInfo?.Price2 }}元 </b>
                </span>
            </div>
        </Card>
        <Card title="快速查看团队" class="mt-5">
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
                    <Button
                        type="primary"
                        @click="AgentIndex"
                        :loading="loading"
                        :disabled="loading"
                    >
                        查询
                    </Button>
                    <Button @click="resetTime" class="ml-2" :disabled="loading"> 重置 </Button>
                </div>
            </div>
            <Row :gutter="24">
                <Col :sm="12" :md="8" :xl="4" class="mb-3">
                    <Tag color="green">
                        新增代理：<b>{{ indexData?.NewAgent }} 人</b>
                    </Tag>
                </Col>
                <Col :sm="12" :md="8" :xl="4" class="mb-3">
                    <Tag color="green">
                        团队返利：<b>{{ indexData?.TeamProfit }} 元</b>
                    </Tag>
                </Col>
                <Col :sm="12" :md="8" :xl="4" class="mb-3">
                    <Tag color="green">
                        新增月卡用户 <b>{{ indexData?.NewAgent }} 人</b>
                    </Tag>
                </Col>
                <Col :sm="12" :md="8" :xl="4" class="mb-3">
                    <Tag color="green">
                        团队销售 <b>{{ indexData?.TeamSaleCount }} 套</b>
                    </Tag>
                </Col>
                <Col :sm="12" :md="8" :xl="4" class="mb-3">
                    <Tag color="green">
                        个人销售 <b>{{ indexData?.MeSaleCount }} 套</b>
                    </Tag>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { API } from '@/api'
import { reactive, ref } from 'vue'
import {
    Card,
    InputNumber,
    Button,
    DatePicker,
    message,
    Row,
    Col,
    Tag,
    Modal,
} from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useUser } from '@/stores/useUser'
import dayjs, { Dayjs } from 'dayjs'
import type { AgentIndex } from '@/api/Agent/types'

const state = reactive({
    RegisterTime: [dayjs().startOf('day'), dayjs().endOf('day')],
})
const { userInfo } = storeToRefs(useUser())
const { setUserInfo } = useUser()

interface IList {
    title: string
    value: string
    unit: string
    key?: string
}

const list = ref<IList[]>([
    { title: '我的账号', value: `${userInfo.value?.User} (id:${userInfo.value?.Id})`, unit: '' },
    {
        title: '上次登录',
        value: dayjs(Number(userInfo.value?.LoginTime) * 1000).format('YYYY-MM-DD HH:mm:ss'),
        unit: '',
    },
    { title: '我的余额', value: String(userInfo.value?.Rmb), unit: '元' },
    {
        title: '我的销售（今日）',
        value: String(userInfo.value?.TeamSaleCount || '0'),
        unit: '套',
        key: 'TeamSaleCount',
    },
    {
        title: '月卡还未到期用户',
        value: String(userInfo.value?.TeamUser || '0'),
        unit: '人',
        key: 'TeamUser',
    },
    {
        title: '团队总余额',
        value: String(userInfo.value?.TeamRmb || '0'),
        unit: '元',
        key: 'TeamRmb',
    },
])
const Amount = ref(500)
const loading = ref(false)
const endOpen = ref(false)
const chargeLoading = ref(false)
const indexData = ref<AgentIndex>()
const dateActive = ref(dayjs().startOf('day').unix())
const dateList = ref([
    { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
    {
        label: '昨天',
        value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    },
    {
        label: '近七天',
        value: [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')],
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

const resetTime = async () => {
    dateActive.value = dayjs().startOf('day').unix()
    state.RegisterTime = [dayjs().startOf('day'), dayjs().endOf('day')]
    AgentIndex()
}

const AgentCharge = async () => {
    if (!Amount.value) return message.error('请输入金额')
    chargeLoading.value = true
    const res = await API.AgentCharge({ Amount: Number(Amount.value) })
    chargeLoading.value = false
    if (res.code === 10000) {
        if (res.data?.data.payment_url) {
            window.open(res.data?.data.payment_url)
            Modal.confirm({
                title: '系统提示',
                content: '等待支付中...',
                okText: '我已支付，查询状态',
                onOk: async () => {
                    return new Promise(async (resolve, reject) => {
                        const result = await API.QueryPaymentInfo({
                            Trade_id: res.data?.data.trade_id!,
                        })
                        if (result.data?.Status !== 3) {
                            message.info('未查询到支付信息')
                            reject()
                            return
                        }
                        resolve(true)
                    }).catch(() => {})
                },
            })
        }
    }
}

const GetAgentInfo = async () => {
    const res = await API.GetAgentInfo()
    if (res.code === 10000) {
        setUserInfo(res.data?.AgentInfo!)
    }
}

const AgentIndex = async () => {
    loading.value = true
    const res = await API.AgentIndex({
        RegisterTime: state.RegisterTime.map(dayjs).map(item => String(item.unix())),
    })
    loading.value = false
    if (res.code === 10000) {
        indexData.value = res.data!
        Object.keys(res.data!).forEach(key => {
            list.value.forEach(item => {
                if (item.key === key) {
                    item.value = res.data?.[key as keyof typeof AgentIndex]!
                }
            })
        })
        userInfo.value!.TeamSaleCount = res.data?.TeamSaleCount
        userInfo.value!.TeamRmb = res.data?.TeamRmb
        setUserInfo(userInfo.value!)
    }
}

GetAgentInfo()
AgentIndex()
</script>
