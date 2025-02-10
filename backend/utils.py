import whisper
from moviepy.editor import VideoFileClip
import os
from transformers import pipeline

def extract_audio_from_video(video_path, audio_path):
    """
    Extracts the audio from a video file and saves it as a separate file.
    """
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)
    video.close()

def format_timestamp(seconds):
    """
    Formats seconds into an SRT timestamp (HH:MM:SS,ms).
    """
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{milliseconds:03}"

def generate_subtitles(video_path, model_path, processor_path, whisper_model_name="base", task_id=None, progress_store=None):
    """
    Generates subtitles for a video using a custom ASR model followed by Whisper model correction.
    """
    # Load Whisper model for correction
    try:
        whisper_model = whisper.load_model(whisper_model_name)
    except Exception as e:
        print(f"Error loading Whisper model: {e}")
        raise

    # Load the fine-tuned Wav2Vec2 model and processor for ASR
    asr_pipeline = pipeline(
        "automatic-speech-recognition",
        model=model_path,
        tokenizer=processor_path
    )

    # Extract audio from video
    audio_path = "temp_audio.wav"
    extract_audio_from_video(video_path, audio_path)

    # Step 1: Transcribe audio with Wav2Vec2 model (ASR model)
    result_wav2vec = asr_pipeline(audio_path)
    wav2vec_transcript = result_wav2vec['text'].lower()  # Convert transcript to lowercase
    print(f"Custom ASR model output: {wav2vec_transcript}")

    # Step 2: Use Whisper model for better vocabulary and timestamp correction
    result_whisper = whisper_model.transcribe(audio_path)

    # Create SRT file path
    srt_path = os.path.splitext(video_path)[0] + "_whisper.srt"

    # Step 3: Generate subtitles using Whisper's improved segments
    with open(srt_path, "w", encoding="utf-8") as srt_file:
        for i, segment in enumerate(result_whisper["segments"]):
            start = format_timestamp(segment["start"])
            end = format_timestamp(segment["end"])
            text = segment["text"].strip()
            srt_file.write(f"{i + 1}\n{start} --> {end}\n{text}\n\n")

            # Update progress periodically (simulate process)
            if progress_store:
                progress = int((i + 1) / len(result_whisper["segments"]) * 100)
                progress_store[task_id]['progress'] = progress

    # Clean up temporary audio file
    os.remove(audio_path)

    return srt_path
