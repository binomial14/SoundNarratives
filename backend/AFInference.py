import wave
import time
import threading

from utils import get_current_time


def process_audio_file(client,filename,config):
    # time.sleep(3)
    result, result_dict = client.generate_caption(filename,config)
    return result

def save_audio_file(filename, audio_buffer):
    """Save the accumulated audio buffer to a WAV file."""
    with wave.open(filename, 'wb') as wav_file:
        num_channels = 1  # Mono
        sample_width = 2  # 16-bit PCM (2 bytes per sample)
        frame_rate = 16000  # Assuming 16000 Hz as per the frontend

        wav_file.setnchannels(num_channels)
        wav_file.setsampwidth(sample_width)
        wav_file.setframerate(frame_rate)
        wav_file.writeframes(b''.join(audio_buffer))
    print(f"Saved {filename}")

async def af_model_inference(client, config, LOGGER):
    await client.send_client_data('systemInfo',True)

    start_time = get_current_time()
    audio_generator = client.generator()

    audio_buffer = []
    cnt = 0
    for content in  audio_generator:
        audio_buffer.append(content)
        if (get_current_time() - start_time) > int(config['audioLength'])*1000:
            save_audio_file('./tmp/tmp.wav',audio_buffer)
            caption = process_audio_file(client,'./tmp/tmp.wav',config)
            await client.send_caption_data('captionData',caption)
            cnt = 0
            start_time = get_current_time()
            audio_buffer = []
        cnt += 1