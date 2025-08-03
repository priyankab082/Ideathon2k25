import whisper
import tempfile

model = whisper.load_model("base")


def transcribe_audio(audio_file):
    """
    Transcribe audio file to text using Whisper model.
    """    
    try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_audio:
                audio_file.save(temp_audio.name)
                result = model.transcribe(temp_audio.name)
                return result['text']
    except Exception as e:
            print(f"Transcription error: {e}")
            return None