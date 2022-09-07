<template>
	<view>
		<view class="d-flex a-center" style="color: #ff5934;">
			<block v-if="num > 0 && integral == 0">
				<text class="font-bold" :class="priceClass" :style="isPrice?accountStyle:''">¥</text>
				<text class="font-bold ml" :style="accountStyle">{{num}}</text>
			</block>
			<block v-else-if="num > 0 && integral > 0">
				<text class="font-bold" :class="priceClass" :style="isPrice?accountStyle:''">¥</text>
				<text class="font-bold ml" :style="accountStyle">{{num}}</text>
				<text class="font-sm"> +{{integral}}积分</text>
			</block>
			<block v-else-if="num == 0 && integral > 0">
				<text class="font-bold ml" :style="accountStyle">{{integral}}积分</text>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		name:"price",
		props:{
			num:{
				type:[Number,String],
				default:0
			},
			integral:{
				type:[Number,String],
				default:0
			},
			priceClass:{
				type:String,
				default:''
			},
			isPrice:{
				type:Boolean,
				default:true
			},
			accountStyle:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>