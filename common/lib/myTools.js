export function checkout() {
	uni.showModal({
		content: '确定清洗完成要出场吗？',
		success: function(res) {
			if (res.confirm) {
				uni.showToast({
					title: '结算成功',
					icon: 'none'
				});
			}
		}
	});

}
