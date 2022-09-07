<template>
	<view class="text-secondary">
		<view class="bg-white d-flex a-center p-2 m-2 rounded-15">
			<uni-icons type="icon-tianmaotuihuobaozhangqia" color="#B2B2B2" customPrefix="iconfont" :size="50"></uni-icons>
			<view class="ml-2">
				<view class="main-text-color font-lg font-bold">{{orderStatus(order.orderStatus)}}</view>
				<view class="font font-weight" v-if="order.orderStatus == 101">请在 {{order.endTime}} 前完成付款，逾期订单将关闭。
				</view>
			</view>
		</view>
		<view class="m-2">
			<view class="d-flex a-center bg-white p-2 border-bottom rounded-15 font-md text-black"
				v-for="(item,index) in orderGoods" :key="index">
				<image :src="item.picUrl" class="rounded-10 flex-shrink" style="width: 150rpx;height: 150rpx;">
				</image>
				<view class="px-2">{{item.goodsName}}</view>
				<view class="text-right ml-auto">
					<price :num="item.price" :integral="item.integral"></price>
					<view class="">x {{item.number}}</view>
				</view>
			</view>
		</view>
		<view class="bg-white p-2 m-2 rounded-15" v-if="order.mobile">
			<view class="font-md text-black">{{order.consignee}} <text>{{order.mobile}}</text> </view>
			<view class="font">
				地址：{{order.address}}
			</view>
		</view>
		<view class="bg-white p-2 m-2 rounded-15 font">
			<view class="d-flex line-h-df">
				<text>订单编号：</text>
				<text class="text-black">{{order.id}}</text>
				<text class="font px-2 rounded-20 border ml-auto" @click="copy">复制</text>
			</view>
			<view class="line-h-df">
				<text>下单时间：</text>
				<text class=" text-black">{{order.createTime}}</text>
			</view>
			<view class="line-h-df">
				<text>支付方式：</text>
				<text class=" text-black">在线支付</text>
			</view>
			<view class="line-h-df">
				<text>支付时间：</text>
				<text class="text-black">{{order.payTime}}</text>
			</view>
			<view class="line-h-df" v-if="order.orderStatus == 301 && order.shipTime">
				<text>发货时间：</text>
				<text class="text-black">{{order.shipTime}}</text>
			</view>
			<view class="line-h-df" v-if="order.orderStatus == 301 && order.shipChannel && order.mobile">
				<text>配送方式：</text>
				<text class="text-black">{{order.shipChannel}}</text>
			</view>
			<view class="line-h-df" v-if="order.orderStatus == 301 && order.shipSn && order.mobile">
				<text>物流单号：</text>
				<text class="text-black">{{order.shipSn}}</text>
			</view>
			<view class="py-2 mt-2 border-top border-bottom line-h-df">
				<text>买家留言：</text>
				<text class="font-weight text-black">{{order.message}}</text>
			</view>
			<view class="d-flex j-sb a-center pt-2 line-h-df">
				<text>商品总额</text>
				<text class="font-weight text-black">￥{{order.orderPrice}}</text>
			</view>
			<view class="d-flex j-sb a-center line-h-df">
				<text>积分</text>
				<text class="font-weight text-black">{{order.integral}}</text>
			</view>
			<view class="d-flex j-sb a-center border-bottom pb-2 line-h-df">
				<text>运费</text>
				<text class="font-weight text-black">+￥0.00</text>
			</view>
			<view class="d-flex j-end py-2 font-md" style="color: #333;">
				<view class="font-weight mr-1">实付款:</view>
				<price :num="order.actualPrice" :integral="order.integral" />
			</view>
		</view>
		<view :style="{height:safeAreaInsets + 105 +'rpx'}"></view>
		<view class="bg-white position-fixed bottom-0 left-0 right-0">
			<view class="d-flex a-center j-end px-3 pt" style="height: 100rpx;" v-if="order.orderStatus == 101">
				<view class="border text-center mr-3" style="padding: 15rpx 0;border-radius: 50rpx;min-width: 200rpx;"
					@click="cancel">
					取消订单</view>
				<view class="main-bg-color text-white text-center"
					style="padding: 15rpx 0;border-radius: 50rpx;min-width: 200rpx;" @click="pay">
					去付款</view>
			</view>
			<view class="d-flex a-center j-end px-3 pt" style="height: 100rpx;" v-else-if="order.orderStatus == 301">
				<!-- <view class="border text-center mr-3" v-if="order.mobile"
					style="padding: 15rpx 0;border-radius: 50rpx;min-width: 200rpx;">
					查看物流</view> -->
				<view class="main-bg-color text-white text-center"
					style="padding: 15rpx 0;border-radius: 50rpx;min-width: 200rpx;" @click="confirm">
					确认收货</view>
			</view>
			
			<view :style="{height:safeAreaInsets+'rpx'}"></view>
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
	const statusMap = {
		101: '未付款',
		102: '用户取消',
		103: '系统取消',
		201: '已付款',
		202: '申请退款',
		203: '已退款',
		301: '已发货',
		401: '用户收货',
		402: '系统收货'
	}
	export default {
		setup() {
			onLoad((e) => {
				v3Data.orderId = e.id
				v3Data.getData()
			})
			const v3Data = reactive({
				orderId: '',
				order: '',
				orderGoods: '',
				cancel() {
					uni.showModal({
						content: '确定取消当前订单吗?',
						showCancel: true,
						cancelText: '再看看',
						confirmText: '确定取消',
						success: res => {
							if(res.confirm){
							}
						}
					});
				},
				updatePrePage(status){
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					if(prevPage.route.indexOf('list-order') > -1){
						prevPage.$vm.updateState(v3Data.orderId,status)
					}
				},
				pay() {
				},
				confirm() {
					uni.showModal({
						content: '确认收到货了吗?',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确认收货',
						success: res => {
							if(res.confirm){
							}
						}
					});
				},
				getData() {
				},
				orderStatus(status) {
					return statusMap[status]
				},
				copy() {
					uni.setClipboardData({
						data: v3Data.order.id,
						success() {
							uni.showToast({
								title: '订单编号复制成功',
								icon: 'none'
							});
						}
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
