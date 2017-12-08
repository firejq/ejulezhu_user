/**
 * Created by firejq on 2017-10-12.
 */
'use strict';

angular.module('app').controller('myOrderCtrl', ['$scope', 'cache', '$http', function ($scope, cache, $http) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.myOrderList = [];
	var is_done = 0;// 标志是否加载完所有条目
	var pageNum = 1;// 当前第几页
	var defaultRecperPage = 7;//默认每页几条记录

	/**
	 * 获取全部订单
	 */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + 'order/all',
	//	params: {
	//		Mobileno: mobilenoCookie,
	//		Usertype: 1,
	//		Token: tokenCookie,
	//		Reqtime: Math.round(new Date().getTime()/1000)
	//	}
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		$scope.myOrderList = response.data.records;
	//
	//		//格式化图片地址
	//		for (var i = 0, len = $scope.myOrderList.length; i < len; i++) {
	//			if ($scope.myOrderList[i].Img !== '') {
	//				$scope.myOrderList[i].Img = $scope.global.ip + $scope.myOrderList[i].Img;
	//			} else {
	//				$scope.myOrderList[i].Img = '/images/e.png';
	//			}
	//		}
	//		//console.log($scope.myOrderList);
	//
	//	} else {
	//		$scope.global.msg('请求出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});

	/**
	 * 获取订单总数
	 */
	//$http({
	//	method: 'GET',
	//	url: $scope.global.url + 'order/number',
	//	params: {
	//		Mobileno: mobilenoCookie,
	//		Usertype: 1,
	//		Token: tokenCookie,
	//		Reqtime: Math.round(new Date().getTime()/1000)
	//	}
	//}).then(function (response) {
	//	//console.log(response);
	//	if (response.data.status === 0) {
	//		$scope.total = response.data.Number;
	//		console.log($scope.total);
	//
	//	} else {
	//		$scope.global.msg('请求出错');
	//	}
	//}, function (response) {
	//	console.log('fail! ' + response);
	//});


	/**
	 * 加载我的订单第一页，每页6条记录
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/page',
		params:{
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000),
			Pagenum: 1,//第一页
			Recperpage: defaultRecperPage//每页6条记录
		}
	}).then(function (response) {
		//console.log(response.data.records);

		if(response.data.status === 0) {
			console.log(response.data);

			//格式化图片链接
			for (var i = 0, len = response.data.records.length; i < len; i++) {
				if (response.data.records[i].Img !== '') {
					response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
				} else {
					response.data.records[i].Img = '/images/e.png';
				}
			}

			for (var i = 0; i < response.data.records.length; i++) {
				$scope.myOrderList.push(response.data.records[i]);
			}

		}
	}, function (response) {
		console.log('failed!!' + response);
	});




	/**
	 * 分页加载我的订单
	 * @param pageNum 第几页（从１开始）
	 * @param recperPage 每页多少记录
	 * @constructor
	 */
	$scope.GetItem = function (pageNum, recperPage){
		recperPage = recperPage || defaultRecperPage;

		if (is_done === 1) {
			$scope.global.msg('暂无更多数据啦，赶紧去下单吧~');
			return;
		}


		if ($scope.myOrderList.length !== 0) {//若不是第一次请求，触发显示加载更多提示
			//console.log('运行到加载更多动画这里');
			document.getElementById('load-more').style.display = 'block';
			//document.getElementById('load-more').scrollIntoView();

		}

		// 分页加载我的订单
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/page',
			params:{
				Mobileno: mobilenoCookie,
				Usertype: 1,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),
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
					$scope.global.msg('暂无更多数据啦，赶紧去下单吧~');
					return;
				}

				//格式化图片链接
				for (var i = 0, len = response.data.records.length; i < len; i++) {
					if (response.data.records[i].Img !== '') {
						response.data.records[i].Img = $scope.global.ip + response.data.records[i].Img;
					} else {
						response.data.records[i].Img = '/images/e.png';
					}
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
		document.getElementById('my-order-list').addEventListener('scroll', function (event) {

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