/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('editAddressCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	var allAddressList = [];//所有地址信息列表
	$scope.addressInfo = {};//当前要修改的地址信息对象

	/**
	 * 返回所有地址信息的列表，再从所有地址中选出指定Id的地址
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

			//console.log(allAddressList);

			// 从所有地址中选出指定Id的地址，赋值到$scope中
			for (var i = 0, len = allAddressList.length; i < len; i++) {
				if (allAddressList[i].Id === parseInt($state.params.addrId)) {
					$scope.addressInfo = allAddressList[i];
					//console.log(allAddressList[i]);
					break;
				}
			}

			var province = decodeURI(sessionStorage.getItem('province')||'');
			var city = decodeURI(sessionStorage.getItem('city')||'');
			var area = decodeURI(sessionStorage.getItem('area')||'');
			if (province !== '' && city !== '' && area !=='') {
				$scope.addressInfo.Region = province + city + area;
				$scope.addressInfo.Regionid = sessionStorage.getItem('regionid');
			}

			//console.log($scope.addressInfo);


		} else {
			$scope.global.cancel('获取地址失败');
		}
	}, function (response) {
		console.log('fail! ' + response);
	});


	/**
	 * 提交修改回调函数
	 */
	$scope.editAddrSubmit = function () {

		$scope.addressInfo.IsDefaultaddr =	$scope.addressInfo.IsDefaultaddr?1:0;
		//console.log(newAddressInfo);
		$http({
			method: 'GET',
			url: $scope.global.url + 'fixaddress/modify',
			params: {
				Mobileno: mobilenoCookie,
				Usertype: 1,
				Token: tokenCookie,
				Reqtime: Math.round(new Date().getTime()/1000),
				Id: $scope.addressInfo.Id,
				Phone: $scope.addressInfo.Phone,
				Contactaddr: $scope.addressInfo.Contactaddr,
				Contactname: $scope.addressInfo.Contactname,
				Region: $scope.addressInfo.Regionid,
				IsDefaultaddr: $scope.addressInfo.IsDefaultaddr
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				window.history.back();
			} else {
				$scope.global.cancel('修改失败');
			}

		}, function (response) {
			console.log('fail! ' + response);
		});




	};




}]);