/**
 * Created by firejq on 2017-10-06.
 */
'use strict';

angular.module('app').directive('appCase', [function () {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'view/template/case.html'
	};
}]);
