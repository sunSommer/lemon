require.config({
	baseUrl:"js/",
	paths:{
		"mui":"libs/mui.min"
	}
})

require(['mui'],function (mui) {
	console.log(mui)
})