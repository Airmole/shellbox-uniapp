<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>校历</view>
		</cu-custom>
		
		<!-- 成绩筛选操作区 -->
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
				<!-- <view class="text-center"><text>点击可放大全屏浏览，长按可保存</text></view> -->
			</template>
			<template v-if="schoolCalendarImage === '' && semesterIndex > -1">
				<tips :tips="`暂无${semesterOptionsList[semesterIndex]?.name}学年学期校历!`"></tips>
			</template>
		</view>
		
		
</template>

<script>
	import api from '@/request/api.js'
	
	export default {
		data() {
			return {
				semesterIndex: -1,
				semesterOptionsList: [],
				schoolCalendarImage: '',
			}
		},
		onLoad() {
			this.fetchCalendarOptions()
			this.getImage()
		},
		methods: {
			fetchCalendarOptions () {
				api.fetchCalendarOptions().then(res => {
					this.semesterOptionsList = res.data.semester
					this.semesterIndex = 0
				})
			},
			semesterChange(e) {
				const index = e.detail.value
				this.semesterIndex = index
				const semester = this.semesterOptionsList[index].value
				console.log('semester', semester)
				uni.showLoading({ title: '加载中...'})
				this.getImage(semester)
			},
			getImage (semester = '') {
				api.getSchoolCalendarImage(semester).then(res => {
					if (res.data.length === 0) {
						this.schoolCalendarImage = ''
						uni.hideLoading()
					} else {
						this.schoolCalendarImage = res.data?.image
					}
				}).catch(error => {
					this.schoolCalendarImage = ''
					uni.hideLoading()
				})
			},
			preview () {
				uni.previewImage({
					urls: [this.schoolCalendarImage]
				})
			},
			imageLoaded () {
				uni.hideLoading()
			}
		}
	}
</script>

<style>

</style>
