from flask import Flask, request, jsonify
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv  # <-- new

app = Flask(__name__)

# Load environment variables from .env
load_dotenv()

# Configure Cloudinary from CLOUDINARY_URL env var
cloudinary.config(secure=True)

@app.route("/upload", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    try:
        upload_result = cloudinary.uploader.upload(
            file,
            resource_type="auto",
            folder="pdf_uploads"
        )

        return jsonify({
            "message": "File uploaded successfully",
            "url": upload_result["secure_url"]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True,port=6000)
