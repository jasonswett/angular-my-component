'use strict';

angular.module('your-name.my-directive', []).
    directive('maTextComponent', [
        'DispatchService',
        '$log',
        function (dispatch, $log) {
            return {
                restrict: 'C',
                templateUrl: '/components/ma-text-component.html',
                scope: {
                    data: '='
                },
                link: {
                    pre: function preLink(scope, element, attrs, ctrl) {

                        var headerHTML = '<h2 class="%%CSS%%">%%TXT%%</h2>';
                        var bodyTxtHTML= '<p class="%%CSS%%">%%TXT%%</p>';
                        var bulletHTML = '<div class="%%CSS%%"><ul>%%BULLET%%</ul></div>';
                        var tableHTML  = '<div class="%%CSS%%"><table class="%%TABLECSS%%"><tbody>%%TABLE%%</tbody></table></div>';

                        var data = scope.data;
                        if(!data) {
                            data = dispatch.getData(attrs.compId);
                        }
                        angular.forEach(data, function(object, key){
                            scope[key] = object;
                        });

                        angular.forEach(scope.content.header, function(tempHeader, index) {
                            var tempHTML = headerHTML
                                .replace(/%%CSS%%/g, (tempHeader.css) ? tempHeader.css : '')
                                .replace(/%%TXT%%/g, (tempHeader.txt) ? tempHeader.txt : '');
                            element.find('div.ma-content').append(tempHTML);
                        });


                        angular.forEach(scope.content.body, function(tempBody, index) {
                            var tempHTML = '';
                            if(tempBody.txt) {
                                tempHTML += bodyTxtHTML
                                    .replace(/%%CSS%%/g, (tempBody.css) ? tempBody.css : '')
                                    .replace(/%%TXT%%/g, (tempBody.txt) ? tempBody.txt : '');
                            }
                            else if(tempBody.bullet) {
                                var listItems = '<li>' + tempBody.bullet.join('</li><li>') + '</li>';
                                tempHTML += bulletHTML
                                    .replace(/%%CSS%%/g, (tempBody.css) ? tempBody.css : '')
                                    .replace(/%%BULLET%%/g, (listItems) ? listItems : '');
                            }
                            else if(tempBody.table) {
                                var rows = '';
                                angular.forEach(tempBody.table.items, function(row, rowIndex) {
                                    rows += '<tr>';
                                    angular.forEach(row, function(col, colIndex){
                                        rows += '<td ';

                                        if(tempBody.table.nowrap != null && tempBody.table.nowrap == colIndex) {
                                            rows += 'nowrap';
                                        }

                                        rows += '>' + col + '</td>';
                                    })
                                    rows += '</tr>';
                                });

                                tempHTML += tableHTML
                                    .replace(/%%CSS%%/g, (tempBody.css) ? tempBody.css : '')
                                    .replace(/%%TABLECSS%%/g, (tempBody.table.css) ? tempBody.table.css : '')
                                    .replace(/%%TABLE%%/g, (rows) ? rows : '');
                            }


                            element.find('div.ma-content').append(tempHTML);
                        });

                    },
                    post: function postLink(scope, element, attrs, ctrl) {

                    }
                }
            };
        }]);
