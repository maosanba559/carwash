<template>
	<view class="mx-3 my-2">
		<view class="font px-2 py-3 mb-2 d-flex j-sb a-center rounded-15"
			style="background-color: #FFF9EA;color: #FF9A43;" v-if="infoFlag">
			<text>请检查识别的地址信息是否准确,如有遗漏请及时补充</text>
			<uni-icons type="closeempty" color="#FF9A43" :size="16" @click="infoFlag = false"></uni-icons>
		</view>
		<view class="bg-white rounded-15 mb-2">
			<view class="d-flex a-center p-2" v-if="tempAddr">
				<uni-icons type="reload" :size="20"></uni-icons>
				<view class="ml-2">
					<view class="font-weight">{{tempAddr.desc}}</view>
					<view class="text-muted font">{{tempAddr.name}}</view>
				</view>
				<view
					class="d-flex a-center j-center main-bg-color text-white flex-shrink font px-2 py-1 rounded-20 ml-auto"
					@click="setAddrData(tempAddr,1)">
					使用当前定位
				</view>
			</view>
		</view>
		<view class="bg-white rounded-15">
			<view class="d-flex a-center mx-2 py-3 border-bottom">
				<text style="width: 150rpx;">姓名</text>
				<input type="text" v-model="adddress.name" placeholder="收货人姓名" />
			</view>
			<view class="d-flex a-center mx-2 py-3 border-bottom">
				<text style="width: 150rpx;">手机号</text>
				<input class="flex-1" type="number" v-model="adddress.tel" placeholder="收货人手机号" />
				<button class="ml-auto font main-text-color" open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber">获取手机号</button>
			</view>
			<view class="d-flex a-center mx-2 border-bottom">
				<text style="width: 150rpx;">所在地址</text>
				<input class="flex-1" type="text" v-model="slectAddr" disabled="true" placeholder="选择收货地址"
					@click="openRegion" />
				<uni-icons class="ml-auto p-3" type="location" color="#f60" :size="20" @click="chooseLocation">
				</uni-icons>
			</view>
			<view class="d-flex mx-2 py-3">
				<text style="width: 150rpx;">详细地址</text>
				<textarea style="height: 100rpx;padding-left: 10rpx;" disable-default-padding
					v-model="adddress.addressDetail" :maxlength="200" placeholder="需要具体到街道、小区、门牌号等" />
			</view>
		</view>
		<view class="py-3 text-muted font" @click="adddress.defaultAddr = !adddress.defaultAddr">
			<label>
				<radio :value="adddress.defaultAddr" :checked="adddress.defaultAddr" color="#f60"
					style="transform:scale(0.7)" /><text>设为默认地址</text>
			</label>
		</view>
		<region-window ref="region" @finish="selectRegion" :defaultAddress="defaultAddr" />

		<button-bottom buttonName="保存并使用" @click="submit" />
	</view>
</template>

<script>
	import {
		getLocation
	} from '@/common/utils/amap.js'
	import {
		ref,
		reactive,
		toRefs,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			let {
				proxy
			} = getCurrentInstance();
			onLoad((e) => {
				v3Data.from = e.type
				if (e.type == 'edit') {
					v3Data.adddress = uni.getStorageSync("addr")
					uni.setNavigationBarTitle({
						title: "编辑收货地址"
					})
					v3Data.slectAddr = v3Data.adddress.province + ' ' + v3Data.adddress.city + ' ' + v3Data
						.adddress.county + ' '
					if (v3Data.adddress.street) {
						v3Data.slectAddr += v3Data.adddress.street
					}
					v3Data.defaultAddr = {
						province: v3Data.adddress.provinceCode,
						city: v3Data.adddress.cityCode,
						county: v3Data.adddress.countyCode,
						street: v3Data.adddress.streetCode
					}
				}
				getLocation().then(res => {
					if (res && res.length > 0) {
						v3Data.tempAddr = res[0]
					}
				})
				v3Data.getCode()
			})
			const v3Data = reactive({
				infoFlag: false,
				js_code: '',
				from: '',
				tempAddr: '',
				defaultAddr: {},
				slectAddr: '',
				adddress: {
					name: '',
					tel: '',
					province: '',
					city: '',
					county: '',
					street: '',
					addressDetail: '',
					defaultAddr: true,
					provinceCode: '',
					cityCode: '',
					countyCode: '',
					streetCode: ''
				},
				rules: {
					name: [{
						rule: /^.+$/,
						msg: '姓名不能为空'
					}],
					tel: [{
						rule: /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/,
						msg: '请输入正确的手机号'
					}],
					province: [{
						rule: /^.+$/,
						msg: '省份不能为空'
					}],
					city: [{
						rule: /^.+$/,
						msg: '城市不能为空'
					}],
					county: [{
						rule: /^.+$/,
						msg: '区县不能为空'
					}],
					addressDetail: [{
						rule: /^.+$/,
						msg: '详细地址不能为空'
					}]
				},
				region: null,
				openRegion: () => {
					v3Data.region.open()
				},
				getPhoneNumber: (res) => {
					if (res.detail.errMsg == 'getPhoneNumber:fail user deny') {
						return
					}
					let encryptedData = res.detail.encryptedData
					let iv = res.detail.iv
					console.log(res);
				},
				getCode: () => {
					uni.login({
						provider: 'weixin',
						success: loginRes => {
							v3Data.js_code = loginRes.code
						},
						fail: () => {
							v3Data.getCode()
						}
					});
				},
				submit() {
					if (proxy.$validate(v3Data.adddress, v3Data.rules)) {
					}
				},
				selectRegion: (res) => {
					v3Data.slectAddr = res.province.name + ' ' + res.city.name + ' ' + res.county.name + ' '
					if (res.street) {
						v3Data.slectAddr += res.street.name
						v3Data.adddress.street = res.street.name
						v3Data.adddress.streetCode = res.street.areaCode
					}
					v3Data.adddress.province = res.province.name
					v3Data.adddress.city = res.city.name
					v3Data.adddress.county = res.county.name

					v3Data.adddress.provinceCode = res.province.areaCode
					v3Data.adddress.cityCode = res.city.areaCode
					v3Data.adddress.countyCode = res.county.areaCode


				},
				setAddrData(result, type) {
					let detail = ''
					if (type) {
						v3Data.infoFlag = true
						detail = result.desc.substring(0,result.desc.indexOf('附近'))
						result = result.regeocodeData.addressComponent
					}

					v3Data.adddress.province = result.province
					v3Data.adddress.city = result.city
					v3Data.adddress.county = result.district
					v3Data.adddress.street = result.township

					v3Data.adddress.addressDetail = detail ? detail : result.detail
					v3Data.slectAddr = v3Data.adddress.province + ' ' +
						v3Data.adddress.city + ' ' + v3Data.adddress
						.county + ' ' + v3Data.adddress.street
				},
				chooseLocation: () => {
					uni.chooseLocation({
						success(res) {
							getLocation({
								location: res.longitude + ',' + res
									.latitude, //location的格式为'经度,纬度
							}).then((addr) => {
								let result = addr[0].regeocodeData.addressComponent
								result.detail = res.name
								v3Data.setAddrData(result)
							})
						}
					})
				}
			})

			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>
	button {
		background-color: #fff !important;
		line-height: 1 !important;
	}

	button::after {
		border: none;
	}
</style>
