<template>
	<view>
		<view class="p-2" v-if="washCards && washCards.length >0">
			<view class="d-flex p-3 a-center rounded-10 mb-2 bg-white position-relative"
				:class="{'select':index == current}" v-for="(item,index) in washCards" :key="item.washCardId"
				@click="current = index">
				<view>
					<view class="font-weight">{{item.name}}</view>
					<view class="my-1 pr-2 text-muted font-sm">{{item.intro}}</view>
					<view><text class="main-text-color font-lg">￥{{item.price}}</text><text
							class="ml-2 font line-through text-light-muted">原价{{item.originalPrice}}</text></view>
				</view>
			</view>
		</view>
		<view class="bg-white">
			<view class="d-flex j-sb py-2 mx-2" @click="navigate('/pages/shop/store-select-list')">
				<text class="text-muted">门店名称</text>
				<view><text class="mr-1">{{storeName === '' ? '请选择':storeName}}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>
			<view class="d-flex j-sb py-2 mx-2" @click="plateSelect('open')">
				<text class="text-muted">选择车牌</text>
				<view><text class="mr-1">{{plateCurrent === '' ? '请选择':plates[plateCurrent].number}}</text>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>
		</view>
		<button-bottom buttonName="立即购买" @click="submit" />
		<uni-popup ref="platePopup" type="bottom">
			<view class="popup-content bg-white" style="border-radius: 20rpx 20rpx 0 0;">
				<view class="d-flex a-center font-weight j-center font-md border-bottom border-light-secondary"
					style="height: 100rpx;">
					请选择车牌
				</view>
				<scroll-view scroll-y="true" class="w-100" style="height: 835rpx;">
					<block v-for="(plate,plateIndex) in plates" :key="plateIndex">
						<view class="d-flex px-5 j-sb line-h-big border-bottom"
							@click.stop="onSelectdPlate(plateIndex)">
							<view>
								{{plate.number}}
							</view>
							<view class="main-text-color">
								选择
							</view>
						</view>
					</block>
				</scroll-view>
				<button-bottom buttonName="添加车牌" @click="navigate('/pages/car/car?type=card')" />
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
				platePopup: null,
				storeId: '',
				storeName: '',
				plateCurrent: '',
				plates: [],
				washCards: [],
				current: 0,
				submit: () => {
					uni.showToast({
						title: "购买成功!"
					})
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				},
				navigate: (uri) => {
					uni.navigateTo({
						url: `${uri}`
					});
				},
				onSelectdPlate: (index) => {
					v3Data.plateCurrent = index
					v3Data.platePopup.close()
				},
				plateSelect: (type) => {
					v3Data.platePopup[type]()
				},
				init: (type) => {
					const data = {"msg":"success","washCards":[{"washCardId":"1527073127424655362","name":"年卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗1小时，超出后0.5元每分钟。","originalPrice":499,"price":380,"num":100,"days":365,"minutes":60,"storeId":"1509777240680833026"},{"washCardId":"1527073127424655365","name":"季卡","intro":"仅限一辆车使用，每天可洗一次，每次可洗40分钟，超出后0.5元每分钟。","originalPrice":188,"price":158,"num":100,"days":90,"minutes":40,"storeId":"1509777240680833026"}],"code":0,"plates":[]}
					v3Data.washCards = data.washCards
					v3Data.plates = data.plates
				}
			})
			onLoad((e) => {
				v3Data.storeId = e.storeId
				v3Data.storeName = e.storeName
				v3Data.current = e.current
				v3Data.init()
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.select {
		border: 1rpx solid #fd680f;
	}
	.select:after {
		bottom: 0px;
		right: 0px;
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: 36px solid #FD680F;
		border-left: 36px solid transparent;
	}
	.select:before {
		content: '';
		position: absolute;
		width: 10px;
		height: 6px;
		background: transparent;
		bottom: 8px;
		right: 5px;
		border: 2px solid white;
		border-top: none;
		border-right: none;
		-webkit-transform: rotate(-55deg);
		-ms-transform: rotate(-55deg);
		transform: rotate(-55deg);
		z-index: 9;
	}
</style>
