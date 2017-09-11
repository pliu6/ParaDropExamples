'use strict';

export default class Airshark {
  /* @ngInject */
  constructor(AppConstants, SocketIo, $log) {
    this.socket = SocketIo.io(AppConstants.host + AppConstants.namespace);

    this.socket.on('connect', () => {
      $log.log('socket.io connected');
    });
    this.socket.on('disconnect', () => {
      $log.log('socket.io disconnected');
    });
  }
}
