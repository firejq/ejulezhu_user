/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('orderPayRecordsCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	/**
	 * 获取支付记录列表
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/getorderpartialpay',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderno: $state.params.orderNo
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			$scope.payRecords = response.data.records;

			//格式化时间，原格式：2017-10-21T14:07:10+08:00，目标格式：2017-10-21 14:07:10
			for (var i = 0, len = $scope.payRecords.length; i < len; i++) {
				var time = $scope.payRecords[i].CreateTime;
				$scope.payRecords[i].CreateTime = time.substring(0, 10) + ' ' + time.substring(11, 19);
			}

			console.log($scope.payRecords);
		} else {
			$scope.global.msg('获取支付信息出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});



}]);