<template>
	<view>
		<view class="header main-bg-color">
			<block v-if="mobile !== ''">
				<view class="userinfo">
					<view>
						<button class="avatar-wrapper" @click="getUserProfile">
							<image :src="avatarUrl" class="avatar" lazy-load />
						</button>
					</view>
					<view class="info" @click="getUserProfile(1)">
						<view class="username">{{nickname === ''?'获取微信昵称':nickname}}</view>
					</view>
				</view>
				<view class="ml-auto">
					<button class="font-md" style="padding: 0 50rpx;" @click="navigate('recharge/recharge')">充值</button>
				</view>
				<!-- <view class="setting">
					<image src="../../static/icon/setting.png"></image>
				</view> -->
			</block>
			<block v-else>
				<button class="font-md" style="padding: 0 50rpx;" @click="navigate('login/login')">登录</button>
			</block>
		</view>

		<view class="m-2 bg-white rounded-15 font-weight">
			<view class="px-3 py-2 d-flex a-center j-sb">
				<view>商城订单</view>
				<view class="text-muted font d-flex a-center" @click="toOrder(0)">
					全部订单
					<uni-icons type="right" class="" color="#B2B2B2" />
				</view>
			</view>
			<view class="py-2 d-flex font text-muted">
				<view class="span-5 d-flex flex-column a-center j-center" @click="toOrder(1)">
					<uni-icons type="icon-daifukuan" color="#6c757d" customPrefix="iconfont" :size="28"></uni-icons>
					<view class="mt-1">待付款</view>
				</view>
				<view class="span-5 d-flex flex-column a-center j-center" @click="toOrder(2)">
					<uni-icons type="icon-daishouhuo" color="#6c757d" customPrefix="iconfont" :size="28"></uni-icons>
					<view class="mt-1">待收货</view>
				</view>
				<view class="span-5 d-flex flex-column a-center j-center" @click="toOrder(3)">
					<uni-icons type="icon-31daipingjia" color="#6c757d" customPrefix="iconfont" :size="28"></uni-icons>
					<view class="mt-1">待评价</view>
				</view>
				<view class="span-5 d-flex flex-column a-center j-center" @click="toOrder(4)">
					<uni-icons type="icon-shouhouwuyou" color="#6c757d" customPrefix="iconfont" :size="28"></uni-icons>
					<view class="mt-1">退款/售后</view>
				</view>
			</view>
		</view>
		<view class="bg-white m-2 rounded-15">
			<view class="px-3 py-2 font-weight">
				我的服务
			</view>
			<view class="d-flex font flex-wrap line-h-md2 text-muted font-weight py-2">
				<button class="button text-center span-5 mb-3" @click="navigate('my/balance')">
					<image src="../../static/icon/js.svg" class="svgsmall"></image>
					<view>我的余额</view>
				</button>
				<button class="button text-center span-5 mb-3" @click="navigate('my/user-washcard')">
					<image src="../../static/icon/xck.svg" class="svgsmall"></image>
					<view>洗车卡</view>
				</button>
				<button class="button text-center span-5 mb-3" @click="navigate('my/order-carwash')">
					<image src="../../static/icon/dd.svg" class="svgsmall"></image>
					<view>洗车订单</view>
				</button>
				<button class="button text-center span-5 mb-3" @click="navigate('car/car')">
					<image src="../../static/icon/car.svg" class="svgsmall"></image>
					<view>我的车辆</view>
				</button>
				<button class="button text-center span-5 mb-3" @click="navigate('failure/index?type=1')">
					<view>
						<image src="../../static/icon/bj.svg" class="svgsmall"></image>
					</view>
					意见反馈
				</button>
				<button class="button text-center span-5 mb-3" @click="join">
					<view>
						<image src="../../static/icon/jm.svg" class="svgsmall"></image>
					</view>
					我要加盟
				</button>
				<button class="button text-center span-5 mb-3" @click="navigate('study/study')">
					<view>
						<image src="../../static/icon/jc.svg" class="svgsmall"></image>
					</view>
					洗车帮助
				</button>
				<button class="button text-center span-5 mb-3" open-type="contact">
					<view>
						<image src="../../static/icon/kf.svg" class="svgsmall"></image>
					</view>
					在线客服
				</button>
				<button class="button text-center span-5 mb-1" @click="navigate('share/share')">
					<image src="../../static/icon/share.svg" class="svgsmall"></image>
					<view>分享赚钱</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const mobile = ref('18536745515')
			const avatarUrl = ref('/static/avatar.jpg')
			const nickname = ref('')

			onShow(() => {
				
			})
			const join = () =>{
				uni.makePhoneCall({
					phoneNumber: '18536745515'
				}).then(res => {}).catch(err => {})
			}
			const getUserProfile = (type) => {
				if (nickname.value !== '' && type == 1) {
					return
				}
				uni.getUserProfile({
					desc: '用于在个人中心展示头像',
					success: ({
						userInfo
					}) => {
						nickname.value = userInfo.nickName
						avatarUrl.value = userInfo.avatarUrl

						uni.setStorageSync("nickname", userInfo.nickName);
						uni.setStorageSync("avatarUrl", userInfo.avatarUrl);
					}
				})

			}
			const setUserInfo = () => {
				mobile.value = uni.getStorageSync("mobile");
				avatarUrl.value = uni.getStorageSync("avatarUrl");
				nickname.value = uni.getStorageSync("nickname");
			}
			const navigate = (uri) => {
				uni.navigateTo({
					url: `/pages/${uri}`
				});
			}
			const toOrder = (type) => {
				uni.navigateTo({
					url: `/pages/order/list-order?type=${type}`
				});
			}

			return {
				mobile,
				avatarUrl,
				nickname,
				navigate,
				getUserProfile,
				toOrder,
				join
			}
		}

	}
</script>

<style lang="scss">
	.button {
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		font-size: 12px;
		color: #6c757d;
		line-height: 1.8;
		background-color: #FFFFFF;
	}

	button::after {
		border: none
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
	}

	.avatar-wrapper {
		padding: 0;
		width: 120rpx;
		height: 120rpx;
		border-radius: 100%;
	}

	.header {
		width: 92%;
		height: 300rpx;
		padding: 130rpx 4% 0 4%;
		display: flex;
		align-items: center;

		.userinfo {
			display: flex;
			align-items: center;

			.info {
				line-height: 1.8;
				margin-left: 30rpx;

				.username {
					color: #fff;
					font-size: 30rpx
				}

				.integral {
					text-align: center;
					padding: 5rpx 10rpx;
					color: #fff;
					background-color: rgba(0, 0, 0, 0.1);
					border-radius: 20rpx;
					font-size: 24rpx
				}
			}
		}

		.setting {
			flex-shrink: 0;
			width: 6vw;
			height: 6vw;

			image {
				width: 100%;
				height: 100%
			}
		}
	}
</style>
