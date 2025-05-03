<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>积分明细</view>
		</cu-custom>
		
		<template v-if="!isLogined">
			<tips tips="查看积分明细，需先登录~" image="https://r2.airmole.net/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"></tips>
		</template>
		
	</view>
</template>

<script>
	import { getEdusysAccount } from '@/common/utils/auth.js'
	export default {
		data() {
			return {
				isLogined: true,
			}
		},
		onLoad() {
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
