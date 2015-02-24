!function () {
    'use strict';
    
    // Load native UI library
    var gui = require('nw.gui');
    
    /* Services */
    
    function TranslatorService($http, apiKey) {
        var self = this,
            baseUrl = 'http://api.wordreference.com/0.8/' + apiKey + '/json/';
        
        // Public API
        self.payload = {
            from        : '',
            to          : '',
            expression  : ''
        }
        
        self.translate = function() {
            if(self.payload != undefined) {
                if(self.payload.from != '' && self.payload.to != '') {
                    // GET request to Wordreference API
                    $http.get(baseUrl + self.payload.from.key + self.payload.to.key + '/' + self.payload.expression).then(function(data) {
                        return new Translation(data);
                    });
                }
            }
        }
        
        // Private 
        function Translation(data) {
            angular.extend(this, data);
            self.translation = parse(this);
            console.log(self.translation);
        }
        
        function parse(obj) {
            if(obj.data) {
                var data = obj.data;
                
                if(data.Error) {
                    return data;
                } else {
                    var terms = [];
                    
                    // Extract terms from translation payload
                    _.each(data.term0.PrincipalTranslations, function(obj) {
                        _.each(obj, function(chunk) {
                            chunk.term !== undefined ? terms.push(chunk.term) : undefined;
                        })
                    });
                    
                    return terms;
                }
            }
        }
    }
    
    /* Controller */
    
    function MainController($scope, TranslatorService) {
        $scope.translator = TranslatorService;
         
        $scope.languages = [
            {name: 'Arabic', key: 'ar'},
            {name: 'Chinese', key: 'zh'},
            {name: 'Czech', key: 'cz'},
            {name: 'English', key: 'en'},
            {name: 'French', key: 'fr'},
            {name: 'Italian', key: 'it'},
            {name: 'Korean', key: 'ko'},
            {name: 'Polish', key: 'pl'},
            {name: 'Romanian', key: 'ro'},
            {name: 'Spanish', key: 'es'},
            {name: 'Turkish', key: 'tr'}
        ];
    }
    
    var app = angular.module('wrcli', ['ngResource']);
    app.controller('MainCtrl', MainController)
        .service('TranslatorService', TranslatorService)
        .constant('apiKey', '057af'); // To remove before pushing on github !
}();