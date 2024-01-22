<template>
	<view>
		<view class="padding-top bg-height bg-img bg-mask flex justify-center"
			:style="{backgroundImage: `url(${backgroundImageUrl})`}">
			<view class="padding-xl text-white radius bg-card">
				<navigator :url="loginStatus?'/pages/setting/profile':'/pages/index/login'"
					class="margin-top-xxl flex justify-center">
					<image class="cu-avatar round avatar"
						:src="loginStatus&&profile&&profile.avatar?profile.avatar:defaultAvatar" mode="scaleToFill">
					</image>
				</navigator>
				<navigator url="/pages/index/login" v-if="!loginStatus"
					class="round bg-gray text-center margin-tb padding-xs">
					<span>您尚未登录</span>
				</navigator>
				<navigator url="/pages/setting/profile" v-else class="round bg-gray text-center margin-tb padding-xs">
					<span>{{profile.nickname}}({{edusysAccount.account}})</span>
				</navigator>
			</view>
			<image class="gif-wave" :src="waterWaveUrl" mode="scaleToFill"></image>
		</view>

		<view class="cu-list menu sm-border" v-for="(item, index) in menuList" style="margin-top: 0;" :key="index">
			<view class="cu-bar solid-bottom bg-white" :data-index="index" @click="foldMenu" style="min-height: 60upx;"
				:hover-class="item.items.length > 5?'press-class':''">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">{{item.title}}</text>
				</view>
				<view class="action" v-if="item.items.length > 5">
					<text :class="(item.fold?'cuIcon-right':'cuIcon-unfold') + ' text-green'"></text>
				</view>
			</view>
			<view class="cu-list grid col-5 no-border text-green line-green" style="padding: 0;">
				<view class="cu-item" v-for="(itm,idx) in item.items" :key="idx" v-if="idx<5">
					<text :class="'iconfont icon-' + itm.icon" style="color: #39B54A;font-size: 40upx;"></text>
					<text>{{itm.name}}</text>
				</view>
				<view class="cu-item" v-for="(itm,idx) in item.items" :key="idx" v-if="idx>=5 && !item.fold">
					<text :class="'iconfont icon-' + itm.icon" style="color: #39B54A;font-size: 40upx;"></text>
					<text>{{itm.name}}</text>
				</view>
			</view>
		</view>

		<view class="flex margin">
			<view class="flex-sub margin-right-sm">
				<button class="round bg-default shadow" open-type="share">分享</button>
			</view>
			<navigator v-if="!loginStatus" class="flex-sub margin-left-sm" url="/pages/index/login">
				<button class="round bg-default">登录</button>
			</navigator>
			<button v-else @click="logout()" class="flex-sub margin-left-sm round bg-red">注销退出</button>
		</view>

		<view class="text-center padding"></view>


	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				loginStatus: app.getLoginStatus(),
				edusysAccount: app.getEdusysAccount(),
				profile: '',
				defaultAvatar: app.globalData.defaultAvatar,
				backgroundImageUrl: 'https://store2018.muapp.cn/images/weapp/background/4697920-48dab9eddafb6ce3.webp',
				waterWaveUrl: 'https://store2018.muapp.cn/images/weapp/water-wave.gif',
				menuList: [{
						title: '课表成绩',
						fold: false,
						items: [{
							id: 'myCourse',
							icon: 'wodekebiao',
							teacher: true,
							student: true,
							name: '我的课表',
							url: '../course/my',
							login: true,
						}, {
							id: 'stulist',
							icon: 'gongrenhuamingce',
							teacher: true,
							student: false,
							name: '花名册',
							url: '../course/stulist/index',
							login: true,
						}, {
							id: 'teacherCourse',
							icon: 'jiaoshikebiao',
							teacher: true,
							student: true,
							name: '教师课表',
							url: '../course/search?type=teacher',
							login: true,
						}, {
							id: 'classCourse',
							icon: 'banjikebiao',
							teacher: true,
							student: true,
							name: '班级课表',
							url: '../course/search?type=class',
							login: true,
						}, {
							id: 'score',
							icon: 'chengji',
							teacher: false,
							student: true,
							name: '成绩查询',
							url: '../score/score',
							login: true,
						}, {
							id: 'cet',
							icon: 'CET',
							teacher: true,
							student: true,
							name: '查四六级',
							url: 'packageResultQuery/pages/cet_his/CET_Result_His_Portal',
							login: false,
						}]
					},
					{
						title: '费用查询',
						fold: false,
						items: [{
							id: 'elesys',
							icon: 'dianfei',
							teacher: true,
							student: true,
							name: '寝室用电',
							url: '../elesys/bind',
							login: false,
						}, {
							id: 'card',
							icon: 'card',
							teacher: false,
							student: true,
							name: '一卡通余额',
							url: '../school/card/bind',
							login: true,
						}, {
							id: 'netfare',
							icon: 'wangluo',
							teacher: true,
							student: true,
							name: '网费查询',
							url: '../netsys/bind',
							login: true,
						}, {
							id: 'finance',
							icon: 'finance',
							teacher: false,
							student: true,
							name: '学费查询',
							url: '../school/finance/bind',
							login: true,
						}]
					},
					{
						title: '图书馆',
						fold: true,
						items: [{
							id: 'booksearch',
							icon: 'booksearch',
							teacher: true,
							student: true,
							name: '图书检索',
							url: './../books/search',
							login: false,
						}, {
							id: 'mybooks',
							icon: 'tushuguan',
							teacher: true,
							student: true,
							name: '我的借阅',
							url: './../books/bind',
							login: true,
						}, {
							id: 'scanBookCode',
							icon: 'dushuma',
							teacher: true,
							student: true,
							name: '扫码查书',
							url: '',
							login: false,
						}, {
							id: 'hotBook',
							icon: 'bangdan',
							teacher: true,
							student: true,
							name: '热门图书',
							url: '../books/hot/index',
							login: false,
						}, {
							id: 'movie',
							icon: 'movie',
							teacher: true,
							student: true,
							name: '音像放映',
							url: '../school/movie',
							login: false,
						}, {
							//   id: 'recommendBook',
							//   icon: 'tuijian',
							//   teacher: true,
							//   student: true,
							//   name: '图书荐购',
							//   url: '../books/recommend/index',
							//   login: false,
							// }, {
							id: 'overdue',
							icon: 'qiankuanjiesuan',
							teacher: true,
							student: true,
							name: '超期催还',
							url: '../books/overdue/index',
							login: false,
						}]
					},
					{
						title: '校园生活',
						fold: false,
						items: [{
							id: 'calendar',
							icon: 'xiaoli',
							teacher: true,
							student: true,
							name: '校历',
							url: '../school/calendar',
							login: false,
						}, {
							id: 'schoolTrans',
							icon: 'daba',
							teacher: true,
							student: true,
							name: '校园出行',
							url: '../traffic/bus',
							login: false,
						}, {
							id: 'teacherBus',
							icon: 'daba',
							teacher: true,
							student: false,
							name: '班车订票',
							url: '',
							login: true,
						}, {
							//   id: 'lost',
							//   icon: 'lost',
							//   teacher: true,
							//   student: true,
							//   name: '失物招领',
							//   url: '../school/lost/index',
							//   login: false,
							// }, {
							id: 'map',
							icon: 'tubiao_ditu',
							teacher: true,
							student: true,
							name: '校园导航',
							url: '../traffic/navi',
							login: false,
						}, {
							id: 'steps',
							icon: 'runsteps',
							teacher: true,
							student: true,
							name: '运动排行',
							url: '../school/run/index',
							login: false,
						}, {
							id: 'tel',
							icon: 'tel',
							teacher: true,
							student: true,
							name: '常用电话',
							url: '../school/tel',
							login: false,
						}, {
							id: 'certificate',
							icon: 'zhengjian',
							teacher: true,
							student: true,
							name: '考证助手',
							url: '../school/cert',
							login: false,
						}, {
							id: 'websites',
							icon: 'diqiu',
							teacher: true,
							student: true,
							name: '校园站点',
							url: '../school/web',
							login: false,
						}, {
							id: 'xiaoai',
							icon: 'xiaoai',
							teacher: true,
							student: true,
							name: '小爱课表',
							url: '../school/xiaoai',
							login: false,
						}, {
							id: 'about',
							icon: 'plane',
							teacher: true,
							student: true,
							name: '关于盒子',
							url: '../school/aboutus',
							login: false,
						}]
					}
				],
			}
		},
		onLoad() {
			this.fetchProfile()
		},
		onShow() {
			this.refreshLoginStatus()
		},
		methods: {
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出账号吗？',
					success(res) {
						if (res.confirm) {
							app.logout()
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			fetchProfile() {
				var _this = this
				if (!_this.loginStatus) return
				_this.$api.fetchProfile().then(res => {
					console.log(res.data)
					_this.profile = res.data
				})
			},
			refreshLoginStatus() {
				const loginStatus = app.getLoginStatus()
				if (!loginStatus) {
					this.loginStatus = loginStatus
					this.edusysAccount = false
				} else {
					this.loginStatus = loginStatus
					this.edusysAccount = app.getEdusysAccount()
					this.fetchProfile()
				}
			},
			foldMenu(e) {
				const index = e.currentTarget.dataset.index
				let menuList = this.menuList
				menuList[index].fold = !menuList[index].fold
				this.menuList = menuList
			}
		}
	}
</script>

<style>
	.bg-height {
		height: 480upx;
	}

	.avatar {
		height: 180upx;
		width: 180upx;
	}

	.gif-wave {
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 100rpx;
	}
</style>