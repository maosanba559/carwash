<template>
	<view>
		<scroll-view scroll-x="true" class="scroll-row">
			<view class="d-flex font" :class="{'pl-3':isGoods}">
				<block v-for="(item,index) in data.list" :key="item.commentId">
					<view class="pr-2">
						<view class="border rounded-10 px-2 pt-2 text-muted d-flex flex-column" style="width: 550rpx;height: 350rpx;">
							<view class="row a-center">
								<image :src="item.avatarUrl == undefined ?'/static/avatar.jpg':item.avatarUrl"
									style="width: 70rpx;height: 70rpx;" class="rounded-circle" lazy-load>
								</image>
								<view class="ml-1" style="margin-right: auto;">
									<view class="line-h-sm font">{{item.mobile}}</view>
									<view class="line-h-sm text-secondary font-sm">
										{{item.createTime.substring(0,10)}}
									</view>
								</view>
								<view>
									<uni-rate :value="item.rate" readonly size="22"></uni-rate>
								</view>
							</view>
							<view class="mt-2 uni-ellipsis" :class="{'uni-ellipsis-5':item.contentImg === ''}">
								{{item.content}}
							</view>
							<view class="row mt-auto mb-2" v-if="item.contentImg && item.contentImg !== ''">
								<view class="span24-8 pr-2" v-for="(img,imgIndex) in item.contentImg.split(',')"
									:key="imgIndex">
									<image :src="img" :data-index="imgIndex" :data-item="item.contentImg.split(',')"
										class="rounded"  style="height: 150rpx;width: 150rpx;" lazy-load
										@tap="previewImage"></image>
								</view>
							</view>
						</view>
					</view>
				</block>
				<view v-if="data.totalPage > 1" class="pr-2 d-flex a-center" style="height: 350rpx;" @click="onClick">
					<view class="text-muted d-flex flex-column a-center j-center">
						<text style="writing-mode: tb-rl;letter-spacing: 10rpx; ">查看全部</text>
						<uni-icons type="right" color="#6c757d"></uni-icons>
					</view>
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default{
		name: "scroll-comment",
		props: {
			data: Object,
			isGoods:{
				type:Boolean,
				default:false
			}
		},
		setup(props,context){
			const previewImage = (e) => {
				var current = e.target.dataset.index
				var uris = e.target.dataset.item
				uni.previewImage({
					current: current,
					urls: uris
				})
			}
			const onClick = () => {
				context.emit('click')
			}
			return {previewImage,onClick}
		}
	}
</script>
<style>
	.uni-ellipsis {
		text-overflow: ellipsis;
		/* #ifndef APP-NVUE */
		white-space:normal;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: 2;
		/* #endif */
	}

	.uni-ellipsis-5 {
		/* #ifndef APP-NVUE */
		-webkit-line-clamp: 6;
		/* #endif */

		/* #ifdef APP-NVUE */
		lines: 6;
		/* #endif */
	}
</style>
