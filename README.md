# 贝壳小盒子

[贝壳小盒子](https://shellbox.airmole.cn)是一款为本校师生定制化开发的校园工具类应用，为师生提供课表、成绩、教师、教室等相关教务信息查询服务，以及图书馆图书检索、音像放映，校园地图、教学校历等校园资讯信息。

功能、界面基于[上版原生微信小程序](https://github.com/Airmole/shellbox)项目为产品原型，使用[uniapp](https://uniapp.dcloud.net.cn)框架开发重构，并重新设计部分功能页面和操作流程。

## 使用体验

|网页H5版|微信小程序版|QQ小程序版|
|------|-----------|---------|
| <img src="https://r2.airmole.cn/i/2024/11/30/18vlto-0h.png" style="width:160px"></img>| <img src="https://r2.airmole.cn/i/2024/11/30/18yjmx-s4.jpg" style="width:160px"></img>|<img src="https://r2.airmole.cn/i/2024/12/10/vffoh-ev.webp" style="width:160px"></img>|

## 应用截图

<img src="https://github.com/user-attachments/assets/c558f1b5-6788-4e30-9547-d90c28a120be" style="width:22%"></img>
<img src="https://github.com/user-attachments/assets/7caeaefa-08d0-40cd-81ed-5309664a5066" style="width:22%"></img>
<img src="https://github.com/user-attachments/assets/7c6bc857-7fc7-4059-92ba-401defb926bf" style="width:22%"></img>
<img src="https://github.com/user-attachments/assets/af6c36c0-da2b-47cc-b550-b95cae0ee10a" style="width:22%"></img>

## 技术栈

本项目基于 **uni-app** 框架开发，可一套代码编译发布到 H5、微信小程序、QQ 小程序等多个平台。

- **前端框架**：[uni-app](https://uniapp.dcloud.net.cn)（Vue 3 版本）
- **状态管理**：[Pinia](https://pinia.vuejs.org) `^2.1.7`
- **UI 组件库**：[ColorUI](https://github.com/weilanwl/ColorUI)
- **构建工具**：Vite（`vite.config.js` 集成 `@dcloudio/vite-plugin-uni`）
- **地图服务**：腾讯地图 / QQ 地图 SDK（manifest.json 已配置密钥）

## 功能模块

### 📚 教务系统
- **课表查询**：个人学期课表（支持按周切换、导出 Excel）、当天日期课表、整月课表、日历视图课表
- **成绩查询**：学期成绩查询、AI 分析总结成绩、成绩筛选项
- **教师/教室/课程**：教师信息、教室信息、课程信息查询
- **其他教务**：训练计划、教师评价、学生名单

### 📖 图书馆服务
- **图书检索**：馆藏图书关键词检索、扫码检索
- **借阅管理**：当前借阅查询、借阅历史、馆藏分析
- **图书资讯**：热读推荐、图书排行、新书通报
- **个人中心**：读者资料、读者积分/评分

### 💰 财务系统
- **缴费业务**：缴费业务列表、缴费记录查询
- **订单管理**：订单记录、缴费订单查询
- **其他服务**：学费缓缴申请、补助信息查询、发票申请

### 🎁 积分系统
- **积分管理**：积分余额查询、积分历史记录
- **积分商城**：积分兑换会员等服务
- **每日签到**：签到获取积分

### 🏫 校园服务
- **教学校历**：查看校历与教学周安排
- **校园地图**：校园地图导览（支持滚动）
- **音像放映**：图书馆音像放映安排
- **校园媒体**：校园公众号/媒体聚合
- **权益保障**：权益保护反馈、问题提交、FAQ
- **联系方式**：校园联系信息

### 🤖 智能功能
- **AI 成绩分析总结**：基于 SSE 接口实现流式 AI 分析成绩数据

## 用户社群

|QQ群(662675925)|微信公众号(USTBShellBox)|
| ----|-------|
| <img src="https://r2.airmole.cn/images/weapp/qq_group.png" style="width:160px"/>|<img src="https://r2.airmole.cn/i/2024/11/25/1c3f3u-ft.png" style="width:160px"/>|

## 数据来源

- 课表、成绩等教务信息数据来源于[学校教务网](http://jw.bkty.top:89/jsxsd)
- 图书检索相关信息来源于[图书馆OPAC系统](http://opac.bkty.top)
- 音像放映安排信息来源于[图书馆微信公众号](https://r2.airmole.cn/i/2024/11/25/12veuy-7v.png)
- 其余信息均来源于网络收集，如有侵权请[联系我](mailto:admin@airmole.cn)

## 相关项目

- 官网主页项目 [Airmole/shellbox-release](https://github.com/Airmole/shellbox-release)
- 教务模块composer包 [Airmole/tjustb-edusys](https://github.com/Airmole/tjustb-edusys)
- aTrust网络容器代理 [Airmole/shellbox-aTrust](https://github.com/Airmole/shellbox-aTrust)

## 项目结构

```
shellbox-uniapp/
├── App.vue                  # 应用入口，全局登录/会话管理
├── main.js                  # 应用启动
├── manifest.json            # 应用配置（平台、SDK、权限等）
├── pages.json               # 页面路由与 tabBar 配置
├── uni.scss                 # uni-app 全局样式变量
├── theme.json               # 主题配置（暗黑模式支持）
├── colorui/                 # ColorUI 组件库
├── common/                  # 公共模块
│   ├── css/                 # 全局样式
│   ├── use/                 # 组合式 API
│   └── utils/               # 工具函数（auth/calendar/tools等）
├── components/              # 全局组件
├── pages/                   # 页面
│   ├── index/               # 首页、登录、功能列表、关于
│   ├── course/              # 课表、教师、教室、课程、日历
│   ├── score/               # 成绩、训练计划、教师评价
│   ├── book/                # 图书馆（检索、借阅、排行等）
│   ├── finasys/             # 财务系统（缴费、订单、发票等）
│   ├── points/              # 积分系统（余额、商城、签到等）
│   ├── school/              # 校园服务（校历、地图、媒体等）
│   ├── setting/             # 个人设置
│   └── webview/             # Web 网页内嵌
├── request/                 # 网络请求封装与 API 定义
├── stores/                  # Pinia 状态管理
├── static/                  # 静态资源
└── uni_modules/             # uni-app 扩展模块
```

## 开发环境

1. 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)（推荐）或使用 Vite CLI
2. 安装依赖：
   ```bash
   npm install
   ```
3. 使用 HBuilderX 打开项目，运行到浏览器或手机调试
4. 或使用命令行开发：
   ```bash
   npm run dev:h5        # H5 开发模式
   npm run dev:mp-weixin # 微信小程序开发模式
   ```

> **注意**：项目后端服务及接口域名不在本仓库中，运行时需结合自身后端环境配置 `request/index.js` 中的请求域名。

## 文档说明

- [使用操作说明](https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w)
- [主要功能页面路径及参数](https://docs.qq.com/doc/DREd0bHpKS0tuTFVI)
- [用户FAQ(常见问题解答)](https://docs.qq.com/doc/DREhocFliTUFRS0dt)

## 打包发行

目前主要维护H5+微信小程序平台

### 支持平台

- **H5**：网页版直接部署
- **微信小程序**：需注意 TextDecoder 兼容问题（见下文）
- **QQ 小程序**：已配置 appid（`1109608669`），支持运行
- **App / 其他小程序**：manifest.json 已配置相关平台，可扩展支持

### 微信小程序打包注意事项

打包发行微信小程序平台时需注意：因AI分析总结成绩功能接入了SSE接口用到了TextDecoder解码处理返回数据，在微信开发者工具模拟器环境下支持TextDecoder，但是手机端真机并未支持，因此需要在HBuilder打包编译完成后，再次手动修改score页面的代码，手动引入TextDecoder函数代码，如下图所示：

![iShot_2025-09-27_22.22.17.png](https://r2.airmole.cn/i/2025/09/27/1c5p8m-6t.png)

```javascript
import TextDecoder from '../../common/utils/miniprogram-text-decoder';
```

修改完成后，在手机端预览测试成绩查询、AI成绩总计功能是否正常，确认无误后上传提交体验版，提审发布新版本！

- [wechat-miniprogram-textdecoder](https://github.com/Airmole/wechat-miniprogram-textdecoder)

## 开源项目参考使用

- [uniapp](https://github.com/dcloudio/uni-app)
- [we重邮](https://github.com/mcc108/wecqupt)
- [ColorUI](https://github.com/weilanwl/ColorUI)
- [广科校园导览](https://github.com/gxgk/school-map)
- [Docker LNMP](https://github.com/yeszao/dnmp)
- [ddddocr-docker](https://github.com/jianzhis/ddddocr-docker)
- [aTrustLogin](https://github.com/kenvix/aTrustLogin)
- [Easy-to-Download](https://github.com/idealclover/Easy-to-Download)

## 打赏赞助

<img src="https://r2.airmole.cn/i/2024/11/30/1bdnal-fm.webp" style="width: 200px;" />
