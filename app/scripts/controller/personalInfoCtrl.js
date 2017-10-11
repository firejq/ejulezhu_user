/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('personalInfoCtrl', ['$scope', '$http', '$state', 'cache', function ($scope, $http, $state, cache) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳

	$scope.personalInfo = {
		Mobileno: mobilenoCookie,
		Username: '',
		Token: tokenCookie,
		Points: ''
	};

	$http({
		method: 'GET',
		url: $scope.global.url + 'user/info',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Reqtime: unix_time,
			Usertype: 1
		}
	}).then(function (response) {
		$scope.personalInfo.Username = response.data.Username;
		$scope.personalInfo.Points = response.data.Points;

	}, function (response) {
		console.log('fail! ' + response);
	});

	$scope.logout = function () {
		layer.open({
			content: '温馨提示<br>是否退出',
			btn: ['确定', '取消'],
			yes: function (index) {
				var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
				$http({
					method: 'GET',
					url: $scope.global.url + 'logout',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Reqtime: unix_time,
						Usertype: 1
					}
				}).then(function (response) {
					console.log(response);
					cache.remove('Mobileno');
					cache.remove('Token');

					$state.go('main');
					layer.close(index);

				}, function (response) {
					console.log(response);
					layer.open({
						content: '注销失败',
						btn: '取消',
						yes: function (index) {
							location.reload();
							layer.close(index);
						}
					});
				});
			},
			no: function (index) {
				layer.close(index);
			}
		});
	};



}]);

