<template>
	<view>
		<view class="d-flex flex-column a-center j-center" style="height: 800rpx;">
			<!-- <circle-icon bgClass="bg-danger" :h="200" iconType="info" :iconSize="50"></circle-icon> -->
			<uni-icons :type="status==1?'checkbox-filled':'info-filled'" :size="120" :color="status==1?'#28a745':'#e56c64'"></uni-icons>
			<!-- <uni-icons type="checkbox-filled" :size="120" color="#28a745"></uni-icons> -->
			<view class="line-h-df mt-3 font-lg">支付{{status==1?'成功':'失败'}}</view>
			<view class="text-muted" v-if="status == 0">请及时完成支付，避免购买失败</view>

			<view class="mt-5 main-bg-color text-center py-2 text-white rounded-15" style="width: 80%;"
			@click="detail">
				订单详情
			</view>
			<view class="main-bg-color text-center py-2 mt-4 text-white rounded-15" style="width: 80%;"
			@click="toIndex">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.orderId = e.oid
				v3Data.status = e.status
			})
			const v3Data = reactive({
				orderId: '',
				status: '',
				detail(){
					uni.redirectTo({
						url: `/pages/goods/goods-order-detail?id=${v3Data.orderId}`
					});
				},
				toIndex(){
					uni.switchTab({
						url:'/pages/goods/index'
					})
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
