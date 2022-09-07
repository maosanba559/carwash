<template>
	<view>
		<view class="p-2" v-if="comments.length>0">
			<view class="d-flex a-center border-bottom text-muted">
				<text>用户评价
				</text>
				<text class="main-text-color mr-1 ml-auto">非常满意</text>
			</view>
		</view>
		<divider></divider>
		<!-- 内容 -->
		<view class="px-2 py-3 d-flex border-bottom border-light-secondary" v-for="(item,index) in comments"
			:key="item.commentId">
			<image :src="item.avatarUrl == undefined ?'/static/avatar.jpg':item.avatarUrl" lazy-load mode="widthFix"
				style="width: 90rpx;height: 90rpx;" class="rounded">
			</image>
			<view class="pl-2 flex-1">
				<view class="d-flex a-center">
					<text class="font text-muted">{{item.mobile}}</text>
					<view class="ml-auto mr-1">
						<uni-rate :value="item.rate" readonly size="20"></uni-rate>
					</view>
				</view>
				<view class="line-h-md font-md my-1">
					{{item.content}}
				</view>
				<view class="row bg-white" v-if="item.contentImg">
					<view class="span24-8 pr-2" v-for="(img,imgIndex) in item.contentImg.split(',')" :key="imgIndex">
						<image :src="img" mode="widthFix" style="width: 180rpx;height: 180rpx;" lazy-load
							@tap="previewImage(item.contentImg.split(','),imgIndex)">
						</image>
					</view>
				</view>
				<view class="d-flex text-light-muted a-center">
					<text class="font">{{item.createTime.substring(0,10)}}</text>
				</view>
				<!-- 官方回复 -->
				<view v-if="item.reply" class="bg-light-secondary p-2 rounded mt-1 text-muted font">
					<text class="main-text-color">店家回复：</text>
					{{item.reply}}
				</view>
			</view>
		</view>
		<!-- 第二条 -->
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs
	} from 'vue'
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.type = e.type
				if(e.type == 0){
					v3Data.storeId = e.storeId
				}else{
					v3Data.goodsId = e.goodsId
					uni.setNavigationBarTitle({
						title:'商品评价'
					})
				}
				v3Data.getComments()
			})
			onReachBottom(() => {
				if (v3Data.currPage < v3Data.totalPage) {
					v3Data.currPage++
					v3Data.getComments()
				}
			})
			const v3Data = reactive({
				type:'',
				storeId: '',
				goodsId:'',
				currPage: 1,
				totalPage: 1,
				comments: [],
				getComments: () => {
				},
				previewImage: function(imgs, index) {
					uni.previewImage({
						current: index,
						urls: imgs
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
	page {
		background-color: #FFFFFF;
	}
</style>
