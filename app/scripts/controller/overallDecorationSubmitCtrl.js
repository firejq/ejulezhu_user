/**
 * Created by firejq on 2017-10-22.
 */
'use strict';

angular.module('app').controller('overallDecorationSubmitCtrl', ['$scope', '$http', 'cache', '$state', function ($scope, $http, cache, $state) {

	console.log($state.params.styleId);
	console.log($state.params.stylePriceId);

}]);