import socketio

class SocketioNamespace(socketio.AsyncNamespace):
    def __init__(self, namespace):
        socketio.Namespace.__init__(self, namespace)
        self.client_count = 0

    def on_connect(self, sid, environ):
        print('connect ' + sid)
        self.client_count += 1

    def on_disconnect(self, sid):
        print('disconnect ' + sid)
        self.client_count -= 1

    async def send_heatmap(self, data):
        if (self.client_count > 0):
            await self.emit('heatmap', data)

    async def send_analyzer_result(self, data):
        if (self.client_count > 0):
            await self.emit('anlyzer', data)
