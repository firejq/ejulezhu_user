/**
 * Created by firejq on 2017-10-22.
 */
'use strict';

angular.module('app').controller('decorationBookingCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	$scope.submitData = {
		styleId: $state.params.styleId,
		selectedDecorationTypeId: 0
	};

	/**
	 * 获取风格价格
	 */
	$http({
		url: $scope.global.url + 'style/price',
		method: 'GET',
		params: {
			Id: $state.params.styleId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.records);
			$scope.describe = response.data.Desc;
			$scope.decorationTypes = response.data.records;
			//console.log($scope.decorationTypes);
		}
	}, function (response) {
		console.log('fail! ' + response);
	});

	/**
	 * 获取风格封面图片
	 */
	$http({
		url: $scope.global.url + 'style',
		method: 'GET'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				//console.log(response.data.records[i].Sampleimg);
				if (response.data.records[i].Id.toString() === $state.params.styleId) {
					$scope.Sampleimg = $scope.global.imagesServer + response.data.records[i].Sampleimg;
					//console.log($scope.Sampleimg);
				}
			}

		} else {
			$scope.global.msg('信息获取出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	$scope.bookingSubmit = function () {
		console.log($scope.submitData.selectedDecorationTypeId);
	};

}]);