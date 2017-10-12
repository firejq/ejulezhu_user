/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

/**
 * 热门话题详情页控制器
 */
angular.module('app').controller('hotTopicArticleDetailCtrl', ['$http', '$scope', '$state', '$sce', function ($http, $scope, $state, $sce) {

	// 增加点击数
	$http({
		url: $scope.global.url + 'hottopics/click',
		method: 'GET',
		params: {
			Id: $state.params.id
		}
	}).then(function (response) {
		if (response.data.status !== 0) {
			console.log('点击数增加出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});

	// 为iframe的src赋值
	$scope.url = $sce.trustAsResourceUrl($scope.global.url + 'web?Id=' + $state.params.id);

	//console.log($scope.url);





}]);