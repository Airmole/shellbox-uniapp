
const getMenuInfo = function() {
	const statusBarHeight = uni.getSystemInfoSync().statusBarHeight
	// #ifndef H5
	const custom = uni.getMenuButtonBoundingClientRect()
	// #endif
	// #ifdef H5
	const custom = {
		height: 40,
		top: 0
	}
	// #endif
	
	const navigationBarHeight = custom.height + (custom.top - statusBarHeight) * 2
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