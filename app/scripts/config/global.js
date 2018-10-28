/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

angular.module('app')
/**
 * 为全局变量和函数赋值
 */
	.run(['$rootScope', function ($rootScope) {
		var ip = 'http://xxx.xx.xxx.xxx:9090';
		/**
		 * 存储全局变量和方法
		 */
		$rootScope.global = {
			ip: ip,
			url: ip + '/v1/',
			imagesServer: 'http://www.xxx.com:9090/',//图片服务器
			domain: 'www.xxx.com/xxx/',//微信公众号入口的回调地址域名 TODO
			shareDomain:'http://xxx.xx.xxx.xxx:9090',//微信分享地址的域名
			cryptid: '123456',
			Mobileno: '',
			Token: '',
			code: '',//微信授权code，在main首页获取

			footer: {//底部导航栏控制变量
				isShown: false//是否显示，默认不显示
			},

			/**
			 * 计算字符串的hash值
			 * @param input
			 * @returns {string}
			 */
			hashCode: function (input) {
				var I64BIT_TABLE =
					'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
				var hash = 5381;
				var i = input.length - 1;
				if(typeof input === 'string'){
					for (; i > -1; i--)
						hash += (hash << 5) + input.charCodeAt(i);
				} else {
					for (; i > -1; i--)
						hash += (hash << 5) + input[i];
				}
				var value = hash & 0x7FFFFFFF;
				var retValue = '';
				do {
					retValue += I64BIT_TABLE[value & 0x3F];
				} while(value >>= 6);
				return retValue;
			},

			/**
			 * 信息提示
			 * @param content
			 * @param time
			 */
			msg: function (content, time) {
				time = time || 1;//默认值为1s
				layer.open({
					content: content,
					skin: 'msg',
					time: time
				});
			},

			/**
			 * 报错信息提示
			 * @param content
			 */
			cancel: function (content) {
				layer.open({
					content: content,
					btn: '取消',
					shadeClose: false,
					yes: function (index) {
						location.reload();
						layer.close(index);
					}
				});
			},

			/**
			 * 执行对象的浅复制
			 */
			shallowClone: function (myObj) {
				if(typeof(myObj) !== 'object' || myObj === null) return myObj;
				var newObj = {};
				for(var i in myObj){
					newObj[i] = $rootScope.global.shallowClone(myObj[i]);
				}
				return newObj;
			},

			/**
			 * 替换指定位置的字符
			 */
			replacePos: function (strObj, pos, replaceText) {
				return strObj.substr(0, pos - 1) + replaceText + strObj.substring(pos, strObj.length);
			},

			/**
			 * 获取URL参数，name为参数名
			 * @param name
			 * @returns {null}
			 */
			getQueryString: function getQueryString(name) {
				var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				var r = window.location.search.substr(1).match(reg);
				if (r !== null) {
					return unescape(r[2]);
				}
				return null;
			}
		}
	}])

	/**
	 * 监听路由的状态变化
	 * 解决了由于设置 body{height:100%} 导致无法触发 scroll 事件的问题：
	 * 不设置 body{height:100%} 会导致其它页面样式出错的问题，因此只能当路由到需要触发 scroll 事件的路由时动态修改 style。
	 */
	.run(['$transitions', function ($transitions) {

		$transitions.onEnter({
			to: function (state) {
				var showFooterState = [
					'hotTopic',
					'case'
				];
				for (var i = 0; i < showFooterState.length; i ++) {
					if (state.name === showFooterState[i]) {
						return true;
					}
				}
			}
		}, function (transition, state) {
			document.getElementsByTagName('body')[0].style.height='auto';
		});

		//$transitions.onExit({
		//	from: function (state) {
		//		var showFooterState = [
		//			'hotTopic',
		//			'case'
		//		];
		//		for (var i = 0; i < showFooterState.length; i ++) {
		//			if (state.name === showFooterState[i]) {
		//				return true;
		//			}
		//		}
		//	}
		//}, function (transition, state) {
		//	//console.log(state);
		//	document.getElementsByTagName('body')[0].style.height='100%';
		//});

		$transitions.onExit({exiting: 'hotTopic'}, function (transition, state) {
			//console.log(state);
			document.getElementsByTagName('body')[0].style.height='100%';

			//取消注册滚动事件
			//console.log('remove');
			window.onscroll = function () {};

		});

		$transitions.onExit({exiting: 'case'}, function (transition, state) {
			//console.log(state);
			document.getElementsByTagName('body')[0].style.height='100%';

			//取消注册滚动事件
			//console.log('remove');
			window.onscroll = function (event) {};

		});


	}])

	/**
	 * 监听路由变化
	 * 规定指定页面必须登录后才能访问
	 */
	.run(['$transitions', 'cache', '$state', function ($transitions, cache, $state) {
		$transitions.onEnter({
			to: function (state) {
				var redirectState = [
					'myOrder',
					'myOrderDetail',
					'myOrderDetail.state',
					'myOrderDetail.detail',
					'orderPayRecords',
					'confirmMasterPrice',
					'continueQueryPrice',
					'payProgressPayment',
					'finishProjectPay',
					//'overallDecorationSubmit', //TODO 整体装修不登录也可以下单？
					'personalInfo',
					'changePwd',
					'addAddr',
					'manageAddr',
					'editAddress',
					'redPackage',
					'repairBooking',
					'repairBooking.materialPrice',
					'repairBooking.labourPrice',
					'messageBox'
				];
				for (var i = 0; i < redirectState.length; i++) {
					if (state.name === redirectState[i]) {
						return true;
					}
				}
			}
		}, function (transition, state) {
			if (typeof cache.get('Token') === 'undefined' || typeof cache.get('Mobileno') === 'undefined') {
				return $state.target('login');
			}

		})

	}])


	/**
	 * 监听路由的状态变化
	 * 根据不同的路由控制是否显示底部导航栏
	 */
	.run(['$transitions', '$rootScope', function ($transitions, $rootScope) {
		$transitions.onEnter({
			to: function (state) {
				var showFooterState = [
					'main',
					'case',
					'knowledge',
					'me'
				];
				for (var i = 0; i < showFooterState.length; i ++) {
					if (state.name === showFooterState[i]) {
						return true;
					}
				}
			}
		}, function (transition, state) {
			$rootScope.global.footer.isShown = true;
		});

		$transitions.onExit({
			from: function (state) {
				var showFooterState = [
					'main',
					'case',
					'knowledge',
					'me'
				];
				for (var i = 0; i < showFooterState.length; i ++) {
					if (state.name === showFooterState[i]) {
						return true;
					}
				}
			}
		}, function (transition, state) {
			$rootScope.global.footer.isShown = false;
		});

	}]);

