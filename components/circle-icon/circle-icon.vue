<template>
	<view>
		<view class="d-flex a-center j-center" :class="bgClass"
			:style="{height: h +'rpx',width: h +'rpx',borderRadius: h/2 +'rpx'}">
			<uni-icons :type="iconType" :size="iconSize" color="#fff"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		name: "circle-icon",
		props: {
			iconType: String,
			bgClass: {
				type: String,
				default: 'main-bg-color'
			},
			iconSize: {
				type: Number,
				default: 30
			},
			h: {
				type: Number,
				default: 80
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>

</style>
