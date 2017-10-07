/**
 * Created by firejq on 2017-10-06.
 */
'use strict';

angular.module('app').directive('appMeHead', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/meHead.html'
	};
}]);