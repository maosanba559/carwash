<template>
	<view>
		<view class="d-flex bg-white p-2 rounded-20" :class="{'a-center':!isIndex}" @click="openDetail(item)">
			<image :src="item.picUrl" class="rounded-20" style="width: 260rpx;height: 260rpx;"/>
			<view class="pl-2 d-flex flex-column j-sb flex-1">
				<view>
					<view>
						<text class="font-weight ellipsis">{{item.name}}</text>
					</view>
					<view class="font mt-1" :style="{ color: isSearch?'#B2B2B2':'#BA7634'}">{{isSearch ?item.keywords:item.reason}}</view>
				</view>
				<view>
					<view class="my-1" v-if="!isIndex">
						<uni-tag text="HOT" size="mini" v-if="item.isHot"
							customStyle="background-color: rgb(254, 166, 0); border-color: rgb(255, 156, 139);margin-right: 10rpx;" />
						<uni-tag text="新品" size="mini" v-if="item.isNew"
							customStyle="background-color: #fff;border-color:#FF7716;color:#FF7716;margin-right: 10rpx;" />
						<uni-tag v-if="item.owner" text="三毛自营" size="mini"
							customStyle="background-color: #F60;border:0" />
					</view>
					<view class="d-flex j-sb a-center">
						<price :num="item.retailPrice" :integral="item.integral" />
						<view class="main-bg-color font px-3 py-1 text-white" style="border-radius: 30rpx;"
							v-if="isIndex">立即购买
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods-list-item",
		props: {
			item: Object,
			isIndex: {
				type: Boolean,
				default: false
			},
			isSearch:{
				type:Boolean,
				default:false
			}
		},
		methods: {
			openDetail(item) {
				let goodsId = item.goodsId || item.id
				uni.navigateTo({
					url: `/pages/goods/goods-detail?goodsId=${goodsId}`
				});
			}
		}
	}
</script>

<style>

</style>
