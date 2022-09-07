<template>
	<view>
		<nav-trans :navOp="0.3" bgColor="#f5f5f5" :bgFixed="true" :titltOp="false">
			<view class="d-flex flex-1">
				<uni-search-bar @confirm="search" placeholder="搜索商品" :radius="30" v-model="searchValue" @clear="clear"
					cancelButton="none" bgColor="#fff" class="flex-1 mr-5">
				</uni-search-bar>
			</view>
		</nav-trans>
		<view class="row font-md font-weight position-fixed left-0 right-0"
			style="height: 90rpx;background-color: #f5f5f5;z-index: 100;">
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
			<view class="d-flex flex-1 a-center j-center main-text-color" @click="showDrawer('showRight')">
				筛选
			</view>
		</view>
		<view class="rounded-20 bg-white flex-1" style="margin-top: 90rpx;">
			<block v-if="list.length > 0">
				<view v-for="(item,index) in list" :key="index" class="border-bottom">
					<goods-list-item :item="item" isSearch />
				</view>
			</block>
			<noting v-else-if="list" />
		</view>
		<!-- 抽屉 -->
		<uni-drawer ref="showRight" mode="right" :width="drawWidth" :mask-click="true" @change="changeDrawer($event)">
			<view style="height: 50rpx;"></view>
			<view class="px-2 font-weight font-md py-1">
				分类
			</view>
			<radio-list :resdata="cates" @change="changeCate" />
			<view class="position-fixed bottom-0 row w-100 border-top" style="height: 55px;">
				<view class="d-flex flex-1 a-center j-center" hover-class="bg-light-secondary" @click="confrim(0)">重置
				</view>
				<view class="d-flex main-bg-color flex-1 a-center j-center text-white" hover-class="main-bg-hover-color"
					@click="confrim(1)">确定</view>
			</view>
		</uni-drawer>
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
				v3Data.searchValue = e.searchValue
				let historyStr = uni.getStorageSync('search')
				if (historyStr !== '') {
					v3Data.history = JSON.parse(historyStr)
				}
				v3Data.getData(0)
				v3Data.getCates()
			})
			onReachBottom(() => {
				if (v3Data.currPage < v3Data.totalPage) {
					v3Data.currPage++
					v3Data.getData(1)
				}
			})
			const v3Data = reactive({
				showRight: null,
				drawWidth: 330,
				tempIndex: 0,
				cates: {
					selected: 0,
					list: [{
						id: 0,
						name: '全部'
					}]
				},
				navOp: 0,
				searchValue: '',
				currPage: 1,
				totalPage: 1,
				history: [],
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
				changeCate(index) {
					v3Data.cates.selected = index
				},
				getCates() {
					
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
				search(res) {
					if (v3Data.searchValue) {
						let repeatIndex = v3Data.history.indexOf(v3Data.searchValue)
						if (repeatIndex > -1) {
							v3Data.history.splice(repeatIndex, 1)
						}
						v3Data.history.unshift(v3Data.searchValue)
						uni.setStorageSync('search', JSON.stringify(v3Data.history))
					}
					v3Data.currPage = 1

					v3Data.getData(0)
					uni.pageScrollTo({
						scrollTop: 0
					})

				},
				clear(res) {
					v3Data.searchValue = ''
				},
				showDrawer(e) {
					v3Data.showRight.open()
				},
				// 0重置/1确定
				confrim(type) {
					v3Data.currPage = 1
					v3Data.tempIndex = type == 1 ? v3Data.cates.selected : 0
					v3Data.getData(0)
					uni.pageScrollTo({
						scrollTop: 0
					})
					v3Data.showRight.close()
				},
				// 抽屉状态发生变化触发
				changeDrawer(e) {
					if (!e) {
						v3Data.cates.selected = v3Data.tempIndex
					}
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
	.uni-searchbar {
		padding-left: 0 !important;
	}
	.navbar-fixed{
		background-color: #f5f5f5 !important;
	}
	.uni-searchbar__box {
		height: 32px !important;
	}
	.uniui-back{
		color: #000 !important;
	}
</style>
