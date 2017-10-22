/**
 * Created by firejq on 2017-10-14.
 */
'use strict';

angular.module('app').controller('overallDecorationCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	$http({
		url: $scope.global.url + 'style',
		method: 'GET'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			$scope.styleRecords = response.data.records;

			for (var i = 0, len = $scope.styleRecords.length; i < len; i ++) {
				$scope.styleRecords[i].Sampleimg = $scope.global.ip + $scope.styleRecords[i].Sampleimg;
			}

			console.log($scope.styleRecords);
		} else {
			$scope.global.msg('信息获取出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});

}]);