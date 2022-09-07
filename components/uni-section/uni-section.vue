<template>
	<view class="uni-section rounded-15 mx-2 pb-2">
		<view class="uni-section-header" nvue>
			<view v-if="type" class="uni-section__head">
				<view :class="type" class="uni-section__head-tag"></view>
			</view>
			<view class="uni-section__content j-sb">
				<text :class="{'distraction':!subTitle}" :style="{color:color}" class="uni-section__content-title">{{ title }}</text>
				<view v-if="subTitle" class="font-sm text-muted" @click="onClick">{{ subTitle }} <uni-icons type="right" color="#6c757d" size="14"></uni-icons></view>
			</view>
		</view>
		<view :class="{'px-3 pb-3':padding}">
			<slot/>
		</view>
	</view>
</template>

<script>

	/**
	 * Section 标题栏
	 * @description 标题栏
	 * @property {String} type = [line|circle] 标题装饰类型
	 * 	@value line 竖线
	 * 	@value circle 圆形
	 * @property {String} title 主标题
	 * @property {String} subTitle 副标题
	 */

	export default {
		name: 'UniSection',
		emits:['click'],
		props: {
			type: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: ''
			},
			color:{
				type: String,
				default: '#333'
			},
			subTitle: {
				type: String,
				default: ''
			},
			padding: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {}
		},
		watch: {
			title(newVal) {
				if (uni.report && newVal !== '') {
					uni.report('title', newVal)
				}
			}
		},
		methods: {
			onClick() {
				this.$emit('click')
			}
		}
	}
</script>
<style lang="scss" >
	$uni-primary: #2979ff !default;
	
	.uni-section {
		background-color: #fff;
		// overflow: hidden;
	}
	.uni-section-header {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 24rpx 0;
		// height: 50px;
		font-weight: normal;
	}
	.uni-section__head {
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.line {
		height: 12px;
		background-color: $uni-primary;
		border-radius: 10px;
		width: 4px;
	}

	.circle {
		width: 8px;
		height: 8px;
		border-top-right-radius: 50px;
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
		border-bottom-right-radius: 50px;
		background-color: $uni-primary;
	}

	.uni-section__content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
	}

	.uni-section__content-title {
		font-size: 15px;
		font-weight: bold;
		color: $uni-primary;
	}

	.distraction {
		flex-direction: row;
		align-items: center;
	}
	
</style>
