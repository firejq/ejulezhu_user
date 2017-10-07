/**
 * Created by firejq on 2017-10-06.
 */
'use strict';

angular.module('app').controller('loginCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	$scope.logindata = {};
	$scope.submitForm = function() {
		var pwd = $scope.logindata.Passwd;
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
			if(response.data.Status === 0) {

				var expireDate = new Date();
				expireDate.setDate(expireDate.getDate() + 7);//设置cookie保存7天

				$cookies.put('Mobileno', response.data.Mobileno, {'expires': expireDate});
				$cookies.put('Token', response.data.Token, {'expires': expireDate});
				$.toast("登陆成功");//TODO 只要下边有页面跳转就无法显示
				window.location.href = 'index.html';
			} else {
				layer.msg("登陆失败，请检查帐号密码");
			}
		}, function (response) {
			layer.msg("登陆超时");
		});
	};

	$scope.register = function(){
		window.location.href = "register.html";
	};
	$scope.forgetpass = function(){
		// alert('忘记密码');
		window.location.href = "forgetpasswd.html";
	};

	$scope.checkbox = function(){

	};

	$scope.back = function() {
		window.history.back();
	};
}]);
