/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').controller('cityPickerCtrl', ['$rootScope', '$scope','$http', '$state', 'center', function ($rootScope, $scope, $http, $state, center) {

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

	// 从哪个state点击过来即回到哪个state去
	var goTo = $state.params.from;
	//if goTo

	//点击完成的回调函数
	$scope.finishPick = function() {
		if ($scope.area !== '区/县') {
			$state.go(goTo, {
				province: encodeURI($scope.province),
				city: encodeURI($scope.city),
				area: encodeURI($scope.area),
				regionid: $scope.areaId
			});
		} else if ($scope.city !== '城市') {
			$state.go(goTo, {
				province: encodeURI($scope.province),
				city: encodeURI($scope.city),
				area: '',
				regionid: ''
			});
		} else if ($scope.province !== '省份') {
			$state.go(goTo, {
				province: encodeURI($scope.province),
				city: '',
				area: '',
				regionid: ''
			});
		} else {
			$state.go(goTo, {
				province: '',
				city: '',
				area: '',
				regionid: ''
			});
		}
	};

	//获取省列表
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

	//弹出模态框
	$scope.choose=function(type){
		switch(type)
		{
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

	//选择省并获取省对应城市列表
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

	//选择城市并获取对应地区列表
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

	// 选择地区回调
	$scope.chooseArea=function(area,areaId){
		$scope.area=area;
		$scope.areaId=areaId;
		$('#areaModal').modal('hide');
	};

	center('#provinceModal','90%');
	center('#cityModal','90%');
	center('#areaModal','90%');
}]);
