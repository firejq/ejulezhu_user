/**
 * Created by firejq on 2017-10-05.
 */
'use strict';

/**
 * 热门话题文章列表页控制器
 */
angular.module('app').controller('hotTopicCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {

	// 获取热门话题页面 banner
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
	/**
	 * 获取指定 topicId 的文章
	 * @param id 话题id
	 * @param pageNum 第几页（从１开始）
	 * @param recperPage 每页多少记录
	 * @constructor
	 */
	$scope.GetItem = function (id, pageNum, recperPage){
		recperPage = recperPage || 5;//默认值为每次加载5条记录

		if("undefined" !== typeof $scope.items[id] && $scope.items[id].length === $scope.total) {//若全部加载完毕，不再执行请求
			$scope.is_done = 1;//标识已经全部加载完毕
			layer.closeAll();
			$scope.global.msg('没有更多了');
			return;
		}


		if ("undefined" !== typeof $scope.items[id]) {//若不是第一次请求，触发显示加载更多提示
			//console.log('运行到加载更多动画这里');
			document.getElementById('load-more').style.display = 'block';
			document.getElementById('load-more').scrollIntoView();

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
			//console.log(response.data.records);

			if(response.data.status === 0) {
				//console.log(response.data);
				//请求成功，则隐藏"加载更多"层
				document.getElementById('load-more').style.display = 'none';

				//格式化图片链接
				for (i = 0; i < response.data.records.length; i++) {
					response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
				}

				if ("undefined" === typeof $scope.items[id]) {
					// 若是第一次请求
					//console.log('first request');
					$scope.items[id] = response.data.records;
					$scope.total = response.data.Total;
				} else {
					// 若不是第一次请求
					//console.log("not first request");
					for (var i = 0; i < response.data.records.length; i++) {
						$scope.items[id].push(response.data.records[i]);
					}
				}
			}
		}, function (response) {
			console.log('failed!!' + response);
		});

		layer.closeAll();
	};

	$scope.id = $state.params.id;// 话题id
	$scope.items = [];// 存放获取的记录
	$scope.is_done = 0;// 标志是否加载完所有条目
	$scope.pageNum = 1;// 当前第几页
	$scope.GetItem($scope.id, $scope.pageNum++);


	/**
	 * 监听scroll事件，到底部加载更多
	 */
	window.onscroll = function () {
		//console.log('scroll is triggered');
		//console.log(window.pageYOffset);
		//console.log(window.innerHeight);
		//console.log(document.getElementsByTagName('body')[0].scrollHeight);
		if (window.pageYOffset + window.innerHeight >=
			document.getElementsByTagName('body')[0].scrollHeight) {
			//console.log('触发加载函数');
			$scope.GetItem($scope.id, $scope.pageNum++);
		}
	};


}]);