<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" v-if="!showStulist">
			<view>课程花名册</view>
		</cu-custom>
		<view v-if="showStulist">
			<view class="padding-tb bg-gradual-blue"></view>
			<view class="cu-bar bg-gradual-blue">
			    <view class="action" @click="hideStulistDetail"><text class="cuIcon-back text-white"></text></view>
			    <view class="content text-bold">{{stulistTitle}}课堂花名册</view>
			</view>
		</view>
		<tips v-if="!isTeacher" :tips="'您的帐号无权查看此页面'" :height="300"></tips>
		<template v-else>
			
			<template v-if="!showStulist">
				<view class="cu-list menu-avatar margin">
					<view class="cu-item margin-tb card-radius" style="height: 180rpx; max-height: 200rpx;" v-for="(item, index) in courseList"
						:key="index" @tap="showStulistDetail(index)">
						<view class="cu-avatar lg round bg-gradual-blue"><text
								class="text-xxl iconfont icon-kechengkebiao"></text></view>
						<view class="content">
							<view class="text-black margin-tb-xs padding-lr-xs text-sm">{{item.title}}</view>
							<view class="padding-lr-xs margin-tb-xs">
								<text style="opacity: 0.7;">课堂：{{item.className}}</text>
							</view>
						</view>
					</view>
					<tips v-if="courseList.length === 0" :tips="'没有任何课程~'"></tips>
				</view>
			</template>
			<template v-else>
				<view class="margin padding round text-center bg-white">
					<text>{{stulistTitle}}</text>
				</view>
				<view class="cu-list menu-avatar margin card-radius">
					<view class="cu-item" style="height: 220rpx;" v-for="(item, index) in stulist"
						:key="index">
						<view class="cu-avatar xl round bg-gradual-blue"><text class="text-df">{{item.name}}</text></view>
						<view class="content margin-left" style="width: 100%;">
							<view class="text-black  padding-lr-xs text-sm"><text class="text-gray margin-right-sm">{{item.no}}.</text><text class="text-black text-xl">{{item.name}}</text></view>
							<view class="padding-lr-xs">
								<text style="opacity: 0.7;">{{item.gender}} | 学号：{{item.usercode}}</text>
							</view>
							<view class="padding-lr-xs">
								<text style="opacity: 0.7;">{{item.grade}}级 | {{item.major}} | {{item.className}}</text>
							</view>
							<view class="padding-lr-xs">
								<text style="opacity: 0.7;">{{item.profession}}</text>
							</view>
						</view>
					</view>
					<tips v-if="stulist.length === 0" :tips="'没有任何学生~'"></tips>
				</view>
			</template>

		</template>
	</view>
</template>

<script>
	import api from '@/request/api.js'
	import {
		getEdusysAccount
	} from '@/common/utils/auth.js'

	export default {
		data() {
			return {
				isTeacher: false,
				courseList: '',
				stulistTitle: '',
				stulist: [],
				showStulist: false,
			}
		},
		onLoad() {
			const edusysAccount = getEdusysAccount()
			if (edusysAccount && edusysAccount.account.length < 8) this.isTeacher = true
			if (!this.isTeacher) return
			this.fetchCourseList()
		},
		methods: {
			fetchCourseList() {
				uni.showLoading({ title: '加载中...' })
				api.fetchTeacherCourseList().then(res => {
					this.courseList = res.data
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({ title: res.data.message, icon: 'none'})
				})
			},
			fetchStuList (code) {
				uni.showLoading({ title: '加载中...' })
				api.fetchTeacherCourseStudentList(code).then(res => {
					this.stulist = res.data
					this.showStulist = true
					console.log('stulist', this.stulist)
					uni.hideLoading()
				})
			},
			showStulistDetail(index) {
				const item = this.courseList[index]
				console.log('item', item)
				this.stulistTitle = item.title
				this.fetchStuList(item.queryCode)
			},
			hideStulistDetail () {
				this.showStulist = false
			}
		}
	}
</script>

<style>

</style>