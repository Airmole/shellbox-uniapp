<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>我的课表</view>
		</cu-custom>
		<view class="flex justify-center">
			<picker @change="semesterChange" :value="semesterIndex" :range="semesterOptions" range-key="name">
				<view class="picker cu-tag line-blue round margin-lr-sm margin-tb-xs">
					{{(semesterOptions.length>0&&semesterIndex>-1)?semesterOptions[semesterIndex].name:''}} 学年 <text
						class="cuIcon-right"></text>
				</view>
			</picker>
			<picker @change="weekChange" :value="weekIndex" :range="weekOptions" range-key="name">
				<view class="picker cu-tag line-blue round margin-lr-sm margin-tb-xs">
					{{(weekOptions.length>0&&weekIndex>-1)?weekOptions[weekIndex].name:'整学期'}} <text
						class="cuIcon-right"></text>
				</view>
			</picker>
		</view>
		
		<courseTable v-if="isLogined" :columnTitles="courseData.columnTitle" :table="courseData.table" :tips="courseData.tips"></courseTable>
		<template v-else>
			<!-- #ifdef MP-WEIXIN -->
			<view class="margin margin-tb-xl radius">
				<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
			</view>
			<!-- #endif -->
			<tips
				tips="查询您的个人课表需登录账号"
				image="https://r2.airmole.net/i/2025/05/02/%E7%82%92%E9%A5%AD.gif"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import courseTable from './components/courseTable.vue'
	export default {
		components: {
			courseTable
		},
		data() {
			return {
				isLogined: true,
				courseData: '',
				semesterIndex: 0,
				semesterOptions: [],
				weekIndex: 0,
				weekOptions: [],
			}
		},
		onLoad (options) {
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			let semester = ''
			let week = ''
			if (options && options.semester) semester = options.semester
			if (options && options.week) week = options.week
			
			this.fetchCourseOptions(semester, week)
			this.fetchCourse(semester, week)
		},
		methods: {
			semesterChange(e) {
				const index = e.detail.value
				const semester = this.semesterOptions[index].value
				this.semesterIndex = index
				const week = this.weekOptions[this.weekIndex].value
				this.fetchCourse(semester, week)
			},
			weekChange(e) {
				const index = e.detail.value
				const week = this.weekOptions[index].value
				this.weekIndex = index
				const semester = this.semesterOptions[this.semesterIndex].value
				this.fetchCourse(semester, week)
			},
			fetchCourseOptions(semester = '', week = '') {
				api.fetchSemesterCourseOptions().then(res => {
					this.weekOptions = res.data.week
					this.semesterOptions = res.data.semester
					let semesterIndex = res.data.semester.findIndex((value) => value.checked === true)
					if (semester.length) semesterIndex = res.data.semester.findIndex((value) => value.value === semester)
					this.semesterIndex = semesterIndex
					if (week.length) this.weekIndex = res.data.week.findIndex((item) => Number(item.value) === Number(week))
				}).catch(error => {
					console.log('获取学期课表筛选项失败', error)
				})
			},
			fetchCourse(semester = '', week = '') {
				uni.showLoading({
					title: '加载中...'
				})
				api.fetchSemesterCourse(semester, week).then(res => {
					this.courseData = res.data
					console.log(this.courseData)
					uni.hideLoading()
				}).catch(error => {
					uni.hideLoading()
					console.log('获取学期课表失败', error)
					uni.showToast({ title: '获取失败，建议重新登录', icon: 'none' })
					/* if (error.data.message === '账号未登录') {
						window.location.reload()
					} */
				})
			}
		}
	}
</script>

<style>
	.tb-head-x {
		margin: 4rpx;
		text-align: center;
	}

	.border-bottom {
		border-bottom: 1px solid #ccc;
	}

	.border-right {
		border-right: 1px solid #ccc;
	}

	.course-item {
		padding: 6rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.content {
		min-width: 200rpx;
	}

	.course-name {}
</style>