<template>
	<view>
		<view :style="{height:safeAreaInsets+100 +'rpx'}"></view>
		<view @click="onClick"
			class="bg-white position-fixed bottom-0 left-0 right-0  d-flex flex-column a-center j-center text-white font-weight">
			<view class="d-flex a-center j-center" :class="bgColor"
				style="width: 90%;border-radius: 50rpx;height: 80rpx;">
				{{buttonName}}
			</view>
			<view :style="{height:safeAreaInsets+20+'rpx'}">
			</view>
		</view>
	</view>
</template>

<script>
	import {
		reactive,
		toRefs,
		onMounted
	} from 'vue'
	export default {
		props: {
			buttonName: {
				type: String,
				default: '确定'
			},
			bgColor: {
				type: String,
				default: 'main-bg-color'
			}
		},
		setup(props, context) {
			const v3Data = reactive({
				onClick: () => {
					context.emit('click')
				},
				fixSize: () => {
					/* const {
						windowWidth,
						windowHeight,
						windowTop,
						safeArea,
						screenHeight,
						safeAreaInsets
					} = uni.getSystemInfoSync()
					// TODO fix by mehaotian 是否适配底部安全区 ,目前微信ios 、和 app ios 计算有差异，需要框架修复
					if (safeArea) {
						// #ifdef MP-WEIXIN
						v3Data.safeAreaInsets = screenHeight - safeArea.bottom
						// #endif
						// #ifndef MP-WEIXIN
						v3Data.safeAreaInsets = safeAreaInsets.bottom
						// #endif
					} */
				}

			})
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	.disable-bg {
		background: rgba(0,0,0,.04);
		color:#6c757d ;
	}
</style>
