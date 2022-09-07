<template>
	<view class="row my-2">
		<block v-for="(item,index) in resdata.list" :key="index">
			<view class="span24-8 text-center px-2 mb-3">
				<view class="rounded  py-1 font-md text-center border"
					:class="index===resdata.selected?'radio-active':'bg-light-secondary'" @click="changeRadio(index)">
					{{item.name}}
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		ref,
		reactive,
		toRefs,
	} from 'vue'
	export default {
		props: {
			resdata: Object
		},
		setup(props, context) {
			const changeRadio = (index) => {
				//this.$emit('change',index);在调用标签上定义 
				context.emit("change", index)
			}
			return {changeRadio}
		}
		
	}
</script>

<style>
	.radio-active {
		background: #FCE0D5 !important;
		color: #EB7320 !important;
		border-color: #EB7320 !important;
		;
	}
</style>
