<template>
	<view>
		<view class="bg-white">
			<uni-search-bar placeholder="门店关键字" @confirm="search" @cancel="clear" @clear="clear" @blur="search">
			</uni-search-bar>
			<view class="uni-list">
				<radio-group @change="radioChange">
					<label class="d-flex border-bottom ml-2 py-3" v-for="(item, index) in stores" :key="item.storeId">
						<view>
							<radio :value="item.storeId" color="#FD6801" class="radio" :checked="index === current" />
						</view>
						<view class="ml-1">{{item.name}}</view>
						<view class="ml-auto pr-2 text-muted font" v-if="latitude !== ''">{{item.juli}} <text
								class="font-sm">km</text></view>
					</label>
				</radio-group>
			</view>
		</view>
		<button-bottom @click="submit"/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currPage: 1,
				totalPage: 1,
				searchKey: '', //search value
				latitude: '',
				longitude: '',
				stores: [],
				current: -1
			}
		},
		onLoad() {
			uni.getLocation({
				type: 'gcj02',
			}).then((res) => {
				this.latitude = res.latitude
				this.longitude = res.longitude
				this.getStores(1)
			}).catch((err) => {
				this.getStores(1)
			});
		},
		onReachBottom() {
			if (this.currPage < this.totalPage) {
				this.currPage++
				this.getStores()
			}
		},
		methods: {
			submit() {
				if (this.current == -1) {
					return uni.showToast({
						title: '请选择您要充值的门店',
						icon: 'none'
					});
				}
				//改变recharge页
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.$vm.storeId = this.stores[this.current].storeId
				prevPage.$vm.storeName = this.stores[this.current].name
				prevPage.$vm.init(1)
				uni.navigateBack({
					delta: -1
				});

			},
			search(res) {
				this.searchKey = res.value
				this.currPage = 1
				this.getStores(1)
			},
			clear(res) {
				this.searchKey = ''
				this.currPage = 1
				this.getStores(1)
			},
			radioChange(evt) {
				this.current = this.stores.findIndex(val => evt.detail.value == val.storeId)
			},
			getStores(type) {
				const data = {"msg":"success","code":0,"page":{"totalCount":3,"pageSize":10,"totalPage":1,"currPage":1,"list":[{"storeId":"1509777240680833026","name":"三毛自助洗车西吴店","juli":"179"},{"storeId":"1554285748037996545","name":"三毛24h共享自助洗车","juli":"180"},{"storeId":"1521387865089531906","name":"三毛自助洗车锦绣城店","juli":"188"}]}}
				this.current = -1
				this.stores = type == 1 ? data.page.list : this.stores.concat(data
					.page.list)
				this.currPage = data.page.currPage
				this.totalPage = data.page.totalPage
			}
		}
	}
</script>

<style>
	.radio {
		transform: scale(0.7);
	}
</style>
