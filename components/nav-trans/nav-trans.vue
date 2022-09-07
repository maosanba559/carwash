<template>
	<view>
		<view class="top_navbar">
			<view v-if="bgFixed" :style="{height:totalHeight + 'px'}"></view>
			<view class="top_pos" :style="{height:totalHeight + 'px',backgroundColor:bgColor}"></view>
			<view class="navbar-fixed" :style="`background: rgba(255, 255, 255, ${navOp});`">
				<view :style="'height:' + statusBarHeight + 'px;'"></view>
				<view class="navbar-content" :style="'height:' + navBarHeight + 'px;'+'width:'+windowWidth+'px;'">
					<view class="d-flex w-100">
						<view @tap="onClickLeft" class="uni-navbar__header-btns uni-navbar__header-btns-left"
							:style="{width:leftWidth}">
							<slot name="left">
								<view v-if="leftWidth > 0 && leftIcon.length > 0">
									<view class="uni-navbar__header-btns-left">
										<view class="d-flex a-center j-center"  :style="{backgroundColor: `rgba(0, 0, 0,${0.3-navOp})`,height:menuHeight+'px',width:menuHeight+'px',borderRadius:menuHeight/2 +'px'}">
											<uni-icons :type="leftIcon" size="20"
												:color="navOp < 0.3 ? `rgba(255, 255, 255,${1-navOp})`:`rgba(0, 0, 0,${navOp})`"
												></uni-icons>
										</view>
									</view>
								</view>
								<view :class="{ 'uni-navbar-btn-icon-left': !leftIcon.length > 0 }"
									class="uni-navbar-btn-text" v-if="leftText.length">
									<text :style="{ fontSize: '12px' }">{{ leftText }}</text>
								</view>
							</slot>
						</view>
						<view class="uni-navbar__header-container" :style="{opacity:titltOp?navOp:1}">
							<slot>
								<view class="uni-navbar__header-container-inner" v-if="title.length>0">
									<text class="uni-nav-bar-text">{{ title }}</text>
								</view>
							</slot>
						</view>
						<view class="uni-navbar__header-btns uni-navbar__header-btns-right"
							:style="{width:rightWidth+'px'}">
							<slot name="right">
								<view v-if="rightIcon.length">
									<uni-icons :type="rightIcon" size="22" />
								</view>
								<view class="uni-navbar-btn-text" v-if="rightText.length && !rightIcon.length">
									<text class="uni-nav-bar-right-text">{{ rightText }}</text>
								</view>
							</slot>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow,
		onPageScroll
	} from "@dcloudio/uni-app";
	/**
	 * bgFixed 是否占位
	 * titltOp 标题默认是否隐藏
	 */
	export default {
		name: "nav-trans",
		props: {
			navOp: {
				type: Number,
				default: 0
			},
			titltOp: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ""
			},
			bgColor: {
				type: String,
				default: ""
			},
			leftWidth: {
				type: Number,
				default: 60
			},
			leftIcon: {
				type: String,
				default: "back"
			},
			leftText: {
				type: String,
				default: ""
			},
			rightWidth: {
				type: Number,
				default: 60
			},
			rightIcon: {
				type: String,
				default: ""
			},
			navigateBack: {
				type: Boolean,
				default: true
			},
			rightText: {
				type: String,
				default: ""
			},
			bgFixed: {
				type: Boolean,
				default: false
			},
		},
		setup(props, context) {
			onMounted(() => {
				v3Data.totalHeight = getApp().globalData.totalHeight
				v3Data.navBarHeight = getApp().globalData.navBarHeight
				v3Data.windowWidth = getApp().globalData.windowWidth
				v3Data.statusBarHeight = getApp().globalData.statusBarHeight
				v3Data.menuHeight = getApp().globalData.menuHeight
			})

			const v3Data = reactive({
				totalHeight: 91, // 总高度
				statusBarHeight: 20, // 状态栏高度
				menuHeight:32,
				navBarHeight: 45, // 导航栏高度
				windowWidth: 375,
				onClickLeft: () => {
					if (props.navigateBack) {
						let pages = getCurrentPages().length
						if(pages > 1){
							uni.navigateBack({
								delta: 1
							});
						}else{
							uni.switchTab({
								url:'/pages/index/index'
							})
						}
					} else {
						this.$emit("clickLeft");
					}
				},
			})
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style lang="scss">
	.top_navbar {
		.top_pos {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
		}

		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100%;

			.navbar-content {
				display: flex;
				align-items: center;
				height: 45px;
				padding: 0 10px;
				box-sizing: border-box;
				position: relative;
			}
		}
	}

	.uni-navbar__header-btns-left {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 60rpx;
		justify-content: flex-start;
		align-items: center;
	}

	.uni-navbar__header-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		padding: 0 10px;
		overflow: hidden;
		align-items: center;
		justify-content: center;
	}

	.uni-navbar__header-container-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		overflow: hidden;
		// box-sizing: border-box;
	}

	.uni-nav-bar-text {
		/* #ifdef APP-PLUS */
		font-size: 34rpx;
		/* #endif */
		/* #ifndef APP-PLUS */
		font-size: 14px;
		font-weight: bold;
		/* #endif */
	}

	.uni-navbar__header-btns-right {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		// width: 150rpx;
		// padding-right: 30rpx;
		justify-content: flex-end;
		align-items: center;
	}
</style>
