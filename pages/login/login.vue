<template>
	<view>
		<view class="h-100 d-flex j-center a-center">
			<view style="width: 80%;">
				<button class="py-1" type="primary" @click="login">微信用户一键登录</button>
			</view>
		</view>
		<view class="font text-light-muted position-fixed left-0 right-0 text-center" style="bottom: 30rpx;">
			<view class="ml-1 ">登录表示您已阅读并同意<text class="text-primary" >《服务协议》</text>、<text
					class="text-primary" >《隐私政策》</text></view>
			<view class="">若您不同意，请勿进行后续操作</view>
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
			const redictUri = ref('')
			const js_code = ref('')
			const pid = ref(0)
			onLoad((e)=>{
				redictUri.value = decodeURIComponent(e.redictUri)
				let cachePid =  uni.getStorageSync('pid')
				if(cachePid){
					pid.value = cachePid
				}
			})
			const login =()=> {
				uni.setStorageSync("token","admin")
				uni.navigateBack({
					delta: 1
				});
			}
			
			return{login}
		}
	}
</script>

<style scoped>

</style>
