/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('feedbackCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	// 初始化数据
	$scope.feedbackData = {
		type: [],
		selectType: '',
		advise: ''
	};

	/**
	 * 获得反馈类型
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'feedback/getfeedbacktype'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			$scope.feedbackData.type = response.data.records;
		} else {

		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	// TODO 图片上传要使用另外的API

	/**
	 * 提交反馈
	 */
	$scope.feedbackSubmit = function () {
		console.log($scope.filetest);
		return;
		console.log($scope.feedbackData);
		$http({
			url: $scope.global.url + 'feedback',
			method: 'GET',
			params: {
				Mobileno: cache.get('Mobileno'),//传已登录用户手机号码，没登陆用户传空
				Feedback: $scope.feedbackData.advise,//用户反馈内容
				Feedbacktype: $scope.feedbackData.selectType,//用户反馈类型
				Imageid: ''//图片id (多个的时候用逗号分开)//TODO
			}
		}).then(function (response) {
			if (response.data.status === 0) {
				$scope.global.msg('提交反馈成功');
			} else {
				$scope.global.msg('提交反馈出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('连接超时');
		});
	};


	/**
	 * 图片文件上传 TODO
	 */
	$http({
		url: $scope.global.url + 'image/upload',
		method: 'POST',
		//headers: {
		//	'Content-Type': undefined
		//},
		data: {
			Mobileno: cache.get('Mobileno'),
			Token: cache.get('Token'),
			Reqtime: Math.round(new Date().getTime()/1000),
			File: ''//图片文件
		}
	}).then(function (response) {
		if (response.data.status === 0) {

		} else {
			$scope.global.msg('图片上传出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
		$scope.global.msg('连接超时');
	});

}]);

