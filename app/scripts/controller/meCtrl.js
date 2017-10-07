/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('meCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	// 检测是否已登陆:loginChecked为true表示已登陆，false表示未登录
	$scope.user = {};
	$scope.user.loginChecked = !(typeof cache.get('Mobileno') === 'undefined' || typeof cache.get('Token') === 'undefined');
	//$scope.user.loginChecked = true;

	// TODO
	if ($scope.user.loginChecked === true) {
		//若已登陆，获取用户信息
		$scope.user.phone = cache.get('Mobileno');
		var token =  cache.get('Token');
		var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
		$http({
			method: 'GET',
			url: $scope.global.url + 'user/info',
			params: {
				Mobileno: $scope.user.phone,
				Token: token,
				Reqtime: unix_time,
				Usertype: 1
			}
		}).then(function (response) {
			//console.log(response);
			$scope.user.Username = response.data.Username;
			$scope.user.Points = response.data.Points;
		}, function (response) {
			console.log('fail!' + response);
		});
	}

	$http.get("/ejulezhu/users/v1/order/state.json")
		.then(function successCallBack(response) {
			if(response.data.Status === 0) {
				$scope.record = response.data.records;
				//console.log($scope.record);
			}
		}, function errorCallBack(response) {
			console.log('failed!');
		});



}]);

