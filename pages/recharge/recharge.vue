<template>
	<view>
		<view class="bg-white">
			<view @click="openStoreSelect">
				<view class="d-flex j-sb py-2 mx-3">
					<text class="text-muted">门店名称</text>
					<view><text class="mr-1">{{storeName === '' ? '请选择':storeName}}</text>
						<uni-icons type="right"></uni-icons>
					</view>
				</view>
				<view class="d-flex j-sb py-2 mx-3">
					<text class="text-muted">门店余额</text>
					<text class="main-text-color">￥{{balance}}</text>
				</view>
			</view>
			<divider />
			<view class="p-3" v-if="storeId !== undefined">
				<view class="mb-5" v-if="inputSwitch == 1">
					<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem"
						activeColor="#FD6801" />
				</view>
				<view>
					<view class="d-flex flex-wrap" v-if="current == 0">
						<block v-for="(item,index) in recharges" :key="item.rechargeId">
							<view class="flex-wrap d-flex position-relative span24-8 font-weight mb-1"
								@click="selectAmount(item.amount)">
								<view
									class="rounded mr-2 mb-1 rounded-10 w-100 text-center font-md d-flex a-center j-center"
									style="background-color:rgb(255, 247, 242);height: 150rpx;color: rgb(255, 116, 13);">
									{{item.amount}}元
								</view>
								<view v-if="item.giftAmount > 0"
									style="position: absolute;border-top-left-radius: 10rpx;border-bottom-right-radius: 10rpx;background-color: #ff7e29;"
									class="px-1 text-white font-sm">送{{item.giftAmount}}元</view>
							</view>
						</block>
					</view>
					<view class="p-3" v-else>
						<view class="d-flex font-md a-center">
							¥<input type="number" v-model="amount" placeholder="输入充值金额" class="ml-2 py-2 flex-1" />
						</view>
					</view>
				</view>
			</view>
			<block v-if="washCards && washCards.length >0">
				<divider />
				<view class="d-flex p-3 a-center border-bottom border-light-secondary" v-for="(item,index) in washCards"
					:key="item.washCardId" @click="openWashCard(index)">
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
			</block>
		</view>
		<view>
			<button-bottom @click="toggle" buttonName="立即充值" />
		</view>
		<uni-popup ref="popup" @change="change" type="bottom" :safeArea="false">
			<view class="popup-content bg-white" style="border-radius: 20rpx 20rpx 0 0;">
				<view @click="closePopup">
					<uni-icons type="closeempty" size="20" class="p-3 position-absolute"></uni-icons>
				</view>
				<view class="text-center py-1 border-bottom">
					<view class="py-2 font-weight main-text-color">¥{{amount}}</view>
				</view>
				<scroll-view scroll-y="true" style="background-color: #F6FAFD;height: 835rpx;">
					<view class="text-muted p-3">
						<rich-text :nodes="protocol"></rich-text>
					</view>
				</scroll-view>
				<button-bottom buttonName="立即充值" @click="submit" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const v3Data = reactive({
				popup: null,
				balance: 0,
				protocol: '',
				recharges: [],
				washCards: [],
				storeId: '',
				storeName: '',
				amount: '',
				current: 0,
				items: ['快捷充值', '输入金额'],
				inputSwitch: 0,
				onClickItem: (e) => {
					v3Data.current = e.currentIndex
				},
				openStoreSelect: () => {
					uni.navigateTo({
						url: '/pages/shop/store-select-list'
					});
				},
				openWashCard: (index) => {
					uni.navigateTo({
						url: `/pages/washcard/washcard?storeId=${v3Data.storeId}&storeName=${v3Data.storeName}&current=${index}`
					});
				},
				submit: () => {
					uni.showToast({
						title: "充值成功!"
					})
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				},
				init: () => {
					v3Data.current = 0
					if (v3Data.storeId === undefined || v3Data.storeId === '') {
						return
					}
					const data = {"msg":"success","washCards":[{"washCardId":"1527073127424655362","name":"年卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗1小时，超出后0.5元每分钟。","originalPrice":499,"price":380,"num":100,"days":365,"minutes":60,"storeId":"1509777240680833026"},{"washCardId":"1527073127424655365","name":"季卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗40分钟，超出后0.5元每分钟。","originalPrice":188,"price":158,"num":100,"days":90,"minutes":40,"storeId":"1509777240680833026"}],"recharges":[{"rechargeId":"1510084848709120001","amount":50,"giftAmount":5,"storeId":"1509777240680833026"},{"rechargeId":"1503329981210038274","amount":80,"giftAmount":20,"storeId":"1509777240680833026"},{"rechargeId":"1536364481821556737","amount":100,"giftAmount":30,"storeId":"1509777240680833026"},{"rechargeId":"1503330005054656513","amount":200,"giftAmount":70,"storeId":"1509777240680833026"},{"rechargeId":"1503330035039735810","amount":500,"giftAmount":300,"storeId":"1509777240680833026"}],"protocol":"<p style=\"text-align:left;\"><b>用户直冲门店，平台不做托管</b><br/><br/>欢迎您使用UU三毛自助洗车平台提供的网站、软件及服务！<br/><br/>1. 服务条款的接受与修改<br/><br/>1.1.<br/><br/>在同意本协议前，请您认真阅读并充分知悉平台的各项规则及要求，以及国家关于该类互联网信息服务的法律法规等。 除非您已阅读并接受本协议所有条款，否则您无权使用本平台及相关服务。您的使用、登录等行为即视为您已阅读并同意本协议的约束。<br/><br/>1.2.<br/><br/>本协议的条款可由UU三毛自助洗车平台随时变更，用户须定期审阅本协议。本协议条款一旦发生变动，UU三毛自助洗车平台将在相关页面上提示变更内容或以其他方式进行公告。变更后的协议一经公布即有效代替原来的协议。用户如不同意UU三毛自助洗车平台对本协议所作的任何变更，应立即停止使用UU三毛自助洗车平台提供的相关服务。如用户在本协议变更后继续使用UU三毛自助洗车平台相关服务的，即视为用户已完全同意变更后的协议。<br/><br/>1.3.<br/><br/>您确认，在选择本协议项下充值服务时，您应当是具备民事行为能力和拥有完全民事权利能力的自然人。若您是未成年人，应在法定监护人陪同下审阅和履行。您在享受UU三毛自助洗车平台提供的增值服务时必须完全、严格遵守本协议条款。</p>","code":0,"balance":"9262.50","inputSwitch":0,"storeName":"三毛自助洗车西吴店"}
					v3Data.balance = data.balance
					v3Data.recharges = data.recharges
					v3Data.protocol = data.protocol
					v3Data.inputSwitch = data.inputSwitch
					v3Data.storeName = data.storeName
					v3Data.washCards = data.washCards
				},
				selectAmount: (e) => {
					v3Data.amount = e
					v3Data.toggle()
				},
				toggle: () => {
					if (v3Data.storeId === undefined || v3Data.storeId === '') {
						return uni.showToast({
							title: '请选择您要充值的门店',
							icon: 'none'
						});
					}
					if (v3Data.amount == '' || v3Data.amount <= 0) {
						return uni.showToast({
							title: '金额不能为空',
							icon: 'none'
						});
					}
					v3Data.popup.open()
				},
				closePopup: () => {
					v3Data.popup.close()
				},
				change: (e) => {
					if (!e.show) {
						v3Data.amount = ''
					}
				}
			})
			onLoad((e) => {
				v3Data.storeId = e.storeId
				v3Data.storeName = e.storeName
				v3Data.init()
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>

</style>
