<template>
	<view class="padding-bottom">
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>音像室影片放映</view>
		</cu-custom>

		<view>
			<view class="padding-sm padding-tb-xs bg-white text-center"><text class="text-green"> <text class="cuIcon-info"></text> 日期下方小绿点表示当天有影片放映安排</text></view>
			<wu-calendar :date="checkedDate" :type="type" :mode="mode" :color="color" :insert="insert" :fold="fold"
				:startWeek="startWeek" :slideSwitchMode="slideSwitchMode" :startDate="startDate" :selected="movieDays"
				@change="calendarChange" @monthSwitch="monthChange"></wu-calendar>
		</view>

		<view class="margin bg-white card-radius">
			<view class="padding solid-bottom">
				<text class="cuIcon-title text-green"></text>{{checkedDate}} 当天放映
			</view>
			<view class="cu-list menu card-radius" v-if="movieList.length > 0">
				<template v-for="(item, index) in movieList" :key="index">
					<view class="cu-item padding-tb radius" @tap="goDouban" :data-index="index">
						<view class="padding-xs">
							<image @tap.stop="showPoster" :data-url="item.poster" style="width: 180rpx;"
								:src="`${item.poster}?imageMogr2/auto-orient/strip%7CimageView2/2/w/128`"
								mode="widthFix" />
						</view>
						<view class="padding-lr-xs flex flex-wrap">
							<view class="solid-bottom text-xl text-cut"><text
									class="cuIcon-videofill text-red margin-right-xs"></text><text
									class="text-bold">{{item.name}}</text><text class="text-gray"
									v-if="item.year">（{{item.year}}）</text>
							</view>
							<view @tap.stop="addCalendar(item)" class="margin-tb-xs">
								<text class="cuIcon-remind text-orange margin-right-xs"></text><text
									class="text-df">{{ item.play_at }}</text>
							</view>
							<view @tap.stop="goPlace(item.place)" class="margin-bottom-xs">
								<text class="cuIcon-locationfill text-blue margin-right-xs"></text><text
									class="text-df">{{item.place}}</text>
							</view>
							<view class="margin-bottom-xs">
								<view class="cu-tag line-blue" v-if="item.duration !== '0分钟'">{{item.duration}}</view>
								<view class="cu-tag line-blue">{{item.genre}}</view>
							</view>
							<view class="margin-bottom-xs">{{item.actor}}</view>
						</view>
					</view>
					<!-- #ifndef MP-QQ -->
					<view class="cu-item padding solid-bottom arrow" v-if="item.origin_url" @tap.stop="goOfficalArticle"
						:data-index="index">查看原文信息</view>
					<!-- #endif -->
				</template>
			</view>
			<view class="padding" v-else>
				<tips :tips="`${checkedDate} 暂无放映计划安排`"></tips>
			</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad-custom unit-id="adunit-3d7f1704631ec7ea" ad-intervals="30"></ad-custom>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-QQ -->
		<view v-if="!isVip" class="margin margin-tb-xl radius">
			<ad unit-id="f0256a9d11d62920007be2d67178cdd3" type="card"></ad>
		</view>
		<!-- #endif -->
		
		<view class="margin-tb-xl padding-tb-xl"></view>

	</view>
</template>
<script>
	const app = getApp()
	import api from '@/request/api.js'
	let interstitialAd = null
	export default {
		data() {
			return {
				isVip: false,
				checkedDate: null,
				type: "month",
				mode: "single",
				color: "#22cece",
				insert: true,
				fold: true,
				startWeek: "mon",
				slideSwitchMode: "horizontal",
				startDate: "2023-03-01",
				showMonth: true,
				movieDays: [],
				movieList: ''
			}
		},
		onLoad(option) {
			this.isVip = app.globalData.isVip
			// #ifdef MP-WEIXIN
			if(wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-c142eaf344ea8f4b' })
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({ adUnitId: '8fe9b8e7191346a2ffb0c20c6bf3e0cf' })
			// #endif
			if (option && option.date) {
				this.checkedDate = option.date // 格式：2024-11-09
			} else {
				var date = new Date()
				var year = date.getFullYear()
				var month = date.getMonth() + 1
				var day = date.getDate()
				this.checkedDate = `${year}-${month}-${day}`
			}
			this.getDateMovie(this.checkedDate)
			this.getMonthMovie(this.checkedDate)
		},
		onShow() {
			if (interstitialAd && !this.isVip) interstitialAd.show()	
		},
		methods: {
			goOfficalArticle(e) {
				const index = e.currentTarget.dataset.index
				const movie = this.movieList[index]
				if (!movie.origin_url) return

				// #ifdef MP-WEIXIN
				wx.navigateTo({
					url: '../webview/webview?url=' + encodeURIComponent(movie.origin_url)
				})
				// #endif

				// #ifdef H5
				window.location.href = movie.origin_url
				// #endif
			},
			goDouban(e) {
				const index = e.currentTarget.dataset.index
				const movie = this.movieList[index]
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
					appId: 'wx2f9b06c1de1ccfca',
					path: `pages/subject/subject?type=movie&id=${movie.douban_id}`
				})
				// #endif

				// #ifdef H5
				window.open(`https://movie.douban.com/subject/${movie.douban_id}`)
				// #endif
			},
			showPoster(e) {
				uni.previewImage({
					urls: [e.currentTarget.dataset.url],
				})
			},
			calendarChange(e) {
				console.log('calendarChange', e)
				this.getDateMovie(e.fulldate)
			},
			monthChange(e) {
				console.log('monthChange', e)
				this.getMonthMovie(e.fullDate)
			},
			getDateMovie(date = '') {
				api.fetchMovieDay(date).then(res => {
					this.movieList = res.data
					if (date.length) this.checkedDate = date
				})
			},
			getMonthMovie(month) {
				api.fetchMovieMonthList(month).then(res => {
					if (res.data && res.data.length) {
						const movieDays = []
						for (let day of res.data) {
							movieDays.push({
								date: `${day.year}-${day.month}-${day.date}`,
								badge: true,
								badgeColor: '#00C853',
								badgePosition: 'bottom-center',
							})
						}
						this.movieDays = movieDays
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
					}
				})
			},
			goPlace (place = '') {
				if (!place.includes('社科')) return
				uni.navigateTo({ url: '/pages/school/map?id=14' })
			},
			addCalendar (movie) {
				const _this = this
				// #ifdef MP
				uni.getSetting({
				  success (settingRes) {
					if (!settingRes.authSetting['scope.addPhoneCalendar']) {
						uni.authorize({
							scope: 'scope.addPhoneCalendar',
							success() {
								_this.addPhoneCalendar(movie)
							},
							fail() {
								uni.openSetting()
							}
						})
					} else {
						_this.addPhoneCalendar(movie)
					}
				  }
				})
				// #endif
			},
			addPhoneCalendar (movie) {
				// #ifdef MP
				const duration = /\d{1,3}/.exec(movie.duration) // 影片时长分钟数
				uni.showModal({
					title: '提示',
					content: '你要将此影片放映添加到手机日程，放映前20分钟提醒吗？',
					success: function (res) {
						if (!res.confirm) return
						wx.addPhoneCalendar({
							title: `观看影片《${movie.name}》`,
							startTime: new Date(`${movie.play_at}`).getTime().toString().slice(0, -3),
							endTime: Number(new Date(`${movie.play_at}`).getTime().toString().slice(0, -3)) + (duration  * 60),
							description: `${movie.name} | 主演：${movie.actor} | 地点：${movie.place}`,
							location: movie.place,
							alarmOffset: 60 * 20, // 提前20分钟提醒
							fail (error) {
								console.log(error)
							}
						})
					}
				})
				// #endif
			}
		},
		onShareAppMessage() {
			let text = ''
			if (this.movieList.length && this.movieList[0].name) text = `《${this.movieList[0].name}》`
			let data = {
			  title: `${text}${this.checkedDate}电影放映`,
			  path: `/pages/school/movie?date=${this.checkedDate}`
			}
			if (this.movieList.length && this.movieList[0].poster) data.imageUrl = this.movieList[0].poster
			console.log(data)
			return data
		},
		onShareTimeline() {
			let text = ''
			if (this.movieList.length && this.movieList[0].name) text = `《${this.movieList[0].name}》`
			let data = {
			  title: `${text}${this.checkedDate}电影放映`,
				query: `date=${this.checkedDate}`
			}
			if (this.movieList.length && this.movieList[0].poster) data.imageUrl = this.movieList[0].poster
			return data
		}
	}
</script>