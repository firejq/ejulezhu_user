/**
 * Created by firejq on 2017-11-01.
 */
'use strict';

angular.module('app').controller('repairValuationCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	//初始化变量
	var mobilenoCookie = cache.get('Mobileno');
	var tokenCookie = cache.get('Token');
	//遮罩层默认隐藏
	$scope.isModalShown = false;
	//已选择维修类型
	$scope.selectedFixType = '';
	//可选择维修类型
	$scope.fixTypes = [
		'墙面糊裱类',
		'照明灯具类',
		'水暖器材',
		'天花吊灯类',
		'电脑智能类',
		'软饰面类',
		'门锁类',
		'木饰面类',
		'管道疏通类',
		'防水补漏类',
		'地面类',
		'电线开关类'
	];
	$scope.repairValuationData = {
		materialPrices: [],//维修材料费
		labourPrices: [],//维修人工费
		selectedMaterialPrice: [],//已选择维修材料费
		selectedLabourPrice: [],//已选择维修人工费
		materialPricesTotal: 0,//维修材料费合计
		labourPricesTotal: 0,//人工费合计
		total: 0//总价估价
	};

	/**
	 * 维修类型选择函数
	 * @param fixType
	 */
	$scope.selectType = function (fixType) {
		//为已选择维修类型赋值
		$scope.selectedFixType = fixType;

		/**
		 * 获取指定维修类型的详细报价信息：物料、人力单价
		 */
		$http({
			url: $scope.global.url + 'price/request',
			method: 'GET',
			params: {
				Fixtype: $scope.selectedFixType//维修类型
			}
		}).then(function (response) {
			//console.log(response);
			if (response.data.status === 0) {
				//console.log(response.data);

				//为可选择的维修材料类型赋值
				for (var item in response.data[$scope.selectedFixType].materialprices) {
					$scope.repairValuationData.materialPrices.push({
						Desc: response.data[$scope.selectedFixType].materialprices[item].Desc,
						Id: response.data[$scope.selectedFixType].materialprices[item].Id,
						Price: response.data[$scope.selectedFixType].materialprices[item].Price,
						Unit: response.data[$scope.selectedFixType].materialprices[item].Unit,
						SelectedNum: 0
					});
				}

				$scope.repairValuationData.labourPrices = response.data[$scope.selectedFixType].labourprices;

			} else {
				$scope.global.msg('获取信息出错');
			}

		}, function (response) {
			console.log('fail! ' + response);
		});


		//隐藏遮罩层
		$scope.isModalShown = false;
	};


	$scope.totalValuation = function () {
		$scope.repairValuationData.total = $scope.repairValuationData.labourPricesTotal + $scope.repairValuationData.materialPricesTotal;
	};




	/****************************************************
	 * 维修材料费明细子页面的控制代码
	 ****************************************************/

	/**
	 * 点击维修材料的回调函数：显示模态框
	 */
	$scope.showModalOfMaterial = function () {
		//对象的浅复制
		$scope.tmpMaterialPrice = $scope.global.shallowClone($scope.repairValuationData.materialPrices);

		$('#material-modal').removeClass('ng-hide');
	};
	/**
	 * 点击模态框任意地方的回调函数，隐藏模态框
	 */
	$scope.hideModalOfMaterial = function () {
		$('#material-modal').addClass('ng-hide');
	};
	/**
	 * 确认按钮触发函数
	 */
	$scope.materialPriceConfirm = function () {
		//将维修材料的合计费用重置为0
		$scope.repairValuationData.materialPricesTotal = 0;

		//将修改后的值赋值到显示信息中
		//合计维修材料费用
		for (var item in $scope.tmpMaterialPrice) {
			$scope.repairValuationData.materialPrices[item].SelectedNum = $scope.tmpMaterialPrice[item].SelectedNum;

			$scope.repairValuationData.materialPricesTotal += $scope.repairValuationData.materialPrices[item].Price * $scope.repairValuationData.materialPrices[item].SelectedNum;
		}

		//隐藏modal层
		$('#material-modal').addClass('ng-hide');
	};
	/********************************************************/





	/********************************************************
	 * 维修人工费明细子页面的控制代码
	 *******************************************************/

	/**
	 * 点击维修材料的回调函数：显示模态框
	 */
	$scope.showModalOfLabour = function () {
		$('#labour-modal').removeClass('ng-hide');

	};
	/**
	 * 点击模态框任意地方的回调函数，隐藏模态框
	 */
	$scope.hideModalOfLabour = function () {
		$('#labour-modal').addClass('ng-hide');
	};
	/**
	 * 确认按钮触发函数
	 */
	$scope.labourPriceConfirm = function (labourKindPrice) {
		$scope.repairValuationData.labourPricesTotal = labourKindPrice;
		//隐藏modal层
		$('#labour-modal').addClass('ng-hide');
	};

	/******************************************************/





}]);