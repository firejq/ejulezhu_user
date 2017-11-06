/**
 * Created by firejq on 2017-11-04.
 */
'use strict';

angular.module('app').controller('messageBoxCtrl', ['$scope', 'cache', '$http', '$state', function ($scope, cache, $http, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	//用户消息容器
	$scope.messageData = {
		orderMessage: {},//订单消息
		systemMessage: {}//系统消息
	};


	/**
	 * 获取用户订单消息状态
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'message/stat',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Messagetype: 1//消息类型（1：订单消息， 2：系统消息， 传空的时候为获取这两类消息的状态）
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data);
			$scope.messageData.orderMessage.unReadNum = response.data.Unreadnum;
			$scope.messageData.orderMessage.unReadTimeStamp = response.data.Unreadtimestamp;

		} else {
			$scope.global.msg('获取用户消息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});

	/**
	 * 获取用户系统消息状态
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'message/stat',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Messagetype: 2//消息类型（1：订单消息， 2：系统消息， 传空的时候为获取这两类消息的状态）
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data);
			$scope.messageData.systemMessage.unReadNum = response.data.Unreadnum;
			$scope.messageData.systemMessage.unReadTimeStamp = response.data.Unreadtimestamp;


		} else {
			$scope.global.msg('获取用户消息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});




	/**
	 * 获取用户订单消息列表
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'message/list',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Messagetype: 1//消息类型（1：订单消息， 2：系统消息， 传空的时候为获取这两类消息的状态）
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data);
			$scope.messageData.orderMessage.records = response.data.records;
			//console.log($scope.messageData);

		} else {
			$scope.global.msg('获取用户消息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});

	///**
	// * 获取用消息详细内容 TODO 用在哪？
	// */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + 'message/detail',
	//	params: {
	//		Mobileno: mobilenoCookie,
	//		Usertype: 1,
	//		Token: tokenCookie,
	//		Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
	//		Id: 0//消息Id，从获取用户消息列表的结果获得
	//	}
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		console.log(response.data);
	//
	//
	//	} else {
	//		$scope.global.msg('获取用户消息出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});


	///**
	// * 删除一条用户消息 TODO 用在哪？
	// */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + 'message/delete',
	//	params: {
	//		Mobileno: mobilenoCookie,
	//		Usertype: 1,
	//		Token: tokenCookie,
	//		Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
	//		Id: 0//消息Id，从获取用户消息列表的结果获得
	//	}
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		console.log(response.data);
	//
	//
	//	} else {
	//		$scope.global.msg('获取用户消息出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});

	///**
	// * 消息已阅读
	// */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + 'message/',//TODO 接口地址有问题
	//	params: {
	//		Mobileno: mobilenoCookie,
	//		Usertype: 1,
	//		Token: tokenCookie,
	//		Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
	//		Readid: 0//消息Id，从获取用户消息列表的结果获得
	//	}
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		console.log(response.data);
	//
	//
	//	} else {
	//		$scope.global.msg('获取用户消息出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});






}]);

