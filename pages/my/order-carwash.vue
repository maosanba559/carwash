<template>
	<view>
		<view class="bg-white" v-if="orders.length > 0">
			<view class="px-3 py-2 line-h-lg border-bottom" v-for="(item,index) in orders" :key="item.carorderId">
				<view class="uni-h5">{{item.storeName}}</view>
				<view class="d-flex j-sb font">
					<text class=""><text class="text-muted">开始时间：</text>{{item.createTime}}</text>
						<text class=""><text class="text-muted">服务时长：</text>{{minute(item.createTime,item.endTime)}}分钟</text>
				</view>
				<view class="d-flex j-sb font">
					<text><text class="text-muted">金额：</text>{{item.amount}} 元</text>
					<text :class="item.state==0?'text-primary':item.state==1?'text-success':'text-danger'">{{status(item.state)}}</text>
				</view>
				<view class="d-flex j-end pt-2" v-if="!item.commentId && item.state == 1">
					<view class="px-3 font main-text-color" style="border-radius: 30rpx;border: 1rpx solid #FD6801;"
					@click="openComment(item.carorderId)">评价</view>
				</view>
			</view>
		</view>
		<noting v-else />
	</view>
</template>

<script>
	import {
		ref,reactive
	} from 'vue'
	import {
		onLoad,onPullDownRefresh,onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const orders = ref([])
			const dataForm = reactive({
				page: 1
			})
			const totalPage = ref(1)
			onLoad(()=>{
				getOrders()
			})
			onPullDownRefresh(()=> {
				initData()
				getOrders(1)
			})
			onReachBottom(()=> {
				if (dataForm.page < totalPage.value) {
					dataForm.page++
					getOrders()
				}
			})
			const status=(key) => {
				switch (key) {
					case 0:
						return '服务中'
						break;
					case 1:
						return '已完成'
						break;
					case 2:
						return '已退款'
						break;
					case 3:
						return '已取消'
						break;
					default:
						break;
				}
			}
			const openComment =(orderId) =>{
				uni.navigateTo({
					url: `/pages/my/editcomment?orderId=${orderId}&type=0`
				});
			}
			const updateComment = (oid) =>{
				//改变order页状态
				let obj = orders.value.find(e => {
					return e.carorderId === oid
				})
				obj.commentId = 8
			}
			const initData =()  =>{
				dataForm.page = 1
				totalPage.value = 1
			}
			const minute = (start, end) => {
				if(end == undefined){
					end = new Date().toString()
				}
				let date3 = Date.parse(new Date(end.replace(/-/g, '/'))) - Date.parse(new Date(start.replace(/-/g, '/')))
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
			}
			const getOrders =(type) =>{
				const data = {"msg":"success","code":0,"page":{"totalCount":174,"pageSize":10,"totalPage":18,"currPage":1,"list":[{"carorderId":"1564595731484942337","storeName":"三毛自助洗车西吴店","amount":22.5,"endTime":"2022-08-30 21:29:21","createTime":"2022-08-30 20:47:46","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1561249234152337409","storeName":"三毛自助洗车西吴店","amount":20.5,"endTime":"2022-08-21 15:47:46","createTime":"2022-08-21 15:09:59","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1559389974577553410","storeName":"三毛自助洗车西吴店","amount":7,"endTime":"2022-08-16 12:02:41","createTime":"2022-08-16 12:01:57","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1559387512017788930","storeName":"三毛自助洗车西吴店","amount":7,"endTime":"2022-08-16 12:01:02","createTime":"2022-08-16 11:52:10","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1558802426243325954","storeName":"三毛自助洗车西吴店","amount":11,"endTime":"2022-08-14 21:25:54","createTime":"2022-08-14 21:07:14","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1558793070604984321","storeName":"三毛自助洗车西吴店","amount":7,"endTime":"2022-08-14 20:32:05","createTime":"2022-08-14 20:30:04","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1557981625273294850","storeName":"三毛自助洗车西吴店","amount":32,"endTime":"2022-08-12 15:45:44","createTime":"2022-08-12 14:45:40","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1557661362853781505","storeName":"三毛自助洗车西吴店","amount":14.5,"endTime":"2022-08-11 17:58:25","createTime":"2022-08-11 17:33:04","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"},{"carorderId":"1555954070089424897","storeName":"三毛自助洗车西吴店","amount":0,"createTime":"2022-08-07 00:28:53","state":3,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","plateId":"1524953045409067009","version":"1","washCardId":"1528201948472365058"},{"carorderId":"1553954204517781505","storeName":"三毛自助洗车西吴店","amount":18.5,"endTime":"2022-08-01 12:35:54","createTime":"2022-08-01 12:02:08","state":1,"storeId":"1509777240680833026","storeStationId":"1509777345634902017","userId":"1509782148540801026","commentId":"-1","version":"1"}]}}
				if (data.code == 0) {
					orders.value = type == 1 ? data.page.list : orders.value.concat(data.page.list)
					dataForm.page = data.page.currPage
					totalPage.value = data.page.totalPage
				} else {
					initData()
				}
			}
			return {orders,openComment,minute,status,updateComment}
		}
		
	}
</script>

<style>

</style>
