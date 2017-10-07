/**
 * Created by firejq on 2017-10-03.
 */
'use strict';

angular.module('app').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('main', {
		url: '/main',
		templateUrl: 'view/main.html',
		controller: 'mainCtrl'
	})
		.state('vrCheckRoom', {
			url: '/vrCheckRoom',
			templateUrl: 'view/vrCheckRoom.html',
			controller: 'vrCheckRoomCtrl'
		})
		.state('knowledge', {
			url: '/knowledge',
			templateUrl: 'view/knowledge.html',
			controller: 'knowledgeCtrl'
		})
		.state('hotTopic', {
			url: '/hotTopic/:id',
			templateUrl: 'view/hotTopic.html',
			controller: 'hotTopicCtrl'
		})
		.state('case', {
			url: '/case',
			templateUrl: 'view/case.html',
			controller: 'caseCtrl'
		})
		.state('me', {
			url: '/me',
			templateUrl: 'view/me.html',
			controller: 'meCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'view/login.html',
			controller: 'loginCtrl'
		});
	$urlRouterProvider.otherwise('main');
}]);