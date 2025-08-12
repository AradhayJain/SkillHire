from flask import Flask, request, jsonify
from pdf_utils import download_pdf_from_url, extract_text_from_pdf
from bert_utils import predict_with_bert

app = Flask(__name__)

@app.route("/extract_details", methods=["POST"])
def extract_details():
    data = request.json
    if not data or "pdf_url" not in data:
        return jsonify({"error": "Missing 'pdf_url' in request body"}), 400

    pdf_url = data["pdf_url"]

    try:
        # Download and extract PDF text
        pdf_path = download_pdf_from_url(pdf_url)
        pdf_text = extract_text_from_pdf(pdf_path)

        # Predict with BERT
        result = predict_with_bert(pdf_text)

        return jsonify({
            "extracted_text": pdf_text,
            "bert_result": result
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
