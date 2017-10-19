/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

angular.module('app').controller('myOrderCtrl', ['$scope', 'cache', '$http', function ($scope, cache, $http) {

	$scope.myOrderList = [];


	$http({
		method: 'GET',
		url: $scope.global.url + 'order/all',
		params: {
			Mobileno: cache.get('Mobileno'),
			Usertype: 1,
			Token: cache.get('Token'),
			Reqtime: Math.round(new Date().getTime()/1000)
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			$scope.myOrderList = response.data.records;
			for (var i = 0, len = $scope.myOrderList.length; i < len; i++) {
				if ($scope.myOrderList[i].Img !== '') {
					$scope.myOrderList[i].Img = $scope.global.ip + $scope.myOrderList[i].Img;
				} else {
					$scope.myOrderList[i].Img = '/images/e.png';
				}
			}
			//console.log($scope.myOrderList);

		} else {
			//$scope.global.cancel('请求出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


}]);