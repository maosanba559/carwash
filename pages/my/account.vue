<template>
	<view>
		<noting v-if="accounts.length == 0"></noting>
		<view class="bg-white">
			<view class="p-2 line-h-lg border-bottom" v-for="(item,index) in accounts" :key="item.balancedetailsId">
				<view class="d-flex j-sb">
					<text>{{status(item.type)}}</text>
					<text
						:class="item.type == 3 ?'text-success':'text-danger'">{{item.type >= 3 && item.type < 6?'-':'+'}}{{item.amount}}</text>
				</view>

				<view class="d-flex j-sb text-muted font">
					<text>{{item.createTime}}</text>
					<text>余额 {{item.balance}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
				switch (key) {
					case 0:
						return '充值'
						break;
					case 1:
						return '赠送'
						break;
					case 2:
						return '退款'
						break;
					case 3:
						return '消费'
						break;
					case 4:
						return '退现'
						break;
					case 6:
						return '积分兑换'
						break;
					case 9:
						return '推广提成'
						break;
					case 11:
						return '活动'
						break;
					default:
						break;
				}
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
