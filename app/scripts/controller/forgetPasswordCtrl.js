/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('forgetPasswordCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

	$scope.forgetdata = {};
	$scope.getVerCodeText = '获取验证码';
	var count = 60;
	$scope.getVerCode = function() {
		if(typeof($scope.forgetdata.Mobileno) === 'undefined') {
			layer.msg("手机号码不能为空");
			return;
		}
		$http({
			method: 'GET',
			url: $scope.global.url + "register/forgetinit",
			params: {
				'Mobileno': $scope.forgetdata.Mobileno,
				'Usertype': 1
			}
		}).then(function(response){
			if (response.data.Status === 0) {
				layer.msg('验证码已发送，请注意查收');
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
			} else {
				layer.msg('获取验证码失败');
			}
		}, function (response) {
			console.log('fail! ' + response);
			layer.msg('发送请求失败');
		});
	};
	$scope.ForgetPwdSubmit = function () {
		var Mobileno = $scope.forgetdata.Mobileno;
		var Identificationcode = $scope.forgetdata.Identificationcode;
		var pwd = $scope.forgetdata.Passwd;
		var Confirm = $scope.forgetdata.Confirm;

		if (typeof Mobileno === 'undefined' || typeof Identificationcode === 'undefined'
			|| typeof pwd === 'undefined' || typeof Confirm === 'undefined') {
			layer.msg('信息填写不完整');
			return;
		} else if(pwd !== Confirm) {
			layer.msg("两次输入的密码不一致");
			return;
		}
		// TODO 未加密
		//var cryptid = CryptoJS.enc.Utf8.parse(cryptid);
		//pwd = CryptoJS.AES.encrypt(pwd, cryptid, {
		//	mode: CryptoJS.mode.ECB,
		//	padding: CryptoJS.pad.Pkcs7
		//}).toString();

		$http({
			method: 'GET',
			url: $scope.global.url + 'register/forgetrequest',
			params: {
				'Mobileno': Mobileno,
				'Usertype': 1,
				'Identificationcode': Identificationcode,
				'Passwd': pwd
			}
		}).then(function (response) {
			if(response.data.Status === 0) {
				layer.msg('找回密码成功');
				$state.go('login');
			} else {
				layer.msg('重置失败，请检查输入')
			}
		}, function (response) {
			layer.msg('请求发送失败');
			console.log(response);
		});

	};


}]);