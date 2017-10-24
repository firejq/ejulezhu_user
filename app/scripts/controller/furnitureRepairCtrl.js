/**
 * Created by firejq on 2017-10-14.
 */
'use strict';

angular.module('app').controller('furnitureRepairCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.furnitureRepairSubmitData = {
		fixType: '',//维修类型，多个用逗号分隔
	};

	$http({
		url: $scope.global.url + 'price/request',
		method: 'GET',
		params: {
			Fixtype: '地面类,电线开关类'//维修类型，多个用英文逗号分隔，注意不能有空格
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			console.log(response.data);
		} else {
			$scope.global.msg('获取信息出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});


}]);