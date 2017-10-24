/**
 * Created by firejq on 2017-10-14.
 */
'use strict';

angular.module('app').controller('furnitureRepairCtrl', ['$scope', '$state', function ($scope, $state) {

	$scope.fixTypes = [
		{
			name: '墙面糊裱类',
			value: false
		},
		{
			name: '照明灯具类',
			value: false
		},
		{
			name: '水暖器材',
			value: false
		},
		{
			name: '天花吊顶类',
			value: false
		},
		{
			name: '电脑智能类',
			value: false
		},
		{
			name: '软饰面类',
			value: false
		},
		{
			name: '门锁类',
			value: false
		},
		{
			name: '木饰面类',
			value: false
		},
		{
			name: '地面类',
			value: false
		},
		{
			name: '管道疏通类',
			value: false
		},
		{
			name: '防水补漏类',
			value: false
		},
		{
			name: '电线开关类',
			value: false
		}
	];




	$scope.repairBookingSubmit = function () {
		var selectedTypes = '';
		for (var i = 0, len = $scope.fixTypes.length; i < len; i ++) {
			if ($scope.fixTypes[i].value === true) {
				if (selectedTypes === '') {
					selectedTypes += $scope.fixTypes[i].name;
				} else {
					selectedTypes += ',' + $scope.fixTypes[i].name;
				}
			}
		}

		//console.log(selectedTypes);

		$state.go('repairBooking', {types: selectedTypes});
	};


}]);