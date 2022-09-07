<template>
	<view>
		<view class="m-2" v-for="(item,index) in goods" :key="index">
			<goods-list-item :item="item" />
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
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.activityId = e.activityId
				uni.setNavigationBarTitle({
					title: e.name
				})
				v3Data.getData()
			})
			const v3Data = reactive({
				activityId: '',
				goods: [],
				getData() {
					const data = {"msg":"success","code":0,"list":[{"activityId":"1563446385888501761","type":0,"goodsId":"1563444865189060610","reason":"","createTime":"2022-08-27 16:40:53","picUrl":"http://img.iuxiche.com/upload/20220827/cd904cccb8ee4cbb9de46645a090c106.jpg","name":"家庭保洁 擦玻璃 小时工","retailPrice":"29.00","counterPrice":"299.00","integral":0,"isHot":1,"isNew":1,"owner":1},{"activityId":"1563446385888501761","type":0,"goodsId":"1563453153817436162","reason":"多年行业经验/值得信赖","createTime":"2022-08-27 17:09:37","picUrl":"http://img.iuxiche.com/upload/20220827/0095bc3aa0a04685837a8fb230e3b6f8.jpg","name":"保姆 月嫂 育儿 催乳 ","retailPrice":"5500.00","counterPrice":"8000.00","integral":0,"isHot":1,"isNew":1,"owner":1}]}
					v3Data.goods = data.list
				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>

</style>
