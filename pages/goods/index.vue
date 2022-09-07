<template>
	<view class="container">
		<nav-trans :leftWidth="0" :navOp="navOp" bgColor="#ff6700" :bgFixed="true" :titltOp="false">
			<view class="input-view" @click="search">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<text class="text-light-muted ml-2 font">搜索商品</text>
			</view>
		</nav-trans>
		<view>
			<view
				style="height: 200rpx;background-color: #FF6700;border-bottom-left-radius: 20%;border-bottom-right-radius: 20%;"
				class="position-relative">
				<view class="py-2 position-absolute left-0 right-0 top-0">
					<swiper-image :resdata="swiperImgs" :height="300" rounded padding></swiper-image>
				</view>
			</view>
			<view class="mx-2">
				<!-- 统一左右padding-->
				<view class="d-flex font-sm line-h text-center font-bold py-2"
					style="margin-top: 120rpx;color: #ff594a;">
					<view class="span24-8  border-right d-flex  a-center j-center">
						<uni-icons color="#ff594a" customPrefix="iconfont" type="icon-pinpaizhuanxiang" style="margin-right: 5rpx;" /> 官方商城
					</view>
					<view class="span24-8  border-right d-flex  a-center j-center">
						<uni-icons customPrefix="iconfont" type="icon-zhengpinbaozhang" color="#ff594a" style="margin-right: 5rpx;" />正品保障
					</view>
					<view class="span24-8 d-flex a-center   j-center">
						<uni-icons customPrefix="iconfont" type="icon-tianmaoshangmentuihuo" color="#ff594a" style="margin-right: 5rpx;" />全场包邮
					</view>
				</view>
				<view class="bg-white rounded-20">
					<view class="d-flex a-center flex-wrap py-1">
						<block v-for="(item,index) in l1" :key="index">
							<view class="d-flex span-4 j-center a-center flex-column p-1" @click="toSecondary(item)">
								<image :src="item.iconUrl" style="width:60rpx ;height: 60rpx;" />
								<text class="font-sm mt-1">{{item.name}}</text>
							</view>
						</block>
					</view>
				</view>
				<divider />
				<!-- 最新推荐 -->
				<view class="rounded-20 bg-white">
					<view v-for="(item,index) in recommends" :key="index">
						<goods-list-item :item="item" isIndex/>
					</view>
				</view>
				<!-- 新品 -->
				<divider />
				<view class="bg-white  rounded-20 d-flex">
					<view class="span-10 p-2" v-if="newGoods && newGoods.length > 0">
						<view class="font-bold">新品好物</view>
						<view class="d-flex mt-2 font-sm">
							<view class="span-10" v-for="(item,index) in newGoods" :key="index"
								@click="openDetail(item.goodsId)">
								<image :src="item.picUrl" class="rounded-20" style="height: 150rpx;width: 150rpx;" />
								<view class="ellipsis">{{item.name}}</view>
							</view>
						</view>
					</view>
					<view class="span-10 p-2" v-if="hotGoods && hotGoods.length > 0">
						<view class="font-bold">热门推荐</view>
						<view class="d-flex mt-2 font-sm">
							<view class="span-10" v-for="(item,index) in hotGoods" :key="index"
								@click="openDetail(item.goodsId)">
								<image :src="item.picUrl" class="rounded-20" style="height: 150rpx;width: 150rpx;" />
								<view class=" ellipsis">{{item.name}}</view>
							</view>
						</view>
					</view>
				</view>

			</view>
			<!-- tab -->
			<view class="topId"></view>
			<view :style="{top: totalHeight+'px'}" class="cate" :class="{'cate-top':isTop}">
				<scroll-view id="tab-bar" scroll-x scroll-with-animation :show-scrollbar="false"
					:scroll-into-view="scrollInto">
					<view class="d-flex flex-1 pt-3 pb-2">
						<view class="scroll-item" :id="'tab'+index"
							:class="[{'tabtop':isTop},index == tabIndex?currentClass:'']" v-for="(tab,index) in tabBars"
							:key="index" :data-current="index" @click="ontabtap">
							<view class="font-weight d-flex flex-column j-center a-center">
								<text class="cate-name">{{tab.name}}</text>
								<view class="cate-bottom"></view>
							</view>
							<view class="text-muted" style="margin-top: -8rpx;">
								<text class="sub-cate px-1 rounded-20" style="">{{tab.desc}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- tab end -->
			<view class="mt-2">
				<swiper :current="tabIndex" @change="ontabchange" :style="{height:swiperHeight}">
					<swiper-item v-for="(tab,cateIndex) in goodsList" :key="cateIndex">
						<!--goods start  -->
						<view :id="'swiper-'+cateIndex">
							<goods-item :list="tab.data" v-if="tab.data.length > 0" />
							<noting v-else></noting>
						</view>
						<!--goods  end-->
					</swiper-item>
				</swiper>
			</view>
			<!-- swiper end -->
		</view>
	</view>
</template>

<script>
	const MAX_CACHE_DATA = 100;
	// 缓存页签数量
	const MAX_CACHE_PAGE = 3;

	import {
		ref,
		reactive,
		toRefs,
		nextTick,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow,
		onPullDownRefresh,
		onPageScroll,
		onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onMounted(() => {
				v3Data.totalHeight = getApp().globalData.totalHeight
			})
			onLoad(() => {
				v3Data.getData()
			})
			onPullDownRefresh(() => {
				uni.stopPullDownRefresh()
			})
			onReachBottom(() => {
				let activeTab = v3Data.goodsList[v3Data.tabIndex]
				let nextPage = activeTab.currPage + 1
				if (nextPage <= activeTab.totalPage) {
					activeTab.currPage += 1
					v3Data.getList(v3Data.tabIndex)
				}
			})
			onPageScroll((e) => {
				let topHeight = e.scrollTop;
				let navOp = 0;
				navOp = topHeight / v3Data.totalHeight;
				// const styles = ` background: rgba(255, 255, 255, ${navOp});`;
				v3Data.navOp = topHeight > 10 ? navOp : 0;

				if (topHeight > v3Data.tabToTopNum - v3Data.totalHeight - 5) {
					v3Data.currentClass = 'scroll-top'
					v3Data.isTop = true
				} else {
					v3Data.currentClass = 'scroll-current'
					v3Data.isTop = false
				}

			})
			const v3Data = reactive({
				goodsList: [],
				cacheTab: [],
				scrollInto: '',
				tabIndex: 0,
				tabBars: [],
				totalHeight: 0,
				navOp: 0,
				tabToTopNum: 0,
				swiperHeight: '100vh',
				isTop: false,
				titleBg: '#FF6700',
				currentClass: 'scroll-current',
				swiperImgs: [],
				l1: [],
				recommends: [],
				newGoods: [],
				hotGoods: [],
				toSecondary: (cate) => {
					if (cate.targetType == 1 && cate.target) {
						uni.navigateTo({
							url: cate.target + '&name='+ cate.name
						});
					} else {
						uni.navigateTo({
							url: `/pages/categroy/cate-secondary?pid=${cate.id}`
						});
					}
				},
				search(){
					uni.navigateTo({
						url: '/pages/search/search'
					});
				},
				getData() {
					const data = {"msg":"success","swipers":[{"rotationId":"1552835081209380865","url":"http://img.iuxiche.com/upload/20220827/4e2c398030af48d6a0a7c7ec20ded4ef.jpg","path":"/pages/goods/activity-goods?activityId=1563446385888501761&name=家政精选","type":"1"}],"newGoods":[{"id":"1553933345921028097","activityId":"1552864655595012098","type":2,"goodsId":"1553933345921028097","reason":"","createTime":"2022-08-25 18:01:37","picUrl":"http://img.iuxiche.com/upload/20220801/43596b24e8d84a2a98d3c564c8a5ab8c.jpeg","name":"嘉实多全合成机油","retailPrice":"360.00","counterPrice":"428.00","integral":0},{"id":"1563444865189060610","activityId":"1552864655595012098","type":2,"goodsId":"1563444865189060610","reason":"快速/便捷/极速到账","createTime":"2022-07-29 11:50:50","picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","name":"家庭保洁 擦玻璃 小时工","retailPrice":"29.00","counterPrice":"299.00","integral":0}],"code":0,"l1":[{"id":"1563045404331806721","name":"中秋节","desc":"","iconUrl":"http://img.iuxiche.com/upload/20220826/3af58b27c8194c7bbcecd9557a922ed4.jpg","level":"L1","targetType":0,"target":""},{"id":"1552837475104194561","name":"积分兑换","desc":"积分有礼","iconUrl":"http://img.iuxiche.com/upload/20220826/8332a6bc1af54a808fa6a0bf79b4e42f.jpg","level":"L1","targetType":0,"target":""},{"id":"1562731987184136193","name":"软件开发","desc":"","iconUrl":"http://img.iuxiche.com/upload/20220825/6f9e79099fd24b288bf80a716c8e2d54.png","level":"L1","targetType":0,"target":""},{"id":"1552855225025429506","name":"汽车服务","desc":"全方位保障","iconUrl":"http://img.iuxiche.com/upload/20220826/927553126cfa4f8a9a26a0e482a86f71.jpg","level":"L1","targetType":0,"target":""},{"id":"1552858366689148929","name":"三毛家政","desc":"精诚服务","iconUrl":"http://img.iuxiche.com/upload/20220826/cd20d9608b174b358b0d046b34c5838b.jpg","level":"L1","targetType":0,"target":""}],"hotGoods":[{"id":"1552845669171986434","activityId":"1552864878090256385","type":3,"goodsId":"1552845669171986434","reason":"","createTime":"2022-07-29 11:53:41","picUrl":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","name":"10元兑换【西吴店】","retailPrice":"0.00","counterPrice":"0.00","integral":2000}],"l2":[{"id":"1562732383935934466","name":"软件定制","desc":"定制开发","iconUrl":"","level":"L2","targetType":0,"target":""},{"id":"1563045678542819329","name":"中秋月饼","desc":"手工月饼","iconUrl":"","level":"L2","targetType":0,"target":""},{"id":"1563440748819423234","name":"家政服务","desc":"专业家政","iconUrl":"","level":"L2","targetType":0,"target":""},{"id":"1552839764141408258","name":"兑换余额","desc":"自动充值","iconUrl":"","level":"L2","targetType":0,"target":""},{"id":"1552856133058691074","name":"爱车保养","desc":"爱车保养","iconUrl":"","level":"L2","targetType":0,"target":""}],"firstTabPage":{"totalCount":2,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"id":"1562735317117579266","storeId":"1509777240680833026","name":"APP/小程序/H5 软件定制开发","integral":"0","keywords":"","brief":"敏捷开发/快速交付/质量保证/9年售后","isOnSale":true,"picUrl":"http://img.iuxiche.com/upload/20220825/f9be3eecdd1f48698c90822a70452b83.png","isNew":true,"isHot":true,"owner":true,"counterPrice":9999,"retailPrice":100,"exchange":false},{"id":"1563023504247427073","storeId":"1509777240680833026","name":"24h共享洗车系统 定制开发 品牌打造","integral":"0","keywords":"","brief":"提供成套方案/定制品牌","isOnSale":true,"picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":49999,"retailPrice":1000,"exchange":false}]},"recommends":[{"id":"1563023504247427073","activityId":"1552864075908644865","type":1,"goodsId":"1563023504247427073","reason":"提供成套方案/系统稳定/操作便捷/可对接各种硬件/根据需求定制开发/助力打造自有品牌","createTime":"2022-08-26 12:44:41","picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","name":"24h共享洗车系统 定制开发 品牌打造","retailPrice":"1000.00","counterPrice":"49999.00","integral":0},{"id":"1562735317117579266","activityId":"1552864075908644865","type":1,"goodsId":"1562735317117579266","reason":"快速交付/质量保证/值得信赖/9年售后","createTime":"2022-08-25 17:41:52","picUrl":"http://img.iuxiche.com/upload/20220825/f9be3eecdd1f48698c90822a70452b83.png","name":"APP/小程序/H5 软件定制开发","retailPrice":"100.00","counterPrice":"9999.00","integral":0}]}
						v3Data.tabBars = data.l2
						v3Data.swiperImgs = data.swipers.map(e => {
							return {
								src: e.url,
								path: e.path
							}
						})
						if(v3Data.tabBars){
							v3Data.tabBars.forEach((tabBar) => {
								v3Data.goodsList.push({
									totalPage: 1,
									currPage: 1,
									data: []
								});
							});
						}
						v3Data.l1 = data.l1
						v3Data.recommends = data.recommends
						v3Data.newGoods = data.newGoods
						v3Data.hotGoods = data.hotGoods
						if(data.firstTabPage){
							v3Data.goodsList[0] = {
								totalPage: data.firstTabPage.totalPage,
								currPage: data.firstTabPage.currPage,
								data: data.firstTabPage.list
							}
						}
						nextTick(() => {
							v3Data.queryTop()
							v3Data.setSwiperHeight(0)
						})
				},
				openDetail(goodsId) {
					uni.navigateTo({
						url: `/pages/goods/goods-detail?goodsId=${goodsId}`
					});
				},
				queryTop: () => {
					const query = uni.createSelectorQuery();
					query.select('.topId').boundingClientRect(rect => {
						v3Data.tabToTopNum = rect.top + rect.height
					}).exec()
				},
				ontabchange: (e) => {
					let index = e.target.current || e.detail.current;
					v3Data.switchTab(index);
					v3Data.scrollInto = 'tab' + index
				},
				ontabtap: (e) => {
					let index = e.target.dataset.current || e.currentTarget.dataset.current;
					v3Data.switchTab(index);
				},
				getList(index) {
					let activeTab = v3Data.goodsList[index];
					if (activeTab.currPage == 1) {
						uni.showLoading({
							title: '数据加载中',
							mask: true
						});
					}
					uni.hideLoading()
					nextTick(() => {
						v3Data.setSwiperHeight(index)
					})
					const data = {"msg":"success","code":0,"page":{"totalCount":2,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"id":"1563453153817436162","storeId":"1509777240680833026","name":"保姆 月嫂 育儿 催乳 ","integral":"0","keywords":"","brief":"","isOnSale":true,"picUrl":"http://img.iuxiche.com/upload/20220827/0095bc3aa0a04685837a8fb230e3b6f8.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":8000,"retailPrice":5500,"exchange":false},{"id":"1563444865189060610","storeId":"1509777240680833026","name":"家庭保洁 擦玻璃 小时工","integral":"0","keywords":"","brief":"","isOnSale":true,"picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":299,"retailPrice":29,"exchange":false}]}}
					activeTab.totalPage = data.page.totalPage
					activeTab.currPage = data.page.currPage
					activeTab.data = activeTab.data.concat(data.page.list);
				},
				clearTabData: (e) => {
					v3Data.goodsList[e].data.length = 0;
				},
				/* 计算swiper高度 */
				setSwiperHeight: (index) => {
					//获取节点代码
					const query = uni.createSelectorQuery();
					query
						.select('#swiper-' + index)
						.boundingClientRect(data => {
							if (data != null) {
								v3Data.swiperHeight = data.height < 500 ? '100vh' : data.height + 'px';
							}
						}).exec();
				},
				switchTab: (index) => {
					if (v3Data.goodsList[index].data.length === 0) {
						v3Data.getList(index)
					} else {
						nextTick(() => {
							v3Data.setSwiperHeight(index)
						})
					}

					if (v3Data.tabIndex === index) {
						return;
					}

					// 缓存 tabId
					if (v3Data.goodsList[v3Data.tabIndex].data.length > MAX_CACHE_DATA) {
						let isExist = v3Data.cacheTab.indexOf(v3Data.tabIndex);
						if (isExist < 0) {
							v3Data.cacheTab.push(v3Data.tabIndex);
						}
					}

					// 释放 tabId
					if (v3Data.cacheTab.length > MAX_CACHE_PAGE) {
						let cacheIndex = v3Data.cacheTab[0];
						v3Data.clearTabData(cacheIndex);
						v3Data.cacheTab.splice(0, 1);
					}
					/* ---- */
					v3Data.tabIndex = index

					if (v3Data.isTop) {
						uni.createSelectorQuery()
							.select(".container") //对应外层节点
							.boundingClientRect((container) => {
								uni.createSelectorQuery()
									.select(".topId") //目标节点
									.boundingClientRect((target) => {
										uni.pageScrollTo({
											scrollTop: target.top - container.top - v3Data
												.totalHeight, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离
										});
									})
									.exec();
							})
							.exec();
					}


				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style lang="scss">
	$nav-height: 32px;

	.input-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 500rpx;
		flex: 1;
		background-color: #f5f5f5;
		height: $nav-height;
		border-radius: 15px;
		padding: 0 15px;
		flex-wrap: nowrap;
		margin: 5px 50px 5px 0;
		line-height: $nav-height;
	}

	.input-uni-icon {
		line-height: $nav-height;
	}

	.cate {
		position: sticky;
		z-index: 999;
	}

	.cate-top {
		width: 100%;
		background-color: #fff;
	}

	.scroll-item {
		// flex-direction: column;
		padding: 0rpx 20rpx;
		text-align: center;
		flex: 1;
		white-space: nowrap;
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		flex-wrap: nowrap;
	}

	.scroll-current .cate-name {
		color: #FF6700;
	}

	.scroll-current .sub-cate {
		background-color: #FF6700;
		color: #fff;
	}

	.scroll-top .cate-name {
		color: #FF6700;
	}

	.scroll-top {
		background-color: #fff;
	}

	.scroll-top .cate-name {
		color: #FF6700;
		padding-bottom: 6rpx;
	}

	.sub-cate {
		font-size: 20rpx;
	}

	.cate-bottom {
		height: 5rpx;
		width: 35rpx;
		border-radius: 5rpx;
		background-color: #FF6700;
		margin-top: 3rpx;
		display: none;
	}

	.scroll-top .cate-bottom {
		display: block;
	}

	.cate-name {
		font-size: 17px;
	}

	.tabtop {
		background-color: #fff;
	}

	.tabtop .sub-cate {
		display: none;
	}
</style>
