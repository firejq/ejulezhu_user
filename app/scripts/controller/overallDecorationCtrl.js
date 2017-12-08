/**
 * Created by firejq on 2017-10-14.
 */
'use strict';

angular.module('app').controller('overallDecorationCtrl', ['$scope', '$http', function ($scope, $http) {

	//初始化变量
	var is_done = 0;// 标志是否加载完所有条目
	var pageNum = 1;// 当前第几页
	var defaultRecperPage = 3;//默认每页几条记录
	$scope.styleRecords = [];

	/**
	 * 获取所有装修风格
	 */
	//$http({
	//	url: $scope.global.url + 'style',
	//	method: 'GET'
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		$scope.styleRecords = response.data.records;
	//
	//		for (var i = 0, len = $scope.styleRecords.length; i < len; i ++) {
	//			$scope.styleRecords[i].Sampleimg = $scope.global.ip + $scope.styleRecords[i].Sampleimg;
	//		}
	//
	//		console.log($scope.styleRecords);
	//	} else {
	//		$scope.global.msg('信息获取出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});


	/**
	 * 获取第一页装修风格
	 */
	$http({
		url: $scope.global.url + 'style/page',
		method: 'GET',
		params: {
			Pagenum: 1,//第一页
			Recperpage: defaultRecperPage//每页6条记录
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			console.log(response.data.records);

			//格式化图片链接
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				response.data.records[i].Sampleimg = $scope.global.ip + response.data.records[i].Sampleimg;
			}

			$scope.styleRecords = response.data.records;

		} else {
			$scope.global.msg('信息获取出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 分页加载装修风格
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


		if ($scope.styleRecords.length !== 0) {//若不是第一次请求，触发显示加载更多提示
			//console.log('运行到加载更多动画这里');
			document.getElementById('load-more').style.display = 'block';
			//document.getElementById('load-more').scrollIntoView();

		}

		// 分页加载我的订单
		$http({
			url: $scope.global.url + 'style/page',
			method: 'GET',
			params: {
				Pagenum: pageNum,//第一页
				Recperpage: recperPage//每页6条记录
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
				for (var i = 0, len = response.data.records.length; i < len; i ++) {
					response.data.records[i].Sampleimg = $scope.global.ip + response.data.records[i].Sampleimg;
				}

				for (var i = 0; i < response.data.records.length; i++) {
					$scope.styleRecords.push(response.data.records[i]);
				}

			}
		}, function (response) {
			console.log('failed!!' + response);
		});

		layer.closeAll();
	};



	/**
	 * 监听scroll事件，到底部加载更多
	 * 延迟1s注册监听事件，是因为立即注册的话document.getElementById('overall-decoration')获取不到dom元素
	 */
	setTimeout(function () {
		//console.log('注册');
		document.getElementById('overall-decoration').addEventListener('scroll', function (event) {

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