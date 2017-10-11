/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('editAddressCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	var allAddressList = [];

	// 返回所有地址信息的列表
	// 10位unix时间戳
	var unix_time = Math.round(new Date().getTime()/1000);
	$http({
		method: 'GET',
		url: $scope.global.url + 'fixaddress/request',
		params: {
			Mobileno: mobilenoCookie,
			Usertype: 1,
			Token: tokenCookie,
			Reqtime: unix_time
		}
	}).then(function (response) {
		//console.log(response);
		if (response.data.status === 0) {
			//将返回的地址信息存到地址数组中
			for (var i = 0; i < response.data.records.length; i ++) {
				allAddressList.push({
					Cityid: response.data.records[i].Cityid,
					Contactaddr: response.data.records[i].Contactaddr,
					Contactname: response.data.records[i].Contactname,
					Id: response.data.records[i].Id,
					IsDefaultaddr: response.data.records[i].IsDefaultaddr,
					Phone: response.data.records[i].Phone,
					Provinceid: response.data.records[i].Provinceid,
					Region: response.data.records[i].Region,
					Regionid: response.data.records[i].Regionid
				});
			}
			//TODO
			console.log(allAddressList);

			// 从所有地址中选出指定Id的地址，赋值到$scope中
			for (var i = 0, len = allAddressList.length; i < len; i++) {
				if (allAddressList[i].Id === parseInt($state.params.addrId)) {
					$scope.addressInfo = allAddressList[i];
					//console.log(allAddressList[i]);
				}
			}
		} else {
			layer.open({
				content: '获取地址失败',
				btn: '取消',
				yes: function (index) {
					layer.close(index);
					location.reload();
				}
			});
		}
	}, function (response) {
		console.log('fail! ' + response);
	});




}]);