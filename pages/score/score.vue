<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="content">成绩查询</block>
		</cu-custom>

		<view class="margin">
			<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'radius')">
				<view class="cu-item press-class" @click="showOptionsArea">
					<view class="content">
						<text class="cuIcon-title text-green"></text> 成绩筛选操作
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!foldOptionsArea">
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-grey">学年学期</text>
						</view>
						<view class="action">
							<picker @change="semesterChange" :value="semesterIndex" :range="semesterOptionsList" range-key="name">
								<view class="picker">
									{{semesterIndex>-1?semesterOptionsList[semesterIndex].name:'全部学期'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-grey">课程性质</text>
						</view>
						<view class="action">
							<picker @change="natureChange" :value="natureIndex" :range="natureOptionsList" range-key="name">
								<view class="picker">
									{{natureIndex>-1?natureOptionsList[natureIndex].name:'---请选择---'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">课程名称</text>
						</view>
						<view class="action text-right">
							<input placeholder="请输入课程名称" name="course" v-model="optionForm.course"></input>
						</view>
					</view>
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-grey">显示方式</text>
						</view>
						<view class="action">
							<picker @change="showChange" :value="showIndex" :range="showOptionsList" range-key="name">
								<view class="picker">
									{{showIndex>-1?showOptionsList[showIndex].name:'显示全部成绩'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item">
						<view class="content">
						</view>
						<view class="action">
							<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text class="cuIcon-refresh"></text> 重置</button>
							<button @click="fetchScore" class="cu-btn round bg-green shadow"><text class="cuIcon-search"></text> 查询</button>
						</view>
					</view>
				</template>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				foldOptionsArea: true,
				semesterOptionsList: [],
				natureOptionsList: [],
				showOptionsList: [],
				semesterIndex: -1,
				natureIndex: -1,
				showIndex: -1,
				optionForm: {
					semester: '',
					nature: '',
					course: '',
					show: ''
				},
			}
		},
		onLoad() {
			this.fetchOptions()
			this.fetchScore()
		},
		methods: {
			semesterChange (e) {
				const index = e.detail.value
				this.semesterIndex = index
				this.optionForm.semester = this.semesterOptionsList[index].value
			},
			natureChange (e) {
				const index = e.detail.value
				this.natureIndex = index
				this.optionForm.nature = this.natureOptionsList[index].value
			},
			showChange (e) {
				const index = e.detail.value
				this.showIndex = index
				this.optionForm.show = this.showOptionsList[index].value
			},
			fetchOptions() {
				this.$api.fetchScoreOptions().then(res => {
					console.log('获取成绩筛选项', res.data)
					this.semesterOptionsList = res.data.time
					this.natureOptionsList = res.data.nature
					this.showOptionsList = res.data.show
				})
			},
			fetchScore () {
				console.log(this.optionForm)
				uni.showLoading({ title: '查询中...' })
				this.$api.fetchScore(
					this.optionForm.semester,
					this.optionForm.nature,
					this.optionForm.course,
					this.optionForm.show
				).then(res => {
					console.log('成绩查询：', res.data)
					uni.hideLoading()
				}).catch(error => {
					console.log('成绩查询失败', error)
					uni.hideLoading()
				})
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			resetOptionsForm () {
				this.optionForm = {
					semester: '',
					nature: '',
					course: '',
					show: ''
				}
				this.semesterIndex = -1
				this.natureIndex = -1
				this.showIndex = -1
			}
		}
	}
</script>

<style>

</style>