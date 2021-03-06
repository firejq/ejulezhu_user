/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('cityPickerCtrl', ['$scope','$http', '$state', 'center', function ($scope, $http, $state, center) {

	$scope.province='省份';
	$scope.city='城市';
	$scope.area='区/县';
	//初始化省份、城市、地区列表
	$scope.provinces=new Array({
		Province: '省份',
		Provinceid: 0
	});
	$scope.cities=new Array({
		City: '城市',
		Cityid: 0
	});
	$scope.areas=new Array({
		Region:'区/县',
		Regionid:0
	});


	/**
	 * 点击完成的回调函数
	 */
	$scope.finishPick = function() {
		//var params = {
		//	province: '',
		//	city: '',
		//	area: '',
		//	regionid: ''
		//};

		//// 从哪个state点击过来即回到哪个state去
		//var goTo = $state.params.from;

		//// 若从editAddress来，则在参数中加入editAddressId，并将goTo设置为'editAddress'
		//if (goTo.indexOf('editAddress') !== -1) {
		//	params.addrId = goTo.split('-')[1];
		//	goTo = goTo.split('-')[0];
		//	console.log(params);
		//}

		if ($scope.area !== '区/县') {
			//params.province = encodeURI($scope.province);
			//params.city = encodeURI($scope.city);
			//params.area = encodeURI($scope.area);
			//params.regionid = $scope.areaId;
			//$state.go(goTo, params);

			window.sessionStorage.setItem('province', encodeURI($scope.province));
			window.sessionStorage.setItem('city', encodeURI($scope.city));
			window.sessionStorage.setItem('area', encodeURI($scope.area));
			window.sessionStorage.setItem('regionid', $scope.areaId);
			window.history.back();

		} else if ($scope.city !== '城市') {
			//params.province = encodeURI($scope.province);
			//params.city = encodeURI($scope.city);
			//$state.go(goTo, params);

			window.sessionStorage.setItem('province', encodeURI($scope.province));
			window.sessionStorage.setItem('city', encodeURI($scope.city));
			window.history.back();


		} else if ($scope.province !== '省份') {
			//params.province = encodeURI($scope.province);
			//$state.go(goTo, params);

			window.sessionStorage.setItem('province', encodeURI($scope.province));
			window.history.back();

		}

	};

	/**
	 * 获取省列表
	 */
	$http({
		url: $scope.global.url+'region/province',
		method:'GET'
	}).then(function success(res){
		if(res.data.status===0){
			res.data.records.forEach(function(item,index,arr){
				$scope.provinces.push(item);
			})
		}
	},function error(res){
		console.log('获取城市数据失败');
		console.log(res);
	});


	/**
	 * 弹出模态框
	 * @param type
	 */
	$scope.choose=function(type){
		switch(type) {
			case 'province':
				$('#provinceModal').modal();
				break;
			case 'city':
				$('#cityModal').modal();
				break;
			case 'area':
				$('#areaModal').modal();
				break;
			default:
				break;
		}
	};

	/**
	 * 选择省并获取省对应城市列表
	 * @param prov
	 * @param provId
	 */
	$scope.chooseProvince=function(prov,provId){
		$scope.province=prov;
		$scope.provId=provId;
		$http({
			url:$scope.global.url+'region/city',
			method:'GET',
			params:{
				provinceid:provId
			}
		}).then(function success(res){
			if(res.data.status===0){
				res.data.records.forEach(function (item,index,arr) {
					$scope.cities.push(item);
				});
				$('#provinceModal').modal('hide');
			}
		},function error(res){
			console.log('获取城市列表失败');
			console.log(res);
		});
	};

	/**
	 * 选择城市并获取对应地区列表
	 * @param city
	 * @param cityId
	 */
	$scope.chooseCity=function(city,cityId){
		$scope.city=city;
		$scope.cityId=cityId;
		$http({
			url:$scope.global.url+'region/region',
			method:'GET',
			params:{
				cityid:cityId
			}
		}).then(function success(res){
			if(res.data.status===0){
				res.data.records.forEach(function (item,index,arr) {
					$scope.areas.push(item);
				});
				$('#cityModal').modal('hide');
			}
		},function error(res){
			console.log('获取地区列表失败');
			console.log(res);
		});
	};

	/**
	 * 选择地区回调
	 * @param area
	 * @param areaId
	 */
	$scope.chooseArea=function(area,areaId){
		$scope.area=area;
		$scope.areaId=areaId;
		$('#areaModal').modal('hide');
	};

	center('#provinceModal','90%');
	center('#cityModal','90%');
	center('#areaModal','90%');

}]);
