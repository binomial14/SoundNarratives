import asyncio

import ssl
import socketio
from aiohttp import web
import ssl

import logging

from datetime import datetime
import sys

from utils import linux_to_windows_path

sys.path.append(linux_to_windows_path('/c/Users/lyuanwu/Workspace/AudioFlamingo/audio-flamingo/'))
sys.path.append(linux_to_windows_path('/c/Users/lyuanwu/Workspace/AudioFlamingo/audio-flamingo/inference'))

from inference.AudioFlamingoAPI import AudioFlamingoAPI

from SystemWrapper import SystemWrapper

api = AudioFlamingoAPI()

LOGGER = logging.getLogger(__name__)
logging.basicConfig(filename=f"./data/{datetime.now().strftime('%Y%m%d')}.log", encoding='utf-8', format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
LOGGER.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
LOGGER.addHandler(console_handler)

app = web.Application()
sio = socketio.AsyncServer(cors_allowed_origins=[])

FRONTEND_URL = "https://141.212.110.188:443"

sio.attach(app)

async def index(request):
    response = web.Response(text="Backend running...")
    response.headers['Access-Control-Allow-Origin'] = FRONTEND_URL
    return response
app.router.add_route('GET', '/', index)

# @asyncio.coroutine
@sio.on('startClient')
async def start_client(c_id,config):
    LOGGER.info(f'Start streaming audio data from client {c_id}')
    print(config)
    await sio.emit('mic_status',{"occupied": True})
    await SystemWrapper.start_client(c_id,sio,config,api,LOGGER)

@sio.on('stopClient')
async def stop_client(c_id):
    LOGGER.info(f'Stop streaming audio data from client {c_id}')
    await sio.emit('mic_status',{"occupied": False})
    await SystemWrapper.stop_client(c_id)
    
    
@sio.on('audioData')
async def receive_audio(c_id, audio_data):
    SystemWrapper.receive_audio_data(c_id, audio_data)

ssl_context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
ssl_context.load_cert_chain('../cert.pem', '../key.pem')
web.run_app(app, host='0.0.0.0', port=443, ssl_context=ssl_context)
