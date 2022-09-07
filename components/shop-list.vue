<template>
	<view>
		<block v-for="(item,index) in resdata" :key="'gird'+index">
			<view class="d-flex p-3 border-bottom position-relative"
				@click="openShopDetail(item.storeId,item.state)">
				<view class="d-flex pr-1 flex-column">
					<image :src="item.titleImg" lazy-load class="animate__animated animate__fadeIn"
						style="width: 180rpx;height: 150rpx;border-radius: 10rpx 10rpx 0 0;" />
					<view @click.stop="openMap(item.longitude,item.latitude,item.address)"
						class="text-center border line-h-lg mr-1 text-muted"
						style="width: 178rpx;border-radius: 0 0 10rpx 10rpx;">
						<uni-icons type="map-pin-ellipse"></uni-icons>
						导航
					</view>
				</view>
				<view class="flex-1">
					<view class="font-weight font-md">{{item.name}}</view>
					<view class="d-flex">
						<uni-icons v-for="(star,startIndex) in 5" :key="startIndex" :size="20" type="star-filled"
							color="#ffca3e" />
						<view class="ml-auto font text-secondary pr-2" v-if="onLocation">{{item.juli}} <text
								class="font-sm">km</text> </view>
					</view>
					<view class="d-flex">
						<view class="utag text-white"
							style="font-size: 26rpx;background-color: #007bff;border-radius: 10rpx;margin-top: 0;">工位:
							{{item.stationNum}}
						</view>
						<view class="utag text-white" v-show="item.freeNum > 0"
							style="font-size: 26rpx;background-color: #18bc37;border-radius: 10rpx;margin-top:0">
							空闲：{{item.freeNum}}
						</view>
						<view class="utag text-white" v-show="item.freeNum < 1"
							style="font-size: 26rpx;border-radius: 10rpx;margin-top:0;background-color:#f3a73f">
							使用中
						</view>
					</view>
					<view class="d-flex flex-wrap ">
						<view class="utag" style="border:1rpx solid #d9ecff"
							v-for="(tag,tagIndex) in (item.tag!=null?item.tag.split(','):[])" :key="tagIndex">{{tag}}
						</view>
					</view>
					<view class="d-flex a-center mt-1 font-sm">
						<uni-icons type="location"></uni-icons>
						<text class="text-muted ellipsis">{{item.address}}</text>
					</view>
				</view>
				<view v-if="item.state !== 1"
					class="position-absolute left-0 right-0 top-0 bottom-0 d-flex a-center j-center text-light-muted"
					style="background-color: gray;opacity: 0.95;letter-spacing: 10rpx;">{{item.closeReason}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		reactive,
		toRefs,
	} from 'vue'
	export default {
		name: "shop-list",
		props: {
			resdata: Array,
			onLocation: {
				default: false,
				type: Boolean
			}
		},
		setup(props) {
			const v3Data = reactive({
				openShopDetail: (storeId, state) => {
					if (state != 1) {
						return uni.showToast({
							title: '该门店暂未营业',
							icon: 'none'
						});
					}
					uni.navigateTo({
						url: '/pages/shop/shopdetail?storeId=' + storeId
					});
				},
				openMap: (lo, la, address) => {
					uni.openLocation({
						latitude: la,
						longitude: lo,
						name: address,
						success: function() {}
					});
				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.utag {
		font-size: 24rpx;
		margin-right: 10rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		margin-top: 10rpx;
		align-self: center;
		background-color: #ecf5ff;
		color: #409eff;
		border-radius: 20rpx;
	}
</style>
