<template>
			<view class="d-flex a-center j-center flex-column" :class="{'mt-5':mt}">
				<uni-icons :type="icon" customPrefix="iconfont" color="#B2B2B2" :size="100"></uni-icons>
				<view style="color: #B2B2B2;" v-if="text" class="font">{{text}}</view>
			</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default:'icon-kong' 
			},
			mt:{
				type:Boolean,
				default:true
			},
			text:String
		}
	}
</script>

<style>

</style>
