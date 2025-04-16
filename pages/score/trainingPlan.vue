<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<view>培养方案及完成情况</view>
		</cu-custom>

		<template v-if="isLogined && plan === ''">
			<tips tips="没有查询到您的培养方案" image="/static/image/nothing.png"></tips>
		</template>

		<template v-if="!isLogined">
			<tips tips="查询您的培养方案需登录账号" image="/static/image/nothing.png" :showButton="true" buttonText="现在登录"
				path="/pages/index/login"></tips>
		</template>
		<view v-else class="bg-white margin padding card-radius padding-bottom-xl">
			<template v-if="plan && plan.courseList && plan.courseList.content">
				<view class="margin">
					<view v-if="plan.title" class="text-center text-title margin-lr-xl padding-lr">
						<text class="text-bold">{{plan.title}}</text>
					</view>
				</view>
				<template v-if="plan.cultivateTarget">
					<view class="cu-bar">
						<view class="action">
							<text class="cuIcon-title text-green"></text>
							<text class="text-title text-title">一、培养目标</text>
						</view>
					</view>
					<view><text>{{plan.cultivateTarget}}</text></view>
				</template>
				<template v-if="plan.description">
					<view class="cu-bar">
						<view class="action">
							<text class="cuIcon-title text-green"></text>
							<text class="text-title text-title">二、详细说明</text>
						</view>
					</view>
					<view><text>{{plan.description}}</text></view>
				</template>
				<view v-if="plan.courseList" class="cu-bar">
					<view class="action">
						<text class="cuIcon-title text-green"></text>
						<text class="text-title text-title">三、课程设置总表</text>
					</view>
				</view>
				<view class="radius bg-gray" v-for="(courseSystem, index) in plan.courseList.content" :key="index">
					<view @click="foldCourseSystem(index)"
						class="text-center margin-top-sm flex justify-between align-center bg-gray padding-xs radius">
						<view></view>
						<view>
							<text class="text-title text-lg">{{courseSystem.courseSystem.title}}
								\n（应修：{{courseSystem.courseSystem.due}}&nbsp;&nbsp;|&nbsp;&nbsp;已修：{{courseSystem.courseSystem.existing}}）</text>
						</view>
						<view><text
								:class="'text-bold cuIcon-'+(courseSystem.fold || !courseSystem.hasOwnProperty('fold') ?'unfold':'right')"></text>
						</view>
					</view>
					<template v-if="courseSystem.fold || !courseSystem.hasOwnProperty('fold')">
						<view class="border radius margin-bottom"
							v-for="(courseItem, courseIndex) in courseSystem.items" :key="courseIndex">
							<view class="cu-form-group data-row bg-gradual-blue">
								<view>课程名称</view>
								<input class="text-right" :disabled="true" :value="courseItem.courseName"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>课程编号</view>
								<input class="text-right" :disabled="true" :value="courseItem.courseCode"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>完成情况</view>
								<input v-if="courseItem.completion" class="text-right" :disabled="true"
									:value="`${courseItem.completion.status}(${courseItem.completion.score}分)`"></input>
								<input v-else class="text-right" :disabled="true"
									:value="courseItem.completion"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>课程性质</view>
								<input class="text-right" :disabled="true" :value="courseItem.courseNature"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>课程属性</view>
								<input class="text-right" :disabled="true" :value="courseItem.courseType"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>学分</view>
								<input class="text-right" :disabled="true" :value="courseItem.credit"></input>
							</view>
							<view class="cu-form-group data-row bg-gray">
								<view>开设学期</view>
								<input class="text-right" :disabled="true" :value="courseItem.term"></input>
							</view>
							<view class="text-center bg-gray"><text>学时（总学时：<text
										class="text-lg">{{courseItem.totalHours}}</text>）</text></view>
							<view class="grid col-3 text-center bg-gray padding-xs">
								<view class="border flex flex-direction">
									<view>讲课学时</view>
									<view class="text-lg">{{courseItem.lectureHours}}</view>
								</view>
								<view class="border flex flex-direction">
									<view>实验学时</view>
									<view class="text-lg">{{courseItem.experimentalHours}}</view>
								</view>
								<view class="border flex flex-direction">
									<view>设计学时</view>
									<view class="text-lg">{{courseItem.designHours}}</view>
								</view>
								<view class="border flex flex-direction">
									<view>上机学时</view>
									<view class="text-lg">{{courseItem.computerHours}}</view>
								</view>
								<view class="border flex flex-direction">
									<view>实践学时</view>
									<view class="text-lg">{{courseItem.practicalHours}}</view>
								</view>
								<view class="border flex flex-direction">
									<view>其他学时</view>
									<view class="text-lg">{{courseItem.otherHours}}</view>
								</view>
							</view>
							<!-- #ifdef MP-WEIXIN -->
							<view v-if="courseIndex !== 0 && courseIndex % 5 === 0" class="bg-white">
								<ad unit-id="adunit-62f52651dd5f4ff6" ad-intervals="30"></ad>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-QQ -->
							<view v-if="courseIndex !== 0 && courseIndex % 5 === 0" class="bg-white">
								<ad unit-id="297c24fcd434022129795daed3f46440"></ad>
							</view>
							<!-- #endif -->
						</view>
					</template>
					<view class="radius border" v-if="courseSystem.summary">
						<view class="text-center bg-gradual-green">
							<text>小计</text>
						</view>
						<view class="text-center bg-gray"><text>学时（总学时：<text
									class="text-lg">{{courseSystem.summary.totalHours}}</text>）</text></view>
						<view class="grid col-3 text-center bg-gray padding-xs">
							<view class="border flex flex-direction">
								<view>讲课学时</view>
								<view class="text-lg">{{courseSystem.summary.lectureHours}}</view>
							</view>
							<view class="border flex flex-direction">
								<view>实验学时</view>
								<view class="text-lg">{{courseSystem.summary.experimentalHours}}</view>
							</view>
							<view class="border flex flex-direction">
								<view>设计学时</view>
								<view class="text-lg">{{courseSystem.summary.designHours}}</view>
							</view>
							<view class="border flex flex-direction">
								<view>上机学时</view>
								<view class="text-lg">{{courseSystem.summary.computerHours}}</view>
							</view>
							<view class="border flex flex-direction">
								<view>实践学时</view>
								<view class="text-lg">{{courseSystem.summary.practicalHours}}</view>
							</view>
							<view class="border flex flex-direction">
								<view>其他学时</view>
								<view class="text-lg">{{courseSystem.summary.otherHours}}</view>
							</view>
						</view>
						<view class="cu-form-group data-row bg-gray">
							<view>学分小计</view>
							<input class="text-right" :disabled="true" :value="courseSystem.summary.credit"></input>
						</view>
					</view>
					<view class="margin-tb"></view>
				</view>
			</template>

			<template v-if="plan && plan.courseList && plan.courseList.summary && plan.courseList.summary.termProgress">
				<view @click="foldProgress" class="text-center flex justify-between padding-top">
					<view></view>
					<text class="text-bold">学期修业进度</text>
					<view><text :class="'text-bold cuIcon-'+(showAllProgress?'unfold':'right')"></text></view>
				</view>
				<view v-for="(semester, semesterIndex) in plan.courseList.summary.termProgress" :key="semesterIndex"
					class="margin-tb-sm">
					<template v-if="semesterIndex===0 || (showAllProgress&&semesterIndex>0)">
						<view class="text-left">
							<text>{{semester.term}} 学期修业总进度</text>
						</view>
						<view class="cu-progress round">
							<view class="bg-gradual-blue"
								:style="`width: ${semester.progress?`${semester.progress}%`:''};`">
								{{semester.progress}}%</view>
						</view>
					</template>
				</view>
				<view class="margin-tb padding-tb"></view>
			</template>

			<view class="radius border" v-if="plan && plan.courseList && plan.courseList.summary">
				<view class="text-center bg-gradual-green">
					<text>合计</text>
				</view>
				<view class="text-center bg-gray"><text>学时（总学时：<text
							class="text-lg">{{plan.courseList.summary.totalHours}}</text>）</text></view>
				<view class="grid col-3 text-center bg-gray padding-xs">
					<view class="border flex flex-direction">
						<view>讲课学时</view>
						<view class="text-lg">{{plan.courseList.summary.lectureHours}}</view>
					</view>
					<view class="border flex flex-direction">
						<view>实验学时</view>
						<view class="text-lg">{{plan.courseList.summary.experimentalHours}}</view>
					</view>
					<view class="border flex flex-direction">
						<view>设计学时</view>
						<view class="text-lg">{{plan.courseList.summary.designHours}}</view>
					</view>
					<view class="border flex flex-direction">
						<view>上机学时</view>
						<view class="text-lg">{{plan.courseList.summary.computerHours}}</view>
					</view>
					<view class="border flex flex-direction">
						<view>实践学时</view>
						<view class="text-lg">{{plan.courseList.summary.practicalHours}}</view>
					</view>
					<view class="border flex flex-direction">
						<view>其他学时</view>
						<view class="text-lg">{{plan.courseList.summary.otherHours}}</view>
					</view>
				</view>
				<view class="cu-form-group data-row bg-gray">
					<view>学分合计</view>
					<input class="text-right" :disabled="true" :value="plan.courseList.summary.credit"></input>
				</view>
			</view>
		</view>

		<view class="margin-xl padding-xl"></view>

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
				showAllProgress: true,
				plan: null
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			if (wx.createInterstitialAd) interstitialAd = wx.createInterstitialAd({
				adUnitId: 'adunit-5a3621a7eb4da121'
			})
			// #endif
			// #ifdef MP-QQ
			if (qq.createInterstitialAd) interstitialAd = qq.createInterstitialAd({
				adUnitId: '7be7a448772d36a43560aabf2b2a1a0c'
			})
			// #endif

			if (getEdusysAccount() === false) {
				this.isLogined = false
				return
			}

			this.fetchTrainingPlan()
		},
		onShow() {
			if (interstitialAd) interstitialAd.show()
		},
		methods: {
			foldProgress() {
				this.showAllProgress = !this.showAllProgress
			},
			foldCourseSystem(index) {
				let value = this.plan.courseList.content[index].fold
				if (value == undefined) value = true
				this.plan.courseList.content[index].fold = !value
			},
			fetchTrainingPlan() {
				if (!this.isLogined) {
					uni.showToast({
						title: '需要登录后才能查询您的培养计划～',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '查询中...'
				})
				api.fetchTrainingPlan().then(res => {
					this.plan = res.data
					uni.hideLoading()
				}).catch(error => {
					console.log('培养计划查询失败', error)
					this.plan = ''
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.border {
		border: 1px solid gray;
	}

	.data-row {
		min-height: 0;
	}
</style>