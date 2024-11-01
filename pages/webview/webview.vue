<template>
	<web-view :src="url"></web-view>
</template>

<script>
	const defaultUrl = 'https://mp.weixin.qq.com/s/51iFkQBg89lZKz_1a7bLgw'

	export default {
		data() {
			return {
				url: defaultUrl
			}
		},
		methods: {
			
		},
		onLoad(options) {
			let url = ''
			if (typeof options.url == 'undefined') {
			  url = defaultUrl
			} else {
			  url = decodeURIComponent(options.url)
			}
			// #ifdef H5
			window.location.href = url
			// #endif
			this.url = url
		}
	}
</script>

<style>

</style>
