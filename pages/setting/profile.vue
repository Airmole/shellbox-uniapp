<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">资料修改</block>
		</cu-custom>

		<view class="flex flex-wrap justify-center margin-xl">
			<view class="avatar text-center shadow-wrap"> <button class="cu-avatar xxl border round bg-white"
					open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar"
					:style="{ backgroundImage: `url(${avatarUrl})` }">
				</button></view>
			<view class="text-center margin"><text>点击上方头像可授权修改</text></view>
		</view>
		<view class="cu-form-group round margin-xl">
			<view class="title">昵称</view>
			<input type="nickname" v-model="nickname" placeholder="请输入昵称" bindchange="nicknameChange" />
		</view>

		<view class="margin-xl bg-white padding radius shadow-wrap" style="border-radius: 20upx;">
			<view><text
					class="text-left padding-left-xl">受《小程序用户头像昵称获取规则调整公告》通知要求，微信小程序使用用户头像昵称必须经过用户主动授权允许。小盒子调整为默认使用灰色头像，登录学号作为头像，昵称;您可在此页面修改授权。请放心，即使不修改授权也不会影响您任何功能正常使用</text>
			</view>
		</view>

		<view class="margin-xl flex flex-direction">
			<button class="cu-btn round bg-default lg" @click="updateProfile()">确认保存</button>
		</view>

	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				avatarUrl: app.globalData.defaultAvatar,
				nickname: ''
			}
		},
		onLoad() {
			this.fetchProfile()
		},
		methods: {
			fetchProfile () {
				var _this = this
				_this.$api.fetchProfile().then(res => {
					_this.avatarUrl = res.data.avatar
					_this.nickname = res.data.nickname
				})
			},
			updateProfile () {
				var _this = this
				let data = {
					avatar: _this.avatarUrl,
					nickname: _this.nickname
				}
				// #ifdef MP-WEIXIN
				data.wx_open_id = app.getOpenId()
				// #endif
				// #ifdef MP-QQ
				data.qq_open_id = app.getOpenId()
				// #endif
				_this.$api.updateProfile(data).then(res => {
					if (res.statusCode) {
						uni.showToast({ title: '保存成功~' })
						_this.fetchProfile()
					} else {
						uni.showToast({ title: res.data.message, icon:'none' })
						console.log('updateProfile错误：', res.data)
					}
				})
			}
		}
	}
</script>

<style>
	page {
	  background: #eee;
	}
	
	.avatar {
	  width: 100%;
	}
</style>