require.config({
	baseUrl: "../js/",
	paths: {
		"mui": "libs/mui.min"
	}
})


require(['mui'], function(mui) {
	console.log(mui)
	let localStorage = window.localStorage;
	document.querySelector(".sure").addEventListener('tap', function() {
		let name = document.querySelector(".name").value;
		let pwd = document.querySelector(".pwd").value;
		if (!name || !pwd) {
			mui.alert('用户名和密码不能为空', '提示', '确定', function(e) {})
		} else {
			mui.ajax('/api/login', {
				data: {
					name: name,
					pwd: pwd
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					console.log(data)
					if (data.code == 1) {
						mui.alert(data.msg,'提示','确定',function (e) {
						   location.href = "../../page/register.html"
						})
					} else if (data.code == 2) {
						localStorage.setItem("uid", data.data)
						location.href = "../../index.html"
					}
				},
				error: function(xhr, type, errorThrown) {

				}
			});
		}

	})
})
