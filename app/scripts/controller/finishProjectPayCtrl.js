/**
 * Created by firejq on 2017-10-21.
 */
'use strict';

angular.module('app').controller('finishProjectPayCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {
	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.finishProjectPayData = {};
	$scope.fee = 0;


	/**
	 * 获取订单详细信息和状态
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/status',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderno: $state.params.orderNo,
			Orderid: $state.params.orderId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.Status === 0) {
			//将订单详情赋值到$scope.finishProjectPayData中
			$scope.finishProjectPayData = response.data;

			//格式化下单时间，原格式：20171014092816，格式化为2017-10-14 09:28:16
			var time = $scope.finishProjectPayData.OrderTime;
			$scope.finishProjectPayData.OrderTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);
			time = $scope.finishProjectPayData.Appointmenttime;
			$scope.finishProjectPayData.Appointmenttime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);

			console.log($scope.finishProjectPayData);
		} else {
			$scope.global.msg('获取信息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});





	/**
	 * 获取订单还没支付的金额
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/getorderremainingfee',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderno: $state.params.orderNo,
			Orderid: $state.params.orderId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.fee);
			$scope.fee = response.data.fee;

			//console.log($scope.fee);

		} else {
			$scope.global.msg('获取信息出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


}]);