!(function(){'use strict';
	angular.module('frame') 
	.directive('alert', function() {
		return {
			restrict: 'AE',
			templateUrl: 'directive/alert/alert.template.html',
			scope: {
				resolve: '<',
				close: "&",
				dismiss: "&"
			},
			controller:['$scope', function ($scope) {
				$scope.data={
					textdata : "确认",
					title:"确认内容"
				};
				if ($scope.resolve.items){
					$scope.data = $scope.resolve.items;
				} 
				
				$scope.ok = function () {
					$scope.close({$value: 'sure'});
				};
				$scope.cancel = function () {
					$scope.dismiss({$value: 'cancel'});
				};
			}]
		}
	});  
})()
