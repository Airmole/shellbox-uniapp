<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>会员购买记录</view>
		</cu-custom>

		<!-- 登录校验 -->
		<template v-if="!isLogined">
			<tips
				tips="查看会员购买记录，需先登录~"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		<template v-else>
			<!-- 状态筛选 -->
			<view class="bg-white">
				<view class="flex text-center text-sm">
					<view class="flex-sub" v-for="(tab, index) in statusTabs" :key="index"
						@click="changeStatus(tab)">
						<view class="padding-sm" :class="currentStatus === tab.value ? 'text-blue text-bold' : 'text-gray'">
							{{tab.name}}
						</view>
						<view class="status-line" :class="currentStatus === tab.value ? 'bg-blue' : ''"></view>
					</view>
				</view>
			</view>

			<!-- 订单列表 -->
			<view class="cu-card dynamic card-radius" v-for="(item, index) in datalist" :key="index">
				<view class="cu-item shadow" :class="bgClass(item.status)">
					<view class="cu-bar">
						<view class="action">
							<text class="cuIcon-vip text-yellow"></text>
							<text class="text-bold">贝壳小盒子 - {{item.title || item.product_id || '会员'}}</text>
						</view>
						<view class="action">
							<text class="cu-tag round" :class="statusTagClass(item.status)">{{item.status_text || statusText[item.status] || '未知'}}</text>
						</view>
					</view>
					<view class="text-content" style="max-height: unset;">
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">订单编号：</text><text>{{item.out_trade_no}}</text></view>
						</view>
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">购买数量：</text><text class="">{{item.quantity || 1}} 份</text></view>
							<view class="flex-sub"><text class="text-gray">支付金额：</text><text class="text-red">¥{{formatAmount(item.amount)}}</text></view>
						</view>
						<view class="flex">
							<view class="flex-sub"><text class="text-gray">下单时间：</text><text class="">{{item.created_at}}</text></view>
						</view>
						<view class="flex" v-if="item.updated_at && item.updated_at !== item.created_at">
							<view class="flex-sub"><text class="text-gray">更新时间：</text><text class="">{{item.updated_at}}</text></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 无数据 -->
			<template v-if="datalist.length === 0 && !loading">
				<view class="margin-xl padding-xl text-center">
					<tips tips="还没有会员购买记录~" image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips>
				</view>
			</template>

			<!-- 分页器 -->
			<view v-if="pager" class="flex margin align-center text-center" v-show="pager.lastPage > 1">
				<view class="flex-sub"><button v-if="pager.currentPage != 1" @click="lastPage" class="cu-btn round bg-gradual-blue">上一页</button></view>
				<view class="flex-sub">第{{pager.currentPage}}页丨共{{pager.lastPage}}页</view>
				<view class="flex-sub"><button v-if="pager.currentPage != pager.lastPage" @click="nextPage" class="cu-btn round bg-gradual-blue">下一页</button></view>
			</view>
		</template>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	import { getEdusysAccount } from '@/common/utils/auth.js'

	const app = getApp()
	const appStore = useAppStore()
	const { loginStatus } = storeToRefs(appStore)

	const isLogined = ref(true)
	const loading = ref(false)
	const repaying = ref('')
	let datalist = ref([])
	let pager = ref(null)
	let currentStatus = ref('')

	// 状态筛选 Tabs
	const statusTabs = [
		{ name: '全部', value: '' },
		{ name: '待支付', value: '0' },
		{ name: '已支付', value: '1' },
		{ name: '已发货', value: '2' },
		{ name: '失败', value: '3' }
	]

	// 状态中文文案映射（用于兜底展示）
	const statusText = {
		0: '待支付',
		1: '已支付',
		2: '已发货',
		3: '失败'
	}

	onLoad(() => {
		if (!loginStatus.value && !app.globalData.profile && !uni.getStorageSync('auth')) {
			isLogined.value = false
			return
		}
		if (getEdusysAccount() === false) {
			isLogined.value = false
			return
		}
		fetchData(1)
	})

	function changeStatus (tab) {
		if (currentStatus.value === tab.value) return
		currentStatus.value = tab.value
		fetchData(1)
	}

	async function fetchData (page = 1) {
		loading.value = true
		uni.showLoading({ title: '加载中...' })
		try {
			const res = await api.fetchVpOrders(currentStatus.value, page, 10)
			const data = res.data.data || res.data || {}
			console.log(data)
			datalist.value = data || []
			console.log(datalist)
			pager.value = data.pager || null
		} catch (e) {
			console.log('fetchVpOrders error', e)
			const msg = (e && e.data && e.data.message) || '订单记录加载失败'
			uni.showToast({ title: msg, icon: 'none' })
		} finally {
			loading.value = false
			uni.hideLoading()
		}
	}

	function lastPage () {
		if (pager.value && pager.value.currentPage > 1) {
			fetchData(pager.value.currentPage - 1)
		}
	}

	function nextPage () {
		if (pager.value && pager.value.currentPage < pager.value.lastPage) {
			fetchData(pager.value.currentPage + 1)
		}
	}

	function formatAmount (amount) {
		if (amount === null || typeof amount === 'undefined') return '0.00'
		return (Number(amount) / 100).toFixed(2)
	}

	// 订单卡片背景
	function bgClass (status) {
		if (status === '2' || status === 2 || status === 'delivered') return 'bg-gradual-greenLight'
		return ''
	}

	// 状态 Tag 样式
	function statusTagClass (status) {
		if (status === '0' || status === 0 || status === 'pending') return 'line-orange'
		if (status === '1' || status === 1 || status === 'paid') return 'line-blue'
		if (status === '2' || status === 2 || status === 'delivered') return 'bg-green'
		if (status === '3' || status === 3 || status === 'failed') return 'bg-red'
		return 'bg-gray'
	}

	function getOpenid () {
		const openid = app.getOpenId && app.getOpenId()
		if (openid) return Promise.resolve(openid)
		return new Promise((resolve, reject) => {
			uni.login({
				success (res) {
					if (res.code) {
						api.uniLogin({ code: res.code }).then(loginRes => {
							const oid = loginRes.data && loginRes.data.openid
							if (app.setOpenId) app.setOpenId(oid)
							resolve(oid)
						}).catch(reject)
					} else {
						reject(new Error('微信登录失败'))
					}
				},
				fail: reject
			})
		})
	}

	function checkIosVersion () {
		const sys = uni.getSystemInfoSync()
		if (sys.platform !== 'ios') return true
		const cur = String(sys.version || '').split('.').map(Number)
		const base = [8, 0, 68]
		for (let i = 0; i < 3; i++) {
			if ((cur[i] || 0) > base[i]) return true
			if ((cur[i] || 0) < base[i]) break
		}
		uni.showModal({ title: '提示', content: '请将微信更新至最新版后再进行支付', showCancel: false })
		return false
	}

	function sleep (ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}

	async function startVirtualPayment (payData, outTradeNo) {
		// #ifdef MP-WEIXIN
		return new Promise((resolve) => {
			wx.requestVirtualPayment({
				mode: payData.mode,
				signData: payData.signData,
				paySig: payData.paySig,
				signature: payData.signature,
				success: async () => {
					uni.showToast({ title: '支付成功', icon: 'none' })
					const delivered = await pollOrderStatus(outTradeNo)
					if (delivered) {
						uni.showToast({ title: '会员已开通', icon: 'none' })
					} else {
						const ok = await wechatFallbackQuery(outTradeNo)
						if (ok) uni.showToast({ title: '会员已开通', icon: 'none' })
					}
					fetchData()
					resolve(true)
				},
				fail: (err) => {
					console.log('requestVirtualPayment fail', err)
					uni.showToast({ title: '支付失败或已取消', icon: 'none' })
					resolve(false)
				}
			})
		})
		// #endif
		// #ifndef MP-WEIXIN
		uni.showToast({ title: '当前环境不支持虚拟支付', icon: 'none' })
		return Promise.resolve(false)
		// #endif
	}

	async function pollOrderStatus (outTradeNo) {
		if (!outTradeNo) return false
		for (let i = 0; i < 15; i++) {
			await sleep(2000)
			try {
				const res = await api.queryVpOrder(outTradeNo)
				const order = res.data.data || res.data || {}
				if (order.status === '2' || order.status_text === 'delivered') {
					return true
				}
			} catch (e) {
				// 忽略单次查询错误，继续重试
			}
		}
		return false
	}

	async function wechatFallbackQuery (outTradeNo) {
		if (!outTradeNo) return false
		try {
			const openid = app.getOpenId && app.getOpenId()
			const res = await api.queryVpOrderByWechat({ outTradeNo, openid })
			const data = res.data.data || res.data || {}
			const order = data.local_order || {}
			return order.status === '2' || order.status_text === 'delivered'
		} catch (e) {
			return false
		}
	}
</script>

<style scoped>
	.card-radius {
		border-radius: 24upx;
	}
	.status-line {
		height: 6upx;
		width: 40upx;
		margin: 0 auto;
		border-radius: 6upx;
		opacity: 0.9;
	}
</style>
