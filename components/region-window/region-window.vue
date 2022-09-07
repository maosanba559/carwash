<template>
	
	<uni-popup type="bottom" ref="popup" style="background-color: #fff;" :safeArea="false">
		<view class="region-container">
			<view class="title">
				选择地址
				<view @click="close">
					<close-button />
				</view>
			</view>
			<view class="nav-list" >
				<block v-for="addressKey,i in addressKeys" :key="i">
					<view class="item line1" :class="{'selected':navKey==addressKey}" @click="changeNav(addressKey)" v-if="selectedAddress[addressKey]!=null">{{selectedAddress[addressKey].name}}</view>
				</block>
				
				<view class="item line1 selected" v-if="!finish&&selectedAddress.street==null">请选择</view>
			</view>
			<scroll-view class="address-list" scroll-y>
				<block v-for="addressKey,i in addressKeys" :key="i" >
					<block v-if="listKey==addressKey">
						<view class="a-item" 
							hover-class="hover"
							:class="{'on':selectedAddress[addressKey]!=null&&item.areaCode==selectedAddress[addressKey].areaCode}" 
							v-for="item,index in addressList[addressKey]" 
							:key="index" 
							@click="selectItem(item)" >
							<view class="text line1">{{item.name}}</view>
							<uni-icons v-if="selectedAddress[addressKey]!=null&&item.areaCode==selectedAddress[addressKey].areaCode" type="checkmarkempty" color="#f60"></uni-icons>
						</view>
					</block>
					
				</block>
			</scroll-view>
		</view>
	</uni-popup>
</template>

<script>
import cache from '@/common/ext/cache.js'
export default {
	created(){

	},
	props:{
		defaultAddress:{
			type: Object,
			default: ()=>{
				return {
					province:null,
					city:null,
					county:null,
					street:null
				}
			}
		}
	},
	data(){
		return{
			addressKeys:['province','city','county','street'],
			addressList:{
				province:[],
				city:[],
				county:[],
				street:[]
			},
			selectedAddress:{
				province:null,
				city:null,
				county:null,
				street:null
			},
			navKey:null,// 激活的导航列表key
			listKey:'province',// 激活的地址列表key
			finish:false// 是否已选择完成
		}
	},
	methods:{
		getCitys(pid){
			return new Promise((reslove, reject) => {
				uni.request({
					url: `/region/listByPid/${pid}`,
					method:  'GET',
					header:{'content-type':'application/json; charset=utf-8'},
					success: ({data}) => {
						if (data.code == 0)
							reslove(data.list, data);
						else
							reject(data|| '系统错误');
					},
					fail: (err) => {
						if (err.hasOwnProperty('errMsg') ) {
							if (err.errMsg == 'request:fail timeout') {
								reject({title:'网络超时'})
							} else if (err.errMsg == 'request:fail -109:net::ERR_ADDRESS_UNREACHABLE') {
								reject({title:'网络异常，请检查您的网络状况'})
							} else {
								reject({title:err.errMsg.replace('request:fail','')||'网络异常'})
							}
						} else {
							reject({title:err.errMsg||'网络异常'})
						}
						console.error(err)
						reject('网络异常');
					}
				})
			});
		},
		/**
		 * 重选地区
		 */
		changeNav(addressKey){
			this.finish = false
			this.navKey = addressKey
			this.listKey = addressKey
		},
		/**
		 * 初始化
		 */
		async init(){
			if (this.addressList.province.length==0&&this.addressList.city.length==0&&this.addressList.county.length==0&&this.addressList.street.length==0) {
				// 遍历defaultAddress，有这填入list，并设置listKey和navKey
				Object.keys(this.defaultAddress).forEach(async (key)=>{
					if (this.defaultAddress[key]!=null&&this.defaultAddress[key]!=0) {
						this.navKey = key
						this.listKey = key
						this.finish = true
						var addressList = []
						if (key=='province') {
							addressList = await this.getCitysInfo(0)
						} else if (key=='city') {
							addressList = await this.getCitysInfo(this.defaultAddress['province'])
						} else if (key=='county') {
							addressList = await this.getCitysInfo(this.defaultAddress['city'])
						} else if (key=='street') {
							addressList = await this.getCitysInfo(this.defaultAddress['county'])
						}
						this.addressList[key] = addressList
						addressList.forEach((item)=>{
							if (item.areaCode==this.defaultAddress[key]) {
								this.selectedAddress[key]=item
							}
						})
					}
				})
				if (!this.finish) {
					this.addressList['province'] = await this.getCitysInfo(0)
				}
			}
		},
		getCitysInfo(id){
			return new Promise((resolve,reject)=>{
				let key = 'address_'+id
				if (cache.has(key)) {
					resolve(cache.get(key,true))
				} else {
					uni.showLoading()
					this.getCitys(id).then(res=>{
						uni.hideLoading()
						cache.set(key,res)
						resolve(res)
					}).catch(err=>{
						uni.hideLoading();
						reject(err)
					})
				}
			})
		},
		/**
		 * 选择地址
		 */
		async selectItem(item){
			let listKey = this.listKey
			this.selectedAddress[listKey] = item
			// 重置nav选中值，根据当前选中键值显示下一个地址列表 || 没有下级的话是完成
			// province->city 
			// city->county 
			// county->street 
			// street>完成
			this.navKey=null
			let res = await this.getCitysInfo(item.areaCode)
			if (res.length==0){ return this.finishSelect(listKey)}
			if (listKey=='province') {
				this.cleanNavData(['city','county','street'])
				this.addressList['city'] = res
				this.listKey = 'city'
			} else if (listKey=='city') {
				this.cleanNavData(['county','street'])
				this.addressList['county'] = res
				this.listKey = 'county'
			} else if (listKey=='county') {
				this.cleanNavData(['street'])
				this.addressList['street'] = res
				this.listKey = 'street'
			}
		},
		/**
		 * 清除nav头,地址列表和已选中地址信息
		 */
		cleanNavData(addressKeys){
			addressKeys.forEach((key)=>{
				this.addressList[key]=[]
				this.selectedAddress[key]=null
			})
		},
		/**
		 * 完成地址选择
		 */
		finishSelect(listKey){
			this.finish = true
			this.listKey = listKey
			this.navKey = listKey
			this.$emit('finish',this.selectedAddress)
			this.close()
		},
		close(){
			this.$refs.popup.close()
		},
		open(){
			this.$refs.popup.open()
			this.init()
		}
	}
}
</script>

<style lang="scss" scoped>
	.region-container{
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		.line1{
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.title{
			color: #333333;
			font-size: 32rpx;
			padding:30rpx 0;
			text-align: center;
			position: relative;
			font-weight: 500;
		}
		.nav-list{
			width:100%;
			height: 100rpx;
			padding: 0 22rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			box-sizing: border-box;
			.item{
				width: 25%;
				color: #333333;
				font-size: 28rpx;
				position: relative;
				height: 50rpx;
				text-align: center;
				transition: font-weight 0.3s;
				&::after{
					content:'';
					display: block;
					height: 6rpx;
					width: 72rpx;
					position: absolute;
					bottom: 0rpx;
					left: 50%;
					transform: translateX(-50%);
					background-color: transparent;
					transition: background-color 0.3s;
				}
				&.selected{
					font-weight: 500;
					&::after{
						background-color: #f60;
					}
				}
			}
		}
		.address-list{
			position: relative;
			flex: 1;
			height:825rpx;
			.a-item{
				padding: 0 24rpx;
				height: 88rpx;
				color:#333333;
				transition: background-color 0.1s;			
				display: flex;
				justify-content: space-between;
				align-items: center;
				&.on{
					color:#f60;
				}
				.text{
					width: 90%;
				}
				&.hover{
					background-color: #e9e9e9;
				}
			}
		}
	}
</style>
