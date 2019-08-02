require.config({
	baseUrl: "../js/",
	paths: {
		"mui": "libs/mui.min",
		"dtPicker": "libs/mui.picker.min",
		"popPicker": "libs/mui.poppicker"
	},
		shim: {
			"dtPicker": {
				deps: ["mui"]
			},
			"popPicker": {
				deps: ["mui"]
			}
		}
})


require(['mui','dtPicker'], function(mui,dtPicker) {
	console.log(mui)

	//全局变量
	let uid = window.localStorage.getItem("uid");
	let tabLis = document.querySelectorAll(".tab-list ul li");
	let tabMain = document.querySelectorAll(".tabMain");
	let mainUl = document.querySelector(".main-lists");
	let counter = document.querySelectorAll(".counter ul li span");
	let txt = document.querySelector(".txt");
	let del = document.querySelector(".del");
	let ok = document.querySelector(".ok");
	let dtpicker;
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth() + 1;
	let currentDay = new Date().getDay();
	let currentTime = document.querySelector(".date").innerHTML =currentYear + '-' + (currentMonth > 10 ? currentMonth : '0' + currentMonth) + '-' + (currentDay > 10 ? currentDay : '0' + currentDay);

	function init() {
		getTab("支出");
		tab();
		counters();
		addBill();
		dtPicker = new mui.DtPicker({
			type:"date"
		}); 
		dtPickerTime();
	}

	//tab切换
	function tab() {
		mui('.tab-list ul').on('tap', 'li', function() {
			for (let i = 0; i < tabLis.length; i++) {
				tabLis[i].classList.remove("active");
			}
			this.classList.add("active");
			getTab(this.innerHTML);
		})
	};

	//添加账单
	function addBill() {
		ok.addEventListener('tap', function() {
			let icon = document.querySelector(".tab-active span").className;
			let income = document.querySelector(".tab-list .active").innerHTML;
			let style = document.querySelector(".tab-active").nextElementSibling.innerText;
			let timer = document.querySelector(".date").innerHTML;
			console.log(timer)
			mui.ajax('/api/addBill', {
				data: {
					uid: uid,
					icon: icon,
					style:style,
					income:income,
					timer:timer,
					price:txt.value * 1
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					mui.alert(data.msg,'提示','确定',function () {
						window.location.href = "../../index.html"
					})
				},
				error: function(xhr, type, errorThrown) {

				}
			});
		})
	}

	//日期时间
	function dtPickerTime () {
		document.querySelector(".date").addEventListener('tap',function () {
			_this = this;
			dtPicker.show(function (selectItems) {
				_this.innerHTML = selectItems.y.text + '-' + selectItems.m.text + '-' + selectItems.d.text;
			    //console.log(selectItems.m);//{text: "2016",value: 2016} 
			    //console.log(selectItems.d);//{text: "05",value: "05"} 
			})
		})
		
	}

	//tab切换时发送请求
	function getTab(income) {
		mui.ajax('/api/getClass', {
			data: {
				uid: uid,
				income: income
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				render(data.data)
			},
			error: function(xhr, type, errorThrown) {

			}
		});
	};

	//计算器
	function counters() {
		mui('.counter ul li').on('tap', 'span', function() {
			// txt.value += this.innerHTML
			_this = this;
			if (this.innerHTML == "X") {
				txt.value = txt.value.length == 1 ? "0.00" : txt.value.substr(0, txt.value.length - 1)
				console.log(txt.value)
			} else if (txt.value == "0.00") {
				txt.value = this.innerHTML
			} else {
				txt.value += this.innerHTML
			}
		});
	};

	//点击自定义添加图标
	function add () {
		let add = document.querySelector(".add");
		add.addEventListener('tap',function () {
			let style = document.querySelector(".tab-list ul .active").innerHTML;
			window.localStorage.setItem("style",style);
			window.location.href = "addClass.html";
			
		})
	}

	//数据渲染
	function render(data) {
		let str = "";
		data.forEach(item => {
			str +=
				`<dd>
					<p><span class="${item.icon}""></span></p>
					<p>${item.style}</p>
				</dd>`
		})
		mainUl.innerHTML = str +
			`<dd class="add">
				<p><span class="mui-icon mui-icon-plus"></span></p>
				<p>自定义</p>
			</dd>`;
		tabIcon();
		add();

	};

	//点击高亮
	function tabIcon() {
		let icons = document.querySelectorAll(".main-lists dd");
		mui('.main-lists').on('tap', 'dd', function() {
			for (var i = 0; i < icons.length; i++) {
				icons[i].firstElementChild.classList.remove("tab-active");
			}
			this.firstElementChild.classList.add("tab-active");
		})
	};
	
	//返回上一个页面
	document.querySelector(".back").addEventListener('tap',function () {
		window.location.href = "../../index.html"
	})
	

	init();
})
