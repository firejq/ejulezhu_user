/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('addAddrCtrl', ['$scope', 'cache', '$http', function ($scope, cache, $http) {

	//地址选择器初始化
	//$("#city-picker").cityPicker({
	//	title: "选择城市/区县"
	//});

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	//$scope.userInfo = {
	//	Mobileno: mobilenoCookie,
	//	name: '暂时没接口'//TODO
	//};

	//单个地址信息
	$scope.addressInfo = {
		Contactname: '',
		Phone: mobilenoCookie,
		Region: '',
		Contactaddr: '',
		IsDefaultaddr: 0
	};

	$scope.addSubmit = function () {
		$scope.addressInfo.IsDefaultaddr = $scope.addressInfo.IsDefaultaddr? 1 : 0;
		$scope.addressInfo.Region = document.getElementById('city-picker').attributes['data-code'].value;
		var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
		$http({
			method: 'GET',
			url: $scope.global.url + 'fixaddress/add',
			params: {
				Mobileno: mobilenoCookie,
				Usertype: 1,
				Token: tokenCookie,
				Reqtime: unix_time,
				Phone: $scope.addressInfo.Phone,
				Contactaddr: $scope.addressInfo.Contactaddr,
				Contactname: $scope.addressInfo.Contactname,
				Region: $scope.addressInfo.Region,
				IsDefaultaddr: $scope.addressInfo.IsDefaultaddr
			}
		}).then(function (response) {
			console.log(response);
			if (response.data.status === 0) {
				$scope.msg('添加成功');
				window.history.go(-1);
			} else {
				$scope.msg('添加失败', 'cancel');
			}
		}, function (response) {
			console.log('fail!' + response);
		});
	};

}]);