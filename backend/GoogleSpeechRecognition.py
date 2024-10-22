from google.cloud import speech

from utils import get_current_time

async def google_speech_recognition(client, web_config, LOGGER):
    await client.send_client_data('systemInfo',0,'startLoading',True)
    speech_client = speech.SpeechClient()

    speaker_diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=0,
        min_speaker_count=1,
        max_speaker_count=4,
    )

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
        max_alternatives=1, # can output 3 alternatives and see if can help LLM select the best
        model='latest_long', # check https://cloud.google.com/speech-to-text/docs/transcription-model for different types of model, medical_conversation, latest_long
        diarization_config=speaker_diarization_config,
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config, interim_results=True
    )
    await client.send_client_data('systemInfo',0,'endLoading',False)

    audio_generator = client.generator()
    requests = (speech.StreamingRecognizeRequest(audio_content=content) for content in audio_generator)
    responses = speech_client.streaming_recognize(streaming_config, requests)

    for response in responses:
        if get_current_time() - client.start_time > 180*1000:
            client.start_time = get_current_time()
            break

        if response:
            data = ''
            for idx, word in enumerate(response.results[0].alternatives[0].transcript.split()):
                if idx != 0:
                    if word not in [',', '.', '!', '?']:
                        data += ' '
                else:
                    if word in [',', '.', '!', '?']:
                        continue
                data += word
            # data = ' '.join(response.results[0].alternatives[0].transcript.split())
            if response.results[0].is_final:
                LOGGER.info(' '.join(response.results[0].alternatives[0].transcript.split()))
                print(' '.join(response.results[0].alternatives[0].transcript.split()))
                if len(data) > 1:
                    data = data[0].upper() + data[1:] + "."
            else:
                print(' '.join(response.results[0].alternatives[0].transcript.split()),end='\r')
            
            
            spkr = ''
            for w in response.results[0].alternatives[0].words:
                if w:
                    spkr = w.speaker_tag
                    break
            await client.send_client_data('transcriptData',spkr,data,response.results[0].is_final)
