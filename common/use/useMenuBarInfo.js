/**
 * 菜单/导航栏信息计算（模块顶层同步执行）
 *
 * ⚠️ 本模块被全局注册组件 cu-custom 在模块顶层 import 并立即执行，
 * 一旦此处抛错，所有使用 cu-custom 的页面都会渲染失败 → 整页白屏。
 * 因此这里采用「绝对安全」策略：
 *   1. 不依赖 #ifdef/#ifndef 条件编译区分平台（避免条件编译失效时重复声明导致 SyntaxError）
 *   2. 全程 try-catch + typeof 探测，即使 uni 或某 API 不存在也不会抛错
 *   3. 所有数值做有效性兜底，杜绝 NaN/undefined 进入样式
 *
 * 平台差异：
 *   - 小程序端：getMenuButtonBoundingClientRect 存在，用胶囊按钮精算导航栏高度
 *   - App/H5 端：该 API 不存在，使用标准 44px 导航栏
 */

// 默认安全值
const SAFE_STATUS_BAR_HEIGHT = 0
const SAFE_NAVIGATION_BAR_HEIGHT = 44

function safeNumber(value, fallback) {
	return (typeof value === 'number' && !isNaN(value) && isFinite(value)) ? value : fallback
}

function buildMenuInfo(sysInfo) {
	let statusBarHeight = SAFE_STATUS_BAR_HEIGHT
	let navigationBarHeight = SAFE_NAVIGATION_BAR_HEIGHT
	let custom = {
		height: SAFE_NAVIGATION_BAR_HEIGHT,
		top: SAFE_STATUS_BAR_HEIGHT
	}

	// 状态栏高度（失败时回退 0）
	try {
		statusBarHeight = safeNumber(sysInfo && sysInfo.statusBarHeight, SAFE_STATUS_BAR_HEIGHT)
	} catch (e) {
		statusBarHeight = SAFE_STATUS_BAR_HEIGHT
	}
	if (statusBarHeight < 0) statusBarHeight = SAFE_STATUS_BAR_HEIGHT
	custom.top = statusBarHeight

	// 运行时检测胶囊按钮 API：仅小程序端存在
	try {
		if (typeof uni !== 'undefined' &&
			typeof uni.getMenuButtonBoundingClientRect === 'function') {
			const capsule = uni.getMenuButtonBoundingClientRect()
			if (capsule &&
				typeof capsule.height === 'number' && !isNaN(capsule.height) &&
				typeof capsule.top === 'number' && !isNaN(capsule.top)) {
				navigationBarHeight = capsule.height + (capsule.top - statusBarHeight) * 2
				custom = capsule
			}
		}
	} catch (e) {
		// 忽略异常，继续使用默认 44px
	}

	// 数值最终兜底，防止 NaN/undefined 传入样式
	navigationBarHeight = safeNumber(navigationBarHeight, SAFE_NAVIGATION_BAR_HEIGHT)
	if (navigationBarHeight <= 0) navigationBarHeight = SAFE_NAVIGATION_BAR_HEIGHT
	if (!custom || typeof custom !== 'object') {
		custom = { height: navigationBarHeight, top: statusBarHeight }
	}

	const customBarHeight = navigationBarHeight + statusBarHeight

	return {
		statusBarHeight, // 状态栏高度
		navigationBarHeight, // 导航栏高度
		customBarHeight, // 总体高度
		custom,
	}
}

// 任何情况下都返回合法对象，绝不向上抛错
const menuInfo = (function () {
	try {
		if (typeof uni === 'undefined' || typeof uni.getSystemInfoSync !== 'function') {
			return buildMenuInfo(null)
		}
		return buildMenuInfo(uni.getSystemInfoSync())
	} catch (e) {
		return buildMenuInfo(null)
	}
})()

export default menuInfo
