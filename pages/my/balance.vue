<template>
	<view>
		<noting v-if="balances.length == 0"></noting>
		<view class="bg-white">
			<view class="p-2 border-bottom " v-for="(item,index) in balances" :key="item.storeId">
				<view class="d-flex j-sb line-h-lg" @click="naviToStore(item.storeId)">
					<view class="font-weight">
						{{item.storeName}}
					</view>
					<uni-icons type="right" color="#B2B2B2" />
				</view>
				<view class="d-flex j-sb text-muted a-center line-h-lg">
					<view>余额：<text class="main-text-color">￥{{item.balance}}</text></view>
					<view>积分：<text class="main-text-color">{{item.integral}}</text></view>
				</view>
				<view class="mt-2 text-right">
					<button type="default" size="mini" class="mr-2" @click="naviToAccount(item)">余额明细</button>
					<button type="default" size="mini" class="mr-2" @click="naviToIntegral(item)">积分明细</button>
					<button type="default" size="mini"  @click="naviToStoreGoods(item)">积分兑换</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup(){
			const balances = ref([])
			onLoad(()=>{
				getAccounts()
			})
			const naviToStore =(storeId) =>{
				uni.showToast({
					title: '跳转页面',
					icon: 'none'
				});
			}
			const naviToAccount =(item) =>{
				uni.showToast({
					title: '跳转页面',
					icon: 'none'
				});
			}
			const naviToIntegral =(item) =>{
				uni.showToast({
					title: '跳转页面',
					icon: 'none'
				});
			}
			const naviToStoreGoods =(item) =>{
				uni.showToast({
					title: '跳转页面',
					icon: 'none'
				});
			}
			const getAccounts =(type) => {
				const data = {"msg":"success","balances":[{"storeId":"1509777240680833026","balance":9262.5,"storeName":"三毛自助洗车西吴店","integral":"17345"},{"storeId":"1521387865089531906","balance":2,"storeName":"三毛自助洗车锦绣城店","integral":"0"}],"code":0}
				balances.value = data.balances
			}
			return{balances,naviToStore,naviToAccount,naviToIntegral,naviToStoreGoods}
		}
		
	}
</script>

<style>

</style>
