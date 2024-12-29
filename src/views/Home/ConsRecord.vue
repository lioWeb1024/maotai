<!-- 消费记录 -->
<template>
    <Card :bordered="false" class="mb-5">
        <div class="table-page-search-wrapper">
            <div class="flex flex-wrap">
                <div class="mr-5 mb-2">
                    <DatePicker
                        :disabled="loading"
                        v-model:value="state.RegisterTime[0]"
                        show-time
                        placeholder="Start"
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                    <DatePicker
                        :disabled="loading"
                        v-model:value="state.RegisterTime[1]"
                        show-time
                        placeholder="End"
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </div>
                <div class="mr-5 mb-2">
                    <Select class="w-28" v-model:value="state.Type" :disabled="loading">
                        <SelectOption :value="1"> 用户名 </SelectOption>
                        <SelectOption :value="2"> 消息 </SelectOption>
                        <SelectOption :value="3"> IP </SelectOption>
                    </Select>
                </div>
                <div class="mr-3 mb-2">
                    <Input
                        placeholder="请输入关键字"
                        v-model:value="state.Keywords"
                        :disabled="loading"
                    />
                </div>
                <div class="mb-2">
                    <Button
                        type="primary"
                        class="mr-3"
                        @click="GetList"
                        :loading="loading"
                        :disabled="loading"
                    >
                        查询
                    </Button>
                    <Button @click="resetTime" :disabled="loading">重置</Button>
                </div>
            </div>
        </div>
    </Card>
    <Card :bordered="false" class="mt-5">
        <Spin :spinning="loading">
            <Table
                :scroll="{ x: true }"
                :columns="columns"
                :data-source="dataList"
                :pagination="state"
                @change="handleTableChange"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'Time'">
                        {{ getTime(record.Time) }}
                    </template>
                    <template v-if="column.key === 'Count'">
                        <Tag color="blue">
                            {{ record.Count }}
                        </Tag>
                    </template>
                </template>
            </Table>
        </Spin>
    </Card>
</template>

<script setup lang="ts">
import { API } from '@/api'
import type { IGetList } from '@/api/Agent/interface'
import type { GList } from '@/api/Agent/types'
import { getTime } from '@/utils/getTime'
import {
    Card,
    Input,
    Button,
    DatePicker,
    Select,
    Table,
    Spin,
    SelectOption,
    Tag,
    type TablePaginationConfig,
} from 'ant-design-vue'
import dayjs from 'dayjs'
import { ref } from 'vue'

const loading = ref(false)
const dataList = ref<GList[]>()
const state = ref({
    Keywords: '',
    Page: 1,
    Size: 10,
    Status: 0,
    Type: 1,
    total: 0,
    RegisterTime: [dayjs().startOf('month'), dayjs().endOf('month')],
})
const columns = ref([
    {
        title: 'Id',
        dataIndex: 'Id',
        key: 'Id',
        width: 120,
    },
    {
        title: '用户名',
        dataIndex: 'User',
        key: 'User',
        ellipsis: true,
        width: 120,
    },
    {
        title: '时间',
        dataIndex: 'Time',
        key: 'Time',
        ellipsis: true,
        scopedSlots: { customRender: 'Time' },
        width: 200,
    },
    {
        title: '金额',
        dataIndex: 'Count',
        key: 'Count',
        scopedSlots: { customRender: 'Count' },
        ellipsis: true,
        width: 100,
    },
    {
        title: '消息',
        dataIndex: 'Note',
        key: 'Note',
    },
])

const resetTime = async () => {
    state.value = {
        Keywords: '',
        Page: 1,
        Size: 10,
        Status: 0,
        Type: 1,
        total: 0,
        RegisterTime: [dayjs().startOf('month'), dayjs().endOf('month')],
    }
}
const handleTableChange = (item: TablePaginationConfig) => {
    state.value.Page = item.current!
    state.value.Size = item.pageSize!
    GetList()
}

const GetList = async () => {
    loading.value = true
    const res = await API.GetList({
        ...state.value,
        RegisterTime: [
            String(state.value.RegisterTime[0].unix()),
            String(state.value.RegisterTime[1].unix()),
        ],
        total: undefined,
    })
    loading.value = false
    if (res.code === 10000) {
        dataList.value = res.data?.List!
        state.value.total = res.data?.Count!
    }
}

GetList()
</script>
