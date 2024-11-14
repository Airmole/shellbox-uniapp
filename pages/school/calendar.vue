<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>校历</view>
		</cu-custom>
		
		<view class="margin">
			<view class="cu-list menu sm-border round">
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-grey">学年学期</text>
						</view>
						<view class="action">
							<picker @change="semesterChange" :value="semesterIndex" :range="semesterOptionsList"
								range-key="name">
								<view class="picker">
									{{semesterIndex>-1?semesterOptionsList[semesterIndex]?.name:''}}
								</view>
							</picker>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="flex justify-center align-center card-radius cu-list menu text-center margin bg-white">
			<template v-if="schoolCalendarImage !== ''">
				<view>
				<image @click="preview()" @load="imageLoaded()" :src="schoolCalendarImage" mode="widthFix"></image>
				</view>
			</template>
			<template v-if="schoolCalendarImage === '' && semesterIndex > -1">
				<tips :tips="`暂无${semesterOptionsList[semesterIndex]?.name}学年学期校历!`"></tips>
			</template>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<view class="margin bg-white card-radius">
			<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
		</view>
		<!-- #endif -->
		
		
</template>

<script>
	import api from '@/request/api.js'
	
	export default {
		data() {
			return {
				semesterIndex: -1,
				semesterOptionsList: [],
				schoolCalendarImage: '',
				calendarList: ''
			}
		},
		onLoad(options) {
			const semester = (options && options.semester) ? options.semester : ''
			this.fetchAllCalendar(semester)
		},
		methods: {
			fetchAllCalendar (semester = '') {
				uni.showLoading({ title: '加载中...'})
				api.fetchAllSchoolCalendar().then(res => {
					this.semesterOptionsList = res.data.map(item => {
						return { name: item.semester, value: item.semester }
					})
					let semesterIndex = 0
					if (semester) semesterIndex = res.data.findIndex(item => item.semester === semester)
					console.log(res.data, semesterIndex)
					this.schoolCalendarImage = res.data[semesterIndex].image
					this.semesterIndex = semesterIndex
					this.calendarList = res.data
					uni.hideLoading()
				})
			},
			semesterChange(e) {
				const index = Number(e.detail.value)
				const semester = this.semesterOptionsList[index]
				uni.showLoading({ title: '加载中...'})
				this.semesterIndex = index
				if (this.schoolCalendarImage === this.calendarList[index].image) uni.hideLoading()
				this.schoolCalendarImage = this.calendarList[index].image
			},
			preview () {
				uni.previewImage({
					urls: [this.schoolCalendarImage]
				})
			},
			imageLoaded () {
				uni.hideLoading()
			}
		},
		onShareAppMessage() {
			const semester = this.semesterOptionsList[this.semesterIndex].value
			let data = {
			  title: `${this.semesterOptionsList[this.semesterIndex]?.name}校历 - 贝壳小盒子`,
			  path: `/pages/school/calendar?semester=${semester}`
			}
			if (this.schoolCalendarImage) data.imageUrl = this.schoolCalendarImage
			return data
		},
		onShareTimeline() {
			const semester = this.semesterOptionsList[this.semesterIndex].value
			let data = {
				title: `${this.semesterOptionsList[this.semesterIndex]?.name}校历 - 贝壳小盒子`,
				query: `semester=${semester}`
			}
			if (this.schoolCalendarImage) data.imageUrl = this.schoolCalendarImage
			return data
		}
	}
</script>

<style>

</style>
