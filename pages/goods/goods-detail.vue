<template>
	<view>
		<nav-trans :navOp="navOp">
			<view class="font-md font-weight d-flex">
				<view class="d-flex flex-column px-2 a-center" @click="scrollTo(index)"
					:class="{'top-current':index == topCurrent}" v-for="(menu,index) in topMenus" :key="index">
					{{menu.text}}
					<view class="bottom-line"></view>
				</view>
			</view>
		</nav-trans>
		<swiper-image :resdata="swiperImgs" :height="750" :autoPlay="false" :dots="false" />
		<view class="p-3 bg-white">
			<view class="d-flex a-center">
				<price :num="checkedSpecPrice" :integral="goods.integral" accountStyle="font-size:42rpx"
					:isPrice="false" />
			</view>
			<view class="d-flex j-sb a-center pt-1">
				<view class="font-bold">{{goods.name}}</view>
				<view>
					<button class="button"  open-type="share">
						<uni-icons type="upload" :size="26"></uni-icons>
					</button>
				</view>
			</view>
			<view class="font">{{goods.brief}}</view>
		</view>
		<divider />
		<view class="pl-3 py-1 bg-white">
			<view class="d-flex a-center font">
				<text class="font-bold pr-5">已选</text>
				<view class="py-2 flex-1 d-flex a-center" style="border-bottom: 1rpx solid #dee2e6;"
					@click="popupHandle('skuPopup')">
					<text class="font ">{{checkedSpecText}} <text class="text-muted ml-1" v-if="!soldout">
							×{{number}}</text> </text>
					<uni-icons type="right" class="ml-auto pr-2" color="#B2B2B2"></uni-icons>
				</view>
			</view>
			<!-- <view class="d-flex a-center font">
				<text class="font-bold pr-5">送至</text>
				<view class="py-2 flex-1 d-flex a-center" style="border-bottom: 1rpx solid #dee2e6;">
					<text class="font ">小米灵感触控笔 x 1</text>
					<uni-icons type="right" class="ml-auto pr-2" color="#B2B2B2"></uni-icons>
				</view>
			</view> -->
			<view class="d-flex a-center font">
				<text class="font-bold pr-5">门店</text>
				<view class="py-2 flex-1 d-flex a-center" style="border-bottom: 1rpx solid #dee2e6;">
					<text class="">{{store.name}}</text>
					<!-- <uni-icons type="right" class="ml-auto pr-2" color="#B2B2B2"></uni-icons> -->
				</view>
			</view>
			<view class="d-flex a-center font">
				<text class="font-bold pr-5">服务</text>
				<view class="py-2 d-flex flex-wrap text-muted font flex-1 pr-3">
					<view class="d-flex a-cente mr-2" v-if="goods.owner">
						<uni-icons type="icon-duigou" customPrefix="iconfont" color="#B2B2B2"
							style="margin-right: 5rpx;"></uni-icons>三毛自营
					</view>
					<view class="d-flex a-cente mr-2">
						<uni-icons type="icon-duigou" customPrefix="iconfont" color="#B2B2B2"
							style="margin-right: 5rpx;"></uni-icons>包邮
					</view>
					<view class="d-flex a-cente mr-2">
						<uni-icons type="icon-duigou" customPrefix="iconfont" color="#B2B2B2"
							style="margin-right: 5rpx;"></uni-icons>7天无理由
					</view>
				</view>
			</view>
		</view>
		<divider />
		<!-- 评价 -->
		<view class="bg-white pb-3" id="menu1">
			<view class="d-flex j-sb px-3 pt-2 pb-3">
				<view class="font-md font-weight">用户评价</view>
				<uni-icons type="right" color="#B2B2B2"></uni-icons>
			</view>
			<scroll-comment isGoods v-if="commentPage.totalCount>0" :data="commentPage" @click.stop="openConment">
			</scroll-comment>
			<noting v-else :mt="false" icon="icon-queshengye_zanwushuju"/>
		</view>
		<!-- 评价end -->
		<divider />
		<view class="bg-white text-center pb-2" id="menu2">
			<view class="main-text-color font-md py-2">商品详情</view>
			<rich-text :nodes="goods.detail" />
			<view class="d-flex py-2 font-md font-bold border-bottom" style="color: #909399;" v-for="attr in attributes"
				:key="attr.id">
				<text class="span-10">{{attr.attribute}}</text>
				<text class="span-10">{{attr.value}}</text>
			</view>
		</view>
		<!-- 推荐 -->
		<divider />
		<!--goods start  -->
		<view class="font-weight pl-2 py-2" id="menu3">商品推荐</view>
		<goods-item :list="introList" />
		<!--goods  end-->
		<!-- 底部菜单 -->
		<view :style="{height:safeAreaInsets + 100 +'rpx'}"></view>
		<view class="goods-carts bg-white">
			<view class="d-flex a-center px-2" style="height: 100rpx;font-size: 12px;">
				<button class="button" @click="openCall">
					<view class="p-1 mr-2 text-center">
						<uni-icons type="chat" :size="20" />
						<view>客服</view>

					</view>
				</button>
				<button class="button" @click="toStoreMall">
					<view class="p-1 text-center mr-2">
						<uni-icons type="shop" :size="20" />
						<view>店铺</view>
					</view>
				</button>
				<view class="flex-1 p-2 text-center"
					style="font-size: 28rpx;border-radius: 100rpx;background: linear-gradient(90deg, #FE6035, #EF1224);color: #fff;"
					@click="buttonClick">
					立即购买
				</view>
			</view>
			<view :style="{height:safeAreaInsets+'rpx'}"></view>
		</view>
		<!-- sku -->
		<uni-popup ref="skuPopup" type="bottom" :safeArea="false">
			<view class="popup-content bg-white" style="border-radius: 20rpx 20rpx 0 0;">
				<view @click="popupHandle('skuPopup',0)">
					<close-button />
				</view>
				<view class="d-flex px-3 pt-3 pb-1">
					<image :src="tmpPicUrl" style="width: 212rpx;height: 212rpx;" mode=""></image>
					<view class="flex-1 d-flex flex-column  j-center px-3">
						<view class="line-h-df">
							<price :num="checkedSpecPrice" accountStyle="font-size:36rpx" :integral="goods.integral" />
						</view>
						<view class="font font-weight">{{tmpSpecText}}</view>
					</view>
				</view>
				<scroll-view scroll-y="true" style="height: 635rpx;">
					<view class="px-3 font">
						<view class="py-2" v-for="(item,index) in specifications" :key="index">
							<view class="font-bold">{{item.name}}</view>
							<view class="d-flex flex-wrap">
								<view class="px-2 mt-2 d-inline-block mr-2 text-center"
									:class="{'sku-current':spec.checked}" :data-index="index"
									:data-spec-index="specIndex" @click="clickSkuValue"
									v-for="(spec,specIndex) in item.valueList" :key="spec.id"
									style="min-width:100rpx;height: 60rpx;line-height: 60rpx;background-color: rgba(0,0,0,.04);border-radius: 50rpx;border:1rpx solid transparent">
									{{spec.value}}
								</view>
							</view>
						</view>
						<view class="my-3 d-flex j-sb a-center">
							<view class="font-bold">购买数量</view>
							<uni-number-box :min="1" :max="maxNum" v-model="number" />
						</view>
					</view>
				</scroll-view>
				<button-bottom :buttonName="soldout?'暂时缺货':'立即购买'" :bgColor="soldout?'disable-bg':'main-bg-color'"
					@click="naveCheckOut" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
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
		onShareAppMessage
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onMounted(() => {

			})
			onShareAppMessage(()=>{
				return {
				    title:'三毛自助洗车',
					path:'/pages/goods/goods-detail?goodsId='+v3Data.goods.id
				}
			})
			onLoad((e) => {
					const data = {"msg":"success","commentPage":{"totalCount":0,"pageSize":10,"totalPage":0,"currPage":1,"list":[]},"code":0,"introList":[{"id":"1563453153817436162","name":"保姆 月嫂 育儿 催乳 ","integral":"0","brief":"","picUrl":"http://img.iuxiche.com/upload/20220827/0095bc3aa0a04685837a8fb230e3b6f8.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":8000,"retailPrice":5500,"exchange":false},{"id":"1563444865189060610","name":"家庭保洁 擦玻璃 小时工","integral":"0","brief":"","picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":299,"retailPrice":29,"exchange":false},{"id":"1563023504247427073","name":"24h共享洗车系统 定制开发 品牌打造","integral":"0","brief":"提供成套方案/定制品牌","picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","isNew":true,"isHot":true,"owner":true,"counterPrice":49999,"retailPrice":1000,"exchange":false},{"id":"1562735317117579266","name":"APP/小程序/H5 软件定制开发","integral":"0","brief":"敏捷开发/快速交付/质量保证/9年售后","picUrl":"http://img.iuxiche.com/upload/20220825/f9be3eecdd1f48698c90822a70452b83.png","isNew":true,"isHot":true,"owner":true,"counterPrice":9999,"retailPrice":100,"exchange":false},{"id":"1554318185149362178","name":"360全包脚垫","integral":"0","brief":"商务百搭柔软舒适，防水易清洗，车型合适，版权齐全，专车制定。","picUrl":"http://img.iuxiche.com/upload/20220802/e6493a34ed1c406883659d27729e043e.jpeg","isNew":true,"isHot":true,"owner":false,"counterPrice":580,"retailPrice":480,"exchange":false},{"id":"1552845669171986434","name":"10元兑换【西吴店】","integral":"2000","brief":"","picUrl":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","isNew":true,"isHot":true,"owner":false,"counterPrice":0,"retailPrice":0,"exchange":true}],"goods":{"id":"1563023504247427073","goodsSn":"F688","storeId":"1509777240680833026","name":"24h共享洗车系统 定制开发 品牌打造","categoryId":"1562732383935934466","integral":"0","gallery":"http://img.iuxiche.com/upload/20220826/dc8d5adf199b4e57b55c931e9e13af6c.jpg","keywords":"","brief":"提供成套方案/定制品牌","isOnSale":true,"sortOrder":80,"picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","shareUrl":"","isNew":true,"isHot":true,"owner":true,"unit":"套","counterPrice":49999,"retailPrice":1000,"detail":"<p><img style=\"max-width:100%;height:auto\" src=\"http://img.iuxiche.com/upload/20220826/d7c75c13468d4e51822934c25d0a646d.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>","createTime":"2022-08-26 12:40:18","updateTime":"2022-08-28 16:23:51","deleted":0,"needAddress":false,"exchange":false,"sales":0,"exchangeBalance":0},"attributes":[],"store":{"storeId":"1509777240680833026","name":"三毛自助洗车西吴店"},"specifications":[{"name":"套餐","valueList":[{"id":"1563026340637118467","goodsId":"1563023504247427073","specification":"套餐","value":"门店版","picUrl":"","createTime":"2022-08-26 12:51:34","deleted":0},{"id":"1563026340641312770","goodsId":"1563023504247427073","specification":"套餐","value":"自定义品牌","picUrl":"","createTime":"2022-08-26 12:51:34","deleted":0},{"id":"1563026340641312771","goodsId":"1563023504247427073","specification":"套餐","value":"单车牌识别器","picUrl":"","createTime":"2022-08-26 12:51:34","deleted":0}]}],"products":[{"id":"1563804538857627650","goodsId":"1563023504247427073","specifications":["门店版"],"price":1000,"number":10,"url":"","createTime":"2022-08-26 12:51:34","updateTime":"2022-09-06 17:23:35","deleted":0},{"id":"1563804538861821954","goodsId":"1563023504247427073","specifications":["自定义品牌"],"price":29999,"number":10,"url":"","createTime":"2022-08-26 12:51:34","deleted":0},{"id":"1563804538870210562","goodsId":"1563023504247427073","specifications":["单车牌识别器"],"price":999,"number":10,"url":"","createTime":"2022-08-26 12:51:34","deleted":0}]}
					if (data.goods.gallery) {
						v3Data.swiperImgs = data.goods.gallery.split(',').map(e => {
							return {
								src: e
							}
						})
					}
					v3Data.goods = data.goods
					v3Data.checkedSpecPrice = v3Data.goods.retailPrice
					v3Data.tmpPicUrl = v3Data.goods.picUrl
					v3Data.attributes = data.attributes
					v3Data.introList = data.introList
					v3Data.store = data.store
					v3Data.commentPage = data.commentPage
					v3Data.specifications = data.specifications
					v3Data.products = data.products
					v3Data.queryNode()
					
					//商品规格初始化
					for (let i = 0; i < v3Data.specifications.length; i++) {
						v3Data.specifications[i].valueList[0].checked = true
					}
					v3Data.changeSpecInfo();
				}),

				onPageScroll((e) => {
					let topHeight = e.scrollTop;
					let navOp = 0;
					navOp = topHeight / getApp().globalData.totalHeight;
					v3Data.navOp = topHeight > 10 ? navOp : 0;

					if (!v3Data.isClick) {
						topHeight = topHeight + 5

						if (topHeight <= v3Data.menuPositions[1]) {
							v3Data.topCurrent = 0
						} else if (topHeight >= v3Data.menuPositions[1] && topHeight < v3Data.menuPositions[2]) {
							v3Data.topCurrent = 1
						} else if (topHeight >= v3Data.menuPositions[2] && topHeight < v3Data.menuPositions[3]) {
							v3Data.topCurrent = 2
						} else {
							v3Data.topCurrent = 3
						}
					}

				})
			const v3Data = reactive({
				maxNum: 0,
				number: 1,
				soldout: false,
				tmpPicUrl: '',
				checkedSpecText: '规格数量选择',
				tmpSpecText: '请选择规格数量',
				checkedSpecPrice: 0,
				goods: '',
				store: '',
				commentPage: [],
				introList: [],
				specifications: [],
				attributes: [],
				products: [],
				skuPopup: null,
				navOp: 0,
				menuPositions: [0, 0, 0, 0],
				topCurrent: 0,
				isClick: false,
				topMenus: [{
					text: '商品',
				}, {
					text: '评价',
				}, {
					text: '详情',
				}, {
					text: '推荐',
				}],
				swiperImgs: [],
				scrollTo(index) {
					v3Data.topCurrent = index
					v3Data.isClick = true

					uni.pageScrollTo({
						scrollTop: v3Data.menuPositions[index]
					})
					setTimeout(() => {
						v3Data.isClick = false
					}, 300);
				},
				popupHandle(name, type) {
					if (type == 0) {
						v3Data[name].close()
					} else {
						v3Data[name].open()
					}
				},
				openCall: () => {
					uni.makePhoneCall({
						phoneNumber: '18536745515'
					}).then(res => {}).catch(err => {})
				},
				openConment: () => {
					uni.navigateTo({
						url: `/pages/shop/comment?goodsId=${v3Data.goods.id}&type=1`
					});
				},
				toStoreMall: () => {
						uni.navigateTo({
							url: `/pages/shop/store-goods?storeId=${v3Data.goods.storeId}&storeName=${v3Data.store.name}`
						});
				},
				buttonClick: (e) => {
					v3Data.popupHandle('skuPopup', 1)
				},
				naveCheckOut() {
					//根据选中的规格，判断是否有对应的sku信息
					let checkedProduct = v3Data.getCheckedProductItem(v3Data.getCheckedSpecKey());
					if (v3Data.soldout || !checkedProduct) {
						return uni.showToast({
							title: '请选择其他规格',
							icon: 'none'
						});
					}
					let goods = {
						goodsId: v3Data.goods.id,
						number: v3Data.number,
						productId: checkedProduct.id,
						goodsPic: v3Data.tmpPicUrl,
						goodsName: v3Data.goods.name,
						specName: v3Data.checkedSpecText,
						price: checkedProduct.price,
						needAddress: v3Data.goods.needAddress,
						integral: v3Data.goods.integral
					}

					uni.setStorageSync("tempGoods", goods)

					uni.navigateTo({
						url: '/pages/goods/create-order',
					});
				},
				queryNode: () => {
					setTimeout(() => {
						const totalHeight = getApp().globalData.totalHeight
						const query = uni.createSelectorQuery();
						query.select('#menu1').boundingClientRect()
						query.select('#menu2').boundingClientRect()
						query.select('#menu3').boundingClientRect()
						query.exec((res) => {
							v3Data.menuPositions[0] = 0
							v3Data.menuPositions[1] = res[0].top - totalHeight
							v3Data.menuPositions[2] = res[1].top - totalHeight
							v3Data.menuPositions[3] = res[2].top - totalHeight
						})
					}, 300)
				},
				// 规格选择
				clickSkuValue: (event) => {
					let index = event.currentTarget.dataset.index;
					let specIndex = event.currentTarget.dataset.specIndex;

					if (v3Data.specifications[index].valueList[specIndex].checked) {
						return
					}
					v3Data.specifications[index].valueList[specIndex].checked = true
					v3Data.specifications[index].valueList.forEach((spec, index) => {
						if (index != specIndex) {
							spec.checked = false
						}
					})
					//重新计算spec改变后的信息
					v3Data.changeSpecInfo();

					//重新计算哪些值不可以点击
				},
				// 规格改变时，重新计算价格及显示信息
				changeSpecInfo: () => {
					let checkedNameValue = v3Data.getCheckedSpecValue();
					//设置选择的信息
					let checkedValue = checkedNameValue.filter(function(v) {
						if (v.valueId != 0) {
							return true;
						} else {
							return false;
						}
					}).map(function(v) {
						return v.valueText;
					});
					if (checkedValue.length > 0) {
						v3Data.tmpSpecText = checkedValue.join(' ')
					} else {
						v3Data.tmpSpecText = '请选择规格数量'
					}

					if (v3Data.isCheckedAllSpec()) {

						v3Data.checkedSpecText = v3Data.tmpSpecText

						// 规格所对应的货品选择以后
						let checkedProduct = v3Data.getCheckedProductItem(v3Data.getCheckedSpecKey());
						if (!checkedProduct) {
							v3Data.soldout = true
							return;
						}

						v3Data.checkedSpecPrice = checkedProduct.price
						if (checkedProduct.number > 0) {
							if (checkedProduct.url) {
								v3Data.tmpPicUrl = checkedProduct.url
							}
							v3Data.soldout = false
							v3Data.maxNum = checkedProduct.number
						} else {
							v3Data.soldout = true
							v3Data.maxNum = 0
						}

					} else {
						v3Data.checkedSpecText = "规格数量选择"
						v3Data.checkedSpecPrice = v3Data.goods.retailPrice
						v3Data.soldout = false
					}

				},
				//获取选中的规格信息
				getCheckedSpecValue: () => {
					let checkedValues = [];
					let _specificationList = v3Data.specifications;
					for (let i = 0; i < _specificationList.length; i++) {
						let _checkedObj = {
							name: _specificationList[i].name,
							valueId: 0,
							valueText: ''
						};
						for (let j = 0; j < _specificationList[i].valueList.length; j++) {
							if (_specificationList[i].valueList[j].checked) {
								_checkedObj.valueId = _specificationList[i].valueList[j].id;
								_checkedObj.valueText = _specificationList[i].valueList[j].value;
							}
						}
						checkedValues.push(_checkedObj);
					}

					return checkedValues;
				},

				//判断规格是否选择完整
				isCheckedAllSpec: () => {
					return !v3Data.getCheckedSpecValue().some(function(v) {
						if (v.valueId == 0) {
							return true;
						}
					});
				},

				getCheckedSpecKey: () => {
					let checkedValue = v3Data.getCheckedSpecValue().map(function(v) {
						return v.valueText;
					});
					return checkedValue;
				},
				// 获取选中的产品（根据规格）
				getCheckedProductItem: (key) => {
					return v3Data.products.find(function(v) {
						return key.every((ele) => v.specifications.includes(ele))
					});
				}
			})
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style lang="scss">
	.bottom-line {
		height: 5rpx;
		width: 25rpx;
		border-radius: 5rpx;
		background-color: #FF6700;
		margin-top: 5rpx;
		display: none;
	}

	.top-current {
		color: #FF6700;
	}

	.top-current .bottom-line {
		display: block;
	}

	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		/* #ifdef H5 */
		left: var(--window-left);
		right: var(--window-right);
		/* #endif */
		bottom: 0;
	}

	.sku-current {
		background-color: rgba(255, 89, 52, .08) !important;
		border: 1rpx solid #ff5934;
		color: #f56600;
	}

	.button {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		font-size: 12px;
		line-height: 1.1;
		background-color: #FFFFFF;
	}

	button::after {
		border: none
	}
</style>
