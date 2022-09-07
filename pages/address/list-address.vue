<template>
	<view class="px-3 py-2">
		<view class="bg-white rounded-15 px-2 mb-2" v-for="(item,index) in addrList" :key="index" @click="setAddr(item)">
			<view class="py-3 border-bottom">
				<view class="line-h-df">{{item.name}} {{item.tel}}</view>
				<view class="font text-muted">{{item.province+' '+item.city+''+item.county+''+item.street + '' + item.addressDetail}}</view>
			</view>
			<view class=" font text-muted d-flex a-center j-sb py-2">
				<label @click.stop="setDefault(item.id)" >
					<radio color="#f60"
						style="transform:scale(0.6)" :checked="item.defaultAddr"/><text>设为默认地址</text>
				</label>
				<view class="text-muted">
					<text class="p-2" @click.stop="del(item.id)">删除</text>
					<text class="p-2" @click.stop="edit(item)">编辑</text>
				</view>
			</view>
		</view>
	</view>
	<!-- buttom -->
	<view :style="{height:safeAreaInsets + 100 +'rpx'}"></view>
	<view class="bg-white position-fixed bottom-0 left-0 right-0">
		<view class="d-flex a-center j-sb px-3 py-2">
			<view class="span24-11 main-bg-color py-2 text-white text-center" style="border-radius: 50rpx;" @click="openAddAddr(0)">
				手动添加地址
			</view>
			<view class="span24-11 py-2 text-white text-center" style="border-radius: 50rpx;background-color: #56bb39;" @click="openAddAddr(1)">
				微信一键添加
			</view>
		</view>
		<view :style="{height:safeAreaInsets+'rpx'}"></view>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad(()=>{
				v3Data.getAddrList()
			})
			const v3Data = reactive({
				addrList:[],
				edit(addr){
					uni.setStorageSync("addr",addr)
					uni.navigateTo({
						url: '/pages/address/add-address?type=edit'
					});
				},
				del(id){
					uni.showModal({
						content: '您确认要删除这个地址吗?',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if(res.confirm){
							}
						},
						fail: () => {},
						complete: () => {}
					});
				},
				getAddrList() {
				},
				setAddr(addr){
					let pages = getCurrentPages();
					let prevPage = pages[pages.length - 2];
					prevPage.$vm.setAddr(addr)
					uni.navigateBack({
						delta: 1
					});
				},
				setDefault(id){
					uni.request({
						url: `/address/defaultAddr/${id}`,
						method: 'GET',
						success: ({
							data
						}) => {
							if(data.code == 0){
								v3Data.addrList.forEach(e=>{
									if(e.id == id){
										e.defaultAddr = true
									}else{
										e.defaultAddr = false
									}
								})
							}
						}
					});
				},
				openAddAddr: (type) => {
					if (type == 0) {
						uni.navigateTo({
							url: '/pages/address/add-address?type=select'
						});
					} else {
						uni.chooseAddress({
							success(res) {
								if (res.errMsg == 'chooseAddress:ok') {
									uni.request({
										url: '/address/save',
										method: 'POST',
										data: {
											name: res.userName,
											tel: res.telNumber,
											province: res.provinceName,
											city: res.cityName,
											county: res.countyName,
											street: res.streetName,
											addressDetail: res.detailInfo,
											defaultAddr: false
										},
										success: ({
											data
										}) => {
											if (data.code == 0) {
												v3Data.getAddrList()
											} else {
												uni.showToast({
													title: data.msg,
													icon: 'none'
												});
											}
										},
									});
								}
							},
							fail() {
								uni.showToast({
									title: '获取用户收货地址失败',
									icon: 'none'
								});
							}
						})
					}
				}
			})
	
			return {
				...toRefs(v3Data)
			}
		}
	}
</script>

<style>

</style>
