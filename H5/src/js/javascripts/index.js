require.config({
	baseUrl: "js/",
	paths: {
		"mui": "libs/mui.min",
		"dtPicker": "libs/mui.picker.min",
		"popPicker": "libs/mui.poppicker",
		"echarts": "libs/echarts.min"
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


require(['mui', 'dtPicker', 'popPicker', 'echarts'], function(mui, dtPicker, popPicker, echarts) {
	console.log(mui)
	let uid = window.localStorage.getItem("uid");
	let page = 1;
	let pageSize = 20;
	let newData = [];
	let dtPickerTime;
	let popPickerTime;
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth() + 1;
	let currentYearHTML = document.querySelector(".year").innerHTML = currentYear + '-' + (currentMonth < 10 ? '0' +
		currentMonth : currentMonth);
	let curym = "";
	let expense = 0.00;
	let getIncome = 0.00;
	let lis = document.querySelectorAll(".list ul li");
	let main = document.querySelectorAll(".main");

	//判断登录注册
	if (!uid) {
		window.location.href = "page/login.html"
	} else {
		getBill(0);
	};

	function init() {
		pullRefreshes();
		dtPickerTime = new mui.DtPicker({
			"type": "month"
		});
		dates();
		popPickerTime = new mui.PopPicker();
		popPickerTime.setData([{
				value: '1',
				text: '年'
			},
			{
				value: '2',
				text: '月'
			}
		]);
		monthes();

	}

	//上拉加载
	function pullRefreshes() {
		mui.init({
			pullRefresh: {
				container: '#pullrefresh',
				up: {
					contentrefresh: '正在加载...',
					callback: getBill
				}
			}
		});
	};

	//日历
	function dates() {
		document.querySelector(".year").addEventListener('tap', function() {
			let _this = this
			dtPickerTime.show(function(selectItems) {
				if (curym == currentYear) {
					_this.innerHTML = selectItems.y.text;
					getDateBill(_this.innerHTML)
				} else {
					_this.innerHTML = selectItems.y.text + '-' + selectItems.m.text;
					getDateBill(_this.innerHTML)
				}

				console.log(selectItems.y); //{text: "2016",value: 2016} 
				console.log(selectItems.m); //{text: "05",value: "05"} 
			})
		})
	}

	// 年/月
	function monthes() {
		document.querySelector(".month").addEventListener('tap', function() {
			let _this = this
			let titleY = document.querySelector("[data-id='title-y']");
			let titleM = document.querySelector("[data-id='title-m']");
			let pickerY = document.querySelector("[data-id='picker-y']");
			let pickerM = document.querySelector("[data-id='picker-m']");

			popPickerTime.show(function(selectItems) {
				if (selectItems[0].value == 1) {
					_this.innerHTML = selectItems[0].text
					titleM.style.display = "none";
					pickerM.style.display = "none";
					titleY.style.width = "100%";
					pickerY.style.width = "100%";

					document.querySelector(".year").innerHTML = currentYear;
					curym = currentYear;

				} else if (selectItems[0].value == 2) {
					_this.innerHTML = selectItems[0].text
					titleM.style.display = "inline-block";
					pickerM.style.display = "inline-block";
					titleY.style.width = "50%";
					pickerY.style.width = "50%";

					document.querySelector(".year").innerHTML = currentYearHTML
					curym = currentMonth
				}
				//console.log(selectItems[0].text); //智子
				//console.log(selectItems[0].value); //zz 
			})
		})
	}

	//渲染首页数据,上拉加载
	function getBill(stops) {
		stops ? mui('#pullrefresh').pullRefresh().endPullupToRefresh(true) :
			uid = window.localStorage.getItem("uid");
		setTimeout(function() { //loading等待效果
			mui.ajax('/api/getBill', {
				data: {
					uid: uid,
					page: page++,
					pageSize: pageSize
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					if (!data.data) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了
					} else {
						stops ? mui('#pullrefresh').pullRefresh().endPullupToRefresh(true) :
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为false代表还有数据
						newData = [...newData, ...data.data]
						render(newData)
					}
				},
				error: function(xhr, type, errorThrown) {}
			});
		}, 1500)
	};

	//根据日历的时间渲染列表
	function getDateBill(timer) {
		getBill(1)
		uid = window.localStorage.getItem("uid");
		setTimeout(function() { //loading等待效果
			mui.ajax('/api/getDateBill', {
				data: {
					uid: uid,
					timer: timer || currentYearHTML
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				success: function(data) {
					console.log(data.data)
					render(data.data)
				},
				error: function(xhr, type, errorThrown) {}
			});
		}, 1500)
	};

	//点击退出，退出当前用户账单
	document.querySelector(".exit").addEventListener('tap', function(event) {
		window.localStorage.removeItem("uid")
		window.location.reload()
	})

	//删除单条账单
	function deletes() {
		const del = [...document.querySelectorAll(".del")];
		const view = [...document.querySelectorAll(".view")];
		view.forEach(item => {
			mui(item).on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				mui.confirm('确认删除该条账单记录？', '删除', btnArray, function(e) {
					if (e.index == 0) {
						// console.log(this)
						mui.ajax('/api/deleteBill', {
							data: {
								id: item.getAttribute("data-id")
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 10000, //超时时间设置为10秒；
							success: function(data) {
								document.querySelector(".lis").parentNode.removeChild(document.querySelector(".lis"))
							},
							error: function(xhr, type, errorThrown) {}
						});
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			});
			var btnArray = ['确认', '取消'];
		})
	};

	//添加账单
	document.querySelector(".plus").addEventListener('tap', function() {
		window.location.href = "../../page/userClass.html";
	})

	//tab切换
	function tab(data) {
		console.log(data)
		lis.forEach((file, idx) => {
			file.addEventListener('tap', function() {
				for (let i = 0; i < lis.length; i++) {
					lis[i].classList.remove("active");
					main[i].classList.add("current");
				}
				this.classList.add("active");
				main[idx].classList.remove("current");
			})
		})
		swiperSlide(data)
	}
	//swiper slider 滑动

	function swiperSlide(data) {

		let count = 0
		box.addEventListener("swipeleft", function() {

			count++
			if (count >= -2) count = 1
			echart(data, count, "outcome")
		})
		box.addEventListener("swiperight", function() {

			count--
			if (count <= -1) count = 0
			echart(data, count, "chart")
		})
		echart(data, count, "chart")
	}
	//渲染数据
	function render(data) {
		tab(data)
		let str = "";
		data.forEach(item => {
			if (item.income == "收入") {
				getIncome += item.price
			} else {
				expense += item.price
			}
			str +=
				`<li class="lis">
					<ul id="OA_task_1" class="mui-table-view view"  data-id="${item._id}">
						<li class="mui-table-view-cell mui-transitioning">
							<div class="mui-slider-right mui-disabled">
								<a class="mui-btn mui-btn-red del" style="transform: translate(0px, 0px);">删除</a>
							</div>
							<div class="mui-slider-handle handle" style="transform: translate(0px, 0px);">
								<div class="left">
									<span class="${item.icon}"></span>
									<ol>
										<li>${item.style}</li>
										<li>${item.timer}</li>
									</ol>
								</div>
								<span style="color:${item.income == '收入' ? 'green' : 'orange'}">${item.price}.00</span>
							</div>
						</li>
					</ul>
				</li>`
		})
		document.querySelector(".lists").innerHTML = str;
		document.querySelector(".income").innerHTML = getIncome + '.00';
		document.querySelector(".money").innerHTML = expense + '.00';
		deletes();
	}

	init();

	function echart(data, i, idName) {
		console.log(i)
		const incomeArr = [],
			outcomeArr = []

		data.forEach(item => {
			item.income == "收入" ? incomeArr.push({
				name: item.style,
				value: item.price,
			}) : outcomeArr.push({
				name: item.style,
				value: item.price,
			})
		})


		var myChart = echarts.init(document.getElementById(idName));
		var option = {};


		option = {
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},

			series: [
				{
					name: i ? "支出":"收入",
					type: 'pie',
					radius: ['40%', '55%'],
					label: {
						normal: {
							// formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
							// backgroundColor: '#eee',
							borderColor: '#aaa',
							// borderWidth: 1,
							// borderRadius: 4,
							// shadowBlur:3,
							// shadowOffsetX: 2,
							// shadowOffsetY: 2,
							// shadowColor: '#999',
							// padding: [0, 7],
							rich: {
								a: {
									color: '#999',
									lineHeight: 22,
									align: 'center'
								},
								// abg: {
								//     backgroundColor: '#333',
								//     width: '100%',
								//     align: 'right',
								//     height: 22,
								//     borderRadius: [4, 4, 0, 0]
								// },
								hr: {
									borderColor: '#aaa',
									width: '100%',
									borderWidth: 0.5,
									height: 0
								},
								b: {
									fontSize: 16,
									lineHeight: 33
								},
								per: {
									color: '#eee',
									backgroundColor: '#334455',
									padding: [2, 4],
									borderRadius: 2
								}
							}
						}
					},
					data: i ? outcomeArr : incomeArr
				}
			]
		};
		myChart.setOption(option);
	}

})
