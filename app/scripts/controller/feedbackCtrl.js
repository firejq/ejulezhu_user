/**
 * Created by firejq on 2017-10-10.
 */
'use strict';

angular.module('app').controller('feedbackCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	// TODO API中没有type的字段参数
	//var feedbackType = $scope.feedbackdata.type;
	//var advise = $scope.feedbackdata.advise;

	// TODO 图片上传要使用另外的API

	$scope.feedbackSubmit = function () {
		//$http({
		//	url: $scope.global.url + 'feedback',
		//	method: 'GET',
		//	params: {
		//		'Mobileno': cache.get('Mobileno'),
		//		'Feedback': advise
		//	}
		//}).then(function (response) {
		//	if (response.data.Status === 0) {
		//		$scope.global.msg('提交反馈成功');
		//	} else {
		//		$scope.global.msg('提交反馈出错');
		//	}
		//}, function (response) {
		//	console.log('fail! ' + response);
		//	$scope.global.msg('连接超时');
		//});
	};

}]);

