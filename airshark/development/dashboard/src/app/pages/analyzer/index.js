'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';

import template from './analyzerPage.html';

const analyzerPageComponentName = 'analyzerPage';

const analyzerPageComponent = {
  template,
  restrict: 'E'
};

const analyzerPage = angular.module('airsharkDemo.analyzerPage', [
  uiRouter
])
.component(analyzerPageComponentName, analyzerPageComponent)
.config($stateProvider => {
  'ngInject';

  $stateProvider
  .state('analyzerPage', {
    url: '/analyzer',
    component: analyzerPageComponentName
  });
});

export default analyzerPage.name;
