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
			rule: false//规则页面默认不显示
		},
	};

	/**
	 * 分享次数加1，增加一次抢红包机会
	 */
	$scope.share = function () {
		$http({
			method: 'GET',
			url: $scope.global.url + 'redpackage/share',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),
				Usertype: 1,
				Channel: 'weixin' //分享渠道，如weixin
			}
		}).then(function (response) {
			if (response.data.status === 0) {
				//TODO 分享的页面还没做
				//console.log('Shared! Add chance successfully');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});
	};


	/**
	 * 抢红包
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
	};
	/**
	 * 隐藏规则页面
	 */
	$scope.hideRule = function () {
		$scope.redPackageData.visible.rule = false;
	};


}]);