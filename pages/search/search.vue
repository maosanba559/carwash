<template>
	<view class="d-flex flex-column" style="height: 100vh;">
		<view class="d-flex a-center">
			<uni-search-bar @confirm="search" :focus="true" v-model="searchValue" @clear="clear" cancelButton="none"
				bgColor="#fff" class="flex-1" :radius="30">
			</uni-search-bar>
			<view class="pr-2 py-1" @click="search">搜索</view>
		</view>
		<view class="bg-white flex-1 px-2">
			<view class="pt-5" v-if="history.length > 0">
				<view class="mb-1 d-flex j-sb a-center">
					<view class="font-bold">搜索历史</view>
					<uni-icons type="trash" :size="22" @click="historyClear"></uni-icons>
				</view>
				<view class="py-1 row">
					<block v-for="(item,index) in history" :key="index">
						<color-tag :item="item" :color="false" @click="tagClick" />
					</block>
				</view>
			</view>
			<view class="pt-5" v-if="hot.length > 0">
				<view class="font-bold mb-1">搜索发现</view>
				<view class="py-1 row">
					<block v-for="(item,index) in hot" :key="index">
						<color-tag :item="item" @click="tagClick" />
					</block>
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
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			onLoad((e) => {
				let historyStr = uni.getStorageSync('search')
				if (historyStr !== '') {
					v3Data.history = JSON.parse(historyStr)
				}
				v3Data.getHot()
			})
			const v3Data = reactive({
				hot: [],
				history: [],
				searchValue: '',
				search(res) {
					if (v3Data.searchValue) {
						let repeatIndex = v3Data.history.indexOf(v3Data.searchValue)
						if (repeatIndex > -1) {
							v3Data.history.splice(repeatIndex, 1)
						}
						v3Data.history.unshift(v3Data.searchValue)
						uni.setStorageSync('search', JSON.stringify(v3Data.history))
					}
					uni.navigateTo({
						url: '/pages/search/search-list?searchValue='+v3Data.searchValue
					});
				},
				clear(res) {
					v3Data.searchValue = ''
				},
				getHot() {
					
				},
				tagClick(res){
					v3Data.searchValue = res
					v3Data.search()
				},
				historyClear() {
					uni.showModal({
						content: '是否删除全部搜索历史?',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if (res.confirm) {
								v3Data.history = []
								uni.removeStorageSync('search')
							}
						}
					});
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
