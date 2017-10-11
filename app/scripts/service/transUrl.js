/**
 * Created by firejq on 2017-10-11.
 */
'use strict';

angular.module('app').factory('transUrl',['$location',function($location){
	return function(){
		var absUrl=$location.absUrl();
		var url=$location.url();
		var urlIndex=absUrl.indexOf(url);
		return absUrl.substring(0, urlIndex - 1);
	}
}]);