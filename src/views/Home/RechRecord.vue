<!-- 充值记录 -->
<template>
    <Card>
        <div class="flex items-center">
            <InputNumber
                class="w-44"
                v-model:value="Amount"
                placeholder="请输入金额"
                :disabled="chargeLoading"
            />
            <Button
                class="ml-3"
                type="primary"
                :loading="chargeLoading"
                :disabled="chargeLoading"
                @click="AgentCharge"
            >
                立即充值
            </Button>
        </div>
    </Card>
    <Card :bordered="false" class="mt-5">
        <Spin :spinning="loading">
            <Table
                :scroll="{ x: true }"
                :columns="columns"
                :data-source="orderList"
                :pagination="state"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'PayTime'">
                        {{ record.PayTime ? getTime(record.PayTime) : record.PayTime }}
                    </template>
                    <template v-if="column.key === 'Time'">
                        {{ getTime(record.Time) }}
                    </template>
                    <template v-if="column.key === 'Status'">
                        <Tag :color="colors(record.Status)">
                            {{ Status(record.Status) }}
                        </Tag>
                    </template>
                </template>
            </Table>
        </Spin>
    </Card>
</template>

<script setup lang="ts">
import { API } from '@/api'
import type { IGetAgentReChargeOrderList } from '@/api/Agent/interface'
import type { OList } from '@/api/Agent/types'
import { getTime } from '@/utils/getTime'
import {
    Card,
    Table,
    Tag,
    Spin,
    InputNumber,
    Button,
    type TablePaginationConfig,
    message,
    Modal,
} from 'ant-design-vue'
import { computed, ref } from 'vue'

const state = ref<IGetAgentReChargeOrderList>({
    Page: 1,
    Size: 10,
    total: 0,
})
const loading = ref(false)
const chargeLoading = ref(false)
const Amount = ref('')
const orderList = ref<OList[]>()
const columns = ref([
    {
        title: '付款时间',
        dataIndex: 'PayTime',
        key: 'PayTime',
        scopedSlots: { customRender: 'PayTime' },
        width: 120,
    },
    {
        title: '收款地址',
        dataIndex: 'To_address',
        key: 'To_address',
        width: 280,
    },
    {
        title: '返利金额',
        dataIndex: 'BackRate',
        key: 'BackRate',
        ellipsis: true,
        width: 120,
    },
    {
        title: '人民币',
        dataIndex: 'Amount',
        key: 'Amount',

        ellipsis: true,
        width: 100,
    },
    {
        title: 'USDT',
        dataIndex: 'PayUsdt',
        key: 'PayUsdt',
    },
    {
        title: '状态',
        dataIndex: 'Status',
        scopedSlots: { customRender: 'Status' },
        key: 'Status',
    },
    {
        title: '创建时间',
        dataIndex: 'Time',
        scopedSlots: { customRender: 'Time' },
        key: 'Time',
    },
])

const colors = computed(() => (Status: number) => {
    return Status === 1 ? 'blue' : Status === 2 ? 'red' : 'green'
})

const Status = computed(() => (Status: number) => {
    return Status === 1 ? '待支付' : Status === 2 ? '支付失败' : '支付成功'
})

const handleTableChange = (item: TablePaginationConfig) => {
    state.value.Page = item.current!
    state.value.Size = item.pageSize!
    GetAgentReChargeOrderList()
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

const GetAgentReChargeOrderList = async () => {
    loading.value = true
    const res = await API.GetAgentReChargeOrderList({
        Page: state.value.Page,
        Size: state.value.Size,
    })
    loading.value = false
    if (res.code === 10000) {
        orderList.value = res.data?.List!
        state.value.total = res.data?.Count!
    }
}

GetAgentReChargeOrderList()
</script>
