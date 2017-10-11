/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('addAddrCtrl', ['$scope', 'cache', '$http', '$state', function ($scope, cache, $http, $state) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	//单个地址信息
	$scope.addressInfo = {
		Contactname: '',
		Phone: mobilenoCookie,
		Region: $state.params.regionid,
		Contactaddr: '',
		IsDefaultaddr: 0,

		province: decodeURI($state.params.province),
		city: decodeURI($state.params.city),
		area: decodeURI($state.params.area)

	};

	$scope.addAddrSubmit = function () {
		$scope.addressInfo.IsDefaultaddr = $scope.addressInfo.IsDefaultaddr? 1 : 0;
		var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
		//console.log($scope.addressInfo);
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
			//console.log(response);
			if (response.data.status === 0) {
				$scope.global.msg('添加成功');
				$state.go('manageAddr');
			} else {
				$scope.global.msg('添加失败');
			}
		}, function (response) {
			console.log('fail!' + response);
		});
	};

}]);