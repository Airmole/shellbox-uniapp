const getMenuInfo = function() {
	let statusBarHeight = 0
	try {
		statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0
	} catch (e) {
		statusBarHeight = 0
	}

	// #ifdef MP
	// 小程序端存在胶囊按钮，可据此精确计算导航栏高度
	let custom = null
	let navigationBarHeight = 44
	try {
		custom = uni.getMenuButtonBoundingClientRect()
		if (custom && typeof custom.height === 'number' && typeof custom.top === 'number') {
			navigationBarHeight = custom.height + (custom.top - statusBarHeight) * 2
		} else {
			custom = { height: 44, top: statusBarHeight }
		}
	} catch (e) {
		custom = { height: 44, top: statusBarHeight }
	}
	// #endif

	// #ifndef MP
	// H5 与 App 端没有胶囊按钮，getMenuButtonBoundingClientRect 不存在，
	// 否则会导致页面渲染崩溃、白屏，此处使用标准导航栏高度 44px
	const navigationBarHeight = 44
	const custom = {
		height: 44,
		top: statusBarHeight
	}
	// #endif

	const customBarHeight = (navigationBarHeight || 44) + (statusBarHeight || 0)

	return {
		statusBarHeight, // 状态栏高度
		navigationBarHeight, // 导航栏高度
		customBarHeight, // 总体高度
		custom,
	}
}

const menuInfo = getMenuInfo()

export default menuInfo
