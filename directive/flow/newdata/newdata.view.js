!(function(){'use strict';
	angular.module('frame') 
	.directive('newdata', function() {
		return {
			restrict: 'AE',
			templateUrl: 'directive/flow/newdata/newdata.template.html',
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
