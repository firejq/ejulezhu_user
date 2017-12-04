/**
 * Created by firejq on 2017-10-15.
 */
'use strict';

angular.module('app').controller('myOrderDetailCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//默认进入订单状态页面
	$state.go('myOrderDetail.state');

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.orderDetail = {};

	$scope.href = {
		//返回 “确认报价” 路由
		5: function () {
			return 'confirmMasterPrice({orderId: ' + $state.params.orderId + ', orderNo: \'' + $state.params.orderNo + '\'})';
		},
		// 返回 “验收” 路由
		8: function () {
		},
		// 返回 “客户支付” 路由
		9: function () {
			//若去掉路由参数中的单引号，会导致number类型的orderNo过大而溢出，+运算不会自动转换成string类型
			return 'finishProjectPay({orderId: ' + $state.params.orderId + ', orderNo: \'' + $state.params.orderNo + '\'})';
		}
	};


	/**
	 * 获取订单详细信息和状态
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'order/status',
		params: {
			Mobileno: mobilenoCookie,
			Token: tokenCookie,
			Usertype: 1,
			Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
			Orderno: $state.params.orderNo,
			Orderid: $state.params.orderId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.Status === 0) {
			//将订单详情赋值到$scope.orderDetail中
			$scope.orderDetail = response.data;
			//console.log($scope.orderDetail);

			//格式化下单时间，原格式：20171014092816，格式化为2017-10-14 09:28:16
			var time = $scope.orderDetail.OrderTime;
			$scope.orderDetail.OrderTime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);
			time = $scope.orderDetail.Appointmenttime;
			$scope.orderDetail.Appointmenttime = time.substring(0, 4) + '-' + time.substring(4, 6) + '-' + time.substring(6, 8) + ' ' + time.substring(8, 10) + ':' + time.substring(10, 12) + ':' + time.substring(12, 14);

			//将图片地址补充完整
			for (var i = 0, len = $scope.orderDetail.ImageList.length; i < len; i ++) {
				$scope.orderDetail.ImageList[i] = $scope.global.ip + $scope.orderDetail.ImageList[i];
			}


			//若只有一条状态记录，说明该订单已被取消
			if ($scope.orderDetail.records.length === 1) {
				$scope.orderDetail.isCanceled = 1;

				$scope.orderDetail.nowStateIntroduction = '已取消';
			} else {
				//若不止有一条记录，说明订单没被取消
				$scope.orderDetail.isCanceled = 0;
				//若“确认报价”状态已完成，则将“取消订单”的按钮换成“支付进度款”
				if ($scope.orderDetail.records[4].FinishTime !== '') {
					$scope.orderDetail.isConfirmedMasterPrice = true;
				}
				//当前状态
				for (var i = 0, len = $scope.orderDetail.records.length; i < len; i ++) {
					if ($scope.orderDetail.records[i].FinishTime === '') {
						$scope.orderDetail.nowStateIntroduction = $scope.orderDetail.records[i-1].Introduction;
						break;
					}
				}
			}

			console.log($scope.orderDetail);
		} else {
			$scope.global.msg('订单状态获取出错');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});





	/**
	 * 取消订单
	 */
	$scope.orderCancel = function () {
		$http({
			method: 'GET',
			url: $scope.global.url + 'order/cancel',
			params: {
				Mobileno: mobilenoCookie,
				Token: tokenCookie,
				Usertype: 1,
				Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
				Orderno: $state.params.orderNo,
				Orderid: $state.params.orderId
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				$scope.global.msg('取消订单成功');
				$state.go('myOrder');
			} else {
				$scope.global.msg('取消订单出错');
			}
		}, function (response) {
			console.log('fail! ' + response);
		});

	};


	/**
	 * 验收回调函数
	 */
	$scope.checkProject = function () {
		layer.open({
			content: '温馨提示<br><br>验收',
			btn: ['确认', '取消'],
			yes: function (index) {
				//console.log('yes');

				/**
				 * 客户确定验收
				 */
				$http({
					method: 'GET',
					url: $scope.global.url + 'order/checkandaccept',
					params: {
						Mobileno: mobilenoCookie,
						Token: tokenCookie,
						Usertype: 1,
						Reqtime: Math.round(new Date().getTime()/1000),//10位unix时间戳
						Orderno: $state.params.orderNo,
						Orderid: $state.params.orderId
					}
				}).then(function (response) {
					//console.log(response);
					if (response.data.status === 0) {
						$scope.global.msg('验证成功~');
					} else {
						$scope.global.msg('验证出错~');
					}
				}, function (response) {
					console.log('fail! ' + response);
				});


				layer.close(index);
				location.reload();
			},
			no: function (index) {
				//console.log('no');
				layer.close(index);
			}
		});
	};


}]);
