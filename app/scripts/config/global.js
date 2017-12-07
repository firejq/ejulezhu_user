/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

angular.module('app')
/**
 * 为全局变量和函数赋值
 */
	.run(['$rootScope', function ($rootScope) {
		var ip = 'http://120.25.74.193';
		/**
		 * 存储全局变量和方法
		 */
		$rootScope.global = {
			ip: ip,
			url: ip + '/v1/',
			cryptid: '123456',
			Mobileno: '',
			Token: '',
			code: '',//微信授权code
			//domain: 'http://api.firejq.com/',//部署该web app的域名

			footer: {//底部导航栏控制变量
				isShown: false//是否显示，默认不显示
			},

			/**
			 * 信息提示
			 * @param content
			 */
			msg: function (content) {
				layer.open({
					content: content,
					skin: 'msg',
					time: 1
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
	 * 解决了由于设置 body{height:100%} 导致无法触发 scroll 事件，不设置会导致其它页面样式出错得问题：当路由到 hotTopic
	 * 这个 state 时动态修改 style 即可
	 */
	.run(['$transitions', function ($transitions) {
		$transitions.onEnter({entering: 'hotTopic'}, function (transition, state) {
			//console.log(state.name);
			document.getElementsByTagName('body')[0].style.height='auto';
		});

		$transitions.onExit({exiting: 'hotTopic'}, function (transition, state) {
			//console.log(state);
			document.getElementsByTagName('body')[0].style.height='100%';
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


