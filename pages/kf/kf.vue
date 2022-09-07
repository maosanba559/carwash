<template>
	<view>
		<view class="h-100 d-flex j-center a-center">
			<view style="width: 80%;">
				<button class="py-1" style="letter-spacing: 10rpx;" type="primary" open-type="contact">在线客服</button>
				<button class="py-1 mt-5" style="letter-spacing: 10rpx;" type="warn" @click="openCall">拨打电话</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			openCall() {
				uni.makePhoneCall({
					phoneNumber: '18536745515'
				})
			}
		}
	}
</script>

<style>

</style>
