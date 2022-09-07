<template>
	<view class="bg-white p-2 h-100 text-muted">
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app";
	export default {
		setup() {
			const content = ref('')
			onLoad((e) => {
				getProtocol(e.type)
			})
			const getProtocol = (type) => {
				
			}
			return {
				content
			}
		}
	}
</script>

<style>

</style>
