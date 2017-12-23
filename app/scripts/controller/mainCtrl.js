/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('mainCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	$scope.global.code = $scope.global.getQueryString('code');//微信授权code
	//alert($scope.global.code);

	/**
	 * 获取首页 banner 滚动图片
	 */
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
				image: $scope.global.imagesServer + response.data.records[i]['Img'],
				id: i,
				href: response.data.records[i]['Href']
			});
		}
	}, function (response) {
		console.log('failed!! ' + response);
	});

	/**
	 * 获取热门话题图片和名字
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + "hottopics/category",
		params:{
			'type': 0
		}
	}).then(function (response) {
		$scope.topics = response.data.records;
		$scope.topics.forEach(function (item, index, array) {
			item['CatImg'] = $scope.global.imagesServer + item['CatImg'];
		});
		//console.log($scope.topics);

	}, function (response) {
		console.log('failed!! ' + response);
	});


	/**
	 * 若已登录，获取用户消息状态
	 */
	if (typeof mobilenoCookie !== 'undefined' && typeof tokenCookie !== 'undefined') {
		$http({
			method: 'GET',
			url: $scope.global.url + 'message/stat',
			params: {
				Mobileno: mobilenoCookie,
				Usertype: 1,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Messagetype: ''//消息类型（1：订单消息， 2：系统消息， 传空的时候为获取这两类消息的状态）
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				//console.log(response.data);
				//若有未读信息，显示小红点
				document.getElementById('message-unread-red-dot').attributes['class'].value = response.data.Unreadnum > 0 ? '':'ng-hide';

			} else {
				$scope.global.msg('获取用户消息出错');
			}

		}, function (response) {
			console.log('fail! ' + response);
		});
	}






}]);

