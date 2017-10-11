/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('manageAddrCtrl', ['$scope', '$http', 'cache', function ($scope, $http, cache) {

	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');

	// 返回所有地址信息的列表
	(function () {
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
				$scope.addressList = [];
				for (var i = 0; i < response.data.records.length; i ++) {
					$scope.addressList.push({
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
				console.log($scope.addressList);
			} else {
				layer.open({
					content: '获取地址失败',
					btn: '取消',
					yes: function (index) {
						layer.close(index);
					}
				});
			}

		}, function (response) {
			console.log('fail! ' + response);
		});
	})();

	////////////////////////////////////////////////
	$scope.modifyAddress = function (addressInfo) {//TODO 怎么给modify_address.html传参数
		//$scope.curSelectId = addressInfo.Id;
		//alert($scope.curSelectId);
		//top.location = 'modify_address.html';
		$scope.global.msg('6666');

	};

	$scope.deleteAddress = function (id) {
		//询问框
		layer.open({
			content: '温馨提示<br>确认删除此维修地址吗',
			btn: ['确定', '取消'],
			yes: function(index){
				var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
				$http({
					method: 'GET',
					url: $scope.global.url + 'fixaddress/delete',
					params: {
						Mobileno: mobilenoCookie,
						Usertype: 1,
						Token: tokenCookie,
						Reqtime: unix_time,
						Id: id
					}
				}).then(function (response) {
					if (response.data.status === 0) {
						location.reload();
						layer.close(index);
					} else {
						console.log('fail! ' + resposne);
					}
				}, function (response) {
					console.log('fail! ' + response);
				});
			},
			no: function (index) {
				layer.close(index);
			}
		});

	};


}]);