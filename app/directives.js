
app.directive('formElement', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            label : "@",
            model : "="
        },
        link: function(scope, element, attrs) {
            scope.disabled = attrs.hasOwnProperty('disabled');
            scope.required = attrs.hasOwnProperty('required');
            scope.pattern = attrs.pattern || '.*';
        },
        template: '<div class="form-group"><label class="col-sm-3 control-label no-padding-right" >  {{label}}</label><div class="col-sm-7"><span class="block input-icon input-icon-right" ng-transclude></span></div></div>'
      };
        
});

app.directive('onlyNumbers', function() {
    return function(scope, element, attrs) {
        var keyCode = [8,9,13,37,39,46,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110,190];
        element.bind("keydown", function(event) {
            if($.inArray(event.which,keyCode) == -1) {
                scope.$apply(function(){
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }

        });
    };
});

app.directive('focus', function() {
    return function(scope, element) {
        element[0].focus();
    }      
});
app.directive('animateOnChange', function($animate) {
  return function(scope, elem, attr) {
      scope.$watch(attr.animateOnChange, function(nv,ov) {
        if (nv!=ov) {
              var c = 'change-up';
              $animate.addClass(elem,c, function() {
              $animate.removeClass(elem,c);
          });
        }
      });  
  }  
});

app.directive('datepickerLocaldate', ['$parse', function ($parse) {
        var directive = {
            restrict: 'A',
            require: ['ngModel'],
            link: link
        };
        return directive;

        function link(scope, element, attr, ctrls) {
            var ngModelController = ctrls[0];

            // called with a JavaScript Date object when picked from the datepicker
            ngModelController.$parsers.push(function (viewValue) {
                // undo the timezone adjustment we did during the formatting
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                // we just want a local date in ISO format
                return viewValue.toISOString().substring(0, 10);
            });

            // called with a 'yyyy-mm-dd' string to format
            ngModelController.$formatters.push(function (modelValue) {
                if (!modelValue) {
                    return undefined;
                }
                // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
                var dt = new Date(modelValue);
                // 'undo' the timezone offset again (so we end up on the original date again)
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
                return dt;
            });
        }
    }]);
	
app.directive('timepickerLocaldate', ['$parse', function ($parse) {
        var directive = {
            restrict: 'A',
            require: ['ngModel'],
            link: link
        };
        return directive;

        function link(scope, element, attr, ctrls) {
            var ngModelController = ctrls[0];

            // called with a JavaScript Date object when picked from the datepicker
            ngModelController.$parsers.push(function (viewValue) {
                // undo the timezone adjustment we did during the formatting
                viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                // we just want a local date in ISO format
                return viewValue.toISOString().substring(12, 17);
            });

            // called with a 'yyyy-mm-dd' string to format
            ngModelController.$formatters.push(function (modelValue) {
                if (!modelValue) {
                    return undefined;
                }
                // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
                var dt = new Date(modelValue);
                // 'undo' the timezone offset again (so we end up on the original date again)
                dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
                return dt;
            });
        }
    }]); 