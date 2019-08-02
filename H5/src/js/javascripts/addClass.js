require.config({
	baseUrl: "../js/",
	paths: {
		"mui": "libs/mui.min",
		// "dtPicker": "libs/mui.picker.min",
		// "popPicker": "libs/mui.poppicker"
	},
	// 	shim: {
	// 		"dtPicker": {
	// 			deps: ["mui"]
	// 		},
	// 		"popPicker": {
	// 			deps: ["mui"]
	// 		}
	// 	}
})

require(['mui'], function(mui) {
	console.log(mui)

	//全局变量
	let uid = window.localStorage.getItem("uid");
	let income = window.localStorage.getItem("style");
	let iconSlider = document.querySelector(".icon-slider");
	let topIcon = document.querySelector(".topIcon");
	let save = document.querySelector(".save");
	let txt = document.querySelector(".txt");
	let target = [];
	console.log(save)

	function init() {
		getIcon();
	}


	function getIcon() {
		mui.ajax('/api/getIcons', {
			data: {
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				var num = Math.ceil(data.data.length / 10);
				for (var i = 0; i < num; i++) {
					target.push(data.data.splice(0, 20))
				}
				let str = "";
				target.forEach(file => {
					str += `<div class="mui-slider-item">
									<ul class="list">`
					file.map(item => {
						str += `<li>
										<p><span class="${item.icon}"></span></p>
									</li>`
					}).join("")
					str += `</ul>
								</div>`
				})
				iconSlider.innerHTML = str;
				//初始化轮播图
				var gallery = mui('.mui-slider');
				gallery.slider({
					interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
				});
				
				saveIcon();
			},
			error: function(xhr, type, errorThrown) {}
		});
	};

	function saveIcon () {
		let icons = document.querySelectorAll(".list li p");
		console.log(icons)
		icons.forEach(file => {
			file.addEventListener('tap',function () {
				topIcon.firstElementChild.className = this.firstElementChild.className;
			})
		})
		
		save.addEventListener('tap',function () {
			let style = txt.value;
			console.log(income)
			mui.ajax('/api/addClass',{
				data:{
					uid:uid,
					icon:topIcon.firstElementChild.className,
					style:style,
					income:income
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					console.log(data)
					mui.alert(data.msg,'提示','确定',function () {
					   window.location.href = "../../page/userClass.html"
					})
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
		})
	}

	init();
})
