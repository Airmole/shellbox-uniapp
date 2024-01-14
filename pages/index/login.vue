<template>
	<view>
		<view class="bg-img bg-mask"
			:style="{ backgroundImage: `url(${bgImgUrl})`, height: pageHeight + 'px' }">
			<cu-custom bgColor="#ffffff" :isBack="false">
				<block slot="content"><span class="text-white">登录</span></block>
			</cu-custom>
			<view class="margin-top-xxl padding margin radius">
				<view class="text-center margin">
					<image class='cu-avatar round' style="height: 180upx;width: 180upx;;"
						src="https://store2018.muapp.cn/images/weapp/logo.jpeg" mode="aspectFit"></image>
				</view>
				<form>
					<view class="cu-form-group round margin-top-xl">
						<view class="title">账号</view>
						<input v-model="loginForm.account" type="number" placeholder="教务系统账号(学号)" name="account"
							maxlength="10" focus="true" confirm-type="next" @input="accountInput"></input>
					</view>
					<view class="cu-form-group round margin-tb-xl">
						<view class="title">密码</view>
						<input v-model="loginForm.password" password="true" placeholder="教务系统登录密码"
							name="password"></input>
					</view>
				</form>
				<view class="flex padding-top">
					<button style="visibility: hidden;" class="flex-sub round margin-right cu-btn lg">快速免密登录</button>
					<button @click="submitLogin()" class="flex-sub round margin-left cu-btn lg bg-green">
						绑定登录 <span class="cuIcon-right"></span>
					</button>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import {
		globalVar
	} from '@/global.js'
	export default {
		data() {
			return {
				pageHeight: globalVar.screenHeight,
				bgImgUrl: 'https://cn.bing.com/th?id=OHR.HokkaidoSwans_ZH-CN8733312972_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp',
				loginForm: {
					account: '',
					password: ''
				}
			}
		},
		onLoad() {

		},
		methods: {
			accountInput(e) {
				const length = e.detail.value.length
				if (length == 9) uni.hideKeyboard()

			},
			submitLogin() {
				console.log(this.loginForm)
			}
		}
	}
</script>

<style>
</style>