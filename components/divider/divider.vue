<template>
	<view>
		<view class="divider" :style="getStyle"></view>
	</view>
</template>

<script>
	export default {
		name:"divider",
		props:{
			height:{
				type:String,
				default:'15'
			}
		},
		computed: {
			getStyle() {
				return `height: ${this.height}rpx;`
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>
<style>
.divider{
	 background: #F5F5F5;
	 width: 100%;
	}
</style>
