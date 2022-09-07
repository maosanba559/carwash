<template>
	<view class="px-2 pb-2">
		<block v-for="(item,index) in notices" :key="item.noticeId">
			<view class="mb-3 bg-white rounded-20" @click="openDetail(item.noticeId)">
				<image :src="item.img" class="notice-img"/>
				<view class="uni-h5 px-2 pb-2">{{item.title}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		setup(){
			const notices = ref([])
			const currPage = ref(1)
			const totalPage = ref(1)
			onShow(() => {
				if(notices.value.length == 0){
					getNotices()
				}
			})
			onPullDownRefresh(() => {
				currPage.value = 1
				totalPage.value = 1
				getNotices(1)
			})
			onReachBottom(() => {
				if (currPage.value < totalPage.value) {
					currPage.value++
					getNotices()
				}
			})
			const getNotices =(type) =>{
				
			}
			const openDetail =(id) =>{
				uni.navigateTo({
					url: '/pages/notice/detail?noticeId='+id,
				});
			}
			return {notices,openDetail}
		}
		
	}
</script>

<style>
	.notice-img {
		height: 300rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}
</style>
