<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>教室查询</view>
		</cu-custom>
		
		<view class="margin">
			<view :class="'cu-list menu sm-border '+(foldOptionsArea?'card-radius':'card-radius')">
				<view class="cu-item press-class" @click="showOptionsArea">
					<view class="content">
						<text class="cuIcon-title text-green"></text> 教室筛选操作
					</view>
					<view class="action text-right">
						<text :class="'cuIcon-'+(foldOptionsArea?'right':'unfold')"></text>
					</view>
				</view>
				<template v-if="!foldOptionsArea">
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-red">*教学楼</text>
						</view>
						<view class="action">
							<picker @change="buildingChange" :value="buildingIndex" :range="buildingOption"
								range-key="label">
								<view class="picker">
									{{buildingIndex>-1?buildingOption[buildingIndex].label:'教学楼'}}
								</view>
							</picker>
						</view>
					</view>
					<view class="cu-item arrow">
						<view class="content">
							<text class="text-red">*教室</text>
						</view>
						<view class="action">
							<picker @change="classroomChange" :value="classroomIndex" :range="classroomOption"
								range-key="label">
								<view class="picker">
									{{classroomIndex>-1?classroomOption[classroomIndex].label:'教室'}}
								</view>
							</picker>
						</view>
					</view>
					<template v-if="!foldOptionForm">
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">学年学期</text>
							</view>
							<view class="action">
								<picker @change="semesterChange" :value="semesterIndex" :range="semesterOption"
									range-key="name">
									<view class="picker">
										{{semesterIndex>-1?semesterOption[semesterIndex].name:'本学期'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">时间模式</text>
							</view>
							<view class="action">
								<picker @change="timeModelChange" :value="timeModelIndex" :range="timeModelOption"
									range-key="name">
									<view class="picker">
										{{timeModelIndex>-1?timeModelOption[timeModelIndex].name:'节次模式'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">教室类型</text>
							</view>
							<view class="action">
								<picker @change="classroomTypeChange" :value="classroomTypeIndex" :range="classroomTypeOption"
									range-key="name">
									<view class="picker">
										{{classroomTypeIndex>-1?classroomTypeOption[classroomTypeIndex].name:'教室类型'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">人数比较</text>
							</view>
							<view class="action flex">
								<picker @change="peopleSignChange" :value="peopleSignIndex" :range="peopleSignOption"
									range-key="name">
									<view class="picker">
										{{peopleSignIndex>-1?peopleSignOption[peopleSignIndex].name:'比较方式'}} <text class="cuIcon-right"></text>
									</view>
								</picker>
								<view class="margin-lr"><text>~</text></view>
								<input placeholder="输入比较人数" name="peopleNum" style="width: 200rpx;" v-model="optionForm.peopleNum" />
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">教室状态</text>
							</view>
							<view class="action">
								<picker @change="classroomStatusChange" :value="classroomStatusIndex" :range="classroomStatusOption"
									range-key="name">
									<view class="picker">
										{{classroomStatusIndex>-1?classroomStatusOption[classroomStatusIndex].name:'教室状态'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">借用院系</text>
							</view>
							<view class="action">
								<picker @change="borrowCollegeChange" :value="borrowCollegeIndex" :range="borrowCollegeOption"
									range-key="name">
									<view class="picker">
										{{borrowCollegeIndex>-1?borrowCollegeOption[borrowCollegeIndex].name:'借用院系'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">教室所属单位</text>
							</view>
							<view class="action">
								<picker @change="classroomOwnedChange" :value="classroomOwnedIndex" :range="classroomOwnedOption"
									range-key="name">
									<view class="picker">
										{{classroomOwnedIndex>-1?classroomOwnedOption[classroomOwnedIndex].name:'所属单位'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">周次</text>
							</view>
							<view class="action flex">
								<picker @change="weekStartChange" :value="weekStartIndex" :range="weekOption"
									range-key="name">
									<view class="picker">
										{{weekStartIndex>-1?weekOption[weekStartIndex].name:'开始周次'}} <text class="cuIcon-right"></text>
									</view>
								</picker>
								<view class="margin-lr"><text>~</text></view>
								<picker @change="weekEndChange" :value="weekEndIndex" :range="weekOption"
									range-key="name">
									<view class="picker">
										{{weekEndIndex>-1?weekOption[weekEndIndex].name:'结束周次'}} <text class="cuIcon-right"></text>
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">星期</text>
							</view>
							<view class="action flex">
								<picker @change="dayOfWeekStartChange" :value="dayOfWeekStartIndex" :range="dayOfWeekOption"
									range-key="name">
									<view class="picker">
										{{dayOfWeekStartIndex>-1?dayOfWeekOption[dayOfWeekStartIndex].name:'开始星期'}} <text class="cuIcon-right"></text>
									</view>
								</picker>
								<view class="margin-lr"><text>~</text></view>
								<picker @change="dayOfWeekEndChange" :value="dayOfWeekEndIndex" :range="dayOfWeekOption"
									range-key="name">
									<view class="picker">
										{{dayOfWeekEndIndex>-1?dayOfWeekOption[dayOfWeekEndIndex].name:'结束星期'}} <text class="cuIcon-right"></text>
									</view>
								</picker>
							</view>
						</view>
					</template>
					<view class="text-center bg-white padding-sm text-blue">
						<view class="content" @tap="unfoldOptionForm()">
							<text v-if="foldOptionForm" class="text-blue cuIcon-unfold">展开所有筛选项</text>
							<text v-else class="text-blue cuIcon-fold">折叠不常用筛选项</text>
						</view>
					</view>
					<view class="cu-item">
						<view class="content"></view>
						<view class="action">
							<button @tap="resetOptionsForm()" class="cu-btn round bg-red shadow margin-lr"><text
									class="cuIcon-refresh"></text> 重置</button>
							<button @tap="fetchClassroomStatus()" class="cu-btn round bg-green shadow"><text
									class="cuIcon-search"></text> 查询</button>
						</view>
					</view>
				</template>
			</view>
		</view>
		
		<view v-if="classrooms !== ''" class="margin padding-sm bg-white card-radius">
			<view class="text-center margin-tb-xs">
				<text class="text-xl">教室占用符号说明</text>
			</view>
			<view class="text-center">
				<view>
					<text><text class="text-red">M</text>跨模式占用 | <text class="text-brown">Ｌ</text>临时调课 | <text class="text-blue">Ｇ</text> 固定调课</text>
				</view>
				<view>
					<text><text class="text-red">Κ</text>考试 | <text class="text-red">Ｘ</text>锁定 | <text class="text-red">Ｊ</text>借用 | ◆正常上课</text>
				</view>
				<view>
					<text>已占用状态时间节次可点击查看占用详情</text>
				</view>
			</view>
		</view>
		
		<view class="margin bg-white padding-tb-sm card-radius" v-for="(room, roomIndex) in classrooms" :key="roomIndex">
			<view class="text-center text-bold">
				<text class="text-xl">{{room.classroom}}</text>
			</view>
			<view class="margin-xs padding-lr-xs" v-for="(day, dayIndex) in room.items" :key="dayIndex">
				<view class="text-center margin-tb-xs">
					<text>{{day.title}}</text>
				</view>
				<view class="flex justify-center align-start">
					<view class="text-center justify-start bg-gray align-center" style="width: 100rpx;" v-for="(item, index) in day.items">
						<view :class="`flex align-start cell ${item.content.length === 0?'bg-green':'bg-gray'}`" @tap="roomDetail(roomIndex, dayIndex, index)">
							<view class="room-item flex-sub border-bottom">
								<text>{{serialArray[index]}}</text>
							</view>
							<view class="room-item flex-sub">
								<template v-for="(text, tindex) in item.content" :key="tindex">
									<text v-if="text === 'M'" class="text-red">{{text}}</text>
									<text v-else-if="text === 'Ｌ'" class="text-brown">{{text}}</text>
									<text v-else-if="text === 'Ｇ'" class="text-blue">{{text}}</text>
									<text v-else-if="text === 'Κ'" class="text-red">{{text}}</text>
									<text v-else-if="text === 'Ｘ'" class="text-red">{{text}}</text>
									<text v-else-if="text === 'Ｊ'" class="text-red">{{text}}</text>
									<text v-else-if="text === '◆'">{{text}}</text>
									<text v-else>{{text}}</text>
								</template>
								<template v-if="item.content.length === 0">
									<text class="text-white">{{'空闲'}}</text>
								</template>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<tips v-if="classrooms !== '' && classrooms.length === 0" :tips="'没找到符合条件的结果，调整筛选项试试？'"></tips>
		
		<view class="cu-modal" :class="showDetailModal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">教室占用详情</view>
					<view class="action" @tap="hideDetailModal">
						<text class="cuIcon-close text-red"></text>
					</view> 
				</view>
				<view class="text-left" v-if="classroomDetail.length">
					<swiper :indicator-dots="true" :autoplay="false" style="height: 960rpx;">
						<block v-for="(detail, detailIndex) in classroomDetail" :key="detailIndex">
							<swiper-item>
								<view class="swiper-item">
									<view class="cu-list menu sm-border">
										<template v-for="(item, index) in detail" :key="index">
											<view class="cu-item" v-if="item.value">
												<view class="content">
													<text class="text-grey">{{item.label}}</text>
												</view>
												<view class="action" style="max-width: 500rpx;">
													<view>{{item.value}}</view>
												</view>
											</view>
										</template>
									</view>
								</view>
							</swiper-item>
						</block>
					</swiper>
					<view v-if="classroomDetail.length>1" class="padding-sm text-center"><text>左右滑动可切换</text></view>
				</view>
				<view class="text-center" v-else>
					<view class="padding">
						<view class="text-xsl">
							<text class="cuIcon-roundcheckfill text-green"></text>
						</view>
						<view class="text-center margin-tb-xs">
							<text>恭喜！此时段教室空闲，没有活动占用</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	export default {
		data() {
			return {
				classrooms: '',
				foldOptionsArea: false,
				foldOptionForm: true,
				semesterIndex: -1,
				semesterOption: [],
				timeModelIndex: -1,
				timeModelOption: [],
				classroomTypeIndex: -1,
				classroomTypeOption: [],
				buildingIndex: -1,
				buildingOption: [],
				classroomIndex: -1,
				classroomOption: [],
				peopleSignIndex: -1,
				peopleSignOption: [],
				classroomStatusIndex: -1,
				classroomStatusOption: [],
				borrowCollegeIndex: -1,
				borrowCollegeOption: [],
				classroomOwnedIndex: -1,
				classroomOwnedOption: [],
				weekStartIndex: -1,
				weekEndIndex: -1,
				weekOption: [],
				dayOfWeekStartIndex: -1,
				dayOfWeekEndIndex: -1,
				dayOfWeekOption: [],
				optionForm: {
					semester: '',
					timeModel: '',
					schoolArea: '',
					teachArea: '',
					classroomType: '',
					teachBuilding: '',
					classroomCode: '',
					peopleSign: '',
					peopleNum: '',
					classroomStatus: '',
					borrowCollege: '',
					classroomOwned: '',
					weekStart: '',
					weekEnd: '',
					dayOfWeekStart: '',
					dayOfWeekEnd: '',
					serialNoStart: '',
					serialNoEnd: ''
				},
				dayOfWeeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
				serialArray: ['1~2', '3~4', '5~6', '7~8', '9~10', '11~13'],
				classroomDetail: '',
				showDetailModal: false
			}
		},
		onLoad() {
			this.generateWeekOption()
			this.generateDayOfWeekOption()
			this.fetchOptions()
			this.fetchClassroomList('building')
			this.fetchClassroomList('classroom')
		},
		methods: {
			fetchOptions () {
				uni.showLoading({ title: '加载中...' })
				api.fetchClassroomOptions().then(res => {
					const {
						semester,
						timeModel,
						schoolArea,
						teachArea,
						classroomType,
						peopleSign,
						classroomStatus,
						borrowCollege,
						classroomOwned
					} = res.data
					this.semesterOption = semester
					this.semesterIndex = semester.findIndex((value) => value.checked === true)
					this.optionForm.semester = semester[this.semesterIndex].value
					this.timeModelOption = timeModel
					this.timeModelIndex = timeModel.findIndex((value) => value.checked === true)
					this.optionForm.timeModel = timeModel[this.timeModelIndex].value
					this.classroomTypeOption = classroomType
					this.classroomTypeIndex = classroomType.findIndex((value) => value.checked === true)
					this.optionForm.classroomType = classroomType[this.classroomTypeIndex].value
					this.peopleSignOption = peopleSign
					this.peopleSignIndex = peopleSign.findIndex((value) => value.checked === true)
					this.optionForm.peopleSign = peopleSign[this.peopleSignIndex].value
					this.classroomStatusOption = classroomStatus
					this.classroomStatusIndex = classroomStatus.findIndex((value) => value.checked === true)
					this.optionForm.classroomStatus = classroomStatus[this.classroomStatusIndex].value
					this.borrowCollegeOption = borrowCollege
					this.borrowCollegeIndex = borrowCollege.findIndex((value) => value.checked === true)
					this.optionForm.borrowCollege = borrowCollege[this.borrowCollegeIndex].value
					this.classroomOwnedOption = classroomOwned
					this.classroomOwnedIndex = classroomOwned.findIndex((value) => value.checked === true)
					this.optionForm.classroomOwned = classroomOwned[this.classroomOwnedIndex].value
					uni.hideLoading()
				})
			},
			fetchClassroomStatus () {
				if (!this.optionForm.teachBuilding.length && !this.optionForm.classroomCode) {
					uni.showToast({ title: '教学楼或教室请至少选择一项！', icon: 'none'})
					return
				}
				uni.showLoading({ title: '加载中...' })
				api.fetchClassroomStatus(
					this.optionForm.semester,
					this.optionForm.timeModel,
					this.optionForm.schoolArea,
					this.optionForm.teachArea,
					this.optionForm.classroomType,
					this.optionForm.teachBuilding,
					this.optionForm.classroomCode,
					this.optionForm.peopleSign,
					this.optionForm.peopleNum,
					this.optionForm.classroomStatus,
					this.optionForm.borrowCollege,
					this.optionForm.classroomOwned,
					this.optionForm.weekStart,
					this.optionForm.weekEnd,
					this.optionForm.dayOfWeekStart,
					this.optionForm.dayOfWeekEnd,
					this.optionForm.serialNoStart,
					this.optionForm.serialNoEnd
				).then(res => {
					const { params, classroom } = res.data
					console.log('classroom', classroom)
					this.classrooms = classroom
					uni.hideLoading()
				}).catch(res => {
					uni.showToast({ title: res.data.message, icon: 'none'})
					uni.hideLoading()
				})
			},
			roomDetail (roomIndex, dayIndex, serialIndex) {
				uni.showLoading({ title: '加载中...'})
				const item = this.classrooms[roomIndex].items[dayIndex].items[serialIndex]
				console.log('roomDetail', item)
				api.fetchClassroomDetail(
					this.optionForm.semester,
					this.optionForm.timeModel,
					item.classroomCode,
					item.serialValue,
					item.dayOfWeek,
					item.startAt,
					item.endAt,
					this.optionForm.weekStart,
					this.optionForm.weekEnd,
					this.optionForm.dayOfWeekStart,
					this.optionForm.dayOfWeekEnd,
					this.optionForm.serialNoStart,
					this.optionForm.serialNoEnd
				).then(res => {
					this.classroomDetail = res.data
					console.log(res.data)
					uni.hideLoading()
					this.showDetailModal = true
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({title: res.data.message, icon: 'none'})
				})
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			semesterChange(e) {
				const index = e.detail.value
				this.semesterIndex = index
				this.optionForm.semester = this.semesterOption[index].value
			},
			timeModelChange (e) {
				const index = e.detail.value
				this.timeModelIndex = index
				this.optionForm.timeModel = this.timeModelOption[index].value
			},
			classroomTypeChange (e) {
				const index = e.detail.value
				this.classroomTypeIndex = index
				this.optionForm.classroomType = this.classroomTypeOption[index].value
			},
			buildingChange (e) {
				const index = e.detail.value
				this.buildingIndex = index
				this.optionForm.teachBuilding = this.buildingOption[index].value
				this.fetchClassroomList('classroom', this.buildingOption[index].value)
			},
			classroomChange (e) {
				const index = e.detail.value
				this.classroomIndex = index
				this.optionForm.classroomCode = this.classroomOption[index].value
			},
			peopleSignChange (e) {
				const index = e.detail.value
				this.peopleSignIndex = index
				this.optionForm.peopleSign = this.peopleSignOption[index].value
			},
			classroomStatusChange (e) {
				const index = e.detail.value
				this.classroomStatusIndex = index
				this.optionForm.classroomStatus = this.classroomStatusOption[index].value
			},
			borrowCollegeChange (e) {
				const index = e.detail.value
				this.borrowCollegeIndex = index
				this.optionForm.borrowCollege = this.borrowCollegeOption[index].value
			},
			classroomOwnedChange (e) {
				const index = e.detail.value
				this.classroomOwnedIndex = index
				this.optionForm.classroomOwned = this.classroomOwnedOption[index].value
			},
			weekStartChange (e) {
				const index = e.detail.value
				this.weekStartIndex = index
				this.optionForm.weekStart = this.weekOption[index].value
			},
			weekEndChange (e) {
				const index = e.detail.value
				this.weekEndIndex = index
				this.optionForm.weekEnd = this.weekOption[index].value
			},
			dayOfWeekStartChange (e) {
				const index = e.detail.value
				this.dayOfWeekStartIndex = index
				this.optionForm.dayOfWeekStart = this.dayOfWeekOption[index].value
			},
			dayOfWeekEndChange (e) {
				const index = e.detail.value
				this.dayOfWeekEndIndex = index
				this.optionForm.dayOfWeekEnd = this.dayOfWeekOption[index].value
			},
			generateWeekOption () {
				const weekOption = []
				for (var i = 1; i <= 30; i++) {
					weekOption.push({name: `第${i}周`, value: i})
				}
				this.weekOption = weekOption
			},
			generateDayOfWeekOption () {
				const dayOfWeekOption = []
				for (var i = 0; i < this.dayOfWeeks.length; i++) {
					dayOfWeekOption.push({name: this.dayOfWeeks[i], value: (i+1) })
				}
				this.dayOfWeekOption = dayOfWeekOption
			},
			fetchClassroomList (type = 'classroom', buildingId = '') {
				uni.showLoading({ title: '加载中...'})
				api.fetchClassroomList(type, buildingId).then(res => {
					if (type === 'classroom') this.classroomOption = res.data
					if (type === 'building') this.buildingOption = res.data
					uni.hideLoading()
				})
			},
			hideDetailModal () {
				this.showDetailModal = !this.showDetailModal
			},
			unfoldOptionForm () {
				this.foldOptionForm = !this.foldOptionForm
			},
			resetOptionsForm() {
				this.optionForm = {
					semester: '',
					timeModel: '',
					schoolArea: '',
					teachArea: '',
					classroomType: '',
					teachBuilding: '',
					classroomCode: '',
					peopleSign: '',
					peopleNum: '',
					classroomStatus: '',
					borrowCollege: '',
					classroomOwned: '',
					weekStart: '',
					weekEnd: '',
					dayOfWeekStart: '',
					dayOfWeekEnd: '',
					serialNoStart: '',
					serialNoEnd: ''
				}
				this.semesterIndex = -1
				this.timeModelIndex = -1
				this.classroomTypeIndex = -1
				this.buildingIndex = -1
				this.classroomIndex = -1
				this.peopleSignIndex = -1
				this.classroomStatusIndex = -1
				this.borrowCollegeIndex = -1
				this.classroomOwnedIndex = -1
				this.weekStartIndex = -1
				this.weekEndIndex = -1
				this.dayOfWeekStartIndex = -1
				this.dayOfWeekEndIndex = -1
				this.fetchOptions()
			}
		}
	}
</script>

<style>
	.cell {
		flex-direction: column;
		width: 100rpx;
		margin: 0;
		padding: 0;
		border: 1px solid;
		border-radius: 0;
	}
	.border {
		border: 1px solid;
	}
	.border-bottom {
		border-bottom: 1px solid;
	}
	.room-item {
		width: 100%;
		height: 40rpx;
		margin: 0 !important;
		padding: 0 !important;
	}
</style>
