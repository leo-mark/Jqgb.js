/**
* gbjq.js
* @fileOverview 再见jquery
* @author MARK
* @email 251372419@qq.com
* @site wwww.12mo.com/gbjq/gbjq.js
* @version 1.0
* @date 2013-08-05
* Copyright 
* @example
*    gbJq.Rolling();
*	 getDom.getClass();
*/
var getDom = {
	 /**
     * 获取class对象
     * @param {Object | String} tagName--获取的范围，className--获取的class名
     */
	'getClass' : function(tagName,className){
		if(tagName.getElementsByClassName){                   //兼容获取class对象
			return tagName.getElementsByClassName(className); //如果浏览器支持则用此方法
		}else{
			var aAttry = [];//定义一个空数组;
			var tags = tagName.getElementsByTagName("*"); //获取标签
            for(var i =0; i<tags.length;i++){
            	if(tags[i].className == className){
            		aAttry[aAttry.length] = tags[i]; //把符合的元素放入数组内
				}
            } 
            return aAttry; 
 		}
	},
	/* --------------------获取和设置class样式------------------------ */
	'getStyle' : function(obj,name,value){
	/**
     * 获取和设置对象样式
     * @param {Object | String} obj--获取或者设置的范围，name--要获取或者设置的样式，value--要设置的值
     */
		if(arguments.length == 2){   //参数两个为获取样式
			if(obj.currentStyle){
				return parseInt(obj.currentStyle[name]);  //兼容获取样式
			}else{
				return parseInt(getComputedStyle(obj,false)[name]);
			}
			//return obj.style[name];
		}else{                        //参数三个为设置样式
			return obj.style[name] = value;
		}

	}
}
var gbJq = {
		/* --------------------无缝滚动--------------- */
		'Rolling': function(bosid,speed,oid){
			var oDiv = document.getElementById(bosid); //滚动外框ID
			var oUl = oDiv.getElementsByTagName("ul")[0];//滚动的ul
			var aLi = oUl.getElementsByTagName("li");
			var speed = (speed == undefined) ? 2 : -speed; //速度和方向，检测是否有值，有则用，无则用默认值
			oUl.innerHTML = oUl.innerHTML+ oUl.innerHTML; //复制一份ul
			oUl.style.width = aLi.length * aLi[0].offsetWidth+'px'; //设置ul宽度
			function Move(){
				if(oUl.offsetLeft < -oUl.offsetWidth/2){
					oUl.style.left = '0';     //向左移动临界位置
				}else if(oUl.offsetLeft > 0 ){
					oUl.style.left = -oUl.offsetWidth/2+'px'; //向右移动临界位置
				}
				oUl.style.left = oUl.offsetLeft+speed+'px';
			};
			var _time = setInterval(Move,30);
			oDiv.onmouseover = function(){
				clearInterval(_time);
			};
			oDiv.onmouseout = function(){
				_time = setInterval(Move,30);
			};
			//oid有值，则激活左右按钮滚动状态
			if(oid != undefined){
				var ori = document.getElementById(oid);//获取左右按钮的ID
				var oleft = ori.getElementsByTagName("a")[0];
				var oright = ori.getElementsByTagName("a")[1];
			
				oleft.onclick = function(){
					speed = -2;
					
				};
				oright.onclick = function(){
					speed = 2;
				};
			}
		},

		/* --------------------固定右侧------------------------ */

		'fixed':function(fixedId,distance,backTop){
			var oDiv = document.getElementById(fixedId);
			var backTop = (backTop == undefined) ? false : backTop;//是否激活回到顶部状态
			var distance = (distance == undefined) ? 100 : distance; //距离底部的距离
			window.onscroll = function(){
				//启动回到顶部状态后隐藏显示按钮
				var scrollTOP = document.documentElement.scrollTop || document.body.scrollTop; //scrollTop对象的最顶部到对象在当前窗口显示的范围内的顶边的距离
				if (backTop == true && document.documentElement.scrollTop + document.body.scrollTop > 50) { 
					oDiv.style.display = "block"; 
				} 
				else if(backTop == true){ 
					oDiv.style.display = "none";
					
				}
				//parseInt取整，为的避免除以2的时候出现小数点
				starMove(oDiv,parseInt((document.documentElement.clientHeight - oDiv.offsetHeight) - distance + scrollTOP));

			};
			var _time = null;
			//实现缓冲运动
			function starMove(fixedId,iTarget){
				var oDiv = fixedId;
				clearInterval(_time);
				_time = setInterval(function(){
					var speed = (iTarget - oDiv.offsetTop)/10;
					speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //取整
					if(oDiv.offsetTop == iTarget){
						clearInterval(_time);  //到达目的地，停止setInterval
					}else{
						oDiv.style.top = oDiv.offsetTop+speed+'px';
					}
				},30);
			}
			//激活回到顶部状态
			if(backTop == true){
				oDiv.onclick = function(){
					window.scrollTo(0,0); 
				};
			}
		},
		/* --------------------弹框------------------------ */
		'popBox':function(pid){
			var oDiv = document.getElementById(pid);
			oDiv.style.display = "block";
			var dw = document.documentElement.clientWidth;
			var dh = document.documentElement.clientHeight;
			var bw = oDiv.clientWidth;
			var bh = oDiv.clientHeight;
			//获取元素左边到屏幕的距离
			var boxw = Math.round((dw - bw)/2); 
			var boxh = Math.round((dh - bh)/2);
			//动态创建半透明标签
			var newHTml = document.createElement("div");
			newHTml.id = "pop-bg";
			document.getElementsByTagName("body")[0].appendChild(newHTml);
			//设置半透明标签大小
			newHTml.style.display = "block";
			newHTml.style.width =dw +"px";
			newHTml.style.height = dh +"px";
            //居中弹框
			oDiv.style.left = boxw+"px";
			oDiv.style.top = boxh+"px";
			var oClose = getDom.getClass(oDiv,"close"); //获取class对象
			//alert(oClose.length);
			//console.log(oClose.length)
			for(var i = 0; i <oClose.length; i++){  //必包循环点击
				(function(arg){         
					oClose[i].onclick = function(){
						oDiv.style.display = "none";
						document.getElementsByTagName("body")[0].removeChild(newHTml);
					}
				})(i)
			}
		},
		/* --------------------输入字段的提示------------------------ */
		'placeholder':function(bcolor,ocolor){
			var beforColor = (bcolor == undefined) ? "#A9A9A9" : bcolor;  //设置点击去前颜色
			var originalColor = (ocolor == undefined) ? "#000" : ocolor; //设置点击后颜色
			var aGbplace = [];    //装带有gbplace属性的对象
			var sValueStyle = []; //装带有gbplace属性的value
			var oInput= document.getElementsByTagName("input");
			for(var i =0; i < oInput.length; i++){  //找出所有带gbplace属性的input标签
				if(oInput[i].getAttribute("gbplace")){
					//var ainput = oinput[i];
					aGbplace.push(oInput[i]); // 把符合要求的元素放到aGbplace数组里面
				}
			}
			for(var t =0; t < aGbplace.length; t++){ //获取所有gbplace属性的value
				aGbplace[t].style.color = beforColor; //把有gbplace属性的设置成显示颜色
				sValueStyle.push(aGbplace[t].getAttribute("value"));
				(function(arg){
					aGbplace[t].onclick = function(){
						aGbplace[arg].style.color = originalColor;
						this.setAttribute("value","");
					}
					aGbplace[t].onblur = function(){
						aGbplace[arg].style.color = beforColor;
						this.setAttribute("value",sValueStyle[arg]);
					}
				})(t)
				
			}			
		}
}
