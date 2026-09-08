const getMenuInfo = function() {
	let statusBarHeight = 0
	try {
		const sysInfo = uni.getSystemInfoSync()
		statusBarHeight = (sysInfo && sysInfo.statusBarHeight) || 0
	} catch (e) {
		statusBarHeight = 0
	}

	// 默认值：标准导航栏高度 44px
	let navigationBarHeight = 44
	let custom = { height: 44, top: statusBarHeight }

	// 运行时检测：直接检查 getMenuButtonBoundingClientRect 是否存在
	// 存在则说明是支持胶囊按钮的小程序平台，用胶囊按钮精算导航栏高度
	// 不存在则使用默认 44px（App/H5 端）
	if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
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
