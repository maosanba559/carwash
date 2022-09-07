<template>
	<view>
		<index-skeleton v-if="skeletonShow"></index-skeleton>
		<view v-else>
			<swiper-image :resdata="swiperImgs" :height="350" rounded padding></swiper-image>
			<view v-if="notice" class="m-2 font-md pl-2 d-flex a-center rounded-15 font-weight" @click="noticeClick"
				style="background-color: #FFF9EA;color: #FF9A43;">
				<uni-icons type="sound" color="#FF9A43" :size="20"></uni-icons>
				<text class="ml-2">{{notice.title}}</text>
				<view @click.stop="closeNotice" class="p-3 ml-auto">
					<uni-icons type="closeempty" color="#FF9A43" :size="16" />
				</view>
			</view>
			<view class="mt-2">
				<view class="mx-2 d-flex font-md font-weight bg-white a-center j-center rounded-20 "
					style="height: 160rpx;">
					<view class="text-center flex-1" @click="navigate('recharge/recharge')">
						<image src="../../static/icon/cz.svg" class="svgsmall"></image>
						<view>充值缴费</view>
					</view>
					<view class="text-center flex-1" @click="navigate('car/car')">
						<image src="../../static/icon/car.svg" class="svgsmall"></image>
						<view>添加车辆</view>
					</view>
					<view class="text-center flex-1" @click="goOut">
						<image src="../../static/icon/js.svg" class="svgsmall"></image>
						<view>结算开门</view>
					</view>
					<view class="text-center flex-1" @click="navigate('study/study')">
						<image src="../../static/icon/jc.svg" class="svgsmall"></image>
						<view>如何洗车</view>
					</view>
				</view>
				<divider />
				<uni-section title="附近门店">
					<shop-list :resdata="stores" :onLocation="onLocation"></shop-list>
				</uni-section>
				<divider />
				<view v-if="goods && goods.length > 0">
					<view class="p-2 text-center text-muted">商品推荐</view>
					<goods-item :list="goods"/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const data = {"msg":"success","swipers":[{"rotationId":"152822970","url":"http://img.iuxiche.com/upload/20220826/262e94a4ca744870b8ac18e12378fb12.jpg","path":"/pages/goods/activity-goods?activityId=1563029226121138178&name=精选","type":"0"},{"rotationId":"156344679","url":"http://img.iuxiche.com/upload/20220827/4e2c398030af48d6a0a7c7ec20ded4ef.jpg","path":"/pages/goods/activity-goods?","type":"0"}],"code":0,"stores":[{"storeId":"1509777240680833026","name":"自助洗车西吴店","titleImg":"http://img.iuxiche.com/upload/20220401/2000cc84404a4d229b058d6c590fe664.jpg","contentImg":"http://img.iuxiche.com/upload/20220401/8dce95bea29b46f2ae07577b5b8aa2ba.jpg,http://img.iuxiche.com/upload/20220401/d13ee7ee08bb4f82be1fff82b88735ec.jpg","stationNum":1,"freeNum":1,"tag":"7元10分钟,超出每分钟0.5元,免费停车2小时,免费加玻璃水,可开着门洗车，需要联系客服","longitude":112.583946,"latitude":37.782399,"address":"北街交叉口西南角第17家门店","mobile":"18536745515","scoreNum":"6","scoreSum":"30","createTime":"2022-04-01 14:18:39","state":1,"userId":"55","startAmount":7,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"juli":"179","version":"2149","closeReason":"停水暂停营业","inputSwitch":0,"openConfirm":false,"balanceGran":7},{"storeId":"1509777240680833026","name":"自助洗车西吴店","titleImg":"http://img.iuxiche.com/upload/20220401/2000cc84404a4d229b058d6c590fe664.jpg","contentImg":"http://img.iuxiche.com/upload/20220401/8dce95bea29b46f2ae07577b5b8aa2ba.jpg,http://img.iuxiche.com/upload/20220401/d13ee7ee08bb4f82be1fff82b88735ec.jpg","stationNum":1,"freeNum":0,"tag":"7元10分钟,超出每分钟0.5元,免费停车2小时,免费加玻璃水,可开着门洗车，需要联系客服","longitude":112.583946,"latitude":37.782399,"address":"北街交叉口西南角第17家门店","mobile":"18536745515","scoreNum":"6","scoreSum":"30","createTime":"2022-04-01 14:18:39","state":1,"userId":"1525306704244350977","startAmount":7,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"juli":"179","version":"2149","closeReason":"停水暂停营业","inputSwitch":0,"openConfirm":false,"balanceGran":7}],"goods":[{"id":"1563453153817436162","activityId":"1552863962633076737","type":5,"goodsId":"1563453153817436162","reason":"","createTime":"2022-08-27 17:11:22","picUrl":"http://img.iuxiche.com/upload/20220827/0095bc3aa0a04685837a8fb230e3b6f8.jpg","name":"保姆 月嫂 育儿 催乳 ","retailPrice":"5500.00","counterPrice":"8000.00","integral":0},{"id":"1563444865189060610","activityId":"1552863962633076737","type":5,"goodsId":"1563444865189060610","reason":"山西连锁/专业服务","createTime":"2022-08-27 16:38:46","picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","name":"家庭保洁 擦玻璃 小时工","retailPrice":"29.00","counterPrice":"299.00","integral":0},{"id":"1563023504247427073","activityId":"1552863962633076737","type":5,"goodsId":"1563023504247427073","reason":"","createTime":"2022-08-26 12:46:54","picUrl":"http://img.iuxiche.com/upload/20220826/29a6e872425e496aa88375562accf50c.jpg","name":"24h共享洗车系统 定制开发 品牌打造","retailPrice":"1000.00","counterPrice":"49999.00","integral":0}]}
	import {
		checkout
	} from '@/common/lib/myTools'
	import shopList from '@/components/shop-list.vue';
	import indexSkeleton from '@/components/index-skeleton.vue'
	import {
		reactive,
		toRefs
	} from 'vue'
	import {
		onLoad,
		onShow
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const v3Data = reactive({
				goods: [],
				notice: '',
				storageNoticeId: '',
				skeletonShow: true,
				onLocation: false,
				stores: [],
				swiperImgs: [],
				latitude: '',
				longitude: '',
				noticeClick: () => {
					uni.navigateTo({
						url: v3Data.notice.path ? v3Data.notice.path :
							'/pages/notice/detail?noticeId=' +
							v3Data.notice.noticeId
					});
				},
				getData: () => {
					uni.getLocation({
						type: 'gcj02',
						success: res => {
							v3Data.latitude = res.latitude;
							v3Data.longitude = res.longitude;
							v3Data.onLocation = true
						},
						fail: () => {},
						complete: () => {
								v3Data.stores = data.stores
								v3Data.swiperImgs = data.swipers.map(e => {
									return {
										src: e.url,
										path: e.path
									}
								})
								if (!v3Data.storageNoticeId || v3Data
									.storageNoticeId !== data.notice.noticeId
								) {
									v3Data.notice = data.notice
								}
								v3Data.skeletonShow = false
								v3Data.goods = data.goods
						}
					});

				},
				closeNotice() {
					let id = v3Data.notice.noticeId
					v3Data.storageNoticeId = id
					uni.setStorageSync('noticeId', id)
					v3Data.notice = null
				},
				goOut: () => {
					checkout()
				},
				navigate: (uri) => {
					uni.navigateTo({
						url: `/pages/${uri}`
					});
				}
			})
			onLoad((e) => {
				v3Data.storageNoticeId = uni.getStorageSync('noticeId')
				if (e.storeId != undefined) {
					uni.navigateTo({
						url: '/pages/shop/shopdetail?storeId=' + e.storeId
					});
				}
				if (e.scene) {
					let scene = decodeURIComponent(e.scene).split("=");
					if(scene[0] === 'userId'){
						uni.setStorageSync("pid",scene[1])
					}else if(scene[0] === 'activityId'){
						uni.navigateTo({
							url: `/pages/activity/activity?aid=${scene[1]}`
						});
					}
				}

			});
			onShow(() => {
					v3Data.getData()
			})

			return {
				...toRefs(v3Data)
			}
		},
		components: {
			shopList,
			indexSkeleton
		}
	}
</script>

<style>
	.uni-section-header {
		padding: 24rpx 20rpx 0 20rpx !important;
	}
</style>
