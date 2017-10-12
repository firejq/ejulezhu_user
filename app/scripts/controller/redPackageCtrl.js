/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

angular.module('app').controller('redPackageCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	/**
	 * 分享次数加1，增加一次抢红包机会
	 */
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
			console.log('add chance successfully');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 获取当前还有多少次机会抢红包
	 */
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
			console.log('Chance: ' + response.data.Chance);
		} else {
			$scope.global.msg('获取信息出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 执行抢红包操作
	 */
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
		if (response.data.status === 0) {
			console.log('you get the money:' + response.data.Value);
		} else {
			$scope.global.msg('操作出错');
			layer.closeAll();
		}
	}, function (response) {
		console.log('fail! ' + response);
	});



}]);