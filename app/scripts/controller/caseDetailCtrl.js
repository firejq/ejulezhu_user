/**
 * Created by firejq on 2017-12-10.
 */

'use strict';

angular.module('app').controller('caseDetailCtrl', ['$http', '$scope', '$state', '$sce', 'cache', function ($http, $scope, $state, $sce, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	// eg: http://120.25.74.193/html/projectsample/index.html?id=6&PlateType=ejx&Mobileno=15813879994&Usertype=1&Token=817230581f938c082f85584eddb43ef4&Reqtime=1512806656
	$scope.caseDetailUrl = $sce.trustAsResourceUrl('http://www.ejx88.com:9090/html/projectsample/index.html?id=' + $state.params.id + '&PlateType=ejx&Mobileno=' + mobilenoCookie + '&Usertype=1&Token=' + tokenCookie + '&Reqtime=' + Math.round(new Date().getTime()/1000));


	/**
	 * 全量获取工程案例，获取该id案例的详情
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + "projectsample/all"
	}).then(function (response) {
		//console.log(response);

		if(response.data.status === 0) {

			//console.log(response.data.records);

			for (var i =0 ; i < response.data.records.length; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.id.toString()) {
					//console.log(response.data.records[i]);

					$scope.sampleInfo = response.data.records[i];
					$scope.sampleInfo.Img = $scope.global.imagesServer + $scope.sampleInfo.Img;
					break;
				}
			}

			//console.log($scope.sampleInfo);

		}
	}, function (response) {
		console.log('failed!!' + response);
	});


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
					title: '工程案例', // 分享标题
					desc: $scope.sampleInfo.Desc, // 分享描述
					link: $scope.caseDetailUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 TODO 因此放到生产服务器上，这些设置才能生效
					imgUrl: $scope.sampleInfo.Img, // 分享图标
					type: 'link', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功');
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				//分享到微信朋友圈
				wx.onMenuShareTimeline({
					title: '工程案例', // 分享标题
					link: $scope.caseDetailUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: $scope.sampleInfo.Img, // 分享图标
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功');
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				//分享到QQ
				wx.onMenuShareQQ({
					title: '工程案例', // 分享标题
					desc: $scope.sampleInfo.Desc, // 分享描述
					link: $scope.caseDetailUrl, // 分享链接
					imgUrl: $scope.sampleInfo.Img, // 分享图标
					trigger: function (res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						$scope.global.msg('分享成功');
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



