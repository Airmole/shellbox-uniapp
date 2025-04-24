import { request } from './index.js'
import { httpBuildQuery } from '../common/utils/tools.js'

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
	fetchMenuList () {
		return request(`/menu`, `GET`)
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
		const params = {}
		if (semester.length > 0) params.semester = semester
		if (nature.length > 0) params.nature = nature
		if (course.length > 0) params.course = course
		if (show.length > 0) params.show = show
		let queryString = ''
		const queryStringArray = []
		for (let key in params) {
			const value = params[key]
			const queryString = `${key}=${encodeURIComponent(value)}`
			queryStringArray.push(queryString)
		}
		queryString = queryStringArray.join('&')
		// console.log(queryString)
		return request(`/edusys/score?${queryString}`, 'GET')
	},
	// 成绩分数AI总结建议
	fetchScoreSuggestion () {
		return request('/edusys/score/suggestion', 'GET')
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
	fetchCalendarOptions () {
		return request(`/edusys/calendar/options`, `GET`)
	},
	// 获取校历图片
	getSchoolCalendarImage (semester = '') {
		return request(`/edusys/calendar/image?semester=${semester}`, `GET`)
	},
	// 获取所有校历
	fetchAllSchoolCalendar () {
		return request(`/school/calendar`, `GET`)
	},
	// 班级课表筛选项
	fetchClassCourseOptions () {
		return request(`/edusys/course/class/options`, `GET`)
	},
	// 班级课表专业选项
	fetchClassCourseProfessionOptions (collegeCode = '', grade = '') {
		let query = {}
		if (collegeCode !== '') query.collegeCode = collegeCode
		if (grade !== '') query.grade = grade
		const queryString = httpBuildQuery(query)
		return request(`/edusys/course/class/professionOptions?${queryString}`, `GET`)
	},
	// 获取班级课表
	fetchClassCourse (
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
	// 教师课表筛选项
	fetchTeacherCourseOptions () {
		return request(`/edusys/course/teacher/options`, `GET`)
	},
	// 获取教师课表
	fetchTeacherCourse (
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
		// url = `https://apifoxmock.com/m1/3906316-3540911-default/wap/edusys/classroom/status/options`
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
	fetchBookSearch (type = '02', keyword = '') {
		return request(`/book/search?type=${type}&keyword=${keyword}`)
	},
	fetchBookDetailByMarcNo (marcNo) {
		return request(`/book/marc/${marcNo}`)
	},
	fetchBookLendTrend (marcNo) {
		return request(`/book/lendTrend/${marcNo}`)
	},
	fetchSameAuthorBooks (marcNo) {
		return request(`/book/sameAuthor/${marcNo}`)
	},
	fetchOpacsysKeywordCloud () {
		return request(`/book/keywordCloud`)
	},
	fetchOpacsysHotRankSimple () {
		return request(`/book/hot/simple`)
	}
}