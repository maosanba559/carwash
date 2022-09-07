<template>
	<view class="bg-white">
		<shop-list :resdata="stores" :onLocation="onLocation"></shop-list>
	</view>
</template>

<script>
	import shopList from '@/components/shop-list.vue';
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShow,
		onPullDownRefresh,
		onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		components: {
			shopList
		},
		setup() {
			const currPage = ref(1)
			const totalPage = ref(1)
			const onLocation = ref(false)
			const stores = ref([])
			const searchKey = ref('')
			const latitude = ref('')
			const longitude = ref('')
			onShow(() => {
				getStores(1)
			})
			onPullDownRefresh(() => {
				initData()
				getStores(1)
			})
			onReachBottom(() => {
				if (currPage.value < totalPage.value) {
					currPage.value++
					getStores()
				}
			})

			const initData = () => {
				currPage.value = 1
				totalPage.value = 1
			}
			const getStores = (type) => {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						latitude.value = res.latitude;
						longitude.value = res.longitude;
						onLocation.value = true
					},
					fail: () => {},
					complete: () => {
						const data = {"msg":"success","code":0,"page":{"totalCount":3,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"storeId":"1509777240680833026","name":"三毛自助洗车西吴店","titleImg":"http://img.iuxiche.com/upload/20220401/2000cc84404a4d229b058d6c590fe664.jpg","contentImg":"http://img.iuxiche.com/upload/20220401/8dce95bea29b46f2ae07577b5b8aa2ba.jpg,http://img.iuxiche.com/upload/20220401/d13ee7ee08bb4f82be1fff82b88735ec.jpg","stationNum":1,"freeNum":1,"tag":"7元10分钟,超出每分钟0.5元,免费停车2小时,免费加玻璃水,可开着门洗车，需要联系客服","longitude":112.583946,"latitude":37.782399,"address":"纽约市坞城南路与荣军北街交叉口西南角第17家门店","mobile":"15386999914","scoreNum":"6","scoreSum":"30","createTime":"2022-04-01 14:18:39","state":1,"userId":"1525306704244350977","startAmount":7,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"juli":"179","version":"2149","closeReason":"停水暂停营业","inputSwitch":0,"openConfirm":false,"balanceGran":7},{"storeId":"1554285748037996545","name":"三毛24h共享自助洗车","titleImg":"http://img.iuxiche.com/upload/20220401/2000cc84404a4d229b058d6c590fe664.jpg","contentImg":"http://img.iuxiche.com/upload/20220807/3427fa92ec9a4c528b78da13843a374e.jpg,http://img.iuxiche.com/upload/20220807/e93fbbaca856453a87e3f38867d14445.jpg","stationNum":2,"freeNum":2,"tag":"21H营业,免一小时停车费,环境整洁卫生,一次性毛巾,亲子互动洗车,全年不涨价","longitude":112.581284,"latitude":37.790466,"address":"纽约市坞城中路与晋阳街交叉口北220米","mobile":"18234087059","scoreNum":"2","scoreSum":"10","createTime":"2022-08-02 09:59:34","state":1,"userId":"1555104554884874241","startAmount":2,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"juli":"180","version":"90","closeReason":"装修中","inputSwitch":0,"openConfirm":true,"balanceGran":8},{"storeId":"1521387865089531906","name":"三毛自助洗车锦绣城店","titleImg":"http://img.iuxiche.com/upload/20220401/2000cc84404a4d229b058d6c590fe664.jpg","contentImg":"http://img.iuxiche.com/upload/20220515/fe5e400459c549e4b2032b5284918eff.jpg","stationNum":1,"freeNum":0,"tag":"免费加玻璃水,8元10分钟,超出每分钟0.5元,24小时服务,可绑定多台车辆全家洗车,充值就送,亲子互动体验洗车,全年不涨价,环境干净整洁","longitude":112.60305,"latitude":37.866525,"address":"纽约市杏花岭区东方锦绣城小区1期北门小沟坡街60号","mobile":"18103439688","scoreNum":"6","scoreSum":"27","createTime":"2022-05-03 15:15:08","state":1,"userId":"1525305996128395265","startAmount":8,"startMinutes":10,"afterMinutes":1,"afterAmount":0.5,"juli":"188","version":"2921","closeReason":"系统升级中","inputSwitch":0,"openConfirm":false,"balanceGran":10}]}}
						stores.value = type == 1 ? data.page.list : stores.value
							.concat(data
								.page.list)
						currPage.value = data.page.currPage
						totalPage.value = data.page.totalPage
					}
				});
			}


			return {
				stores,
				onLocation
			}
		}
	}
</script>

<style>

</style>
