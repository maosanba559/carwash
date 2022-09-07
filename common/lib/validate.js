export default {
	validate: (obj, rules) => {
		for (let key in rules) {
			let temp = rules[key]
			for (let i = 0; i < temp.length; i++) {
				if (!(temp[i].rule).test(obj[key])) {
					uni.showToast({
						title: temp[i].msg,
						icon: 'none'
					});
					return false
				}
			}
		}
		return true
	}
}
