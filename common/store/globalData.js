/**
 * App 全局状态的安全读写层（storage-first）
 *
 * ⚠️ 为什么要有这个模块：
 *   App 端冷启动早期，`getApp()` 会直接抛错：
 *     "getApp() failed. Learn more: ... ?id=getapp"
 *   而 Vue3 <script setup> 与 pinia setup store 的模块顶层是**同步执行**的，
 *   只要在 store 顶层调用 getApp()，报错就会发生在 store 定义阶段，
 *   导致所有 useAppStore() 的页面 setup 中断 → 白屏（TabBar 原生渲染所以还在）。
 *
 *   更关键的是：`uni.setStorageSync` / `uni.getStorageSync` 在启动早期同样可能不可用
 *   （报错栈里 useStore 是全局第一个炸点，极可能就发生在模块作用域/初始化期）。
 *   因此本模块做到两点：
 *     1. 绝不调用 getApp()，App 实例只在「函数调用时」惰性获取；
 *     2. 存储层「先用内存，再落 storage」，即使 uni / 存储 API 完全不可用也绝不抛错。
 *
 *   所有取值都带默认值兜底，绝不返回 undefined，避免 undefined 进入模板造成二次崩溃。
 */

// ---------- 默认值（必须与 App.vue 的 globalData 保持一致） ----------
export const GLOBAL_DATA_DEFAULTS = {
	env: 'develop',
	screenHeight: 800,
	isVip: false,
	logoImageUrl: 'https://r2.airmole.cn/i/2024/11/30/17v4j5-c1.jpg',
	loginPromise: null,
	defaultAvatar: 'https://store2018.muapp.cn/images/weapp/defaultAvatar.png',
}

// 内存兜底：始终可读写，作为 storage / App 实例都不可用时的最后防线
const memory = Object.assign({}, GLOBAL_DATA_DEFAULTS)

// 参与持久化的字段（Promise / 运行时字段不入库）
const PERSIST_KEYS = ['env', 'screenHeight', 'isVip', 'logoImageUrl', 'defaultAvatar']
const STORAGE_PREFIX = 'shellbox_gd_'

// ---------- 底层安全封装 ----------

/**
 * 是否具备 uni 运行时（同步、绝不抛错）
 */
function hasUni() {
	try {
		return typeof uni !== 'undefined' && !!uni
	} catch (e) {
		return false
	}
}

/**
 * 安全读写本地存储：任何异常都静默降级
 */
export function getStorage(key, fallback = undefined) {
	try {
		if (!hasUni() || typeof uni.getStorageSync !== 'function') return fallback
		const value = uni.getStorageSync(STORAGE_PREFIX + key)
		return (value === '' || value === null || typeof value === 'undefined') ? fallback : value
	} catch (e) {
		return fallback
	}
}

export function setStorage(key, value) {
	try {
		if (!hasUni() || typeof uni.setStorageSync !== 'function') return
		uni.setStorageSync(STORAGE_PREFIX + key, value)
	} catch (e) {
		// 存储写入失败不影响页面渲染
	}
}

/**
 * 惰性获取 App 实例：只有真正需要回写 globalData 时才调用，且异常一律降级为 null
 */
export function getAppInstance() {
	try {
		if (typeof getApp !== 'function') return null
		return getApp() || null
	} catch (e) {
		return null
	}
}

/**
 * App.vue 中通过 setAppGlobalData 写入过 globalData 时标记为 true，
 * 此时实例数据视为权威来源；否则用 storage / 默认值。
 */
const APP_READY_FLAG = 'app_global_data_ready'
export function markAppDataReady() {
	memory[APP_READY_FLAG] = true
}

function isAppDataReady() {
	if (memory[APP_READY_FLAG]) return true
	try {
		return getStorage(APP_READY_FLAG, false) === true
	} catch (e) {
		return false
	}
}

function readAppGlobalData() {
	const app = getAppInstance()
	if (!app) return null
	try {
		const gd = app.globalData
		if (gd && typeof gd === 'object') return gd
	} catch (e) { /* ignore */ }
	return null
}

// ---------- 对外 API ----------

/**
 * 读取全局数据字段（顺位：内存 → App.globalData（就绪时）→ storage → 默认值）
 * 永不为 undefined，永不抛错
 */
export function getGlobalData(key, fallback = undefined) {
	if (typeof key === 'undefined') {
		const result = Object.assign({}, GLOBAL_DATA_DEFAULTS)
		const source = readAppGlobalData() || {}
		Object.keys(GLOBAL_DATA_DEFAULTS).forEach((k) => {
			result[k] = getGlobalData(k, GLOBAL_DATA_DEFAULTS[k])
		})
		// 非默认字段（如 profile）也一并带出
		Object.keys(source).forEach((k) => { if (!(k in result)) result[k] = source[k] })
		return result
	}

	let value = memory[key]
	if (typeof value === 'undefined' && isAppDataReady()) {
		const gd = readAppGlobalData()
		if (gd && typeof gd[key] !== 'undefined') value = gd[key]
	}
	if (typeof value === 'undefined') value = getStorage(key, undefined)
	if (typeof value === 'undefined') value = fallback
	if (typeof value === 'undefined') value = GLOBAL_DATA_DEFAULTS[key]
	return value
}

/**
 * 写入全局数据字段：内存 + storage + App 实例（可用时）三写，任一失败都不抛错
 */
export function setGlobalData(key, value) {
	if (typeof key === 'undefined') return
	memory[key] = value
	if (PERSIST_KEYS.indexOf(key) !== -1) setStorage(key, value)
	try {
		const app = getAppInstance()
		if (app) {
			if (!app.globalData || typeof app.globalData !== 'object') app.globalData = {}
			app.globalData[key] = value
		}
	} catch (e) { /* ignore */ }
}

/**
 * 首次拿到 App 实例时，把内存/storage 中的状态同步回真实 globalData
 */
export function syncToAppInstance() {
	const app = getAppInstance()
	if (!app) return false
	try {
		if (!app.globalData || typeof app.globalData !== 'object') app.globalData = {}
		Object.keys(memory).forEach((key) => {
			if (key === APP_READY_FLAG) return
			if (typeof app.globalData[key] === 'undefined') {
				app.globalData[key] = memory[key]
			}
		})
		memory[APP_READY_FLAG] = true
		return true
	} catch (e) {
		return false
	}
}

/**
 * 读取 isVip 布尔值（统一兜底）
 */
export function getIsVip() {
	return !!getGlobalData('isVip', false)
}

export default {
	getGlobalData,
	setGlobalData,
	getIsVip,
	getStorage,
	setStorage,
	getAppInstance,
	syncToAppInstance,
	markAppDataReady,
	GLOBAL_DATA_DEFAULTS,
}
