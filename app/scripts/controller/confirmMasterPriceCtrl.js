/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('confirmMasterPriceCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.orderId = $state.params.orderId;
	$scope.orderNo = $state.params.orderNo;


	/**
	 * 获取师傅报价信息
	 */
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/getpricinglog',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Orderid: $state.params.orderId
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				$scope.masterPriceRecords = response.data.records;

				for (var i = 0, len = $scope.masterPriceRecords["0"].Imagelist.length; i < len; i ++) {
					$scope.masterPriceRecords["0"].Imagelist[i] = $scope.global.imagesServer + $scope.masterPriceRecords["0"].Imagelist[i];
				}

				console.log($scope.masterPriceRecords);
			} else {
				$scope.global.msg('获取师傅报价信息出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});

	/**
	 * 获取系统估价
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/status',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderid: $state.params.orderId,
			Orderno: $state.params.orderNo
		}
	}).then(function (response) {
		console.log(response);
		if (response.data.Status === 0) {
			//将订单详情赋值到$scope.payProgressPaymentData中
			$scope.systemPrice = response.data.Price;

			console.log($scope.orderDetail);
		} else {
			$scope.global.msg('获取信息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});





	/**
	 * 取消订单回调函数
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


	/**
	 * 确认师傅报价回调函数
	 */
	$scope.masterPriceConfirm = function () {
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/confirmpricing',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Orderno: $state.params.orderNo,
				Orderid: $state.params.orderId,
				Accepted: 1,
				Reason: $scope.masterPriceRecords[0].Reason,
				Image: $scope.masterPriceRecords[0].Image
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				$scope.global.msg('确认成功');
				$state.go('myOrder');
			} else {
				$scope.global.msg('确认报价出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});
	};

}]);