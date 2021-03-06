(function(root) {

  'use strict';

  var availity = root.availity;

  availity.ui.controller('avValContainerController', function($scope, $timeout) {

    this.message = function(ngModel) {

      var message = null;
      if(ngModel.avResults.violations.length && ngModel.avResults.violations[0].message) {
        message = ngModel.avResults.violations[0].message;
      }else {
        message = null;
      }

      // $timeout is needed to update the UI from $broadcast events
      $timeout(function() {
        $scope.messages.message = message;
      });

    };

  });

  availity.ui.directive('avValContainer', function() {
    return {
      restrict: 'A',
      controller: 'avValContainerController',
      template: '<p class="help-block" data-ng-bind-html="messages.message"></p>',
      replace: true,
      scope: {

      },
      link: function(scope) {
        scope.messages = _.extend({}, scope.messages, { message: null, id: null });
      }
    };
  });


})(window);
