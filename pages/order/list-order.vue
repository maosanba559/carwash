<template>
	<view class="tabs">
		<scroll-view id="tab-bar" class="scroll-h"  scroll-x :show-scrollbar="false" scroll-with-animation
			:scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="index" class="d-inline-block span-4 text-center"
				:id="'tab'+index" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<swiper :current="tabIndex" class="flex-1" :duration="300" @change="ontabchange">
			<swiper-item class="swiper-item" v-for="(tab,swiperIndex) in orderList" :key="swiperIndex">
				<scroll-view class="scroll-v" enableBackToTop="true" scroll-with-animation scroll-y @scrolltolower="loadMore(swiperIndex)">
					<block v-if="tab.data.length > 0">
						<view class="m-2 p-2 rounded-20 bg-white" v-for="(order,orderIndex) in tab.data" :key="orderIndex">
							<view @click="detail(order.id)">
								<view class="d-flex j-sb a-center">
									<view class="font-weight">三毛严选</view>
									<view class="p-1 font rounded-15 text-muted">
										{{orderStatus(order.orderStatus)}}
									</view>
								</view>
								<view class="d-flex a-center font-md">
									<image :src="order.picUrl" class="rounded-10 flex-shrink"
										style="width: 180rpx;height: 180rpx;">
									</image>
									<view class="px-2">{{order.goodsName}}</view>
									<view class="text-right ml-auto text-muted">
										<price :num="order.price" :integral="order.integral"></price>
										<view class="font">x{{order.number}}</view>
									</view>
								</view>
							</view>
							<view class="d-flex a-center j-end font" v-if="order.orderStatus == 101">
								<view class="border text-center mr-3"
									style="padding: 12rpx 0;border-radius: 50rpx;min-width: 150rpx;"
									@click.stop="cancel(order)">
									取消订单</view>
								<view class="main-bg-color text-white text-center"
									style="padding: 12rpx 0;border-radius: 50rpx;min-width: 150rpx;" @click="pay(order)">
									去付款</view>
							</view>
							<view class="d-flex a-center j-end font" v-else-if="order.orderStatus == 301">
								<!-- <view class="border text-center mr-3" v-if="order.mobile"
									style="padding: 12rpx 0;border-radius: 50rpx;min-width: 150rpx;">
									查看物流</view> -->
								<view class="main-bg-color text-white text-center"
									style="padding: 12rpx 0;border-radius: 50rpx;min-width: 150rpx;"
									@click="confirm(order)">
									确认收货</view>
							</view>
							<view class="d-flex a-center j-end font" v-else-if="order.orderStatus > 301 && order.comments == 0">
								<view class="border text-center"
									style="padding: 12rpx 0;border-radius: 50rpx;min-width: 150rpx;"
									@click="openComment(order.id)">
									去评价</view>
							</view>
						</view>
						<view class="loading-more" v-if="tab.isLoading">
							<text class="loading-more-text">{{tab.loadingText}}</text>
						</view>
					</block>
					<noting v-else icon="icon-wushuju"/>
				</scroll-view>
			</swiper-item>
		</swiper>
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
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	export default {
		setup() {
			onLoad((e) => {
				v3Data.tabIndex = e.type
				setTimeout(() => {
					v3Data.tabBars.forEach((tabBar) => {
						v3Data.orderList.push({
							data: [],
							totalPage: 1,
							currPage: 1,
							isLoading: false,
							loadingText: '加载更多...'
						});
					});
					v3Data.switchTab(v3Data.tabIndex)
				}, 350)
			})
			const v3Data = reactive({
				orderList: [],
				cacheTab: [],
				tabIndex: 0,
				tabBars: [{
					name: '全部'
				}, {
					name: '待付款'
				}, {
					name: '待收货'
				}, {
					name: '待评价'
				}, {
					name: '已完成'
				}],
				scrollInto: "",
				getList(index) {
					let activeTab = v3Data.orderList[index];
					activeTab.isLoading = true
					if (activeTab.currPage == 1) {
						uni.showLoading({
							title: '数据加载中',
							mask: true
						});
					}
					const data = {"msg":"success","code":0,"page":{"totalCount":2,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"id":"1552970990168952833","goodsId":"1552845669171986434","orderStatus":402,"goodsName":"10元自动充值","price":0,"number":4,"specifications":"标准","picUrl":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","integral":"2000","comments":"0"},{"id":"1552849329427841025","goodsId":"1552845669171986434","orderStatus":402,"goodsName":"10元自动充值","price":0,"number":1,"specifications":"标准","picUrl":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","integral":"2000","comments":"0"}]}}
					activeTab.totalPage = data.page.totalPage
					activeTab.currPage = data.page.currPage
					activeTab.data = activeTab.data.concat(data.page.list);
					uni.hideLoading()
					activeTab.isLoading = false
				},

				ontabtap(e) {
					let index = e.target.dataset.current || e.currentTarget.dataset.current;
					v3Data.switchTab(index);
				},
				ontabchange(e) {
					let index = e.target.current || e.detail.current;
					v3Data.switchTab(index);
				},
				updateState(oid,status){
					let obj = v3Data.orderList[v3Data.tabIndex].data.find(e=>{
						return e.id = oid
					})
					obj.orderStatus = status
				},
				switchTab(index) {
					if (v3Data.orderList[index].data.length === 0) {
						v3Data.getList(index);
					}

					if (v3Data.tabIndex === index) {
						return;
					}

					// 缓存 tabId
					if (v3Data.orderList[v3Data.tabIndex].data.length > MAX_CACHE_DATA) {
						let isExist = v3Data.cacheTab.indexOf(v3Data.tabIndex);
						if (isExist < 0) {
							v3Data.cacheTab.push(v3Data.tabIndex);
							//console.log("cache index:: " + this.tabIndex);
						}
					}

					v3Data.tabIndex = index;
					v3Data.scrollInto = 'tab' + index;

					// 释放 tabId
					if (v3Data.cacheTab.length > MAX_CACHE_PAGE) {
						let cacheIndex = v3Data.cacheTab[0];
						v3Data.clearTabData(cacheIndex);
						v3Data.cacheTab.splice(0, 1);
					}
				},
				clearTabData(e) {
					this.orderList[e].data.length = 0;
					this.orderList[e].loadingText = "加载更多...";
				},
				loadMore(e) {
					let activeTab = v3Data.orderList[v3Data.tabIndex]
					let nextPage = activeTab.currPage + 1
					if (nextPage <= activeTab.totalPage) {
						activeTab.currPage += 1
						v3Data.getList(v3Data.tabIndex)
					}
				},
				detail(id) {
					uni.navigateTo({
						url: `/pages/goods/goods-order-detail?id=${id}`
					});
				},
				orderStatus(status) {
					return statusMap[status]
				},
				openComment(orderId){
					uni.navigateTo({
						url: `/pages/my/editcomment?orderId=${orderId}&type=1`
					});
				},
				updateComment(oid){
					let activeTab = v3Data.orderList[v3Data.tabIndex]
					let obj = activeTab.data.find(e => {
						return e.id === oid
					})
					obj.comments = 1
				},
				cancel(order) {
					uni.showModal({
						content: '确定取消当前订单吗?',
						showCancel: true,
						cancelText: '再看看',
						confirmText: '确定取消',
						success: res => {
							if (res.confirm) {
							}
						}
					});
				},
				pay(order) {
				},
				confirm(order) {
					uni.showModal({
						content: '确认收到货了吗?',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确认收货',
						success: res => {
							if (res.confirm) {
							}
						}
					});
				},
			})


			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.tabs {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		/* #ifndef APP-PLUS */
		height: 100vh;
		/* #endif */
	}

	.scroll-h {
		height: 80rpx;
		flex-direction: row;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 80rpx;
		line-height: 80rpx;
		flex-wrap: nowrap;
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.uni-tab-item-title-active {
		color: #FF6700;
		font-weight: bold;
	}

	.swiper-item {
		flex: 1;
		flex-direction: row;
	}

	.scroll-v {
		height: 100%;
	}

	.loading-more {
		align-items: center;
		justify-content: center;
		padding-top: 10px;
		padding-bottom: 10px;
		text-align: center;
	}

	.loading-more-text {
		font-size: 28rpx;
		color: #999;
	}
</style>
