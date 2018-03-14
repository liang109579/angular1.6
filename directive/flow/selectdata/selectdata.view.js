!(function(){'use strict';
	angular.module('frame') 
	.directive('selectdata', function() {
		return {
			restrict: 'AE',
			templateUrl: 'directive/flow/selectdata/selectdata.template.html',
			scope: {
				resolve: '<',
				close: "&",
				dismiss: "&"
			},
			controller:['$scope', function ($scope) {
				
			}]
		}
	});  
})()
