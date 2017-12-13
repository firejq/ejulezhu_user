/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').controller('caseCtrl', ['$scope', '$http', function ($scope, $http) {

	//初始化变量
	var is_done = 0;// 标志是否加载完所有条目
	var pageNum = 1;// 当前第几页
	var defaultRecperPage = 6;//默认每页几条记录
	$scope.sampleList = [];


	/**
	 * 全量获取工程案例
	 */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + "projectsample/all"
	//}).then(function (response) {
	//	console.log(response);
	//	if(response.data.status === 0){
	//		$scope.sampleList = response.data.records;
	//		for (var i  =  0; i < response.data.records.length; i++) {
	//			$scope.sampleList[i].Img = $scope.global.ip + response.data.records[i].Img;
	//		}
	//		//console.log($scope.sampleList);
	//
	//	}
	//}, function (response) {
	//	console.log('failed!!' + response);
	//});

	/**
	 * 获取第一页工程案例
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'projectsample/page',
		params:{
			Pagenum: pageNum,
			Recperpage: defaultRecperPage
		}
	}).then(function (response) {
		//console.log(response.data.records);

		if(response.data.status === 0) {
			console.log(response.data);

			for (var i  =  0; i < response.data.records.length; i++) {
				response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
			}
			$scope.sampleList = response.data.records;

		}
	}, function (response) {
		console.log('failed!!' + response);
	});



	/**
	 * 分页加载工程案例
	 * @param pageNum 第几页（从１开始）
	 * @param recperPage 每页多少记录
	 * @constructor
	 */
	$scope.GetItem = function (pageNum, recperPage){
		recperPage = recperPage || defaultRecperPage;

		if (is_done === 1) {
			$scope.global.msg('暂无更多数据~');
			return;
		}


		if ($scope.sampleList.length !== 0) {//若不是第一次请求，触发显示加载更多提示
			//console.log('运行到加载更多动画这里');
			document.getElementById('load-more').style.display = 'block';
			//document.getElementById('load-more').scrollIntoView();

		}

		// 分页加载工程案例
		$http({
			method: 'GET',
			url: $scope.global.url + 'projectsample/page',
			params:{
				Pagenum: pageNum,
				Recperpage: recperPage
			}
		}).then(function (response) {
			//console.log(response.data.records);

			if(response.data.status === 0) {
				//console.log(response.data);

				//请求成功，则隐藏"加载更多"层
				document.getElementById('load-more').style.display = 'none';

				if (response.data.records.length === 0) {
					is_done = 1;
					layer.closeAll();
					$scope.global.msg('暂无更多数据~');
					return;
				}

				//格式化图片链接
				for (var i  =  0; i < response.data.records.length; i++) {
					response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
				}

				for (var i = 0; i < response.data.records.length; i++) {
					$scope.myOrderList.push(response.data.records[i]);
				}

			}
		}, function (response) {
			console.log('failed!!' + response);
		});



		layer.closeAll();
	};

	/**
	 * 监听scroll事件，到底部加载更多
	 * 延迟1s注册监听事件，是因为立即注册的话document.getElementById('my-order-list')获取不到dom元素
	 */
	setTimeout(function () {
		//console.log('注册');
		document.getElementById('case').addEventListener('scroll', function (event) {

			var element = event.target;
			//console.log('scroll is triggered');
			//console.log(element.scrollTop);
			//console.log(element.clientHeight);
			//console.log(element.scrollHeight);
			if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
				//console.log('触发加载函数');
				$scope.GetItem(++pageNum);
			}
		});
	}, 1000);

}]);

