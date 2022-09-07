import AMapWX from '@/common/ext/amap-wx.130.js'
const amapFun = new AMapWX({
	key: '5555'
});
const getLocation = (params) => {
	return new Promise((res, rej) => {
		amapFun.getRegeo({
			...params,
			success: function(data) {
				res(data)
			},
			fail: function(info) {
				rej(data)
			}
		})
	})
}
const getWeather = () => {
	amapFun.getWeather({
		success: function(data) {
			console.log(data);
		},
		fail: function(info) {
			console.log(info)
		}
	})
}
export {
	getLocation,getWeather
}
