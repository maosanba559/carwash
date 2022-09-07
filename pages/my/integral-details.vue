<template>
	<view>
		<noting v-if="accounts.length == 0"></noting>
		<view class="bg-white">
			<view class="p-2 line-h-lg border-bottom" v-for="(item,index) in accounts" :key="item.id">
				<view class="d-flex j-sb">
					<text>{{status(item.type)}}</text>
					<text
						:class="item.type >=201 ?'text-success':'text-danger'">{{item.type >= 201?'-':'+'}}{{item.integral}}</text>
				</view>

				<view class="d-flex j-sb text-muted font">
					<text>{{item.createTime}}</text>
					<text>积分 {{item.integralBalance}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const statusMap = {
		101: '消费奖励',
		102: '管理员增加',
		103: '年卡奖励',
		104: '商城退返',
		105: '兑换商品退还',
		201: '系统扣除',
		202: '兑换余额',
		203: '兑换商品',
		204: '洗车订单退款'
	}
	export default {
		data() {
			return {
				accounts: [],
				dataForm: {
					page: 1,
					storeId: ''
				},
				totalPage: 1
			}
		},
		onLoad(e) {
			this.dataForm.storeId = e.storeId
			this.getAccounts()
			uni.setNavigationBarTitle({
				title: e.storeName
			})
		},
		onPullDownRefresh() {
			this.initData()
			this.getAccounts(1)
		},
		onReachBottom() {
			if (this.dataForm.page < this.totalPage) {
				this.dataForm.page++
				this.getAccounts()
			}
		},
		methods: {
			status(key) {
				return statusMap[key];
			},
			initData() {
				this.dataForm.page = 1
				this.totalPage = 1
			},
			getAccounts(type) {
				
			}
		}
	}
</script>

<style>

</style>
