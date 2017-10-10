/**
 * Created by firejq on 2017-10-10.
 */
'use strict';


angular.module('app').directive('appFootCopyright', [function () {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'view/template/footCopyright.html'
	};
}]);