'use strict';

// Must be put here in order to make sure the component can override the default
// attributes of bootstrap
import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';

import constants from './config/app.constants';
import appConfig from './config/app.config';

import services from './services';
import components from './components';
import containers from './containers';
import pages from './pages';

const requires = [
  uiRouter,
  uiBootstrap,
  services,
  components,
  containers,
  pages
];

import './app.scss';
import template from './app.html';

const appComponentName = 'app';
const appComponent = {
  template,
  restrict: 'E'
};

angular
.module('airsharkDemo', requires)
.constant('AppConstants', constants)
.config(appConfig)
.filter('orderByKey', $filter => {
  'ngInject';
  return (items, field, reverse) => {
    const keys = $filter('orderBy')(Object.keys(items), field, reverse);
    const obj = {};
    keys.forEach(key => {
      obj[key] = items[key];
    });
    return obj;
  };
})
.component(appComponentName, appComponent);
