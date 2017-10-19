/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('orderPayRecordsCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	/**
	 * 获取
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
			console.log($scope.payRecords);
		} else {
			$scope.global.msg('获取支付信息出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});



}]);