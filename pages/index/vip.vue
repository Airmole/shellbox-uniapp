<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>开通会员</view>
		</cu-custom>

		<!-- #ifdef MP-WEIXIN -->
		<template v-if="!isLoginStatus">
			<tips
				tips="哎呀~还没登录嘛？"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		<template v-else-if="isReleaseEnv">
			<view class="padding margin-top-sm bg-white card-radius margin-lr">
				<view class="text-xl text-bold text-center padding-bottom">开通会员，去广告、解锁更多功能</view>
				<view class="text-center text-gray text-sm">
					微信小程序虚拟支付，支付成功后自动发货开通会员，如遇支付成功未到账会自动为你补发。
				</view>
			</view>

			<!-- 会员套餐 -->
			<view class="margin-tb bg-white card-radius margin-lr">
				<view class="cu-bar bg-white">
					<view class="action text-bold"><text class="cuIcon-titles text-green"></text>选择会员套餐</view>
				</view>
				<view class="padding" v-if="products.length">
					<view class="flex flex-wrap justify-between"
						v-for="(item, index) in products" :key="index"
						@click="selectProduct(item)">
						<view class="goods-card padding-sm radius" :class="selected && selected.productId === item.productId ? 'bg-gradual-blue' : 'bg-gray'">
							<view class="text-bold">{{item.title}}</view>
							<view class="text-lg text-bold margin-top-xs">
								<text v-if="item.price" class="text-sm">¥</text>{{formatPrice(item.price)}}
							</view>
						</view>
					</view>
					<view class="margin-top-sm">
						<view v-if="isVip" class="cu-tag round bg-green margin-bottom-xs">当前已是会员，到期时间：{{vipExpireAt || '--'}}</view>
						<button class="cu-btn round bg-default lg block" :disabled="buying" @click="buyVip">
							{{buying ? '支付处理中...' : '立即开通'}}
						</button>
					</view>
				</view>
				<view v-else class="padding text-center text-gray">
					<text v-if="loading">会员套餐加载中...</text>
					<text v-else>暂无可用会员套餐，请稍后再试</text>
				</view>
			</view>
		</template>
		<template v-else-if="!isReleaseEnv">
			<tips
				tips="虚拟支付需在小程序正式版（release）环境中使用，当前为开发/体验版，仅供测试。"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="false"
			></tips>
		</template>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<template v-if="!isLoginStatus">
			<tips
				tips="哎呀~还没登录嘛？"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		<view v-else class="padding margin-top bg-white card-radius margin-lr">
			<view class="padding text-center text-gray">
				微信小程序虚拟支付仅在微信小程序端支持，请在微信小程序中使用会员购买功能。
			</view>
		</view>
		<!-- #endif -->

		<view class="text-center padding"></view>
	</view>
</template>

		<!-- #ifdef MP-WEIXIN -->
		<template v-else-if="isReleaseEnv">
			<view class="padding margin-top-sm bg-white card-radius margin-lr">
				<view class="text-xl text-bold text-center padding-bottom">开通会员，去广告、解锁更多功能</view>
				<view class="text-center text-gray text-sm">
					微信小程序虚拟支付，支付成功后自动发货开通会员，如遇支付成功未到账会自动为你补发。
				</view>
			</view>

			<!-- 会员套餐 -->
			<view class="margin-tb bg-white card-radius margin-lr">
				<view class="cu-bar bg-white">
					<view class="action text-bold"><text class="cuIcon-titles text-green"></text>选择会员套餐</view>
				</view>
				<view class="padding" v-if="products.length">
					<view class="flex flex-wrap justify-between"
						v-for="(item, index) in products" :key="index"
						@click="selectProduct(item)">
						<view class="goods-card padding-sm radius" :class="selected && selected.productId === item.productId ? 'bg-gradual-blue' : 'bg-gray'">
							<view class="text-bold">{{item.title}}</view>
							<view class="text-lg text-bold margin-top-xs">
								<text v-if="item.price" class="text-sm">¥</text>{{formatPrice(item.price)}}
							</view>
						</view>
					</view>
					<view class="margin-top-sm">
						<view v-if="isVip" class="cu-tag round bg-green margin-bottom-xs">当前已是会员，到期时间：{{vipExpireAt || '--'}}</view>
						<button class="cu-btn round bg-default lg block" :disabled="buying" @click="buyVip">
							{{buying ? '支付处理中...' : '立即开通'}}
						</button>
					</view>
				</view>
				<view v-else class="padding text-center text-gray">
					<text v-if="loading">会员套餐加载中...</text>
					<text v-else>暂无可用会员套餐，请稍后再试</text>
				</view>
			</view>
		</template>
		<template v-else-if="!isReleaseEnv">
			<tips
				tips="虚拟支付需在小程序正式版（release）环境中使用，当前为开发/体验版，仅供测试。"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="false"
			></tips>
		</template>
		<!-- #endif -->

		<!-- #ifndef MP-WEIXIN -->
		<template v-if="!isLoginStatus">
			<tips
				tips="哎呀~还没登录嘛？"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		<view v-else class="padding margin-top bg-white card-radius margin-lr">
			<tips
				tips="微信小程序虚拟支付仅在微信小程序端支持，请使用微信小程序体验会员购买功能。"
				image="https://r2.airmole.cn/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="false"
			></tips>
		</view>
		<!-- #endif -->

		<view class="text-center padding"></view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'
	import api from '@/request/api.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'

	const app = getApp()
	const appStore = useAppStore()
	const { loginStatus } = storeToRefs(appStore)

	const isLoginStatus = ref(false)
	const isReleaseEnv = ref(false)
	const isVip = ref(false)
	const vipExpireAt = ref('')
	const products = ref([])
	const selected = ref(null)
	const loading = ref(true)
	const buying = ref(false)

	onLoad(() => {
		isVip.value = app.globalData.isVip
		// #ifdef MP-WEIXIN
		isReleaseEnv.value = (app.globalData.env === 'release')
		// #endif
		// #ifndef MP-WEIXIN
		isReleaseEnv.value = false
		// #endif
	})

	onShow(() => {
		isVip.value = app.globalData.isVip
		isLoginStatus.value = loginStatus.value || !!app.globalData.profile || !!uni.getStorageSync('auth')
		if (isLoginStatus.value) {
			loadVipProfile()
			loadProducts()
		}
	})

	async function loadVipProfile () {
		try {
			const res = await api.fetchProfile()
			const profile = res.data.data || res.data
			if (typeof profile.isVip !== 'undefined') {
				isVip.value = !!profile.isVip
				app.globalData.isVip = !!profile.isVip
			}
			if (profile.vipExpireAt) vipExpireAt.value = profile.vipExpireAt
		} catch (e) {
			console.log('loadVipProfile error', e)
		}
	}

	async function loadProducts () {
		try {
			loading.value = true
			const res = await api.fetchVpProducts()
			const data = res.data || {}
			products.value = data.list || []
			if (products.value.length && !selected.value) {
				selected.value = products.value[0]
			}
		} catch (e) {
			console.log('loadProducts error', e)
		} finally {
			loading.value = false
		}
	}

	function selectProduct (item) {
		selected.value = item
	}

	// 金额格式化：优先使用 yuan，否则从 cents 换算
	function formatPrice (price) {
		if (!price) return ''
		if (price.yuan !== undefined && price.yuan !== null) return price.yuan
		if (price.cents !== undefined && price.cents !== null) return (price.cents / 100)
		return ''
	}

	function getOpenid () {
		// 优先取本地已缓存的 openid（App 启动时已通过 wx.login 换取）
		const openid = app.getOpenId && app.getOpenId()
		if (openid) return Promise.resolve(openid)
		// 未获取到则重新走登录换取
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

	// iOS 版本校验：iOS 端需要微信 >= 8.0.68
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

	async function buyVip () {
		if (!selected.value) {
			uni.showToast({ title: '请先选择会员套餐', icon: 'none' })
			return
		}
		if (buying.value) return
		if (!checkIosVersion()) return

		let openid = ''
		try {
			openid = await getOpenid()
		} catch (e) {
			uni.showToast({ title: '获取微信身份失败', icon: 'none' })
			return
		}

		buying.value = true
		uni.showLoading({ title: '创建订单中...', mask: true })
		try {
			const res = await api.createVpOrder({
				productId: selected.value.productId,
				quantity: 1,
				openid: openid
			})
			const payData = res.data || {}
			const outTradeNo = parseOutTradeNo(payData.signData)
			uni.hideLoading()
			if (!payData.signData || !payData.mode || !payData.paySig || !payData.signature) {
				uni.showToast({ title: (res.data && res.data.message) || '创建订单失败', icon: 'none' })
				return
			}
			await startVirtualPayment(payData, outTradeNo)
		} catch (e) {
			uni.hideLoading()
			const msg = (e && e.data && e.data.message) || '创建订单失败'
			uni.showToast({ title: msg, icon: 'none' })
		} finally {
			buying.value = false
		}
	}

	// 从 signData 中解析出 outTradeNo
	function parseOutTradeNo (signData) {
		try {
			if (typeof signData === 'string') {
				const obj = JSON.parse(signData)
				return obj.outTradeNo || ''
			}
			return (signData && signData.outTradeNo) || ''
		} catch (e) {
			return ''
		}
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
						// 轮询超时，尝试主动查询微信兜底补发货
						const ok = await wechatFallbackQuery(outTradeNo)
						if (ok) uni.showToast({ title: '会员已开通', icon: 'none' })
					}
					refreshVip()
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

	// 轮询本地订单状态
	async function pollOrderStatus (outTradeNo) {
		if (!outTradeNo) return false
		for (let i = 0; i < 15; i++) {
			await sleep(2000)
			try {
				const res = await api.queryVpOrder(outTradeNo)
				const order = res.data || {}
				if (order.status === '2' || order.status_text === 'delivered') {
					return true
				}
			} catch (e) {
				// 忽略单次查询错误，继续重试
			}
		}
		return false
	}

	// 兜底查询（转发微信 query_order 补发货）
	async function wechatFallbackQuery (outTradeNo) {
		if (!outTradeNo) return false
		try {
			const openid = app.getOpenId && app.getOpenId()
			const res = await api.queryVpOrderByWechat({ outTradeNo, openid })
			const data = res.data || {}
			const order = data.local_order || {}
			return order.status === '2' || order.status_text === 'delivered'
		} catch (e) {
			return false
		}
	}

	// 支付完成后刷新会员状态
	function refreshVip () {
		setTimeout(() => {
			loadVipProfile()
		}, 1000)
	}
</script>

<style scoped>
	.goods-card {
		width: 48%;
		margin-bottom: 20upx;
		box-sizing: border-box;
	}
	.card-radius {
		border-radius: 24upx;
	}
	.tips-padding {
		padding: 20upx;
	}
</style>
