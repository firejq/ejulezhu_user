/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('addAddrCtrl', ['$scope', 'cache', '$http', '$state', function ($scope, cache, $http, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');


	//单个地址信息
	$scope.addressInfo = {
		Contactname: window.sessionStorage.getItem('Contactname')||'',//预加载上次填过的信息
		Phone: mobilenoCookie,
		Region: sessionStorage.getItem('regionid')||'',
		Contactaddr: window.sessionStorage.getItem('Contactaddr')||'',//预加载上次填过的信息
		IsDefaultaddr: 0,

		province: decodeURI(sessionStorage.getItem('province')||''),
		city: decodeURI(sessionStorage.getItem('city')||''),
		area: decodeURI(sessionStorage.getItem('area')||'')
	};

	/**
	 * 监听“联系人”的输入，存储到sessionStorage中，防止修改地址后再返回已填的信息丢失
	 */
	document.getElementById('contactName').addEventListener('change', function (event) {
		window.sessionStorage.setItem('Contactname', event.target.value);
		//console.log(window.sessionStorage);
	});

	/**
	 * 监听“详细地址”的输入，存储到sessionStorage中，防止修改地址后再返回已填的信息丢失
	 */
	document.getElementById('contactAddr').addEventListener('change', function (event) {
		window.sessionStorage.setItem('Contactaddr', event.target.value);
		//console.log(window.sessionStorage);
	});



	/**
	 * 添加新地址
	 */
	$scope.addAddrSubmit = function () {
		$scope.addressInfo.IsDefaultaddr = $scope.addressInfo.IsDefaultaddr? 1 : 0;
		var unix_time = Math.round(new Date().getTime()/1000);//10位unix时间戳
		//console.log($scope.addressInfo);
		$http({
			method: 'GET',
			url: $scope.global.url + 'fixaddress/add',
			params: {
				Mobileno: mobilenoCookie,
				Usertype: 1,
				Token: tokenCookie,
				Reqtime: unix_time,
				Phone: $scope.addressInfo.Phone,
				Contactaddr: $scope.addressInfo.Contactaddr,
				Contactname: $scope.addressInfo.Contactname,
				Region: $scope.addressInfo.Region,
				IsDefaultaddr: $scope.addressInfo.IsDefaultaddr
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				//清除 sessionStorage 中的缓存
				window.sessionStorage.removeItem('Contactname');
				window.sessionStorage.removeItem('Contactaddr');

				$scope.global.msg('添加成功');

				//if (window.localStorage.getItem('manageAddrLength') !== null) {
				//	var x = window.history.length - window.localStorage.getItem('manageAddrLength');
				//	window.history.go(-x);
				//} else {
				//	$state.go('manageAddr'); //直接跳转会导致后退键混乱
				//}

				window.history.back();

			} else {
				$scope.global.msg('添加失败');
			}
		}, function (response) {
			console.log('fail!' + response);
		});
	};

}]);