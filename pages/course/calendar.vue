<template>
	<view class="index">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>日历课表</view>
		</cu-custom>
		<wu-calendar
			:useToday="true"
			type="month"
			mode="single"
			color="#3c9cff"
			:insert="true"
			:fold="true"
			startWeek="mon"
			slideSwitchMode="horizontal"
			:lunar="false"
			:showMonth="false"
			:selected="selected"
			@change="calendarChange"
			@monthSwitch="monthChange"
		></wu-calendar>
		
		<view v-if="isLogined" id="dayCourse" class="margin-sm bg-white card-radius">
			<view class="cu-bar bg-white card-radius">
				<view class="action border-title">
					<text class="text-xl text-bold">{{checkedDate}} 当日课表</text>
					<text class="bg-grey" style="width:2rem"></text>
				</view>
			</view>
			<template v-if="checkedDateCourses" v-for="(item, index) in checkedDateCourses.items" :key="index">
				<view @tap="checkAddCalendarPermisson(item)" class="padding-xs border-radius solids-bottom" v-if="item && item.courseName">
					<view class="flex radius">
						<view class="basis-xl padding-xs margin-tb-xs text-cut flex flex-direction">
							<view class="margin-tb-xs text-cut" style="height: 1.2rem;"><text
									class="cuIcon-calendar text-blue margin-right-xs"></text><text>{{item.teachTime}}</text></view>
							<view class="text-cut"  style="height: 1.2rem;"><text
									class="cuIcon-activity text-blue margin-right-xs"></text><text>{{item.courseName}}</text>
							</view>
						</view>
						<view class="basis-xs text-lg margin-tb-xs padding-xs text-center">
							<view class="margin-tb-xs">
								{{item.startAt}}~{{item.endAt}}
							</view>
							<view>{{item.place}}</view>
						</view>
					</view>
				</view>
			</template>
			<template v-if="!checkedDateCourses || (checkedDateCourses && checkedDateCourses.items && checkedDateCourses.items.filter(course => !Array.isArray(course)).length === 0)">
				<tips :tips="`${checkedDate} 没有课程安排 😄`" image="/static/image/nothing.png"></tips>
			</template>
			<template v-else>
				<!-- #ifdef MP -->
				<view class="text-gray padding-tb-xs text-center">
					<text class="cuIcon-info"></text> 点击课程可以添加到手机系统日历提醒
				</view>
				<!-- #endif -->
			</template>
		</view>
		<template v-else>
			<tips
				tips="查询您的个人课表需登录账号"
				image="/static/image/nothing.png"
				:showButton="true"
				buttonText="立即登录"
				path="/pages/index/login"
			></tips>
		</template>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin-lr margin-tb-sm radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		<view class="padding margin"></view>
		
	</view> 
</template> 
<script>
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isLogined: true,
				selected:[],
				monthCourses: [],
				checkedDate: '',
				checkedDateIndex: null,
				checkedDateCourses: []
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			
			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}
			
			this.fetchMonthCourses()
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			fetchMonthCourses (date = '', isMonthChange = false) {
				if (!this.isLogined) {
					uni.showToast({ title: '请登录后查看', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '拼命加载中...' })
				api.fetchMonthCourse(date).then(res => {
					this.monthCourses = res.data
					const selected = this.formatCourseToSelected(res.data)
					this.selected = selected
					if (!isMonthChange) {
						const checkedDateIndex = ((new Date()).getDate() - 1)
						const date = new Date()
						const year = date.getFullYear()
						const month = date.getMonth() + 1
						const day = date.getDate()
						this.checkedDate = `${year}-${month}-${day}`
						this.checkedDateCourses = res.data[checkedDateIndex]
						this.checkedDateIndex = checkedDateIndex
					}
					uni.hideLoading()
				})
			},
			formatCourseToSelected (courses = []) {
				const selected = []
				for (let day of courses) {
					let dayExistCourse = false
					for (let course of day.items) {
						if (Array.isArray(course) && course.length === 0) continue
						if (dayExistCourse) continue
						selected.push({
							date: day.date,
							info: '有课',
							infoColor: '#3D88EC'
						})
						dayExistCourse = true
						continue
					}
				}
				return selected
			},
			calendarChange(e) {
				if (!this.isLogined) {
					uni.showToast({ title: '请登录后查看当天课程安排', icon: 'none' })
					return
				}
				
				const checkedDateIndex = e.date - 1
				const dayCourse = this.monthCourses[checkedDateIndex]
				this.checkedDate = e.fulldate
				this.checkedDateIndex = checkedDateIndex
				this.checkedDateCourses = this.monthCourses[checkedDateIndex]
			},
			monthChange (e) {
				if (!this.isLogined) {
					uni.showToast({ title: '请登录后查看课程安排', icon: 'none' })
					return
				}
				this.fetchMonthCourses(`${e.fullDate}-1`, true)
			},
			checkAddCalendarPermisson (course) {
				var _this = this
				// #ifdef MP
				uni.getSetting({
				  success (settingRes) {
					if (!settingRes.authSetting['scope.addPhoneCalendar']) {
						uni.authorize({
						    scope: 'scope.addPhoneCalendar',
						    success() {
								_this.addPhoneCalendar(course)
						    },
							fail() {
								uni.openSetting()
							}
						})
					} else {
						_this.addPhoneCalendar(course)
					}
				  }
				})
				// #endif
			},
			addPhoneCalendar (course) {
				var _this = this
				// #ifdef MP
				uni.showModal({
					title: '提示',
					content: '你要将这节课添加到手机日程，上课前20分钟提醒吗？',
					success: function (res) {
						if (!res.confirm) return
						wx.addPhoneCalendar({
							title: course.courseName,
							startTime: new Date(`${_this.checkedDate}T${course.startAt}:00`).getTime().toString().slice(0, -3),
							description: `${course.teachTime} | ${course.courseName} | 地点：${course.place}`,
							location: course.place,
							endTime: new Date(`${_this.checkedDate}T${course.endAt}:00`).getTime().toString().slice(0, -3),
							alarmOffset: 60 * 20, // 提前20分钟提醒
							fail (error) {
								console.log(error)
							}
						})
					}
				})
				// #endif
			}
		}
	}
</script>