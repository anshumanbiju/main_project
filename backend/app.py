from flask import Flask, request, jsonify, send_file
import os
import uuid
from werkzeug.utils import secure_filename
from utils import generate_subtitles  # Assume this is your subtitle generation function
import threading
import time
from flask_cors import CORS  # Ensure CORS is enabled if frontend and backend are on different origins

app = Flask(__name__)  # Corrected __name__

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

progress_store = {}

# Enable CORS for all domains (optional but useful in development)
CORS(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/generate-subtitles", methods=["POST"])
def generate_subtitles_route():
    if 'videoFile' not in request.files:
        return jsonify({"error": "No file part"}), 400

    video_file = request.files['videoFile']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if video_file and allowed_file(video_file.filename):
        filename = secure_filename(video_file.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        video_file.save(video_path)

        task_id = str(uuid.uuid4())  # Generate a unique task ID
        progress_store[task_id] = {'progress': 0}

        # Start processing in a background thread
        def process_video():
            try:
                print(f"Starting video processing for task {task_id}...")

                # Step 1: Audio extraction (First 10%)
                for i in range(1, 11):  # Simulate 10% for audio extraction
                    time.sleep(0.1)
                    progress_store[task_id]['progress'] = i
                    print(f"Task {task_id}: Audio extraction {i}%")

                # Step 2: Subtitle generation (Next 80%)
                for i in range(11, 71):  # Simulate 80% for subtitle generation
                    time.sleep(0.1)
                    progress_store[task_id]['progress'] = i
                    print(f"Task {task_id}: Generating subtitles... {i}%")

                # Call your subtitle generation function (ASR and Whisper models together)
                subtitles_file_path = generate_subtitles(
                    video_path,
                    model_path="E:\\video_player\\backend\\subtitle-generator",
                    processor_path="E:\\video_player\\backend\\subtitle-generator",
                    whisper_model_name="base"  # Assuming Whisper is used after custom ASR
                )
                print(f"Task {task_id}: Subtitle generation completed...")

                # Step 3: Saving and returning subtitles (Last 10%)
                for i in range(71, 101):  # Simulate last 10% for saving and returning subtitles
                    time.sleep(0.1)
                    progress_store[task_id]['progress'] = i
                    print(f"Task {task_id}: Saving and returning subtitles... {i}%")

                # Finalize progress and store the file path
                progress_store[task_id]['progress'] = 100
                progress_store[task_id]['subtitlesFilePath'] = subtitles_file_path
                print(f"Task {task_id}: Subtitle file stored at {subtitles_file_path}")

            except Exception as e:
                print(f"Error processing video for task {task_id}: {e}")
                progress_store[task_id]['progress'] = 0
                progress_store[task_id]['error'] = str(e)

        # Start the background processing thread
        threading.Thread(target=process_video).start()

        return jsonify({"taskId": task_id}), 202

@app.route("/progress/<task_id>", methods=["GET"])
def check_progress(task_id):
    progress_info = progress_store.get(task_id)

    if progress_info:
        print(f"Progress for task {task_id}: {progress_info['progress']}%")
        return jsonify(progress_info)
    else:
        return jsonify({"error": "Invalid task ID"}), 404

@app.route("/download/<task_id>", methods=["GET"])
def download_subtitles(task_id):
    progress_info = progress_store.get(task_id)

    if progress_info and 'subtitlesFilePath' in progress_info:
        subtitles_file_path = progress_info['subtitlesFilePath']
        try:
            # Ensure the correct MIME type is set for .srt files
            return send_file(subtitles_file_path, as_attachment=True, download_name="generated-subtitles.srt", mimetype="text/srt")
        except Exception as e:
            return jsonify({"error": f"Error sending file: {e}"}), 500
    else:
        return jsonify({"error": "Subtitles not available yet"}), 404

if __name__ == "__main__":  # Corrected to __name__
    app.run(debug=True)
