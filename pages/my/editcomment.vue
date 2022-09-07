<template>
	<view>
		<view class="p-2 bg-white">
			<view class="d-flex a-center">
				<text class="mr-2">服务评价</text>
				<uni-rate v-model="comment.rate"></uni-rate>
				<text class="text-light-muted font ml-2">{{rateText}}</text>
			</view>
		</view>
		<divider></divider>
		<view class="font pt-2 px-2 bg-white">
			<textarea maxlength="255" v-model="comment.content" placeholder="描述商品/服务和使用感受" />
		</view>
		<divider></divider>
		<view class="uni-uploader-body">
			<view class="uni-uploader-head">
				<view class="uni-uploader-title font">上传照片（可选）</view>
				<view class="uni-uploader-info">{{imageList.length}}/{{imgMax}}</view>
			</view>
			<view class="uni-uploader__files">
				<block v-for="(image,index) in imageList" :key="index">
					<view class="uni-uploader__file position-relative">
						<image class="uni-uploader__img rounded-20" :src="image" :data-src="image" @tap="previewImage">
						</image>
						<view class="d-flex position-absolute text-white"
							style="top: -15rpx;right: -15rpx;z-index: 100;" @tap="removeImg(index)">
							<uni-icons type="clear" style="opacity: 0.65;" size="22"></uni-icons>
						</view>
					</view>
				</block>
				<view class="uni-uploader__input-box rounded-20" v-if="imageList.length < imgMax">
					<view class="uni-uploader__input" @tap="chooseImage"></view>
				</view>
			</view>
		</view>
		<button-bottom buttonName="提交" @click="submit" />
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
		computed
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				data.comment.orderId = e.orderId
				data.comment.type = e.type
			})
			const data = reactive({
				type: '',
				comment: {
					rate: 5,
					content: '',
					contentImg: '',
					orderId: '',
					type: ''
				},
				imgMax: 3,
				imageList: [],
				baseImg: [],
				chooseImage: async function() {
					if (data.imageList.length === data.imgMax) {
						return uni.showToast({
							title: `最多只能上传${data.imgMax}张图片`,
							icon: 'none'
						});

					}
					uni.chooseImage({
						count: data.imgMax - data.imageList.length,
						success: (res) => {
							data.imageList = data.imageList.concat(res.tempFilePaths);
						},
						fail: (err) => {
							// #ifdef MP
							if (err.errMsg.indexOf('cancel') !== '-1') {
								return;
							}
							uni.getSetting({
								success: (res) => {
									let authStatus = false;
									switch (data.sourceTypeIndex) {
										case 0:
											authStatus = res.authSetting[
												'scope.camera'];
											break;
										case 1:
											authStatus = res.authSetting[
												'scope.album'];
											break;
										case 2:
											authStatus = res.authSetting[
													'scope.album'] && res
												.authSetting['scope.camera'];
											break;
										default:
											break;
									}
									if (!authStatus) {
										uni.showModal({
											title: '授权失败',
											content: '需要从您的相机或相册获取图片，请在设置界面打开相关权限',
											success: (res) => {
												if (res.confirm) {
													uni.openSetting()
												}
											}
										})
									}
								}
							})
							// #endif
						}
					})
				},
				previewImage: function(e) {
					var current = e.target.dataset.src
					uni.previewImage({
						current: current,
						urls: data.imageList
					})
				},
				removeImg(index) {
					data.imageList.splice(index, 1)
				},
				async submit() {
					uni.showToast({
						title: '评价成功',
						icon: 'none'
					});
					
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				},
				conversionAddress: function() {
					return new Promise((res) => {
						const that = data;
						that.baseImg = []
						for (let i = 0; i < that.imageList.length; i++) {
							// 转base64  
							uni.getFileSystemManager().readFile({
								filePath: that.imageList[i],
								encoding: "base64",
								success: function(result) {
									that.baseImg.push('data:image/png;base64,' + result
										.data)
									if (that.imageList.length == that.baseImg.length) {
										res(true)
									}
								}
							})
						}
					})
				},
				rateText: computed(() => {
					switch (data.comment.rate) {
						case 1:
							return '非常差'
							break;
						case 2:
							return '差'
							break;
						case 3:
							return '一般'
							break;
						case 4:
							return '好'
							break;
						case 5:
						default:
							return '非常好'
							break;
					}
				})
			})


			return {
				...toRefs(data)
			}
		}

	}
</script>

<style>
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}

	.uni-uploader-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.uni-uploader-info {
		color: #B2B2B2;
	}

	.uni-uploader-body {
		background-color: white;
		padding: 20rpx;
	}

	.uni-uploader__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.uni-uploader__file {
		margin: 10rpx;
		width: 210rpx;
		height: 210rpx;
	}

	.uni-uploader__img {
		display: block;
		width: 210rpx;
		height: 210rpx;
	}

	.uni-uploader__input-box {
		position: relative;
		margin: 10rpx;
		width: 208rpx;
		height: 208rpx;
		border: 2rpx solid #D9D9D9;
	}

	.uni-uploader__input-box:before,
	.uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}

	.uni-uploader__input-box:before {
		width: 4rpx;
		height: 79rpx;
	}

	.uni-uploader__input-box:after {
		width: 79rpx;
		height: 4rpx;
	}

	.uni-uploader__input-box:active {
		border-color: #999999;
	}

	.uni-uploader__input-box:active:before,
	.uni-uploader__input-box:active:after {
		background-color: #999999;
	}

	.uni-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
