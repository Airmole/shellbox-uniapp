<template>
	<text decode="true">&nbsp;</text>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		methods: {
			
		},
		onLoad(options) {
			const url = options.url ? decodeURIComponent(options.url) : ''
			if (url === '') wx.reLaunch({ url: '/pages/index/index' })
			this.url = url
		}
	}
</script>

<style>

</style>
