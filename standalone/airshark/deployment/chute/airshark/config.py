from os import environ
import sys

DEV_MODE = True
WS_API_URL = "ws://128.105.22.154/ws"
API_USERNAME = 'paradrop'
API_PASSWORD = ''
API_TOKEN = None
DASHBOARD_DIR = '/opt/paradrop/development/dashboard/dist'


def loadConfigs():
    from types import ModuleType
    # Get a handle to our settings defined above
    mod = sys.modules[__name__]

    if environ.get('PARADROP_CHUTE_NAME', None) is not None:
        mod.DEV_MODE = False
        mod.WS_API_URL = environ.get("PARADROP_WS_API_URL", None)
        mod.API_TOKEN = environ.get("PARADROP_API_TOKEN", None)
        mod.DASHBOARD_DIR = '/opt/chute/dashboard'
