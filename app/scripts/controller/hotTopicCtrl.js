/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

angular.module('app').controller('hotTopicCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

	$scope.id = $state.params.id;//todo 获取id参数

	//获取用户热门话题 banner 滚动图片
	$http({
		method: 'GET',
		url: $scope.global.url + "banner",
		params: {
			'type': 3
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



}]);