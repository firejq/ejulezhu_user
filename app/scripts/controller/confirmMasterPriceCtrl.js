/**
 * Created by firejq on 2017-10-20.
 */
'use strict';

angular.module('app').controller('confirmMasterPriceCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	console.log($state.params.orderId);

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

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

				console.log($scope.masterPriceRecords);
			} else {
				$scope.global.msg('获取师傅报价信息出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});


}]);