/**
 * Created by firejq on 2017-10-15.
 */
'use strict';

angular.module('app').controller('myOrderDetailCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//默认进入订单状态页面
	$state.go('myOrderDetail.state');

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.orderDetail = {};

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
		if (response.data.Status === 0) {
			$scope.orderDetail = response.data;

			//格式化下单时间，原格式：20171014092816
			var time = $scope.orderDetail.OrderTime;
			$scope.orderDetail.OrderTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);



			console.log($scope.orderDetail);
		} else {
			$scope.global.msg('订单状态获取出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});

	/**
	 * 取消订单
	 */
	$scope.orderCancel = function () {
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/cancel',
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
				$scope.global.msg('取消订单成功');
				$state.go('myOrder');
			} else {
				$scope.global.msg('取消订单出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});

	};



}]);
