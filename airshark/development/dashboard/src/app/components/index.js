'use strict';

import angular from 'angular';

import footer from './footer';
import navigation from './navigation';

export default angular.module('airsharkDemo.components', [
  footer,
  navigation
]).name;
