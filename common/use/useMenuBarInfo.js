const getMenuInfo = function() {
	let statusBarHeight = 0
	try {
		const sysInfo = uni.getSystemInfoSync()
		statusBarHeight = (sysInfo && sysInfo.statusBarHeight) || 0
	} catch (e) {
		statusBarHeight = 0
	}

	// 运行时检测当前平台是否为小程序
	let isMP = false
	try {
		// #ifdef MP
		isMP = true
		// #endif
	} catch (e) {
		isMP = false
	}

	let navigationBarHeight = 44
	let custom = { height: 44, top: statusBarHeight }

	if (isMP) {
		// 小程序端存在胶囊按钮，可据此精确计算导航栏高度
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
	}

	// 验证数值有效，防止 NaN/undefined 导致渲染崩溃
	if (typeof navigationBarHeight !== 'number' || isNaN(navigationBarHeight) || navigationBarHeight <= 0) {
		navigationBarHeight = 44
	}
	if (typeof statusBarHeight !== 'number' || isNaN(statusBarHeight) || statusBarHeight < 0) {
		statusBarHeight = 0
	}

	const customBarHeight = navigationBarHeight + statusBarHeight

	return {
		statusBarHeight, // 状态栏高度
		navigationBarHeight, // 导航栏高度
		customBarHeight, // 总体高度
		custom,
	}
}

const menuInfo = getMenuInfo()

export default menuInfo
