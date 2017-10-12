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
		$rootScope.global = {
			ip: ip,
			url: ip + '/v1/',
			cryptid: '123456',
			Mobileno: '',
			Token: '',
			msg: function (content) {
				layer.open({
					content: content,
					skin: 'msg',
					time: 1
				});
			},
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
			}
		};
	}])

	/**
	 * 监听路由的状态变化
	 * 解决了由于设置 body{height:100%} 导致无法触发 scroll 事件，不设置会导致其它页面样式出错得问题：当路由到 hotTopic 这个 state 时动态修改 style 即可
	 */
	.run(['$transitions', function ($transitions) {
		$transitions.onEnter({entering: 'hotTopic'}, function (transition, state) {
			//console.log(state);
			document.getElementsByTagName('body')[0].style.height='auto';
		});

		$transitions.onExit({exiting: 'hotTopic'}, function (trasition, state) {
			//console.log(state);
			document.getElementsByTagName('body')[0].style.height='100%';
		});
	}]);