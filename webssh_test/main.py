import logging
import tornado.web
import tornado.ioloop

from tornado.options import options

##########################################################
from pathlib import Path
import sys
import os
import signal
import time
import asyncio
sys.path.append(os.path.join(os.path.dirname(__file__), "../webssh"))
##########################################################

from webssh import handler
from webssh.handler import IndexHandler, WsockHandler, NotFoundHandler
from webssh.settings import (
    get_app_settings,  get_host_keys_settings, get_policy_setting,
    get_ssl_context, get_server_settings, check_encoding_setting
)


def make_handlers(loop, options):
    host_keys_settings = get_host_keys_settings(options)
    policy = get_policy_setting(options, host_keys_settings)

    handlers = [
        (r'/', IndexHandler, dict(loop=loop, policy=policy,
                                  host_keys_settings=host_keys_settings)),
        (r'/ws', WsockHandler, dict(loop=loop))
    ]
    return handlers


def make_app(handlers, settings):
    settings.update(default_handler_class=NotFoundHandler)
    return tornado.web.Application(handlers, **settings)


def app_listen(app, port, address, server_settings):
    app.listen(port, address, **server_settings)
    if not server_settings.get('ssl_options'):
        server_type = 'http'
    else:
        server_type = 'https'
        handler.redirecting = True if options.redirect else False
    logging.info(
        'Listening on {}:{} ({})'.format(address, port, server_type)
    )


async def shutdown():
    print("shutdown...")
    tornado.ioloop.IOLoop.current().stop()


def shutdown_handler(sig, frame):
    logging.info(f'Add callback for shutdown by signal {sig}.')
    tornado.ioloop.IOLoop.instance().add_callback_from_signal(shutdown)


def main_org():
    signal.signal(signal.SIGTERM, shutdown_handler)
    signal.signal(signal.SIGINT, shutdown_handler)

    options.parse_command_line()
    check_encoding_setting(options.encoding)
    loop = tornado.ioloop.IOLoop.current()
    app = make_app(make_handlers(loop, options), get_app_settings(options))
    ssl_ctx = get_ssl_context(options)
    server_settings = get_server_settings(options)
    app_listen(app, options.port, options.address, server_settings)
    if ssl_ctx:
        server_settings.update(ssl_options=ssl_ctx)
        app_listen(app, options.sslport, options.ssladdress, server_settings)
    #loop.start()
    try:
        print("Loop start...")
        loop.start()
        print("Loop end")
    except Exception :
        print("Shutting down gracefully..." , flush=True)
    finally:
        loop.stop()


import threading
import ctypes

def start_tornado(*args, **kwargs):
    options.parse_command_line()
    check_encoding_setting(options.encoding)
    loop = tornado.ioloop.IOLoop.current()
    app = make_app(make_handlers(loop, options), get_app_settings(options))
    ssl_ctx = get_ssl_context(options)
    server_settings = get_server_settings(options)
    app_listen(app, options.port, options.address, server_settings)
    if ssl_ctx:
        server_settings.update(ssl_options=ssl_ctx)
        app_listen(app, options.sslport, options.ssladdress, server_settings)
    loop.start()
    #try:
    #    print("Loop start...")
    #    loop.start()
    #    print("Loop end")
    #except Exception :
    #    print("Shutting down gracefully..." , flush=True)
    #finally:
    #    loop.stop()

class twe(threading.Thread):
    def __init__(self, group=None, target=None, name=None, args=(), kwargs={}):
        threading.Thread.__init__(self, group=group, target=target, name=name)
        self.args = args
        self.kwargs = kwargs
        return
    
    def run(self):
        self._target(*self.args, **self.kwargs)

    def get_id(self):
        if hasattr(self, '_thread_id'):
            return self._thread_id
        for id, thread in threading._active.items():
            if thread is self:
                return id
    
    def raise_exception(self):
        print("raise_exception")
        ioloop = tornado.ioloop.IOLoop.instance()
        ioloop.add_callback(ioloop.stop)
        thread_id = self.get_id()
        resu = ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(thread_id), ctypes.py_object(SystemExit))
        print("thread exit")
        if resu > 1:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(thread_id), 0)
            print('Failure in raising exception')


def main():

    t = twe(target=start_tornado)  

    try:
        t.start()
        #t.join()
        while True:
            time.sleep(3)
    except KeyboardInterrupt:
        print("except KeyboardInterrupt")
        t.raise_exception()
        print("stopping")
        t.join()




if __name__ == '__main__':
    main()
