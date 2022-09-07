<template>
	<view>
		<view class="position-relative">
			<swiper :indicator-dots="dots" :autoplay="autoPlay" circular :style="getStyle" @change="change">
				<block v-for="(swiper,index) in resdata" :key="index">
					<swiper-item>
						<view :class="{'px-2':padding}">
							<image class="animate__animated animate__fadeIn" :style="getStyle" :class="{'rounded-20':rounded}" :src="swiper.src"
								@click="event(swiper,index)" />
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="index" v-if="!dots">
				<text class="num">{{current+1}}</text>
				<text class="num">/{{resdata.length}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0
			}
		},
		props: {
			resdata: Array,
			height: {
				type: Number,
				default: 500
			},
			preview: {
				type: Boolean,
				default: false
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			rounded: {
				type: Boolean,
				default: false
			},
			dots: {
				type: Boolean,
				default: true
			},
			padding: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			getStyle() {
				return `height: ${this.height}rpx;`
			},
			getUrls() {
				return this.resdata.map(v => v.src)
			}
		},
		methods: {
			event: function(item, index) {
				if (this.preview) {
					uni.previewImage({
						current: index,
						urls: this.getUrls
					})
				} else {
					if (item.path) {
						uni.navigateTo({
							url: item.path
						});
					}
				}
			},
			change(e) {
				this.current = e.detail.current
			}
		}
	}
</script>

<style>
	/* #ifdef H5 */
	uni-image {
		width: 100%;
	}

	/* #endif */
	.index {
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 15.6667px;
		bottom: 14.6667px;
		box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 0px;
		display: flex;
		flex-direction: row;
		height: 20.6667px;
		justify-content: center;
		padding-right: 8.33333px;
		padding-left: 8.33333px;
		right: 13.6667px;
		-webkit-box-align: center;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-webkit-box-pack: center;
		position: absolute;

	}

	.index .num {
		color: rgb(255, 255, 255);
		font-size: 11px;
	}
</style>
