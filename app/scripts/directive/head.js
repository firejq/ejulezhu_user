/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').directive('appHead', [function () {
	return {
		restrict: 'AE',
		replace: 'true',
		templateUrl: 'view/template/head.html',
		scope: {
			hasBack: '@',
			text: '@'
		},
		link: function($scope) {
			$scope.back = function() {
				window.history.back();
			};
		}
	};
}]);