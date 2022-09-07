<template>
	<view>
		<view class="d-flex j-sb py-2 mx-3" @click="openStoreSelect">
			<text class="text-muted">当前门店</text>
			<view><text class="mr-1">{{storeName}}</text>
			</view>
		</view>
		<view class="d-flex j-sb py-2 mx-3">
			<text class="text-muted">门店余额</text>
			<text class="main-text-color">￥{{balance}}</text>
		</view>
		<view class="p-2 bg-white" v-if="freeStations && freeStations.length >0">
			<block v-for="(item,index) in freeStations" :key="item.stationId">
				<view class="d-flex p-2 a-center position-relative rounded" :class="{'select':index == current}" @click="current = index">
					<view>
						<image :src="item.titleImg" class="rounded animate__animated animate__fadeIn" lazy-load style="width: 180rpx;height: 150rpx;" />
					</view>
					<view class="p-2 py-1 flex-1">
						<view class="font-md">{{item.name}}</view>
						<view class="d-flex">
							<uni-tag text="空闲" type="success" size="mini"></uni-tag>
						</view>
					</view>
				</view>
			</block>
			<divider />
		</view>
		<view class="p-3 bg-white">
			<view class="font-weight">
				注意事项:
			</view>
			<view class="font">
				<view class="mt-3 ">1. 门开启后15秒落门，请您在开启前确认已经在工位门口。</view>
				<view class="mt-1 ">2. 为防止恶意开门,用户当前余额必须>=<text class="main-text-color">10</text>元才能使用此功能。</view>
				<view class="mt-1 ">3. 请确认当前门店以及工位是否正确。</view>
				<view class="mt-1 ">4. 开启成功后请及时入场。</view>
			</view>
		</view>
	
		<view class="bg-white position-fixed bottom-0 left-0 right-0">
			<view class="d-flex a-center j-sb px-3 py-2">
				<view class="span24-11 main-bg-color py-2 text-white text-center" style="border-radius: 50rpx;" @click="recharge">
					前往充值
				</view>
				<view class="span24-11 py-2 text-white text-center" style="border-radius: 50rpx;background-color: #56bb39;" @click="open">
					确认开门
				</view>
			</view>
			<view :style="{height:safeAreaInsets+'rpx'}"></view>
		</view>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const storeId = ref('')
			const storeName = ref('')
			const balance = ref(0)
			const freeStations = ref([])
			const current = ref(0)
			onLoad((e) => {
				storeId.value = e.storeId
				storeName.value = e.storeName
				getBalance()
			})
			const open = () => {
				if (balance.value < 10) {
					return uni.showToast({
						title: '余额必须>=10元才能使用此功能',
						icon: 'none'
					});
				}
				if (freeStations.value.length == 0) {
					return uni.showToast({
						title: '当前没有空闲工位,请等待',
						icon: 'none'
					});
				}
				uni.showModal({
					content: `您确定要开启【${freeStations.value[current.value].name}】吗？`,
					success: function(res) {
						if (res.confirm) {
							uni.showToast({
								title: '开门成功，请及时入场。',
								icon: 'none'
							});
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						}
					}
				});
			}
			const recharge = () => {
				uni.navigateTo({
					url: `/pages/recharge/recharge?storeId=${storeId.value}&storeName=${storeName.value}`
				});
			}
			const getBalance = () => {
				if (storeId.value === undefined || storeId.value === '') {
					return
				}
				
			}
			return{storeName,balance,open,recharge,freeStations,current}
		}


	}
</script>

<style>
.select {
		border: 1rpx solid #fd680f;
	}
	.select:after {
		bottom: 0px;
		right: 0px;
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: 36px solid #FD680F;
		border-left: 36px solid transparent;
	}
	.select:before {
		content: '';
		position: absolute;
		width: 10px;
		height: 6px;
		background: transparent;
		bottom: 8px;
		right: 5px;
		border: 2px solid white;
		border-top: none;
		border-right: none;
		-webkit-transform: rotate(-55deg);
		-ms-transform: rotate(-55deg);
		transform: rotate(-55deg);
		z-index: 9;
	}
</style>
