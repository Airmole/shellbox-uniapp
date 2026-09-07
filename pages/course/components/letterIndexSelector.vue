<template>
	<view class="margin bg-white card-radius flex flex-wrap" v-if="letters.length">
		<view class="cu-bar bg-white card-radius">
			<view class="action">
				<text class="cuIcon-titles text-blue"></text>
				<text class="text-xl text-bold">拼音首字母检索</text>
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
		emits: ['change'],
		props: {
			list: {
				type: [Object, Array],
				default: {},
				required: true
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
			}
		}
	}
</script>

<style>
</style>
