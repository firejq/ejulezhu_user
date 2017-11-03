/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').directive('appFoot', [function () {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'view/template/foot.html',
		scope: {
			isShown: '='
		}
	}
	;
}]);
