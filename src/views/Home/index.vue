<template>
    <Layout class="h-dvh">
        <LayoutSider
            v-model:collapsed="state.collapsed"
            collapsible
            class="max-sm:hidden"
            v-if="!state.drawerVisible"
        >
            <Menu
                :key="state.renderKey + '-sider'"
                v-model:openKeys="state.openKeys"
                v-model:selectedKeys="state.selectedKeys"
                :items="items"
                mode="inline"
                theme="dark"
                @click="clickMenu"
            />
        </LayoutSider>
        <Drawer
            v-else
            title=""
            placement="left"
            v-model:open="state.collapsed"
            :bodyStyle="{ padding: 0 }"
        >
            <Menu
                :key="state.renderKey + '-drawer'"
                :inlineCollapsed="false"
                v-model:openKeys="state.openKeys"
                v-model:selectedKeys="state.selectedKeys"
                :items="items"
                mode="inline"
                @click="clickMenu"
            />
        </Drawer>
        <Layout>
            <LayoutHeader class="!bg-white !px-5 flex items-center justify-between">
                <Button @click="toggleCollapsed">
                    <MenuUnfoldOutlined v-if="state.collapsed" />
                    <MenuFoldOutlined v-else />
                </Button>
                <Popover v-model:open="state.visiblePopover" trigger="click">
                    <template #content>
                        <Button type="text" class="flex items-center" @click="outLogin">
                            <template #icon>
                                <LogoutOutlined />
                            </template>
                            <p class="ml-2">退出</p>
                        </Button>
                    </template>
                    <a class="flex items-center">
                        <Avatar>
                            <template #icon>
                                <AntDesignOutlined
                                    class="flex items-center justify-center h-full"
                                />
                            </template>
                        </Avatar>
                        <span class="ml-2">
                            {{ userInfo?.User }}
                        </span>
                    </a>
                </Popover>
            </LayoutHeader>
            <LayoutContent>
                <main class="p-5 w-full h-full overflow-y-auto">
                    <div class="w-full h-full">
                        <router-view v-slot="{ Component }">
                            <component :is="Component" />
                        </router-view>
                    </div>
                </main>
            </LayoutContent>
        </Layout>
    </Layout>
</template>

<script setup lang="ts">
import { reactive, h, onMounted } from 'vue'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    AppstoreOutlined,
    AntDesignOutlined,
    LogoutOutlined,
} from '@ant-design/icons-vue'
import {
    Menu,
    Button,
    Layout,
    Drawer,
    LayoutHeader,
    LayoutContent,
    LayoutSider,
    Popover,
    Modal,
    Avatar,
    message,
} from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { API } from '@/api'
import Local from '@/utils/Local'
import { useUser } from '@/stores/useUser'
import { storeToRefs } from 'pinia'

const { userInfo } = storeToRefs(useUser())
const router = useRouter()
const route = useRoute()
const defaultOpenKeys = ['sub1', 'sub2']
const state = reactive({
    collapsed: false,
    drawerVisible: false,
    selectedKeys: ['1'],
    openKeys: defaultOpenKeys,
    renderKey: 0,
    visiblePopover: false,
})
const items = reactive([
    {
        key: 'sub1',
        icon: () => h(SettingOutlined),
        label: '系统设置',
        title: '系统设置',
        children: [
            {
                key: '1',
                label: '系统首页',
                title: '系统首页',
            },
            {
                key: '2',
                label: '代理管理',
                title: '代理管理',
            },
            {
                key: '3',
                label: '修改密码',
                title: '修改密码',
            },
        ],
    },
    {
        key: 'sub2',
        icon: () => h(AppstoreOutlined),
        label: '用户管理',
        title: '用户管理',
        children: [
            {
                key: '4',
                label: '会员列表',
                title: '会员列表',
            },
            {
                key: '5',
                label: '消费记录',
                title: '消费记录',
            },
            {
                key: '6',
                label: '充值记录',
                title: '充值记录',
            },
        ],
    },
])

const toggleCollapsed = () => {
    state.collapsed = !state.collapsed
}

const clickMenu = (e: MenuInfo) => {
    const findItem = route.matched?.[0].children?.find(item => item.name === e.item.title)
    if (findItem) router.push(findItem.path)
    if (state.drawerVisible) state.collapsed = false
}

const outLogin = () => {
    Modal.confirm({
        title: '提示',
        content: '确定退出登录吗？',
        onOk: async () => {
            await API.OutLogin()
            router.push('/login')
            message.success('退出成功')
            Local.clear()
        },
    })
    state.visiblePopover = false
    router.push('/login')
}

onMounted(() => {
    const list = items.map(item => item.children).flat()
    const findItem = list.find(item => item.title === route.name)
    if (findItem) state.selectedKeys = [findItem.key]
    state.drawerVisible = document.body.clientWidth < 640
    window.addEventListener('resize', () => {
        state.drawerVisible = document.body.clientWidth < 640
        if (state.drawerVisible) state.openKeys = defaultOpenKeys
        else state.collapsed = false
        state.renderKey = Date.now()
    })
})
</script>
