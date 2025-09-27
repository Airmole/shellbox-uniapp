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

## 文档说明
- [使用操作说明](https://mp.weixin.qq.com/s/XcTFGHHu57y9fw_t7F8A-w)
- [主要功能页面路径及参数](https://docs.qq.com/doc/DREd0bHpKS0tuTFVI)
- [用户FAQ(常见问题解答)](https://docs.qq.com/doc/DREhocFliTUFRS0dt)

## 打包发行

目前主要维护H5+微信小程序平台
打包发行微信小程序平台时需注意：因AI分析总结成绩功能接入了SSE接口用到了TextDecoder解码处理返回数据，在微信开发者工具模拟器环境下支持TextDdecoder，但是手机端真机并未支持，因此需要在HBuilder打包编译完成后，再次手动修改score页面的代码，手动引入TextDecoder函数代码，如下图所示：

![iShot_2025-09-27_22.22.17.png](https://r2.airmole.cn/i/2025/09/27/1c5p8m-6t.png)

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
