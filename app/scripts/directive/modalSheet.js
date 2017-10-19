/**
 * Created by firejq on 2017-10-14.
 */
'use strict';

angular.module('app').directive('appModalSheet', [function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/modalSheet.html',
		scope: {
			list: '=',
			visible: '=',
			select: '&'
		}
	};
}]);