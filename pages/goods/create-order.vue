<template>
	<view class="mx-3 my-2">
		<view class="px-2 pt-4 pb-5  bg-white rounded-15 addr" v-if="tempGoods.needAddress">
			<view class="d-flex a-center j-sb w-100" v-if="address" @click="selectAddr">
				<view>
					<view class="font line-h-df">
						{{address.province+''+address.city+''+address.county+''+address.street}}
						<uni-tag v-if="address.defaultAddr" text="默认" size="mini"
							customStyle="margin-left:10rpx;background-color:#f60 ;border-color:#f60"></uni-tag>
					</view>
					<view class="font-bold line-h-df">{{address.addressDetail}}</view>
					<view class="font-md line-h-df">{{address.name}} <text>{{address.tel}}</text> </view>
				</view>
				<uni-icons type="right" color="#B2B2B2"></uni-icons>
			</view>
			<view class="d-flex j-sb a-center w-100 font" v-else>
				<view class="d-flex span-10 flex-column a-center" @click="openAddAddr(0)">
					<circle-icon iconType="location-filled" :iconSize="30" :h="80" />
					<text class="mt-2">手动添加新地址</text>
				</view>
				<view class="d-flex span-10 flex-column a-center" @click="openAddAddr(1)">
					<circle-icon iconType="weixin" bgClass="bg-weixin" :iconSize="30" :h="80" />
					<text class="mt-2">一键导入地址</text>
				</view>
			</view>

		</view>
		<view class="bg-white mt-2 rounded-15 p-2 d-flex a-center">
			<image :src="tempGoods.goodsPic" class="rounded-15 flex-shrink" style="height: 180rpx;width: 180rpx;">
			</image>
			<view class="px-2">
				<text class="font-weight">{{tempGoods.goodsName}}</text>
				<view class="text-muted font">{{tempGoods.specName}}</view>
			</view>
			<view class="d-flex flex-column a-end ml-auto pr-1">
				<view class="font-weight">￥{{tempGoods.price}}<text v-if="tempGoods.integral > 0"
						class="font">+{{tempGoods.integral}}积分</text></view>
				<view class="text-muted font">x{{tempGoods.number}}</view>
			</view>
		</view>
		<view class="bg-white mt-2 rounded-15 py-2">
			<view class="d-flex j-sb p-2">
				<text class="">运费</text>
				<text class="">包邮</text>
			</view>
			<view class="d-flex j-sb p-2 a-center">
				<text class="">优惠券</text>
				<view class="text-light-muted">无可用 <uni-icons type="right" class="ml-auto pl-1" color="#B2B2B2">
					</uni-icons>
				</view>
			</view>
		</view>
		<view class="bg-white mt-2 rounded-15 py-1">
			<view class="d-flex j-sb p-2 a-center">
				<text>买家留言</text>
				<input class="flex-1 ml-2" placeholder-class="font" type="text" v-model="message"
					placeholder="建议留言前先与商家沟通确认" :maxlength="50" />
			</view>
		</view>
		<view class="bg-white position-fixed bottom-0 left-0 right-0">
			<view class="d-flex a-center j-sb px-3 py-2 ">
				<view class="d-flex a-center j-center">共{{tempGoods.number}}件，合计
					<price :num="tempGoods.number * tempGoods.price" :integral="tempGoods.number * tempGoods.integral"
						accountStyle="font-size:36rpx" />
				</view>
				<view class="">
					<view class="main-bg-color py-2 text-white text-center" style="border-radius: 50rpx;width: 300rpx;"
						@click="pay">
						去付款</view>
				</view>
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
	export default {
		setup() {
			onLoad(() => {
				const tempGoods = uni.getStorageSync("tempGoods")
				v3Data.tempGoods = tempGoods
				v3Data.getAddrList()
			})
			const v3Data = reactive({
				tempGoods: '',
				address: '',
				orderId: '',
				status: 0,
				message: '',
				pay: () => {
					if (v3Data.tempGoods.needAddress && v3Data.address == undefined) {
						return uni.showToast({
							title: '收货地址不能为空',
							icon: 'none'
						});
					}
					uni.showLoading({
						title: '加载中',
						mask: true
					});
					uni.redirectTo({
						url: `/pages/goods/pay-result?oid=${v3Data.orderId}&status=${v3Data.status}`,
						success: res => {}
					});

				},
				getAddrList() {
					
				},
				setAddr(addr) {
					v3Data.address = addr
				},
				selectAddr() {
					uni.navigateTo({
						url: '/pages/address/list-address'
					});
				},
				/* type 0 手动 1 自动 */
				openAddAddr: (type) => {
					if (type == 0) {
						uni.navigateTo({
							url: '/pages/address/add-address?type=select'
						});
					} else {
						uni.chooseAddress({
							success(res) {
								if (res.errMsg == 'chooseAddress:ok') {
									uni.request({
										url: '/address/save',
										method: 'POST',
										data: {
											name: res.userName,
											tel: res.telNumber,
											province: res.provinceName,
											city: res.cityName,
											county: res.countyName,
											street: res.streetName,
											addressDetail: res.detailInfo,
											defaultAddr: false
										},
										success: ({
											data
										}) => {
											if (data.code == 0) {
												v3Data.address = data.addr
											} else {
												uni.showToast({
													title: data.msg,
													icon: 'none'
												});
											}
										},
									});
								}
							},
							fail() {
								uni.showToast({
									title: '获取用户收货地址失败',
									icon: 'none'
								});
							}
						})
					}
				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.addr {
		background: #fff url(../../static/bd1.png) bottom center repeat-x;
		background-size: 50rpx 10rpx;
	}

	.bg-weixin {
		background-color: #56bb39;
	}
</style>
