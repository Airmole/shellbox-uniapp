<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="false">
		  <block slot="content">贝壳小盒子</block>
		</cu-custom>
		
		<template v-if="!loginStatus">
			<view class="padding margin text-xxl">尚未登录</view>
		</template>
		<template v-else>
			<view class="padding margin text-xxl">登录成功</view>
		</template>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loginStatus: app.getLoginStatus()
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
</style>
