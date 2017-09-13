'use strict';

export default class Airshark {
  /* @ngInject */
  constructor(AppConstants, SocketIo, $log) {
    if (AppConstants.host) {
      this.socket = SocketIo.io(AppConstants.host + AppConstants.namespace);
    } else {
      this.socket = SocketIo.io(AppConstants.namespace);
    }

    this.socket.on('connect', () => {
      $log.log('socket.io connected');
    });
    this.socket.on('disconnect', () => {
      $log.log('socket.io disconnected');
    });
  }
}
