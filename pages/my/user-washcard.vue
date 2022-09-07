<template>
	<view>
		<view class="p-3" v-if="washCards.length > 0">
			<view class="p-2 a-center rounded-10 mb-2 bg-white position-relative" v-for="(item,index) in washCards"
				:key="item.tbUserWashCardId">
				<view>
					<view class="d-flex j-sb">
						<text>{{item.cardName}}</text>
						<view>{{item.plateNum}}</view>
					</view>
				</view>
				<view class="my-1 text-muted font">到期时间：{{item.endTime}}</view>
				<view class="text-muted font-sm">说明：每天可洗一次，每次时长为{{item.minutes}}分钟。</view>
				<view class="d-flex j-end" @click="naviToStore(item.storeId)">
					<text class="main-bg-color py-1 px-2 rounded-20 text-white font">查看门店</text>
				</view>
			</view>
		</view>
		<view v-else class="h-100 d-flex flex-column a-center j-center">
			<view class="text-light-muted">空空如也~</view>
			<view class="main-bg-color py-2 text-white font-lg mt-2 text-center" style="width: 300rpx;border-radius: 50rpx;"
			@click="openWashCard">前往挑选</view>
		</view>
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
				washCards: [],
				getUserWashCards: () => {
					const data = {"msg":"success","code":0,"userWashCards":[{"tbUserWashCardId":"1528201948472365058","cardName":"年卡","plateNum":"晋A88888","userId":"1509782148540801026","storeId":"1509777240680833026","createTime":"2022-05-22 10:31:52","endTime":"2022-08-07 01:03:50","minutes":60}]}
					v3Data.washCards = data.userWashCards
				},
				naviToStore: (storeId) => {
					uni.navigateTo({
						url: '/pages/shop/shopdetail?storeId=' + storeId
					});
				},
				openWashCard: () => {
					uni.navigateTo({
						url: '/pages/washcard/washcard'
					});
				}
			})
			onLoad(() => {
				v3Data.getUserWashCards()
			})
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>

</style>
