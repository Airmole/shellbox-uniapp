<template>
	<view class="margin bg-white card-radius flex flex-wrap" v-if="letters.length">
		<view class="cu-bar bg-white card-radius" style="width: 100%;">
			<view class="action">
				<text class="cuIcon-titles text-blue"></text>
				<text class="text-xl text-bold">拼音首字母检索</text>
			</view>
			<view class="action">
				<button v-if="showAllDownloadBtn" @click="allDownload" class="cu-btn bg-gradual-blue shadow-blur round sm"><text class="cuIcon-down"></text>全部下载</button>
			</view>
		</view>
		<view class="padding-lr padding-bottom">
			<template v-for="(item, index) in letters" :key="item">
				<view
				  @click="letterChange(index)"
				  :class="`cu-tag radius margin-xs ${index==currentIndex?'bg-blue':'line-blue'} ${list[item].length?'':'line-gray'}`"
				>{{item}}</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		emits: ['change', 'allDownload'],
		props: {
			list: {
				type: [Object, Array],
				default: {},
				required: true
			},
			showAllDownloadBtn: {
				type: [Boolean],
				default: true,
				required: false
			}
		},
		data() {
			return {
				currentIndex: 0
			}
		},
		computed: {
			letters () {
				const letters = []
				for (let letter in this.list) {
					letters.push(letter)
				}
				return letters
			}
		},
		methods: {
			letterChange (index) {
				const letter = this.letters[index]
				if (!this.list[letter].length) {
					uni.showToast({
						title: `字母${letter}开头没有数据`,
						icon: 'none'
					})
					return
				}
				this.currentIndex = index
				this.$emit('change', { index, letter })
			},
			allDownload () {
				this.$emit('allDownload')
			}
		}
	}
</script>

<style>
</style>
