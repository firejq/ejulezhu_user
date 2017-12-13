/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

angular.module('app').controller('redPackageCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.redPackageData = {
		score: 0,//抢到了多少积分
		visible: {
			anticipate: true,//默认显示抢红包图案
			sad: false,//伤心页默认不显示
			happy: false,//高兴页默认不显示
			rule: false,//规则页面默认不显示
			share: false//分享页面默认不显示
		}
	};




	/**
	 * 抢红包操作
	 */
	$scope.grabRedPackage = function () {
		//获取当前还有多少次机会抢红包
		$http({
			method: 'GET',
			url: $scope.global.url + 'redpackage/chance',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),
				Usertype: 1
			}
		}).then(function (response) {
			if (response.data.status === 0) {
				//console.log('Chance: ' + response.data.Chance);
				if (response.data.Chance > 0) {

					//执行抢红包操作
					$http({
						method: 'GET',
						url: $scope.global.url + 'redpackage/grad',
						params: {
							Mobileno: mobilenoCookie,
							Token: tokenCookie,
							Reqtime: Math.round(new Date().getTime()/1000),
							Usertype: 1
						}
					}).then(function (response) {
						//console.log(response);
						if (response.data.status === 0) {
							if (response.data.Type === 0) {
								//抢到了红包
								//console.log('you get the money:' + response.data.Value);
								$scope.redPackageData.score = response.data.Value;

								//隐藏入口页，显示高兴页（抢到积分大于0）/伤心页（抢到0积分）
								$scope.redPackageData.visible.anticipate = false;
								if ($scope.redPackageData.score === 0) {
									$scope.redPackageData.visible.happy = false;
									$scope.redPackageData.visible.sad = true;
								} else {
									$scope.redPackageData.visible.sad = false;
									$scope.redPackageData.visible.happy = true;
								}
							}
						} else {
							$scope.global.msg('操作出错');
							layer.closeAll();
						}
					}, function (response) {
						console.log('fail! ' + response);
					});

				} else {
					//没有抢红包的机会了
					$scope.global.msg('抱歉，你抢红包的机会用完啦~');
				}
			} else {
				$scope.global.msg('获取信息出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});
	};


	/**
	 * 显示规则页面
	 */
	$scope.showRule = function () {
		$scope.redPackageData.visible.rule = true;
		document.getElementById('rule-article').style.bottom = 0;
	};
	/**
	 * 隐藏规则页面
	 */
	$scope.hideRule = function () {
		$scope.redPackageData.visible.rule = false;
		document.getElementById('rule-article').style.bottom = '-33vh';
	};



	/**
	 * 分享次数加1，增加一次抢红包机会
	 */
	var addChance = function () {
		$http({
			method: 'GET',
			url: $scope.global.url + 'redpackage/share',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),
				Usertype: 1,
				Channel: 'weixin'//分享渠道，暂时写死
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				console.log('add Chance success!')
			} else {
				console.log('add Chance Fail!')
			}
		}, function (response) {
			console.log('fail! ' + response);
		});
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
						//$scope.global.msg('click shared');
					},
					success: function () {
						// 用户确认分享后执行的回调函数
						addChance();
						$scope.global.msg('分享成功，增加一次抢红包机会~');
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
						addChance();
						$scope.global.msg('分享成功，增加一次抢红包机会~');
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
						addChance();
						$scope.global.msg('分享成功，增加一次抢红包机会~');
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


	/**
	 * 弹出提示：点击右上角分享按钮进行分享
	 */
	$scope.showShareTip = function () {
		$scope.global.msg('点击右上角分享按钮进行分享~', 3);
	};


}]);