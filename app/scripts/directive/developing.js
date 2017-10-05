/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

angular.module('app').directive('appDeveloping', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/developing.html'
	};
}]);