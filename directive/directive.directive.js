!(function(){'use strict';
	angular.module('myComponent',['ui.bootstrap']);
	angular.module('myComponent')
  
  .factory('UI',['$document', function($document) {

    function dragable(element, nthParent){
      var startX = 0, startY = 0, x = 0, y = 0, parent = element;
      nthParent = nthParent || 0;
      for(var i = 0; i < nthParent; i ++){
        parent = parent.parent();
      }
      parent.css({
        position: 'relative'
      });
      element.css({
        cursor: 'move'
      });

      element.on('mousedown', function(event) {
        event.preventDefault();
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;
        parent.css({
          top: y + 'px',
          left: x + 'px'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    }
    
    return {
      dragable: dragable
    }
  }])


  /**
   * 让目标可拖动
   * @parentDragable 让这个元素的往上第几级parent可拖动。0表示本级可拖动
   */
  .directive('parentDragable', ['UI', function(UI) {
    return {
      restrict: 'A',
      scope:{
        parentDragable: '=?'
      },
      link: function(scope, element, attr) {
        UI.dragable(element, +scope.parentDragable || 0);
      }
    };
  }]);

})()
