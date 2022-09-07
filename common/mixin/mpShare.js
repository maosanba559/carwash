export default{
    data(){
        return {
			safeAreaInsets:34
        }
    },
	mounted() {
		this.safeAreaInsets = getApp().globalData.safeAreaInsets
	}
    
}