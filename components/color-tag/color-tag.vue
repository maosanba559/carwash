<template>
	<view>
		<view class="px-2 py-1 border m-1 font" style="border-radius: 50rpx;" :style="getColor" @click="onClick(item)">
			{{item}}</view>
	</view>
</template>

<script>
	import {
		reactive,
		toRefs,
		computed
	} from 'vue'
	export default {
		props: {
			item: String,
			color: {
				type: Boolean,
				default: true
			}
		},
		setup(props, context) {
			const v3Data = reactive({
				getColor: computed(() => {
					if (!props.color) {
						return `border:0;background:#F5F5F5;`;
					}
					let color = {
						borderColor: ['#EEA6AA', '#DD6A4B', '#98D5D8', '#9DBE93', '#BCCD99'],
						background: ['#F8EAE9', '#FFBEC6', '#E8F6F6', '#E4F5E2', '#F2F6E8']
					}
					let index = Math.floor(Math.random() * color.borderColor.length)

					return `border-color: ${color.borderColor[index]};background-color: ${color.background[index]};`
				}),
				onClick(item) {
					context.emit('click',item)
				}
			})
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>

</style>
