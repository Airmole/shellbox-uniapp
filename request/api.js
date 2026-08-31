import { request, requestDomain, getOfficeViewerUrl, getPdfViewerUrl } from './index.js'
import { httpBuildQuery } from '../common/utils/tools.js'

/**
 * 下载并打开导出文件（xlsx/pdf通用）
 */
function handleExportFile(exportRes, fileType = 'xlsx') {
	const downloadUrl = exportRes.data.url
	// #ifdef H5
	window.open(getOfficeViewerUrl(downloadUrl))
	// #endif
	// #ifdef MP
	uni.downloadFile({
	  url: downloadUrl,
	  success: function (dlRes) {
		uni.hideLoading()
		const tempFilePath = dlRes.tempFilePath
		uni.openDocument({ filePath: tempFilePath, fileType, showMenu: true })
	  }
	})
	// #endif
}

function handleExportPdf(exportRes) {
	const downloadUrl = exportRes.data.url
	// #ifdef H5
	window.open(getPdfViewerUrl(downloadUrl))
	// #endif
	// #ifdef MP
	uni.downloadFile({
	  url: downloadUrl,
	  success: function (dlRes) {
		uni.hideLoading()
		const tempFilePath = dlRes.tempFilePath
		uni.openDocument({ filePath: tempFilePath, fileType: 'pdf', showMenu: true })
	  }
	})
	// #endif
}

/**
 * 通用的文件导出请求封装
 */
function exportRequest(url, data, { fileType = 'xlsx', errorMsg = '导出失败', isPdf = false } = {}) {
	uni.showLoading({ title: '加载中...'})
	return request(url, 'POST', data).then((exportRes) => {
		if (isPdf) {
			handleExportPdf(exportRes)
		} else {
			handleExportFile(exportRes, fileType)
		}
	}).catch(error => {
		uni.hideLoading()
		console.log(errorMsg, error)
		uni.showToast({ title: '获取失败', icon: 'none' })
	})
}

export default {
	// 登录换取openID
	uniLogin: (data) => {
		// #ifdef MP-WEIXIN
		return request('/weapp/login/code', 'POST', data)
		// #endif
		// #ifdef MP-QQ
		return request('/qqapp/login/code', 'POST', data)
		// #endif
	},
	// 获取菜单列表
	fetchMenuList: () => {
		return request(`/menu`, `GET`)
	},
	// 获取登录界面模态框提示信息内容
	fetchLoginTips: () => {
		return request(`/login/tips`, 'GET')
	},
	// 获取登录页背景图
	getLoginBackground: () => {
		return request('/login/image', 'GET')
	},
	// 自动登录接口
	autoLogin: (data) => {
		return request('/login', 'POST', data)
	},
	// 获取资料
	fetchProfile: () => {
		return request('/profile', 'GET')
	},
	// 更新资料
	updateProfile: (data) => {
		return request('/profile', 'PUT', data)
	},
	// 个人学期课表筛选项
	fetchSemesterCourseOptions: () => {
		return request(`/edusys/course/semester/options`, 'GET')
	},
	// 个人学期课表
	fetchSemesterCourse: (semester = '', week = '') => {
		return request(`/edusys/course/semester?semester=${semester}&week=${week}`, 'GET')
	},
	exportSemesterCourse (course) {
		return exportRequest('/edusys/course/semester/xlsx', course, { errorMsg: '导出个人课表失败' })
	},
	// 个人当天日期本周课表
	fetchDateCourse: (date = '') => {
		return request(`/edusys/course/date?date=${date}`, 'GET')
	},
	// 个人整月课表
	fetchMonthCourse: (date = '') => {
		return request(`/edusys/course/month?date=${date}`, 'GET')
	},
	// 成绩查询筛选项
	fetchScoreOptions: () => {
		return request(`/edusys/score/options`, 'GET')
	},
	// 成绩查询
	fetchScore: (semester = '', nature = '', course = '', show = '') => {
		const params = { semester, nature, course, show }
		const queryString = httpBuildQuery(params)
		return request(`/edusys/score?${queryString}`, 'GET')
	},
	// 导出成绩xlsx
	exportScoreXlsx (score) {
		return exportRequest('/edusys/score/xlsx', score, { errorMsg: '导出成绩单失败' })
	},
	// 导出教务成绩单xlsx
	exportScoreEduXlsx (score) {
		return exportRequest('/edusys/score/edu/xlsx', score, { errorMsg: '导出教务成绩单失败' })
	},
	// 导出教务成绩单pdf
	exportScoreEduPdf (score) {
		return exportRequest('/edusys/score/edu/pdf', score, { errorMsg: '导出教务成绩单失败', isPdf: true })
	},
	// 首页组件数据
	fetchHomeWidget(widgetNameList = []) {
		if (!Array.isArray(widgetNameList)) {
			widgetNameList = []
		}
		const paramsStr = widgetNameList.join(',')
		return request(`/widget/batch?widgets=${paramsStr}`, 'GET')
	},
	// 教务日历查询
	fetchCalendar() {
		return request(`/edusys/calendar`, `GET`)
	},
	// 获取教务日历筛选项
	fetchCalendarOptions() {
		return request(`/edusys/calendar/options`, `GET`)
	},
	// 获取校历图片
	getSchoolCalendarImage(semester = '') {
		return request(`/edusys/calendar/image?semester=${semester}`, `GET`)
	},
	// 获取所有校历
	fetchAllSchoolCalendar() {
		return request(`/school/calendar`, `GET`)
	},
	// 班级课表筛选项
	fetchClassCourseOptions() {
		return request(`/edusys/course/class/options`, `GET`)
	},
	// 班级课表专业选项
	fetchClassCourseProfessionOptions: (collegeCode = '', grade = '') => {
		let query = {}
		if (collegeCode !== '') query.collegeCode = collegeCode
		if (grade !== '') query.grade = grade
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/class/professionOptions?${queryString}`, `GET`)
	},
	// 获取班级课表
	fetchClassCourse(
		semester = '',
		timeModel = '',
		college = '',
		grade= '',
		profession = '',
		className = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (college.length) query.college = college
		if (grade.length) query.grade = grade
		if (profession.length) query.profession = profession
		if (className.length) query.className = className
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/class/course?${queryString}`, `GET`)
	},
	// 导出班级课表,
	exportClassCourse(courses) {
		return exportRequest('/edusys/course/class/course/xlsx', courses, { errorMsg: '导出班级课表失败' })
	},
	// 教师课表筛选项
	fetchTeacherCourseOptions() {
		return request(`/edusys/course/teacher/options`, `GET`)
	},
	// 获取教师课表
	fetchTeacherCourse(
		semester = '',
		timeModel = '',
		college = '',
		teacherName = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (college.length) query.college = college
		if (teacherName.length) query.teacherName = teacherName
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/teacher/course?${queryString}`, `GET`)
	},
	// 导出教师课表
	exportTeacherCourse(course) {
		return exportRequest('/edusys/course/teacher/course/xlsx', course, { errorMsg: '导出教师课表失败' })
	},
	// 课程课表筛选项
	fetchLessonCourseOptions () {
		return request(`/edusys/course/lesson/options`, `GET`)
	},
	// 获取课程课表
	fetchLessonCourse (
		semester = '',
		timeModel = '',
		studyCollege = '',
		teachCollege = '',
		courseNature = '',
		courseName = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = {}
		if (semester.length) query.semester = semester
		if (timeModel.length) query.timeModel = timeModel
		if (studyCollege.length) query.studyCollege = studyCollege
		if (teachCollege.length) query.teachCollege = teachCollege
		if (courseNature.length) query.courseNature = courseNature
		if (courseName.length) query.courseName = courseName
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/lesson/course?${queryString}`, `GET`)
	},
	// 导出课程课表
	exportLessonCourse(course) {
		return exportRequest('/edusys/course/lesson/course/xlsx', course, { errorMsg: '导出课程课表失败' })
	},
	// 教师获取授课列表
	fetchTeacherCourseList () {
		return request(`/edusys/teacher/course/list`, `GET`)
	},
	// 教师获取授课课堂花名册
	fetchTeacherCourseStudentList (code) {
		return request(`/edusys/teacher/course/list/student?code=${code}`, `GET`)
	},
	// 学校系部联系电话
	getSchoolContact () {
		return request(`/school/contact`, `GET`)
	},
	// 获取教学地点列表
	fetchClassroomList (type = 'classroom', buildingId = '') {
		let query = { type, buildingId }
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/list`
		return request(`${url}?${queryString}`, `GET`)
	},
	// 教室状态查询筛选项
	fetchClassroomOptions () {
		let url = `/edusys/classroom/status/options`
		return request(url, `GET`)
	},
	// 教室借用状态查询
	fetchClassroomStatus (
		semester,
		timeModel,
		schoolArea = '',
		teachArea = '',
		classroomType = '',
		teachBuilding = '',
		classroomCode = '',
		peopleSign = '',
		peopleNum = '',
		classroomStatus = '',
		borrowCollege = '',
		classroomOwned = '',
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = ''
	) {
		let query = { semester, timeModel }
		if (schoolArea.length) query.schoolArea = schoolArea
		if (teachArea.length) query.teachArea = teachArea
		if (classroomType.length) query.classroomType = classroomType
		if (teachBuilding.length) query.teachBuilding = teachBuilding
		if (classroomCode.length) query.classroomCode = classroomCode
		if (peopleSign.length) query.peopleSign = peopleSign
		if (peopleNum.length) query.peopleNum = peopleNum
		if (classroomStatus.length) query.classroomStatus = classroomStatus
		if (borrowCollege.length) query.borrowCollege = borrowCollege
		if (classroomOwned.length) query.classroomOwned = classroomOwned
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/status`
		return request(`${url}?${queryString}`, 'GET')
	},
	//教室借用详情
	fetchClassroomDetail (
		semester,
		timeModel,
		classroomCode,
		serialValue,
		dayOfWeek,
		startAt,
		endAt,
		weekStart = '',
		weekEnd = '',
		dayOfWeekStart = '',
		dayOfWeekEnd = '',
		serialNoStart = '',
		serialNoEnd = '',
		classroomStatus = ''
	) {
		let query = { semester, timeModel, classroomCode, serialValue, dayOfWeek, startAt, endAt }
		if (weekStart.length) query.weekStart = weekStart
		if (weekEnd.length) query.weekEnd = weekEnd
		if (dayOfWeekStart.length) query.dayOfWeekStart = dayOfWeekStart
		if (dayOfWeekEnd.length) query.dayOfWeekEnd = dayOfWeekEnd
		if (serialNoStart.length) query.serialNoStart = serialNoStart
		if (serialNoEnd.length) query.serialNoEnd = serialNoEnd
		const queryString = httpBuildQuery(query)
		let url = `/edusys/classroom/detail`
		return request(`${url}?${queryString}`, `GET`)
	},
	// 培养方案
	fetchTrainingPlan () {
		return request('/edusys/trainingPlan', 'GET')
	},
	// 获取评教批次列表
	fetchEvaluateTeacherSemester () {
		return request(`/edusys/evaluateTeacher/semester`)
	},
	// 获取评教课程列表
	fetchEvaluateTeacherCourse (url) {
		return request(`/edusys/evaluateTeacher/course?url=${url}`)
	},
	// 获取评教课程详情
	fetchEvaluateTeacherDetail (url) {
		return request(`edusys/evaluateTeacher/detail?url=${url}`)
	},
	// 权益保护相关
	// 获取权益投诉帖
	fetchRightsProtectionIndex (page = 1, tag = '[0,1,2,3,4]', hot = '[0,1]') {
		return request(`/rightsProtection?page=${page}&tag=${tag}&hot=${hot}`)
	},
	fetchRightsProtectionDetail (id, page = 1) {
		return request(`/rightsProtection/${id}?page=${page}`)
	},
	postRightsProtection (data) {
		return request(`/rightsProtection`, `POST`, data)
	},
	updateRightsProtection (id, data) {
		return request(`/rightsProtection/${id}`, `POST`, data)
	},
	removeRightsProtection (id) {
		return request(`/rightsProtection/${id}`, `DELETE`)
	},
	fetchIsRightsProtectionAdminer (account) {
		return request(`/rightsProtection/adminer/${account}`)
	},
	// 电影放映
	fetchMovieDay (date = '') {
		return request(`/school/movie?date=${date}`)
	},
	fetchMovieMonthList (month = '') {
		return request(`/school/movie/month?month=${month}`)
	},
	fetchMapAllPoi () {
		return request(`/school/map/poi`)
	},
	fetchSchoolMediaList () {
		return request(`/school/media`)
	},
	// 图书查询
	fetchBookHotKeyword () { // 图书检索热门关键字
		return request(`/book/hot/keyword`)
	},
	fetchLibspDictList () { // 图书系统数据字典
		return request('/book/dict')
	},
	fetchBookHotBorrow ( // 热门借阅图书
		page = 1,
		rows = 10,
		disCode = null,
		statRange = 30,
		indexFlag = 1,
		libCode = '',
		sortType = 1,
		classNo = ''
	) {
		let queryParams = {}
		queryParams.page = page
		queryParams.rows = rows
		queryParams.sortType = sortType
		queryParams.statRange = statRange
		if (disCode !== '') queryParams.disCode = disCode
		if (libCode !== '') queryParams.libCode = libCode
		if (classNo !== '') queryParams.classNo = classNo
		if (indexFlag !== '') queryParams.indexFlag = indexFlag
		return request(`/book/hot/borrow`, 'GET', queryParams)
	},
	fetchBookNew ( // 获取新到图书
		page = 1,
		rows = 10,
		time = '2',
		docCode = '1',
		disCode = '',
		callNo = '',
		locationId = ''
	) {
		let queryParams = {}
		if (page !== 1) queryParams.page = page
		if (rows !== 10) queryParams.rows = rows
		if (time !== '2') queryParams.time = time
		if (docCode !== '1') queryParams.docCode = docCode
		if (disCode !== '') queryParams.disCode = disCode
		if (callNo !== '') queryParams.callNo = callNo
		if (locationId !== '') queryParams.locationId = locationId
		return request('/book/new', 'GET', queryParams)
	},
	fetchBookSearchPara () { // 获取检索参数
		return request('/book/search/para')
	},
	fetchBookUnifySearch (
		searchFieldContent,
		searchField = 'keyWord',
		page = 1,
		rows = 10,
		docCode = [],
		litCode = [],
		matchMode = '2',
		resourceType = [],
		subject = [],
		discode1 = [],
		publisher = [],
		libCode = [],
		locationId = [],
		eCollectionIds = [],
		neweCollectionIds = [],
		curLocationId = [],
		campusId = [],
		kindNo = [],
		collectionName = [],
		author = [],
		langCode = [],
		countryCode = [],
		publishBegin = null,
		publishEnd = null,
		coreInclude = [],
		ddType = [],
		verifyStatus = [],
		group = [],
		sortField = 'relevance',
		sortClause = 'asc',
		onlyOnShelf = '1',
		searchItems = null,
		newCoreInclude = [],
		customSub = [],
		customSub0 = [],
		indexSearch = 1
	) { // 统一检索
		let body = { searchFieldContent, searchField, page, rows, docCode, litCode, matchMode, resourceType, subject, 
			discode1, publisher, libCode, locationId, eCollectionIds, neweCollectionIds, curLocationId, campusId, kindNo,
			collectionName, author, langCode, countryCode, publishBegin, publishEnd, coreInclude, ddType, verifyStatus,
			group, sortField, sortClause, onlyOnShelf, searchItems, newCoreInclude, customSub, customSub0, indexSearch }
		return request('/book/search', 'POST', body)
	},
	fetchBookCountAndCover (recordId, title, isbn) { // 获取图书数量&封面
		let query = { recordId, title, isbn }
		return request('/book/countAndCover', 'GET', query)
	},
	fetchBookDetail (recordId) { // 获取图书详情信息
		return request(`/book/${recordId}/detail`)
	},
	fetchBookTenYearBorrow (recordId) { // 获取图书近十年借阅数据
		return request(`/book/${recordId}/tenYearBorrow`)
	},
	fetchBookBorrowAnalysis (recordId) { // 获取图书借阅分析
		return request(`/book/${recordId}/borrowAnalysis`)
	},
	fetchBookCollection (recordId) { // 获取图书馆藏信息
		return request(`/book/${recordId}/bookCollection`)
	},
	fetchBookDetailRelated (recordId, subject, page = 1, rows = 8) { // 获取图书详情相关图书
		let query = { subject, page, rows }
		return request(`/book/${recordId}/detailAbstract`, 'GET', query)
	},
	fetchBookAuthorInfo (
		author,
		fenlei = '',
		size = 10
	) {
		let query = { author, fenlei, size }
		return request('/book/search/author', 'GET', query)
	},
	fetchLibspUserInfo () {
		return request('/libsp/userInfo')
	},
	fetchLibspUserLimit () {
		return request('/libsp/userLimit')
	},
	fetchLibspScoreList (
	    page = 1,
	    rows = 10,
		scoreSign = null,
		startDate = '',
		endDate = '',
		timeType = null
	) {
		let body = { page, rows, scoreSign, startDate, endDate, timeType }
		return request('/libsp/scoreList', 'POST', body)
	},
	fetchLibspDailyBook () {
		return request('/libsp/dailyBook')
	},
	fetchLibspLoanChart () {
		return request('/libsp/loanChart')
	},
	fetchLibspLoanRules () {
		return request('/libsp/loanRules')
	},
	fetchLibspLoanList (
	    isIssue = false,
	    searchType = 1,
		searchContent = '',
		page = 1,
		rows = 10,
		sortType = 0,
		startDate = null,
		endDate = null
	) {
		let body = { searchType, searchContent, page, rows, sortType, startDate, endDate }
		if (isIssue) { // 是否现刊
			return request('/libsp/issueLoanList', 'POST', body)
		} else {
			return request('/libsp/loanList', 'POST', body)
		}
	},
	fetchLibspLoanHistory (
	    isIssue = false,
	    searchType = 1,
		searchContent = '',
		page = 1,
		rows = 10,
		sortType = 0,
		startDate = '',
		endDate = ''
	) {
		let body = { searchType, searchContent, page, rows, sortType, startDate, endDate }
		if (isIssue) {
			return request('/libsp/issueLoanHistory', 'POST', body)
		} else {
			return request('/libsp/loanHistory', 'POST', body)
		}
	},
	// 用户积分
	fetchUserPointsBalance () {
		return request(`/points/balance`)
	},
	fetchUserPointsDocument () {
		return request(`/points/balance/doc`)
	},
	fetchUserPointsBalanceIndex () {
		return request(`/points/balance/index`)
	},
	fetchUserPointsCheckinIndex (month) {
		return request(`/points/checkin/index?month=${month}`)
	},
	userPointsCheckin () {
		return request(`/points/checkin`, 'POST')
	},
	fetchPointsCheckinDocument () {
		return request(`/points/checkin/doc`)
	},
	pointsVideoAdsPlayEnd () {
		return request(`/points/videoAdsEnd`, 'POST')
	},
	fetchUserPointsBalanceHistory (page = 1, type = '', bizType = '') {
		return request(`/points/balance/history?page=${page}&type=${type}&bizType=${bizType}`)
	},
	userPointsExchaneGoods (goodsId, name = '', mobile = '', address = '') {
		const data = { goodsId, name, mobile, address }
		return request(`/points/exchangeGoods`, 'POST', data)
	},
	fetchPointsMallGoods (size = 10) {
		return request('/points/mall')
	},
	fetchPoitsMallGoodsDetail (id) {
		return request(`/points/mall/goods/${id}`)
	},
	// 学生财务收费相关接口
	fetchFinasysProfile () {
		return request('/finasys/profile', 'GET')
	},
	fetchFinasysFeeInfo (pageIndex = 0, pageSize = 10, showPaid = true) {
		const params = { pageIndex, pageSize, showPaid }
		const query = httpBuildQuery(params)
		return request(`/finasys/fee?${query}`)
	},
	fetchFinasysCredit (pageIndex = 0, pageSize = 10, showPaid = true) {
		const params = { pageIndex, pageSize, showPaid }
		const query = httpBuildQuery(params)
		return request(`/finasys/credit?${query}`)
	},
	fetchFinasysSubsidy (pageIndex = 0, pageSize = 10, showUnreleased = true) {
		const params = { pageIndex, pageSize, showUnreleased }
		const query = httpBuildQuery(params)
		return request(`/finasys/subsidy?${query}`)
	},
	fetchFinasysTreePaidRecords (pageIndex = 0, pageSize = 10) {
		const params = { pageIndex, pageSize }
		const query = httpBuildQuery(params)
		return request(`/finasys/paid?${query}`)
	},
	fetchFinasysOrder (pageIndex = 0, pageSize = 10) {
		const params = { pageIndex, pageSize }
		const query = httpBuildQuery(params)
		return request(`/finasys/order?${query}`)
	},
	fetchFinasysDefer(pageIndex = 0, pageSize = 10, showRecords = 'true') {
		const params = { pageIndex, pageSize, showRecords }
		const query = httpBuildQuery(params)
		return request(`/finasys/defer?${query}`)
	},
	fetchFinasysInvoice (pageIndex = 0, pageSize = 10, showRecords = 'true', year = '') {
		const params = { pageIndex, pageSize, showRecords, year }
		const query = httpBuildQuery(params)
		return request(`/finasys/invoice?${query}`)
	},
	fetchFinasysInvoiceDetail (cfid) {
		return request(`/finasys/invoice/detail?cfid=${cfid}`)
	}
}