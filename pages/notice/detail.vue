<template>
	<view class="p-2">
		<view class="uni-h4">{{notice.title}}</view>
		<view class="text-light-muted font">{{notice.createTime}}</view>
		<view class="py-2">
			<rich-text :nodes="notice.content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				notice:{}
			}
		},
		onLoad(e) {
			this.getContent(e.noticeId);
		},
		methods: {
			getContent(id){
				
			}
		}
	}
</script>

<style>

</style>
