/**
 * Created by firejq on 2017-10-04.
 */
'use strict';

angular.module('app').directive('appBanner', function () {
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'view/template/banner.html',
		scope: {
			banner: '='
		}
	};
});