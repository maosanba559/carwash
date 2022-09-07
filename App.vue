<script>
	export default {
		globalData: {
			totalHeight: 0,
			navBarHeight: 0,
			windowWidth: 0,
			statusBarHeight: 0,
			safeAreaInsets: 0,
			menuHeight:0
		},
		onLaunch: function() {
			this.nav()
		},
		onShow: function() {},
		onHide: function() {},
		methods: {
			nav() {
				let info = uni.getSystemInfoSync();
				let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				let statusBarHeight = info.statusBarHeight;
				let windowWidth = info.windowWidth; //全屏
				let navBarHeight =
					menuButtonInfo.bottom -
					info.statusBarHeight +
					(menuButtonInfo.top - info.statusBarHeight) +
					4;
				// v3Data.windowWidth = menuButtonInfo.left; //去掉胶囊宽
				let totalHeight = statusBarHeight + navBarHeight;
				
				this.globalData.menuHeight = menuButtonInfo.height
				this.globalData.totalHeight = totalHeight
				this.globalData.windowWidth = windowWidth
				this.globalData.navBarHeight = navBarHeight
				this.globalData.statusBarHeight = statusBarHeight
				// context.emit('update:navHeight', v3Data.totalHeight)

				const safeArea = info.safeArea
				if (safeArea) {
					// #ifdef MP-WEIXIN
					this.globalData.safeAreaInsets = info.screenHeight - safeArea.bottom
					// #endif
					// #ifndef MP-WEIXIN
					this.globalData.safeAreaInsets = info.safeAreaInsets.bottom
					// #endif
				} else {
					this.globalData.safeAreaInsets = 0
				}
			}
		}
	}
</script>

<style lang="scss">
	@import "/common/zcm-main.css";
	@import "/common/animate.css";
	@import "/common/iconfont.css";

	/* #ifndef APP-NVUE */
	page {
		background-color: #f5f5f5;
	}

	wx-swiper .wx-swiper-dot {
		display: inline-block;
		width: 12px;
		height: 3px;
		margin-right: 0px !important;
		border-radius: 0;
	}

	wx-swiper .wx-swiper-dot:first-child {
		border-top-left-radius: 5rpx;
		border-bottom-left-radius: 5rpx;
	}

	wx-swiper .wx-swiper-dot:last-child {
		border-top-right-radius: 5rpx;
		border-bottom-right-radius: 5rpx;
	}

	wx-swiper .wx-swiper-dot-active {
		background-color: #F0F0F0
	}

	/* #endif */
</style>
