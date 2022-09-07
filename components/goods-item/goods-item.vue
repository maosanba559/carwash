<template>
	<view>
		<view class="px-2 pb-2 d-flex flex-wrap j-sb">
				<view class="goods" @click="openDetail(item.id)" v-for="item,index in list" :key="index">
					<image :src="item.picUrl" class="goods-img animate__animated animate__fadeIn" style="width: 345rpx;height: 345rpx;" />
					<view class="px-3 pt-1 pb-2">
						<view class="font-weight pb-1">
							{{item.name}}</view>
						<view class="text-muted font ellipsis">{{item.brief}}</view>
						<view class="d-flex a-center">
							<price :num="item.retailPrice" :integral="item.integral"/>
							<text v-if="item.counterPrice" class="line-through text-light-muted font-sm ml-2">￥{{item.counterPrice}}</text>
						</view>
						<view class="pt">
							<uni-tag text="HOT" size="mini" v-if="item.isHot"
								customStyle="background-color: rgb(254, 166, 0); border-color: rgb(255, 156, 139);margin-right: 10rpx;" />
							<uni-tag text="新品" size="mini"  v-if="item.isNew"
								customStyle="background-color: #fff;border-color:#FF7716;color:#FF7716;margin-right: 10rpx;" />
							<uni-tag  v-if="item.owner" text="三毛自营" size="mini" customStyle="background-color: #F60;border:0" />
						</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "goods-item",
		props: {
			list: Array,
		},
		data() {
			return {

			};
		},
		methods: {
			openDetail(goodsId) {
				uni.navigateTo({
					url: `/pages/goods/goods-detail?goodsId=${goodsId}`
				});
			}
		}

	}
</script>

<style>
	.goods {
		margin-bottom: 20rpx;
		width: 345rpx;
		background-color: #fff;
		border-radius: 15rpx;
	}

	.goods-img {
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
	}
</style>
