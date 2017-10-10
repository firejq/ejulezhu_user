/**
 * Created by firejq on 2017-10-06.
 */
'use strict';

angular.module('app').controller('loginCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	$scope.logindata = {};
	$scope.submitForm = function() {
		if (typeof $scope.logindata.Mobileno === 'undefined') {
			layer.msg('手机号码为空，请输入手机号码');
			return;
		} else if (typeof $scope.logindata.Passwd === 'undefined') {
			layer.msg('密码为空，请输入密码');
			return;
		}

		var pwd = $scope.logindata.Passwd;
		// TODO 未加密
		// var c = CryptoJS.enc.Utf8.parse(cryptid);
		// pwd = CryptoJS.AES.encrypt(pwd, cryptid).toString();

		$http({
			method: 'GET',
			url: $scope.global.url + "login",
			params: {
				'Mobileno': $scope.logindata.Mobileno,
				'Usertype': 1,
				'Passwd': pwd,
				'Source': "weixin"
			}
		}).then(function (response) {
			if (response.data.Status === 0) {
				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 7);//设置cookie保存7天

				cache.put('Mobileno', response.data.Mobileno, {'expires': expireDate});
				cache.put('Token', response.data.Token, {'expires': expireDate});
				layer.msg("登陆成功");

				$state.go('main');
			} else {
				layer.msg("登陆失败，请检查帐号密码");
			}
		}, function (response) {
			console.log(response);
			layer.msg("登陆超时");
		});
	};

	$scope.checkbox = function(){

	};

	$scope.back = function() {
		window.history.back();
	};
}]);
