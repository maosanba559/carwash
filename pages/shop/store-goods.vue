<template>
	<view>
		<view class="position-fixed left-0 right-0 top-0 px-2" style="background-color: #f5f5f5;z-index: 100;height: 190rpx;">
			<view class="d-flex a-center">
				<uni-icons type="icon-zhengpinbaozhang" customPrefix="iconfont" :size="38" color="#6c757d"/>
				<view class="ml-2 text-muted">
					<view class="font-md">{{storeName}}</view>
					<uni-rate value="5" :size="18"/>
				</view>
			</view>
			<view class="row font-md font-weight mt-2">
				<block v-for="(item,index) in screen.list" :key="index">
					<view class="d-flex flex-1 a-center j-center" @click="changeSort(index)">
						<text :class="screen.sortIndex===index ?'main-text-color':'text-muted'">{{item.name}}</text>
						<view class="d-flex flex-column" v-if="!item.only">
							<view style="line-height: 0.5;">
								<uni-icons type="icon-sanjiao2" customPrefix="iconfont" :size="10" :color="item.status == 1 ?'#FD6801':'#6c757d'"></uni-icons>
							</view>
							<view style="line-height: 0.5;">
								<uni-icons type="icon-sanjiao1" customPrefix="iconfont" :size="10" :color="item.status == 2 ?'#FD6801':'#6c757d'"></uni-icons>
							</view>
						</view>
						
					</view>
				</block>
			</view>
		</view>
		<view class="rounded-20 bg-white" style="margin-top: 190rpx;">
			<block v-if="list.length > 0">
				<view v-for="(item,index) in list" :key="index" class="border-bottom">
					<goods-list-item :item="item" isSearch />
				</view>
			</block>
			<noting v-else-if="list" />
		</view>
		
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
	} from 'vue'
	import {
		onLoad,
		onShow,
		onReachBottom
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				v3Data.storeId = e.storeId
				v3Data.storeName = e.storeName
				v3Data.getData(0)
			})
			onReachBottom(() => {
				if (v3Data.currPage < v3Data.totalPage) {
					v3Data.currPage++
					v3Data.getData(1)
				}
			})
			const v3Data = reactive({
				storeId:'',
				storeName:'',
				currPage: 1,
				totalPage: 1,
				list: '',
				screen: {
					sortIndex: 0,
					list: [{
						name: '综合',
						status: 1,
						only: true
					}, {
						name: '销量',
						status: 0,
						only: true
					}, {
						name: '价格',
						status: 0,
						only: false
					}, {
						name: '积分',
						status: 0,
						only: false
					}]
				},
				changeSort(index) {
					//如果当前已经被选中
					let currIndex = v3Data.screen.sortIndex;
					let currItem = v3Data.screen.list[currIndex];
					v3Data.currPage = 1
					
					uni.pageScrollTo({
						scrollTop: 0
					})
					
					if (index == currIndex) {
						currItem.status = currItem.status == 1 ? 2 : 1
						return v3Data.getData(0)
					}
					//当前未选中情况
					currItem.status = 0;
					v3Data.screen.sortIndex = index;
					v3Data.screen.list[index].status = 2;
		
					v3Data.getData(0)
					
				},
				getData(type) {
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
