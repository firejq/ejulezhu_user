/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

angular.module('app').controller('myOrderCtrl', ['$scope', 'cache', '$http', function ($scope, cache, $http) {

	$scope.myOrderList = [];

	//$http.post("./v1/order/all.json").success(function(response) {
	//
	//	if(response.status === '0'){
	//		$scope.myOrderList = response.records;
	//	}
	//}).error(function(response) {
	//	console.log('failed!!');
	//});

	// TODO
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
			console.log($scope.myOrderList);

		} else {
			$scope.global.cancel('请求出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});

}]);