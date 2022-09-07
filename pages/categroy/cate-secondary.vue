<template>
	<view class="tabs">
		<noting v-if="tabBars.length == 0"/>
		<scroll-view id="tab-bar" class="scroll-h" scroll-x :show-scrollbar="false" scroll-with-animation
			:scroll-into-view="scrollInto">
			<view v-for="(tab,index) in tabBars" :key="index" class="d-inline-block span-4 text-center"
				:id="'tab'+index" :data-current="index" @click="ontabtap">
				<text class="uni-tab-item-title"
					:class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
			</view>
		</scroll-view>
		<swiper :current="tabIndex" class="flex-1" :duration="300" @change="ontabchange">
			<swiper-item class="swiper-item" v-for="(tab,swiperIndex) in orderList" :key="swiperIndex">
				<scroll-view class="scroll-v" enableBackToTop="true" scroll-with-animation scroll-y
					@scrolltolower="loadMore(swiperIndex)">
					<block v-if="tab.data.length > 0">
						<goods-item :list="tab.data" />
						<view class="loading-more" v-if="tab.isLoading">
							<text class="loading-more-text">{{tab.loadingText}}</text>
						</view>
					</block>
					<noting v-else />
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
	// 缓存每页最多
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;
	export default {
		setup() {
			onLoad((e) => {
				v3Data.pid = e.pid
				
			})
			const v3Data = reactive({
				pid: '',
				orderList: [],
				cacheTab: [],
				tabIndex: 0,
				tabBars: [],
				scrollInto: "",
				getData() {
					uni.request({
						url: `/goods/secondaryTab/${v3Data.pid}`,
						method: 'GET',
						success: ({
							data
						}) => {
							if (data.code == 0) {
								if (data.tabs.length == 0) {
									return
								}
								v3Data.tabBars = data.tabs

								v3Data.tabBars.forEach((tabBar) => {
									v3Data.orderList.push({
										data: [],
										totalPage: 1,
										currPage: 1,
										isLoading: false,
										loadingText: '加载更多...'
									});
								});

								let activeTab = v3Data.orderList[0]
								activeTab.totalPage = data.page.totalPage
								activeTab.currPage = data.page.currPage
								activeTab.data = data.page.list
							}
						},
						fail: () => {},
						complete: () => {}
					});
				},
				getList(index) {
					let activeTab = v3Data.orderList[index];
					activeTab.isLoading = true
					if (activeTab.currPage == 1) {
						uni.showLoading({
							title: '数据加载中',
							mask: true
						});
					}
					uni.request({
						url: '/goods/secondaryList',
						method: 'GET',
						data: {
							page: activeTab.currPage,
							categoryId: v3Data.tabBars[index].id
						},
						success: ({
							data
						}) => {
							activeTab.totalPage = data.page.totalPage
							activeTab.currPage = data.page.currPage
							activeTab.data = activeTab.data.concat(data.page.list);
						},
						complete() {
							uni.hideLoading()
							activeTab.isLoading = false
						}
					});
				},

				ontabtap(e) {
					let index = e.target.dataset.current || e.currentTarget.dataset.current;
					v3Data.switchTab(index);
				},
				ontabchange(e) {
					let index = e.target.current || e.detail.current;
					v3Data.switchTab(index);
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
