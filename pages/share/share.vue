<template>
	<view class="font">
		<view class="d-flex j-sb a-center w-100 bg-white py-5" v-if="userId">
			<button class="button d-flex span-10 flex-column a-center" open-type="share">
				<circle-icon iconType="weixin" bgClass="bg-weixin" :iconSize="30" :h="80" />
				<text class="mt-2 font-md">微信邀请</text>
				<text class="mt-1 text-secondary">成功率高</text>
			</button>
			<button class="button d-flex span-10 flex-column a-center" @click="shareQR">
				<circle-icon iconType="scan" :iconSize="30" :h="80" />
				<text class="mt-2 font-md">二维码分享</text>
				<text class="mt-1 text-secondary">覆盖面广</text>
			</button>
		</view>
		<view class="text-secondary px-3 py-2">
			通过分享链接或二维码注册用户，首笔充值{{percentage}}%作为提成充值到您对应的门店账户
		</view>
		<view class="bg-white p-2 text-center">
			<view class="font-weight">我的邀请</view>
			<view class="d-flex a-center mt-2">
				<view class="span-10 text-center border-right">
					<view class="text-secondary">累计赚取提成(元)</view>
					<view class="mt-1">{{sumAmount}}</view>
				</view>
				<view class="span-10 ">
					<view class="text-secondary">累计邀请好友(人)</view>
					<view class="mt-1">{{sumPeople}}</view>
				</view>
			</view>
			<view class="text-center border-top mt-2 pt-2">
				<view class="d-flex a-center text-secondary">
					<view class="span24-8">手机号</view>
					<view class="span24-8">佣金</view>
					<view class="span24-8">注册日期</view>
				</view>
				<view class="d-flex a-center py-1" v-for="(item,index) in levels" :key="item.id">
					<view class="span-10">{{item.mobile}}</view>
					<view class="span-10">{{item.amount}}</view>
					<view class="span-10">{{item.createTime}}</view>
				</view>
				<noting v-if="levels.length == 0"></noting>
			</view>
		</view>
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
		onShareAppMessage
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.getData()
			})
			onShareAppMessage(() => {
				return {
					title: '三毛自助洗车',
					desc: '一起来体验吧'
				}

			})

			const v3Data = reactive({
				userId: '',
				qrUrl: '',
				levels: '',
				sumAmount: '',
				sumPeople: '',
				percentage: '',
				shareQR: () => {
					uni.showModal({
						content: '图片自定义',
						showCancel: false,
						confirmText: '确定',
						success: res => {
						},
					});
				},
				
				getData: () => {
					const data = {"msg":"success","code":0,"percentage":"10","userId":"1509782148540801026","levels":[],"sumAmount":0}
					v3Data.userId = data.userId
					v3Data.levels = data.levels
					v3Data.sumAmount = data.sumAmount
					v3Data.sumPeople = data.levels.length
					v3Data.qrUrl = data.qrUrl
					v3Data.percentage = data.percentage
				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.bg-weixin {
		background-color: #56bb39;
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
