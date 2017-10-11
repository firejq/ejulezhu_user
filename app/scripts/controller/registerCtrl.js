/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('registerCtrl', ['$scope', '$http', '$interval', '$state', 'cache', function ($scope, $http, $interval, $state, cache) {

	$scope.registerData = {};
	$scope.getVerCodeText = '获取验证码';
	$scope.registerData.AgreeProtocol = 1;

	var count = 60;
	$scope.getVerCode = function() {
		if(typeof($scope.registerData.Mobileno) === 'undefined') {
			$scope.global.msg("手机号码不能为空");
			return;
		}
		$http({
			method: 'GET',
			url: $scope.global.url + 'register/init',
			params: {
				'Mobileno': $scope.registerData.Mobileno,
				'Usertype': 1
			}
		}).then(function(response){
			if (response.data.Status === 0) {
				$scope.global.msg('验证码已发送，请注意查收');
				//var cryptid = response.data.Cryptid;//TODO

				count = 60;
				$scope.time = '60';
				var interval = $interval(function() {
					if(count <= 0) {
						$interval.cancel(interval);
						$scope.time = '';
						$scope.getVerCodeText = '重新获取';
					} else {
						$scope.time = --count;
					}
				}, 1000);
			} else if (response.data.Status === 1) {
				$scope.global.msg("该手机号已被注册");
			} else {
				$scope.global.msg("获取验证码失败");
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('发送请求失败');
		});
	};

	$scope.registerSubmit = function() {
		var Mobileno = $scope.registerData.Mobileno;
		var Identificationcode = $scope.registerData.Identificationcode;
		var pwd = $scope.registerData.Passwd;
		var Username = $scope.registerData.Username;

		if (typeof Mobileno === 'undefined' || typeof Identificationcode === 'undefined' || typeof pwd === 'undefined' || typeof Username === 'undefined') {
			$scope.global.msg('信息填写不完整');
			return;
		}
		if ($scope.registerData.AgreeProtocol !== 1) {
			$scope.global.msg('请同意平台使用协议');
			return;
		}
		// TODO 未加密
		//cryptid = CryptoJS.enc.Utf8.parse(cryptid);
		//pwd = CryptoJS.AES.encrypt(pwd, cryptid, {
		//	mode: CryptoJS.mode.ECB,
		//	padding: CryptoJS.pad.Pkcs7
		//}).toString();

		$http({
			method: 'GET',
			url: $scope.global.url + "register/request",
			params: {
				'Mobileno': Mobileno,
				'Usertype': 1,
				'Identificationcode': Identificationcode,
				'Passwd': pwd,
				'Username': Username
			}
		}).then(function (response) {
			if(response.data.Status  ===  0) {
				$scope.global.msg("注册成功");

				//注册完毕后自动登陆
				var Token = response.data.Token;
				cache.put('Mobileno', Mobileno);
				cache.put('Token', Token);

				//跳转到首页
				$state.go('main');
			} else{
				$scope.global.msg("注册失败，请检查输入")
			}
		}, function (response) {
			console.log('fail! ' + response);
			$scope.global.msg('连接超时');
		});
	};


}]);