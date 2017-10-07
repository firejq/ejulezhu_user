/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('caseCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.sampleList = [];
	$http({
		method: 'GET',
		url: $scope.global.url + "projectsample/all"
		// params:{
		// }
	}).then(function (response) {
		//console.log(response);
		if(response.data.status === 0){
			$scope.sampleList = response.data.records;
			for (var i  =  0; i < response.data.records.length; i++) {
				$scope.sampleList[i].Img = $scope.global.ip + response.data.records[i].Img;
			}
			//console.log($scope.sampleList);

		}
	}, function (response) {
		console.log('failed!!' + response);
	});

}]);

