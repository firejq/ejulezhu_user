/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

/**
 * 热门话题详情页控制器
 */
angular.module('app').controller('hotTopicArticleDetailCtrl', ['$http', '$scope', '$state', '$sce', 'cache', function ($http, $scope, $state, $sce, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	// 增加点击数
	$http({
		url: $scope.global.url + 'hottopics/click',
		method: 'GET',
		params: {
			Id: $state.params.id
		}
	}).then(function (response) {
		if (response.data.status !== 0) {
			console.log('点击数增加出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});

	// 为iframe的src赋值
	$scope.url = $sce.trustAsResourceUrl('http://www.ejx88.com:9090/html/hottopic/index.html?id=' + $state.params.id + '&PlateType=ejx');

	//console.log($scope.url);


	/**
	 * 获取该分类的所有文章，找到该文章并获取其信息
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + "hottopics",
		params:{
			'Catid': $state.params.catId
		}
	}).then(function (response) {
		//console.log(response.data.records);

		if(response.data.status === 0) {
			for (var i = 0; i < response.data.records.length; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.id.toString()) {
					//console.log(response.data.records[i]);
					$scope.hotTopicArticleDetailInfo = response.data.records[i];
					$scope.hotTopicArticleDetailInfo.Img = $scope.global.imagesServer + $scope.hotTopicArticleDetailInfo.Img;
					break;
				}
			}
		}
	}, function (response) {
		console.log('fail! ' + response);
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
					title: $scope.hotTopicArticleDetailInfo.Title, // 分享标题
					desc: $scope.hotTopicArticleDetailInfo.Desc, // 分享描述
					link: $scope.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致 TODO 因此放到生产服务器上，这些设置才能生效
					imgUrl: $scope.hotTopicArticleDetailInfo.Img, // 分享图标
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
					title: $scope.hotTopicArticleDetailInfo.Title, // 分享标题
					link: $scope.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: $scope.hotTopicArticleDetailInfo.Img, // 分享图标
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
					title: $scope.hotTopicArticleDetailInfo.Title, // 分享标题
					desc: $scope.hotTopicArticleDetailInfo.Desc, // 分享描述
					link: $scope.url, // 分享链接
					imgUrl: $scope.hotTopicArticleDetailInfo.Img, // 分享图标
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
				//console.log(JSON.stringify(res));
				$scope.global.msg('出现错误');
			});
		}
	}, function (response) {
		console.log('fail! ' + response);
	});





}]);