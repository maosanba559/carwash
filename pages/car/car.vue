<template>
	<view>
		<view class="rounded-10 bg-white px-3">
			<block v-for="(item,index) in plates" :key="item.plateId">
				<view class="py-2 d-flex a-center border-bottom">
					<uni-icons type="vip" size="30"></uni-icons>
					<text class="uni-h5 flex-1 font-weight text-center text-muted">{{item.number}}</text>
					<view class="ml-auto">
						<button type="default" class="bg-dark text-white ml-auto font" style="letter-spacing:10rpx;"
							@click="delCar(item.plateId)">解绑</button>
					</view>
				</view>
			</block>
		</view>
		<divider v-if="plates.length > 0"></divider>
		<uni-section title="请输入您的车牌号码">
			<car-number ref="plate" :isShow="true" @listenPlateChange="plateChange" :defaultPlate="plateNumber">
			</car-number>
			<!-- <view class="font-sm text-muted text-center pb-2">注：新能源车需点击最后的【新能源】</view> -->
		</uni-section>
		<button class="main-bg-color mt-5 text-white" style="width: 90%;" @click="submit">保存</button>
	</view>
</template>

<script>
	import carNumber from '@/components/car-number.vue';
	import {
		ref,
		reactive,
		toRefs,
		nextTick
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		components: {
			carNumber
		},
		setup() {
			const v3Data = reactive({
				plate: null,
				fromUri:'',
				plateNumber: [],
				plates: [],
				getPlates: () => {
					const data = {"msg":"success","code":0,"plates":[{"plateId":"1567446926427725825","number":"贵EFGGGQ","userId":"1509782148540801026","createTime":"2022-09-07 17:37:24"}]}
					v3Data.plates = data.plates
				},
				plateChange: (val) => {
					v3Data.plateNumber = val
				},
				checkCarNum: (vehicleNumber) => {
					var xreg =
						/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;

					var creg =
						/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
					if (vehicleNumber.length == 7) {
						return creg.test(vehicleNumber);
					} else if (vehicleNumber.length == 8) {
						return xreg.test(vehicleNumber);
					} else {
						return false;
					}
				},
				submit: () => {
					if (!v3Data.checkCarNum(v3Data.plateNumber.join(''))) {
						return uni.showToast({
							title: '请输入正确的车牌号码！',
							icon: 'none'
						})
					}
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					});
					setTimeout(()=> {
						uni.navigateBack({
							delta: -1
						});
					}, 1500);
				},
				delCar: (id) => {
					uni.showModal({
						content: '确定要解绑车牌号吗？',
						success: function(res) {
							if (res.confirm) {
								uni.showToast({
									title: '解绑成功',
									icon: 'none'
								});
							}
						}
					});
				}

			})
			onLoad((e) => {
				if(e.type){
					v3Data.fromUri = e.type
				}
				nextTick(() => {
					if (v3Data.plateNumber.length == 0) {
						v3Data.plate.handleChange(0)
					}
					v3Data.getPlates()
				})
			})

			return {
				...toRefs(v3Data)
			}
		}

	}
</script>
<style>
</style>
