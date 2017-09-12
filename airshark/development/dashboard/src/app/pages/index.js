'use strict';

import angular from 'angular';

import home from './home';
import analyzer from './analyzer';

export default angular.module('airsharkDemo.pages', [
  home,
  analyzer
]).name;
