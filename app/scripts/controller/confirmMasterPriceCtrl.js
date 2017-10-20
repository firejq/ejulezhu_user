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
					$scope.masterPriceRecords["0"].Imagelist[i] = $scope.global.ip + $scope.masterPriceRecords["0"].Imagelist[i];
				}

				console.log($scope.masterPriceRecords);
			} else {
				$scope.global.msg('获取师傅报价信息出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});


	/**
	 * 取消订单
	 * TODO 用不用向不接受师傅报价的接口发送？
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
	 * 确认师傅报价
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
				Reason: $scope.masterPriceRecords[0].Reason,//TODO 哪里可以填？是不是这个？
				Image: $scope.masterPriceRecords[0].Image
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				$scope.global.msg('确认报价成功');
				$state.go('myOrder');
			} else {
				$scope.global.msg('确认报价出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});
	};

}]);