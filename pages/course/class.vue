<template>
	<view>
		<template v-if="showSearchArea">
			<cu-custom bgColor="bg-gradual-blue" :isBack="true">
				<view>班级课表</view>
			</cu-custom>
			<view class="margin">
				<view :class="'cu-list menu sm-border '+(foldOptionsArea?'round':'card-radius')">
					<view class="cu-item press-class" @click="showOptionsArea">
						<view class="content">
							<text class="cuIcon-title text-green"></text> 班级课表查询筛选操作
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
								<picker @change="semesterChange" :value="semesterIndex" :range="semesterOption"
									range-key="name">
									<view class="picker">
										{{semesterIndex>-1?semesterOption[semesterIndex].name:'选择学期'}}
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
								<text class="text-grey">上课院系</text>
							</view>
							<view class="action">
								<picker @change="collegeChange" :value="collegeIndex" :range="collegeOption"
									range-key="name">
									<view class="picker">
										{{collegeIndex>-1?collegeOption[collegeIndex].name:'请选择'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">上课年级</text>
							</view>
							<view class="action">
								<picker @change="gradeChange" :value="gradeIndex" :range="gradeOption"
									range-key="name">
									<view class="picker">
										{{gradeIndex>-1?gradeOption[gradeIndex].name:'请选择'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item arrow">
							<view class="content">
								<text class="text-grey">上课专业</text>
							</view>
							<view class="action">
								<picker @change="professionChange" :value="professionIndex" :range="professionOption"
									range-key="dmmc">
									<view class="picker">
										{{professionIndex>-1?professionOption[professionIndex].dmmc:'请选择'}}
									</view>
								</picker>
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
								<text class="text-grey">上课班级</text>
							</view>
							<view class="action text-right">
								<input placeholder="请输入班级名称" name="className" v-model="optionForm.className" />
							</view>
						</view>
						<view class="cu-item">
							<view class="content">
							</view>
							<view class="action">
								<button @click="resetOptionsForm" class="cu-btn round bg-red shadow margin-lr"><text
										class="cuIcon-refresh"></text> 重置</button>
								<button @click="fetchClassCourse" class="cu-btn round bg-green shadow"><text
										class="cuIcon-search"></text> 查询</button>
							</view>
						</view>
					</template>
				</view>
			</view>
			
			<view class="cu-list menu-avatar margin card-radius">
			    <view class="cu-item" v-for="(classCourse, classIndex) in classCourses" :key="classIndex" @click="clickClassCourse(classIndex)">
					<view class="cu-avatar lg round bg-gradual-green"><text class="text-sm">{{classCourse.className}}</text></view>
			        <view class="content"><view class="padding-lr"><text class="text-xl">{{classCourse.className}}</text></view></view>
			    </view>
			</view>
		</template>
		
		<view v-if="!showSearchArea && classCourse.className">
			<view class="cu-bar bg-gradual-blue fixed">
			    <view class="action" @click="hideSearchArea"><text class="cuIcon-back text-white"></text></view>
			    <view class="content text-bold">{{classCourse.className}} 班级课表</view>
			</view>
			<view class="margin-tb-xl padding-top-xs"></view>
			<courseTable :columnTitles="columnTitle" :table="classCourse.course" :tips="''"></courseTable>
		</view>
		
	</view>
</template>

<script>
	import api from '@/request/api.js'
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import courseTable from './components/courseTable.vue'
	export default {
		components: { courseTable },
		data() {
			return {
				showSearchArea: true,
				foldOptionsArea: false,
				collegeIndex: -1,
				collegeOption: [],
				gradeIndex: -1,
				gradeOption: [],
				semesterIndex: -1,
				semesterOption: [],
				timeModelIndex: -1,
				timeModelOption: [],
				professionIndex: -1,
				professionOption: [],
				optionForm: {
					semester: '',
					timeModel: '',
					college: '',
					grade: '',
					profession: '',
					className: ''
				},
				classIndex: 0,
				classCourses: [],
				classCourse: {},
				columnTitle: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			}
		},
		onLoad() {
			if (getEdusysAccount() === false) {
				uni.redirectTo({ url: '/pages/index/login' })
				return
			}
			this.fetchOptions()
			this.fetchProfessionOptions()
		},
		methods: {
			hideSearchArea () {
				this.showSearchArea = true
			},
			showOptionsArea() {
				this.foldOptionsArea = !this.foldOptionsArea
			},
			clickClassCourse (classIndex) {
				console.log('clickClassCourse', this.classCourses[classIndex])
				if (classIndex >= 0) {
					this.classIndex = classIndex
					this.classCourse = this.classCourses[classIndex]
					this.showSearchArea = false
				}
			},
			fetchClassCourse () {
				uni.showLoading({ title: '加载中...' })
				console.log('optionForm', this.optionForm)
				api.fetchClassCourse(
					this.optionForm.semester,
					this.optionForm.timeModel,
					this.optionForm.college,
					this.optionForm.grade,
					this.optionForm.profession,
					this.optionForm.className
				).then(res => {
					// console.log('fetchClassCourse', res.data)
					this.classCourses = res.data
					uni.hideLoading()
				})
			},
			fetchOptions () {
				api.fetchClassCourseOptions().then(res => {
					const { semester, timeModel, college, grade } = res.data
					this.semesterOption = semester
					const semesterIndex = semester.findIndex((value) => value.checked === true)
					this.semesterIndex = semesterIndex
					this.optionForm.semester = semester[semesterIndex].value
					this.timeModelOption = timeModel
					const timeModelIndex = timeModel.findIndex((value) => value.checked === true)
					this.timeModelIndex = timeModelIndex
					this.optionForm.timeModel = timeModel[timeModelIndex].value
					this.collegeOption = college
					this.collegeIndex = college.findIndex((value) => value.checked === true)
					this.gradeOption = grade
					this.gradeIndex = grade.findIndex((value) => value.checked === true)
					uni.hideLoading()
				})
			},
			fetchProfessionOptions (collegeCode = '', grade = '') {
				api.fetchClassCourseProfessionOptions(collegeCode, grade).then(res => {
					this.professionOption = res.data
				})
			},
			semesterChange (e) {
				const index = e.detail.value
				this.semesterIndex = index
				this.optionForm.semester = this.semesterOption[index].value
			},
			timeModelChange (e) {
				const index = e.detail.value
				this.timeModelIndex = index
				this.optionForm.timeModel = this.timeModelOption[index].value
			},
			collegeChange (e) {
				const index = e.detail.value
				this.collegeIndex = index
				this.optionForm.college = this.collegeOption[index].value
				this.fetchProfessionOptions(this.optionForm.college, this.optionForm.grade)
			},
			gradeChange (e) {
				const index = e.detail.value
				this.gradeIndex = index
				this.optionForm.grade = this.gradeOption[index].value
				this.fetchProfessionOptions(this.optionForm.college, this.optionForm.grade)
			},
			professionChange (e) {
				const index = e.detail.value
				this.professionIndex = index
				this.optionForm.profession = this.professionOption[index].dm
			},
			resetOptionsForm() {
				uni.showLoading({ title: '加载中...' })
				this.optionForm = {
					semester: '',
					timeModel: '',
					college: '',
					grade: '',
					profession: '',
					className: ''
				}
				this.professionIndex = -1
				this.fetchOptions()
			}
		}
	}
</script>

<style>
</style>