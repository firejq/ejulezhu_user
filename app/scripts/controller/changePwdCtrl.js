/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('changePwdCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳

	$scope.changePwdData = {
		Mobileno: mobilenoCookie,
		Usertype: 1,
		Token: tokenCookie,
		Oldpasswd: '',
		Newpasswd: '',
		cfmNewpasswd: ''
	};

	$scope.changePwdSubmit = function () {
		if ($scope.changePwdData.Newpasswd !== $scope.changePwdData.cfmNewpasswd) {
			$scope.global.msg('两次密码不一致');
			return;
		}
		$http({
			method: 'GET',
			url: $scope.global.url + 'user/changepasswd',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Reqtime: unix_time,
				Usertype: 1,
				Oldpasswd: $scope.changePwdData.Oldpasswd,
				Newpasswd: $scope.changePwdData.Newpasswd
			}
		}).then(function (response) {
			if (response.data.status === 0) {
				$scope.global.msg('密码修改成功~');
				cache.remove('Mobileno');
				cache.remove('Token');
				$state.go('login');

			} else {
				$scope.global.msg('密码修改失败');
			}

		}, function (response) {
			console.log('fail! ' + response);
		});
	};

}]);

