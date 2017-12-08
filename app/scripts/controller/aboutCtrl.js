/**
 * Created by firejq on 2017-12-07.
 */
'use strict';

angular.module('app').controller('aboutCtrl', ['$http', '$scope', 'cache', function ($http, $scope, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	/**
	 * 弹出提示：点击右上角分享按钮进行分享
	 */
	$scope.showShareTip = function () {
		$scope.global.msg('点击右上角分享按钮进行分享~', 3);
	};

	/**
	 * 获取微信sdk参数
	 * 注册分享监听事件
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'wxjssdk/config',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000),
			Usertype: 1,
			Url: location.href.split('#')[0]//调用jssdk的URL路径
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.config);

			wx.config({
				debug: false,
				appId: 'wx8f87a4579e561e2f', // 必填，公众号的唯一标识
				timestamp: response.data.config.timestamp, // 必填，生成签名的时间戳
				nonceStr: response.data.config.noncestr, // 必填，生成签名的随机串
				signature: response.data.config.signature,// 必填，签名，见附录1
				jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.ready(function(){
				//$scope.global.msg('wxsdk config 验证成功');

				// 微信 JS 接口签名校验工具 https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign

				//分享到微信好友
				wx.onMenuShareAppMessage({
					title: 'e家修', // 分享标题
					desc: '一款基于方便客户维修装修的APP，注册分享即可抢红包哦!', // 分享描述
					link: 'http://120.25.74.193/v1/web/download', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 TODO 因此放到生产服务器上，这些设置才能生效
					imgUrl: 'http://www.ejx88.com:9090/static/confimg/client_logo.png', // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功~');
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				//分享到微信朋友圈
				wx.onMenuShareTimeline({
					title: 'e家修', // 分享标题
					link: 'http://120.25.74.193/v1/web/download', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: 'http://www.ejx88.com:9090/static/confimg/client_logo.png', // 分享图标
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功~');
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				//分享到QQ
				wx.onMenuShareQQ({
					title: 'e家修', // 分享标题
					desc: '一款基于方便客户维修装修的APP，注册分享即可抢红包哦!', // 分享描述
					link: 'http://120.25.74.193/v1/web/download', // 分享链接
					imgUrl: 'http://www.ejx88.com:9090/static/confimg/client_logo.png', // 分享图标
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功~');
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
			});
			wx.error(function(res){
				console.log(JSON.stringify(res));
				$scope.global.msg('出现错误');
			});
		}
	}, function (response) {
		console.log('fail! ' + response);
	});




}]);




