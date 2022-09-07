<template>
	<view>
		<uni-collapse accordion>
			<uni-collapse-item :title="item.title" v-for="(item,index) in courses" :key="item.noticeId">
				<view class="content">
					<rich-text :nodes="item.content"></rich-text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
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
			const courses = ref([])
			onLoad(() => {
				getCourses()
			})
			const getCourses = () => {
				const data = {"msg":"success","code":0,"list":[{"noticeId":"1510080407415140353","title":"车辆入场流程","content":"<ol><li>添加车辆&nbsp;</li><li>充值缴费&nbsp;</li><li>开车入场 (首次绑定车牌如果无法驶入，需倒车重新识别)</li><li>结算出门</li></ol>","createTime":"2022-04-02 10:23:18","type":1,"img":""},{"noticeId":"1510083315594539010","title":"车辆清洗流程","content":"<ol><li><p>持水枪用清水冲洗车身--建<br/>议水枪离车身15-30cm与车身成45度角，从中间到两边、从上到下<br/>冲洗车身，第一遍简单冲洗车身，一般1分钟内完成。<br/></p></li><li><p>清水冲洗完毕后，持泡沫鼓在车身上喷洒洗车泡<br/>沫--建议站在离车身一米左右位置，此时只需大部分车身覆盖泡沫<br/>即可，一般30~60秒。<br/></p></li><li><p>使用毛巾、拖把等擦拭车身--建议从车顶往下擦，最后擦车轮。</p></li><li><p>再次手持水枪用清水冲洗干净全车身泡沫，与第一遍冲清水步骤一致。</p></li><li><p>用毛巾等擦拭车身，吸干车身表面水分。</p></li><li><p>清洗完成，一定要在小程序按“结算开门”方可离开。</p></li></ol>","createTime":"2022-04-02 10:34:51","type":1,"img":""},{"noticeId":"1510168524864204802","title":"常见问题之为什么无法开门？","content":"<ul><li>检查您当前车辆是否已经添加到小程序内。</li><li>余额&gt;=1才能入场，如果余额不足，请先充值。</li><li>首次添加车牌后需倒车重新识别。</li><li>查看当前门店工位使用状态。(<font size=\"1\">门店状态可到小程序门店列表查看</font>)。</li><li>为了避免出场时二次扫描车牌导致错误计费，如果您距上次出场时间在10分钟内也无法开门。（<font color=\"#f9963b\">如您有物品遗忘在店内，可拨打店主电话或联系在线客服协助处理</font>）</li></ul>","createTime":"2022-04-02 16:13:27","type":1,"img":""},{"noticeId":"1521851271764541442","title":"无牌车如何入场？","content":"<p>前往需要入场的门店详情页，点击底部菜单【无牌车通道】</p>","createTime":"2022-05-04 21:56:29","type":1,"img":""},{"noticeId":"1526123062859243521","title":"在规定时间内没有入场或出场该如何处理？","content":"<p>开关门的默认时间为15秒。</p><p><br/></p><p>入场：在规定时间内没有驶入，只需倒车重新识别即可入场。<br/></p><p><br/></p><p>出场：在规定时间内没有驶出，可再次点击小程序按钮【结算开门】，在50秒内都可以再次开门。即使超过50秒也无须担心，只需拨打门店电话，我们的工作人员会为您及时开门。<br/></p>","createTime":"2022-05-16 16:50:52","type":1,"img":""}]}
				courses.value = data.list
			}
			return {courses}
		}
	}
</script>

<style>
	.content {
		padding: 20rpx;
	}
</style>
