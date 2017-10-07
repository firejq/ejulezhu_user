/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

angular.module('app').controller('hotTopicCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

	// 获取用户热门话题 banner 滚动图片
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


	// 获取热门话题 Tab
	$http({
		method: 'GET',
		url: $scope.global.url + "hottopics/category",
		params:{
			'type': 0
		}
	}).then(function successCallBack(response) {
		$scope.topics = response.data.records;

	}, function errorCallBack(response) {
		console.log('failed!! ' + response);
	});



	///////////////////////////////////////////////////////////////
	$scope.GetItem = function (id, pageNum, recperPage){
		if (typeof recperPage === "undefined") {
			recperPage = 10;
		}
		layer.open({
			type: 3,
			offset: 'b',
			shade: 0
		});


		if("undefined" !== typeof $scope.items[id] && $scope.items[id].length === $scope.total) {
			$scope.is_done=1;
			layer.closeAll();
			layer.msg("没有更多了", {time:500,offset: 'b'});
			return;
		}

		// 获取话题类型对应的条目
		$http({
			method: 'GET',
			url: $scope.global.url + "hottopics",
			params:{
				'Catid': id,
				'Pagenum': pageNum,
				'Recperpage': recperPage
			}
		}).then(function (response) {
			if(response.data.status === 0){
				for (i = 0; i < response.data.records.length; i++) {
					response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
				}
				if("undefined" !== typeof $scope.items[id]){
					console.log("defined");
					for (var i = 0; i < response.data.records.length; i++) {
						$scope.items[id].push(response.data.records[i]);
					}
				} else {
					$scope.items[id] = response.data.records;
					$scope.total = response.data.Total;
				}
			}
		}, function (response) {
			console.log('failed!!' + response);
		});

		layer.closeAll();
	};

	$scope.id = $state.params.id;
	$scope.items = [];
	$scope.is_done = 0;// 标志是否加载完所有条目
	$scope.pageNum = 1;
	$scope.GetItem($scope.id, $scope.pageNum++);


}]);