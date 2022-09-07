<template>
	<view class="bg-white">
		<nav-trans :navOp="navOp" title="门店详情">
		</nav-trans>
		<swiper-image :resdata="swiperImgs" :height="750" :dots="false" preview />
		<view class="position-relative">
			<view class="flex-shrink text-center line-h-sm position-absolute"
				style="right: 50rpx;top: 30rpx;z-index: 10;" @click="failure">
				<image src="../../static/icon/gz.svg" class="svgsmall"></image>
				<view class="text-muted font-sm">故障申报</view>
			</view>
		</view>
		<uni-section :title="store.name">
			<view class="font text-muted">
				<view class="d-flex a-center">门店评分：
					<view>
						<uni-rate value="5" size="16" readonly></uni-rate>
					</view>
				</view>
				<block v-if="Object.keys(store).length > 0 ">
					<view>收费标准：{{store.startAmount}}元{{store.startMinutes}}分钟，超出{{store.afterAmount}}元/分</view>
					<view>地址信息：{{store.address}}</view>
				</block>
			</view>
		</uni-section>
		<view class="d-flex font-sm line-h-big text-muted bg-light-secondary">
			<text class="span24-8 border-right text-center">24H服务</text>
			<text class="span24-8 border-right text-center">品质保障</text>
			<text class="span24-8 text-center">售后无忧</text>
		</view>
		<uni-section title="洗车工位" class="font">
			<block v-for="(item,index) in stations" :key="item.stationId">
				<view class="d-flex a-center">
					<view>
						<image :src="item.titleImg" class="rounded animate__animated animate__fadeIn" lazy-load style="width: 180rpx;height: 150rpx;" />
					</view>
					<view class="p-2 py-1 flex-1">
						<view class="font-md">{{item.name}}</view>
						<view class="d-flex">
							<view v-if="item.state != 1" class="utag" :class="item.state==2?'bg-danger':''">
								{{status(item.state)}}
							</view>
						</view>
						<view v-if="item.state==1" class="d-flex a-center">
							<text class="text-info">已使用 {{minute(item.startTime)}} 分钟</text>
							<!-- <text class="utag ml-auto" @click="listenFinish">结束通知</text> -->
						</view>
					</view>
				</view>
			</block>
		</uni-section>
		<block v-if="washCards && washCards.length >0">
			<divider />
			<uni-section title="洗车卡">
				<view class="d-flex p-2 mb-2 bg-white border-main a-center border rounded-10 wash-card"
					v-for="(item,index) in washCards" :key="item.washCardId" @click="openWashCard(index)">
					<view class="span-17 border-right">
						<view class="font-weight">{{item.name}}</view>
						<view class="my-1 pr-2 text-muted font">{{item.intro}}</view>
						<view><text class="main-text-color font-lg">￥{{item.price}}</text><text
								class="ml-2 font line-through text-light-muted">原价{{item.originalPrice}}</text></view>
					</view>
					<view class="span-3 main-text-color text-center">
						选购
					</view>
				</view>
			</uni-section>
		</block>
		<divider />
		<uni-section title="用户评价"
			:subTitle="commentPage.totalCount>0 && store.scoreSum > 0 ?'好评率'+((store.scoreSum/store.scoreNum/5 + 9)*10).toFixed(1)+'%':''"
			@click="openConment">
			<scroll-comment v-if="commentPage.totalCount>0" :data="commentPage" @click.stop="openConment">
			</scroll-comment>
			<noting v-else />
		</uni-section>
		<view v-if="goods.length > 0" style="background-color: #F5F5F5;">
			<view class="p-2 text-center text-muted">商品推荐</view>
			<goods-item :list="goods"/>
		</view>
		<view style="height: 300rpx;"></view>
		<!-- 底部 -->
		<view class="bottom-action bg-light">
			<view class="d-flex  a-center  font-weight flex-wrap">
				<view class="span24-8" @click="recharge">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/cz.svg" class="svgsmall"></image>
						</view>
						<text>充值缴费</text>
					</button>
				</view>
				<view class="span24-8" @click="navigate('car/car')">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/car.svg" class="svgsmall"></image>
						</view>
						<text>添加车辆</text>
					</button>
				</view>
				<view class="span24-8" @click="goOut">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/js.svg" class="svgsmall"></image>
						</view>
						<text>结算开门</text>
					</button>
				</view>
				<view class="span24-8" @click="openUnregCar">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/wpc.svg" class="svgsmall"></image>
						</view>
						无牌车通道
					</button>
				</view>
				<view class="span24-8" @click="openMap">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/dh.svg" class="svgsmall"></image>
						</view>
						一键导航
					</button>
				</view>
				<view class="span24-8" @click="openCall">
					<button class="button" hover-class="none">
						<view>
							<image src="../../static/icon/mobile.svg" class="svgsmall"></image>
						</view>
						联系店主
					</button>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		checkout
	} from '@/common/lib/myTools'
	import {
		ref,
		reactive,
		toRefs
	} from 'vue'
	import {
		onLoad,
		onShow,
		onPageScroll,
		onShareAppMessage
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.getInfo(e.storeId)
				v3Data.getComment(e.storeId)
			});
			onShow(() => {
				if (v3Data.showState) {
					v3Data.getInfo(v3Data.store.storeId)
				}
			})
			onShareAppMessage(()=>{
				return {
				    title:'自助洗车',
					path:'/pages/shop/shopdetail?storeId='+v3Data.store.storeId
				}
			})
			onPageScroll((e) => {
				let topHeight = e.scrollTop;
				let navOp = 0;
				navOp = topHeight / getApp().globalData.totalHeight;
				v3Data.navOp = topHeight > 10 ? navOp : 0;
			})
			const v3Data = reactive({
				goods:[],
				navOp: 0,
				washCards: [],
				store: {},
				stations: [],
				swiperImgs: [],
				commentPage: {},
				showState: false,
				status: (val) => {
					switch (val) {
						case 0:
							return '空闲中'
							break;
						case 1:
							return '使用中'
							break;
						case 2:
							return '维护中'
							break;
						default:
							break;
					}
				},
				listenFinish: () => {
					uni.requestSubscribeMessage({
						tmplIds: ['FBtbcDxY_si8MmLxJvk4_b1U5ISOz75t-4GB6KpJ_Go'],
						success(res) {
							console.log(res['FBtbcDxY_si8MmLxJvk4_b1U5ISOz75t-4GB6KpJ_Go'] ==
								'accept');
						}
					})
				},
				goOut: () => {
					checkout()
				},
				openUnregCar: () => {
					uni.navigateTo({
						url: `/pages/car/unreg-car?storeId=${v3Data.store.storeId}&storeName=${v3Data.store.name}`
					});
				},
				openWashCard: (index) => {
					uni.navigateTo({
						url: `/pages/washcard/washcard?storeId=${v3Data.store.storeId}&storeName=${v3Data.store.name}&current=${index}`
					});
				},
				recharge: () => {
					uni.navigateTo({
						url: `/pages/recharge/recharge?storeId=${v3Data.store.storeId}&storeName=${v3Data.store.name}`
					});
				},
				openConment: () => {
					uni.navigateTo({
						url: `/pages/shop/comment?storeId=${v3Data.store.storeId}&type=0`
					});
				},
				minute: (start) => {
					if (start == undefined || start === '') {
						return 0
					}
					let date3 = new Date() - new Date(start.replace(/-/g, '/'))
					let days = Math.floor(date3 / (24 * 3600 * 1000))

					//计算出小时数
					let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
					let hours = Math.floor(leave1 / (3600 * 1000))
					//计算相差分钟数
					let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
					let minutes = Math.floor(leave2 / (60 * 1000))
					//计算相差秒数
					let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
					let result = (days * 24 * 60) + (hours * 60) + minutes
					return result < 0 ? 0 : result
				},
				failure: () => {
					uni.navigateTo({
						url: '/pages/failure/index?type=0&storeId=' + v3Data.store.storeId
					});
				},
				getInfo: (id) => {
					const data = {"msg":"success","code":0,"store":{"storeId":"1509777240680833026","name":"自助洗车西吴店","titleImg":"http://img.iuxiche.com/upload/20220608/4076ba1134434293a61ab185f44df853.jpg","contentImg":"http://img.iuxiche.com/upload/20220401/8dce95bea29b46f2ae07577b5b8aa2ba.jpg,http://img.iuxiche.com/upload/20220401/d13ee7ee08bb4f82be1fff82b88735ec.jpg","stationNum":1,"freeNum":1,"tag":"7元10分钟,超出每分钟0.5元,免费停车2小时,免费加玻璃水,可开着门洗车，需要联系客服","longitude":112.583946,"latitude":37.782399,"address":"市区坞城南路与荣军北街交叉口西南角第17家门店","mobile":"15386999914","scoreNum":"6","scoreSum":"30","createTime":"2022-04-01 14:18:39","state":1,"userId":"1525306704244350977","startAmount":7,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"version":"2149","closeReason":"停水暂停营业","inputSwitch":0,"openConfirm":false,"balanceGran":7},"stations":[{"stationId":"1509777345634902017","name":"1号位","state":0,"deviceId":"100","storeId":"1509777240680833026","startTime":"2022-09-07 13:08:51","titleImg":"http://img.iuxiche.com/upload/20220401/b26f3d6414b04050a6d1a8d1b2851587.jpg","version":"2143"}]}
					v3Data.swiperImgs = data.store.contentImg.split(',').map(e => {
						return {
							src: e
						}
					})
					v3Data.store = data.store
					v3Data.stations = data.stations
					v3Data.showState = true
				},
				getComment: (id) => {
					const data = {"msg":"success","washCards":[{"washCardId":"1527073127424655362","name":"年卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗1小时，超出后0.5元每分钟。","originalPrice":499,"price":380,"num":100,"days":365,"minutes":60,"storeId":"1509777240680833026"},{"washCardId":"1527073127424655365","name":"季卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗40分钟，超出后0.5元每分钟。","originalPrice":188,"price":158,"num":100,"days":90,"minutes":40,"storeId":"1509777240680833026"}],"code":0,"data":{"totalCount":5,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"commentId":"1561662828417396738","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELoPMQ6j5sjxn8SVmthhsF9pqtk5WmVKYBvyCylQVWmJV3F9VKjwAGWY2UibglN7hgN9SNEYick5Rtw/132","mobile":"139****6355","content":"出大门还要停车费","contentImg":"","rate":5,"sort":1,"userId":"1561648657458016258","storeId":"1509777240680833026","orderId":"1561649371089481729","createTime":"2022-08-22 18:33:27"},{"commentId":"1556143147992539137","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM5HAhFMVm8m6Y14feiblGC0R7j1ibx3iagDBUVNBIdSPYpRwTWCiaIiaicuep6JmiaQKqTWpsPfGGic3gdoGQ/132","mobile":"185****5515","content":"可以，使用挺方便，价格确实便宜","contentImg":"","rate":5,"sort":1,"userId":"1509787440305414145","storeId":"1509777240680833026","orderId":"1545999005383725057","createTime":"2022-08-07 13:00:13"},{"commentId":"1526113029488484354","mobile":"138****5408","content":"洗完车后十秒没出门就出不去了，建议延长出门时间30秒比较合适","contentImg":"","rate":5,"sort":1,"reply":"亲，很抱歉给您造成不好的体验，我们会把您的建议及时通知技术人员改进。开关门的默认时间为15秒。在规定时间内没有驶入，只需倒车重新识别即可入场。在规定时间内没有驶出，可再次点击小程序按钮【结算开门】，在50秒内都可以再次开门。即使超过50秒也无须担心，只需拨打门店电话，我们的工作人员会为您及时开门。","userId":"1517112736427823106","storeId":"1509777240680833026","orderId":"1525771815769710593","createTime":"2022-05-16 16:11:15"},{"commentId":"1520379506110521345","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132","mobile":"153****2339","content":"非常好，设施干净，整洁有序，希望大家共同保持良好的洗车环境，人人讲公德，人人享便利。","contentImg":"","rate":5,"sort":1,"userId":"1520355148688285698","storeId":"1509777240680833026","orderId":"1520356759921778690","createTime":"2022-04-30 20:28:16"},{"commentId":"1519661609583153154","avatarUrl":"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132","mobile":"138****5408","content":"场地舒适干净、设备齐全、摆放有序、价格合理，还有赠费，希望能坚持周到的服务！","contentImg":"","rate":5,"sort":1,"userId":"1517112736427823106","storeId":"1509777240680833026","orderId":"1517113132474978306","createTime":"2022-04-28 20:55:36"}]},"goods":[{"id":"1563453153817436162","goodsSn":"F003","storeId":"1509777240680833026","name":"保姆 月嫂 育儿 催乳 ","categoryId":"1563440748819423234","integral":"0","gallery":"http://img.iuxiche.com/upload/20220827/ecdab140201a4cd68407bb93b62a4fbd.jpg","keywords":"","brief":"","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220827/0095bc3aa0a04685837a8fb230e3b6f8.jpg","shareUrl":"","isNew":true,"isHot":true,"owner":true,"unit":"件","counterPrice":8000,"retailPrice":5500,"detail":"<p><img src=\"http://img.iuxiche.com/upload/20220827/afb5f2877a304b719feb7b23326956a6.png\" style=\"max-width:100%;\" contenteditable=\"false\"/><br/><br/><img src=\"http://img.iuxiche.com/upload/20220827/0c253a5da2374948b52b59738c86d510.png\" style=\"max-width:100%;\" contenteditable=\"false\"/><br/><br/></p><p><img src=\"http://img.iuxiche.com/upload/20220827/a089385c14ff4e4b9d86547a31df15c7.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>","createTime":"2022-08-27 17:07:34","updateTime":"2022-08-29 07:57:54","deleted":0,"needAddress":false,"exchange":false,"sales":0,"exchangeBalance":0},{"id":"1563444865189060610","goodsSn":"F002","storeId":"1509777240680833026","name":"家庭保洁 擦玻璃 小时工","categoryId":"1563440748819423234","integral":"0","gallery":"http://img.iuxiche.com/upload/20220827/38cc508f320442f28ae13f6f99ffb47c.jpg","keywords":"","brief":"","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","shareUrl":"","isNew":true,"isHot":true,"owner":true,"unit":"件","counterPrice":299,"retailPrice":29,"detail":"<p><img src=\"http://img.iuxiche.com/upload/20220827/50a475827ad94550881bacb15849927c.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/><br/><img src=\"http://img.iuxiche.com/upload/20220827/2ddd4a5c9ba648f19068b66725deb359.png\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>","createTime":"2022-08-27 16:34:38","updateTime":"2022-08-29 07:57:54","deleted":0,"needAddress":true,"exchange":false,"sales":0,"exchangeBalance":0},{"id":"1562735317117579266","goodsSn":"F008","storeId":"1509777240680833026","name":"APP/小程序/H5 软件定制开发","categoryId":"1562732383935934466","integral":"0","gallery":"http://img.iuxiche.com/upload/20220825/edc7a8c19cff4a189e2c65d71e816c91.png,http://img.iuxiche.com/upload/20220825/f9be3eecdd1f48698c90822a70452b83.png","keywords":"","brief":"敏捷开发/快速交付/质量保证/9年售后","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220825/f9be3eecdd1f48698c90822a70452b83.png","shareUrl":"","isNew":true,"isHot":true,"owner":true,"unit":"件","counterPrice":9999,"retailPrice":100,"detail":"<p><img src=\"http://img.iuxiche.com/upload/20220826/3802f892bec5401393ca442adddc3f18.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/><br/><img src=\"http://img.iuxiche.com/upload/20220826/2bc1339c3e7f45369faf14b11465b466.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>","createTime":"2022-08-25 17:35:08","updateTime":"2022-08-26 12:35:33","deleted":0,"needAddress":false,"exchange":false,"sales":0,"exchangeBalance":0},{"id":"1554318185149362178","goodsSn":"011","storeId":"1509777240680833026","name":"360全包脚垫","categoryId":"1552856133058691074","integral":"0","gallery":"http://img.iuxiche.com/upload/20220802/f91f7cdaceca47a499939a6fa6937ff4.jpeg,http://img.iuxiche.com/upload/20220802/2b263ae9fc484b8b9a93063a63e748f9.jpeg,http://img.iuxiche.com/upload/20220802/afe8a826be754e0490956c5e845eaf18.jpeg,http://img.iuxiche.com/upload/20220802/93b4c063b58a4819bb9a688dadd5c725.jpeg,http://img.iuxiche.com/upload/20220802/6d6a9062b3864a5498614699ab6f7b6f.jpeg","keywords":"各种车型均可定制","brief":"商务百搭柔软舒适，防水易清洗，车型合适，版权齐全，专车制定。","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220802/e6493a34ed1c406883659d27729e043e.jpeg","shareUrl":"","isNew":true,"isHot":true,"owner":false,"unit":"套","counterPrice":580,"retailPrice":480,"detail":"<p>全部专车制定，购买时请确定车型，脚垫材质及颜色，纽约市内我们将上门服务。<img src=\"http://img.iuxiche.com/upload/20220802/35f1f94b664f4bc5a8ba67c5d7376f16.jpeg\" style=\"font-size: 14px; -webkit-text-size-adjust: 109%; max-width: 100%; -webkit-touch-callout: none; -webkit-user-select: none;\"/></p>","createTime":"2022-08-02 12:08:28","updateTime":"2022-08-02 13:14:19","deleted":0,"needAddress":true,"exchange":false,"sales":0,"exchangeBalance":0},{"id":"1553933345921028097","goodsSn":"010","storeId":"1509777240680833026","name":"嘉实多全合成机油","categoryId":"1552856133058691074","integral":"0","gallery":"http://img.iuxiche.com/upload/20220801/bc1b1ef381f34b8f82959e4e906977f7.jpeg,http://img.iuxiche.com/upload/20220801/41f02fb86d1b4d0e944b739b18214994.jpeg,http://img.iuxiche.com/upload/20220801/d1d73ef63c2f445198bb877db9b45858.jpeg","keywords":"嘉实多护磁","brief":"嘉实多全合成机油，送空滤，机虑，空调虑制定地点更换。","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220801/43596b24e8d84a2a98d3c564c8a5ab8c.jpeg","shareUrl":"","isNew":true,"isHot":false,"owner":false,"unit":"桶","counterPrice":428,"retailPrice":360,"detail":"<p>嘉实多护磁全合成机油，送三虑，指定地点更换。</p>","createTime":"2022-08-01 10:39:15","updateTime":"2022-08-01 11:00:18","deleted":0,"needAddress":false,"exchange":false,"sales":0,"exchangeBalance":0},{"id":"1552845669171986434","goodsSn":"001","storeId":"1509777240680833026","name":"10元兑换【西吴店】","categoryId":"1552839764141408258","integral":"2000","gallery":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","keywords":"","brief":"","isOnSale":true,"sortOrder":100,"picUrl":"http://img.iuxiche.com/upload/20220729/54008d7130a14f64849a4ce15bc976a6.png","shareUrl":"","isNew":true,"isHot":true,"owner":false,"unit":"件","counterPrice":0,"retailPrice":0,"detail":"<p data-we-empty-p=\"\" style=\"text-align:center;\">积分获得方式:用户洗车消费1元可得10积分。</p>","createTime":"2022-07-29 10:37:13","updateTime":"2022-08-26 15:43:49","deleted":0,"needAddress":false,"exchange":true,"sales":5,"exchangeBalance":10},{"id":"1563023504247427073","goodsSn":"F688","storeId":"1509777240680833026","name":"24h共享洗车系统 定制开发 品牌打造","categoryId":"1562732383935934466","integral":"0","gallery":"http://img.iuxiche.com/upload/20220826/dc8d5adf199b4e57b55c931e9e13af6c.jpg","keywords":"","brief":"提供成套方案/定制品牌","isOnSale":true,"sortOrder":80,"picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","shareUrl":"","isNew":true,"isHot":true,"owner":true,"unit":"套","counterPrice":49999,"retailPrice":1000,"detail":"<p><img src=\"http://img.iuxiche.com/upload/20220826/d7c75c13468d4e51822934c25d0a646d.jpg\" style=\"max-width:100%;\" contenteditable=\"false\"/></p>","createTime":"2022-08-26 12:40:18","updateTime":"2022-08-28 16:23:51","deleted":0,"needAddress":false,"exchange":false,"sales":0,"exchangeBalance":0}]}
					v3Data.washCards = data.washCards
					v3Data.commentPage = data.data
					v3Data.goods = data.goods
				},
				openMap: () => {
					uni.openLocation({
						latitude: v3Data.store.latitude,
						longitude: v3Data.store.longitude,
						name: v3Data.store.address,
						success: function() {}
					});
				},
				openCall: () => {
					uni.makePhoneCall({
						phoneNumber: v3Data.store.mobile
					}).then(res => {}).catch(err => {})
				},
				navigate: (uri) => {
					uni.navigateTo({
						url: `/pages/${uri}`
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
	.bottom-action {
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
		height: 300rpx;
	}

	.wash-card:last-child {
		margin-bottom: 0;
	}


	.utag {
		color: #FFFFFF;
		font-size: 24rpx;
		background-color: #18bc37;
		margin-top: 10rpx;
		border-radius: 10rpx;
		padding: 10rpx;
		text-align: center;
	}

	.button {
		margin: 0;
		padding: 0;
		font-size: 13px;
		color: #333;
		line-height: 1.8;
		height: 150rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	button::after {
		border: none;
	}
</style>
