<template>
	<view>
		<view class="bg-white p-2">
			<textarea v-model="content" :placeholder="placeHolder" maxlength="200" class="w-100" />
		</view>
		<divider></divider>
		<view class="bg-white p-2">
			<input type="text" v-model="mobile" placeholder="请输入您的手机号码(选填)" />
		</view>
		<view>
			<button-bottom @click="submit" buttonName="提交"/>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		watch
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const placeHolder = ref('')
			const content = ref('')
			const mobile = ref('')
			let type = ref(0)
			let storeId = ''
			onLoad((e) => {
				type.value = e.type
				storeId = e.storeId
			})
			watch(type, (newValue, oldValue) => {
				let data = newValue == 0 ? "故障申报" : "意见反馈"
				placeHolder.value = (newValue == 0 ? "请简要描述您遇到的问题，例如:泡沫不足。" : "如果您对我们的服务和价格有任何意见或建议，可反馈给我们!")
				uni.setNavigationBarTitle({
					title: data
				})
			})
			const submit = () => {
				uni.showToast({
					title: '提交成功'
				});
				content.value = ''
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
				}, 1500);
			}
			return {
				content,
				mobile,
				placeHolder,
				submit
			}
		}
	}
</script>

<style>

</style>
