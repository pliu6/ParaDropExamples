from aiohttp import ClientSession, BasicAuth, WSMsgType
from asyncio import CancelledError, get_event_loop
import ujson

from . import config
from .spectrum import Spectrum


def get_authentication():
    auth = None
    headers = None
    if config.DEV_MODE:
        auth = BasicAuth(config.API_USERNAME, config.API_PASSWORD)
    else:
        # auth = BasicAuth(config.API_USERNAME, config.API_PASSWORD)
        headers = { 'Authorization': 'Bearer ' + config.API_TOKEN }

    return auth, headers

async def listen_to_airshark_spectrum(app, socketio):
    auth, headers = get_authentication()
    async with ClientSession(headers=headers, auth=auth) as session:
        try:
            ws = await session.ws_connect(config.WS_API_URL + '/airshark/spectrum', \
                autoclose=False, \
                autoping=True)

            async for msg in ws:
                if (msg.type == WSMsgType.BINARY):
                    #heatmap_data = await get_event_loop().run_in_executor(None, Spectrum.heatmap, msg.data)
                    #await socketio.send_heatmap(ujson.dumps(heatmap_data))
                    # Due to performance issue, we can not process the spectrum data in real-time.
                    pass
                elif msg.type == WSMsgType.ERROR:
                    print('Error during receive %s' % ws.exception())
                    break
                elif msg.type == WSMsgType.CLOSE:
                    print('Connection is closed')
                    break
                else:
                    print('Something is wrong with this connection')
                    break

        except CancelledError:
            print('connection is cancelled')

async def listen_to_airshark_analyzer(app, socketio):
    auth, headers = get_authentication()
    async with ClientSession(headers=headers, auth=auth) as session:
        try:
            ws = await session.ws_connect(config.WS_API_URL + '/airshark/analyzer', \
                autoclose=False, \
                autoping=True)

            async for msg in ws:
                if (msg.type == WSMsgType.TEXT):
                    await socketio.send_analyzer_result(msg.data)
                elif msg.type == WSMsgType.ERROR:
                    print('Error during receive %s' % ws.exception())
                    break
                elif msg.type == WSMsgType.CLOSE:
                    print('Connection is closed')
                    break
                else:
                    print('Something is wrong with this connection')
                    break

        except CancelledError:
            print('connection is cancelled')
