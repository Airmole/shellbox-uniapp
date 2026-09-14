<template>
	<view class="cu-list menu sm-border margin-sm card-radius">
		<view class="cu-bar solid-bottom bg-white" style="min-height: 60rpx;" @click="fold = !fold">
			<view class="action">
				<text class="cuIcon-titles text-green"></text>
				<text class="text-xl text-bold">{{title}}</text>
			</view>
			<view class="action text-green" v-if="menuList.length > 5">
				{{fold?`展开`:''}}<text :class="['text-green', fold ? 'cuIcon-right' : 'cuIcon-unfold']"></text>
			</view>
		</view>
		
		<view class="cu-list grid col-5 no-border text-green line-green" :class="[fold && 'fold']" style="padding: 0;">
			<template v-for="(item,idx) in renderMenu" :key="idx">
				<view v-if="isShowIcon(item)" class="cu-item" @click="goPage(item)">
					<text :class="'iconfont icon-' + item.icon" style="color: #39B54A;font-size: 40rpx;"></text>
					<text>{{item.title}}</text>
				</view>
			</template>
		</view>
	</view>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import { getEdusysAccount } from '@/common/utils/auth.js'
	import { useAppStore } from '@/stores/app.js'
	import { storeToRefs } from 'pinia'
	const appStore = useAppStore()
	const { loginStatus, userInfo, edusysAccount, courses } = storeToRefs(appStore)
	
	const props = defineProps({
		menuList: Object,
		title: String,
		isFold: Boolean
	})
	
	const fold = ref(null)
	const renderMenu = computed(() => {
		if (fold.value === null) fold.value = props.isFold
		if (!fold.value) return props.menuList
		return props.menuList.slice(0, 5)
	})
	
	// 身份判定：统一身份认证账号中，教职工号以 T 开头。
	// ⚠️ storeToRefs 解构出来的是 ref，必须 .value，否则 isTeacher 恒为真、isStudent 恒为假，
	// 会让绝大多数 teacher/student 均为 true 的菜单项被错误过滤掉。
	const isTeacher = computed(() => {
		const account = (edusysAccount.value && edusysAccount.value.account) || ''
		return String(account).toUpperCase().indexOf('T') === 0
	})
	
	const isStudent = computed(() => {
		return !isTeacher.value
	})
	
	// 当前所在平台标识。必须与后端 /wap/menu 返回的 platform 字段取值保持一致：
	// weapp / qqapp / android / ios / h5
	// ⚠️ 注意：uni-app 条件编译里 APP 是独立标签，'MP' 不包含 App 端、'H5' 也不包含 App 端，
	// 所以 App 端必须显式用 #ifdef APP 取平台标识，否则后面 icon.platform 匹配不上，
	// 会导致「更多」页所有图标被判定为不可见。
	let platform = 'weapp'
	// #ifdef H5
	platform = 'h5'
	// #endif
	// #ifdef MP-QQ
	platform = 'qqapp'
	// #endif
	// #ifdef APP
	try {
		// App 端 osName 首字母大写（'Android' / 'iOS'），接口里是小写，这里统一归一为小写
		platform = String(uni.getSystemInfoSync().osName).toLowerCase()
	} catch (e) {
		platform = 'android'
	}
	// #endif

	function isShowIcon (icon) {
		// 注意：loginStatus / isTeacher / isStudent 都是 ref / computed 对象，
		// 必须取 .value 判断，直接当布尔值用会恒为真 / 恒为假。
		if (icon.logined && !loginStatus.value) return false
		// ⚠️ 后端约定：teacher / student 表示「该功能面向教师/学生开放」，
		// 不是「仅教师/仅学生」。true 只代表该身份可用，因此判断方向必须是
		// 「当前身份是否被允许」，且两种身份都要各自判断：
		//   教师身份：允许 teacher=true 的项，同时若 student 也为 true 则同样可用
		//   学生身份：允许 student=true 的项，同时若 teacher 也为 true 则同样可用
		// 原实现用 `icon.teacher && !isTeacher` 会把学生身份下 20/22 项直接隐藏。
		if (!isTeacher.value && !isStudent.value) return false
		if (icon.teacher === true || icon.student === true) {
			if (icon.teacher === true && icon.student === true) {
				// 教师与学生均可用，任一身份命中即可
				return true
			}
			if (icon.teacher === true && !isTeacher.value) return false
			if (icon.student === true && !isStudent.value) return false
		}
		// platform 字段缺失时不过滤，避免后端字段异常导致整组图标消失
		if (!icon.platform) return true
		const list = Array.isArray(icon.platform) ? icon.platform : String(icon.platform).split(',')
		return list.map(item => String(item).trim().toLowerCase()).indexOf(platform) > -1
	}

	function goPage(menu) {
		if (!menu) return

		if (menu.need_login && (getEdusysAccount() === false || !loginStatus.value)) {
			uni.showToast({ title: '此功能需要登录', icon: 'none' })
			return
		}

		// 目标路径：小程序端优先 weapp_path（可能是外部小程序），其余端优先 url
		const isMiniProgram = platform === 'weapp' || platform === 'qqapp'
		const path = (isMiniProgram ? menu.weapp_path : menu.url) || menu.url || menu.weapp_path || ''

		// ⚠️ 关键修复：原来整段跳转逻辑被 #ifdef MP / #ifdef H5 包裹，
		// 而 'MP' 与 'H5' 都不包含 App 端，App 端编译后函数体被清空，
		// 表现为「图标能点但毫无反应」。这里改为运行时按平台分发。
		const query = getMenuQuery(menu)

		// 小程序端：配置了 weapp_id 的是外部小程序
		// #ifdef MP
		if (menu.weapp_id) {
			uni.navigateToMiniProgram({
				appId: menu.weapp_id,
				path: `${menu.weapp_path || ''}${query}`
			})
			return
		}
		// #endif

		// 完整 URL（App / H5 端）：用 webview 页打开，避免跳出应用
		if (/^https?:\/\//i.test(path)) {
			// #ifdef H5
			window.location.href = path
			return
			// #endif
			uni.navigateTo({
				url: '/pages/webview/webview?url=' + encodeURIComponent(path)
			})
			return
		}

		if (!path) {
			uni.showToast({ title: '该功能暂未开放', icon: 'none' })
			return
		}

		// tabBar 页面只能用 switchTab；其余页面用 navigateTo
		const basePath = path.split('?')[0]
		if ([
			'/pages/index/index',
			'/pages/index/feature'
		].indexOf(basePath) > -1) {
			uni.switchTab({ url: basePath })
			return
		}

		const url = `${path}${query}`
		uni.navigateTo({
			url,
			fail: () => {
				// 兜底：跳转失败时改为重定向，避免用户点击后毫无反馈
				uni.redirectTo({ url })
			}
		})
	}

	// 计算跳转所需的 query 参数（我的课表需要带上本周周次）
	function getMenuQuery (menu) {
		if (menu.menu_id !== 'myCourse') return ''
		const courseWeekText = (courses && courses.value && courses.value.nowWeek) || ''
		const nowWeekRegexp = /\d{1,2}/
		const match = nowWeekRegexp.exec(courseWeekText)
		const nowWeek = match ? Number(match[0]) : 0
		if (nowWeek > 0 && nowWeek < 30) return `?week=${nowWeek}`
		return ''
	}
	
</script>

<style>
	.card-radius {
		border-radius: 15rpx;
	}
</style>