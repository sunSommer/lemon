"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)}require.config({baseUrl:"js/",paths:{mui:"libs/mui.min",dtPicker:"libs/mui.picker.min",popPicker:"libs/mui.poppicker",echarts:"libs/echarts.min"},shim:{dtPicker:{deps:["mui"]},popPicker:{deps:["mui"]}}}),require(["mui","dtPicker","popPicker","echarts"],function(r,t,e,a){console.log(r);var n=window.localStorage.getItem("uid"),i=1,o=20,l=[],c=void 0,s=void 0,u=(new Date).getFullYear(),d=(new Date).getMonth()+1,m=document.querySelector(".year").innerHTML=u+"-"+(d<10?"0"+d:d),p="",y=0,f=0,h=document.querySelectorAll(".list ul li"),v=document.querySelectorAll(".main");function g(e){e?r("#pullrefresh").pullRefresh().endPullupToRefresh(!0):n=window.localStorage.getItem("uid"),setTimeout(function(){r.ajax("/api/getBill",{data:{uid:n,page:i++,pageSize:o},dataType:"json",type:"post",timeout:1e4,success:function(t){t.data?(e?r("#pullrefresh").pullRefresh().endPullupToRefresh(!0):r("#pullrefresh").pullRefresh().endPullupToRefresh(!1),S(l=[].concat(_toConsumableArray(l),_toConsumableArray(t.data)))):r("#pullrefresh").pullRefresh().endPullupToRefresh(!0)},error:function(t,e,n){}})},1500)}function w(t){g(1),n=window.localStorage.getItem("uid"),setTimeout(function(){r.ajax("/api/getDateBill",{data:{uid:n,timer:t||m},dataType:"json",type:"post",timeout:1e4,success:function(t){console.log(t.data),S(t.data)},error:function(t,e,n){}})},1500)}function b(t){var e,n;console.log(t),h.forEach(function(t,e){t.addEventListener("tap",function(){for(var t=0;t<h.length;t++)h[t].classList.remove("active"),v[t].classList.add("current");this.classList.add("active"),v[e].classList.remove("current")})}),e=t,n=0,box.addEventListener("swipeleft",function(){-2<=++n&&(n=1),q(e,n,"outcome")}),box.addEventListener("swiperight",function(){--n<=-1&&(n=0),q(e,n,"chart")}),q(e,n,"chart")}function S(t){b(t);var e="";t.forEach(function(t){"收入"==t.income?f+=t.price:y+=t.price,e+='<li class="lis">\n\t\t\t\t\t<ul id="OA_task_1" class="mui-table-view view"  data-id="'+t._id+'">\n\t\t\t\t\t\t<li class="mui-table-view-cell mui-transitioning">\n\t\t\t\t\t\t\t<div class="mui-slider-right mui-disabled">\n\t\t\t\t\t\t\t\t<a class="mui-btn mui-btn-red del" style="transform: translate(0px, 0px);">删除</a>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="mui-slider-handle handle" style="transform: translate(0px, 0px);">\n\t\t\t\t\t\t\t\t<div class="left">\n\t\t\t\t\t\t\t\t\t<span class="'+t.icon+'"></span>\n\t\t\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t\t\t<li>'+t.style+"</li>\n\t\t\t\t\t\t\t\t\t\t<li>"+t.timer+'</li>\n\t\t\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<span style="color:'+("收入"==t.income?"green":"orange")+'">'+t.price+".00</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</li>"}),document.querySelector(".lists").innerHTML=e,document.querySelector(".income").innerHTML=f+".00",document.querySelector(".money").innerHTML=y+".00",[].concat(_toConsumableArray(document.querySelectorAll(".del"))),[].concat(_toConsumableArray(document.querySelectorAll(".view"))).forEach(function(n){r(n).on("tap",".mui-btn",function(t){var e=this.parentNode.parentNode;r.confirm("确认删除该条账单记录？","删除",i,function(t){0==t.index?r.ajax("/api/deleteBill",{data:{id:n.getAttribute("data-id")},dataType:"json",type:"post",timeout:1e4,success:function(t){document.querySelector(".lis").parentNode.removeChild(document.querySelector(".lis"))},error:function(t,e,n){}}):setTimeout(function(){r.swipeoutClose(e)},0)})});var i=["确认","取消"]})}function q(t,e,n){console.log(e);var i=[],r=[];t.forEach(function(t){"收入"==t.income?i.push({name:t.style,value:t.price}):r.push({name:t.style,value:t.price})});var o,l=a.init(document.getElementById(n));o={tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},series:[{name:e?"支出":"收入",type:"pie",radius:["40%","55%"],label:{normal:{borderColor:"#aaa",rich:{a:{color:"#999",lineHeight:22,align:"center"},hr:{borderColor:"#aaa",width:"100%",borderWidth:.5,height:0},b:{fontSize:16,lineHeight:33},per:{color:"#eee",backgroundColor:"#334455",padding:[2,4],borderRadius:2}}}},data:e?r:i}]},l.setOption(o)}n?g(0):window.location.href="page/login.html",document.querySelector(".exit").addEventListener("tap",function(t){window.localStorage.removeItem("uid"),window.location.reload()}),document.querySelector(".plus").addEventListener("tap",function(){window.location.href="../../page/userClass.html"}),r.init({pullRefresh:{container:"#pullrefresh",up:{contentrefresh:"正在加载...",callback:g}}}),c=new r.DtPicker({type:"month"}),document.querySelector(".year").addEventListener("tap",function(){var e=this;c.show(function(t){e.innerHTML=p==u?t.y.text:t.y.text+"-"+t.m.text,w(e.innerHTML),console.log(t.y),console.log(t.m)})}),(s=new r.PopPicker).setData([{value:"1",text:"年"},{value:"2",text:"月"}]),document.querySelector(".month").addEventListener("tap",function(){var e=this,n=document.querySelector("[data-id='title-y']"),i=document.querySelector("[data-id='title-m']"),r=document.querySelector("[data-id='picker-y']"),o=document.querySelector("[data-id='picker-m']");s.show(function(t){1==t[0].value?(e.innerHTML=t[0].text,i.style.display="none",o.style.display="none",n.style.width="100%",r.style.width="100%",document.querySelector(".year").innerHTML=u,p=u):2==t[0].value&&(e.innerHTML=t[0].text,i.style.display="inline-block",o.style.display="inline-block",n.style.width="50%",r.style.width="50%",document.querySelector(".year").innerHTML=m,p=d)})})});