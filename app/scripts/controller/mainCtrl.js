/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {

	//获取首页 banner 滚动图片
	$http({
		method: 'GET',
		url: $scope.global.url + "banner",
		params: {
			'type': 1
		}
	}).then(function (response) {
		//console.log(response);
		$scope.banner = {
			myInterval: 2000,
			active: 0,
			slides: []
		};
		for (var i = 0; i < response.data.records.length; i++) {
			$scope.banner.slides.push({
				image: $scope.global.ip + response.data.records[i]['Img'],
				id: i,
				href: response.data.records[i]['Href']
			});
		}
	}, function (response) {
		console.log('failed!! ' + response);
	});

	// 获取热门话题图片和名字
	$http({
		method: 'GET',
		url: $scope.global.url + "hottopics/category",
		params:{
			'type': 0
		}
	}).then(function (response) {
		$scope.topics = response.data.records;
		$scope.topics.forEach(function (item, index, array) {
			item['CatImg'] = $scope.global.ip + item['CatImg'];
		});
		//console.log($scope.topics);

	}, function (response) {
		console.log('failed!! ' + response);
	});

}]);

