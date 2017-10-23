/**
 * Created by firejq on 2017-10-22.
 */
'use strict';

angular.module('app').controller('overallDecorationSubmitCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	$scope.bookingSubmitData = {
		address: '',//地址
		appointmentTime: '',//预约服务时间
		roomArea: '',//房屋面积
		roomNum: [//房间数量
			{
				name: 'bedRoomNum',
				value: 0
			},
			{
				name: 'livingRoomNum',
				value: 0
			},
			{
				name: 'kitchenRoomNum',
				value: 0
			},
			{
				name: 'bathRoomNum',
				value: 0
			}
		]
	};


	$scope.add = function (valIndex) {
		$scope.bookingSubmitData.roomNum[valIndex].value++;
	};
	$scope.minu = function (valIndex) {
		if ($scope.bookingSubmitData.roomNum[valIndex].value > 0) {
			$scope.bookingSubmitData.roomNum[valIndex].value--;
		}
	};


	/**
	 * 获取所有装修风格
	 */
	$http({
		url: $scope.global.url + 'style',
		method: 'GET'
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.records);
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.styleId) {
					$scope.bookingSubmitData.styleTitle = response.data.records[i].Title;
					break;
				}
			}

		} else {
			$scope.global.msg('信息获取出错');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 获取指定风格的各阶层价格信息
	 */
	$http({
		url: $scope.global.url + 'style/price',
		method: 'GET',
		params: {
			Id: $state.params.styleId
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//console.log(response.data.records);
			for (var i = 0, len = response.data.records.length; i < len; i ++) {
				if (response.data.records[i].Id.toString() === $state.params.stylePriceId) {
					$scope.bookingSubmitData.stylePriceTitle = response.data.records[i].Introduction;
					break;
				}
			}
		}

	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 获取默认地址
	 */
	$http({
		method: 'GET',
		url: $scope.global.url + 'fixaddress/request',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: Math.round(new Date().getTime()/1000)
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			for (var i = 0; i < response.data.records.length; i ++) {
				if (response.data.records[i].IsDefaultaddr === 1) {
					$scope.bookingSubmitData.address = response.data.records[i].Region + response.data.records[i].Contactaddr;
					break;
				}
			}
			//console.log($scope.bookingSubmitData.address);
		} else {
			$scope.global.cancel('获取地址失败');
		}

	}, function (response) {
		console.log('fail! ' + response);
	});





}]);