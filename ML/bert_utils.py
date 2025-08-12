import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Label mapping provided
LABELS = {
    'ACCOUNTANT': 0, 'ADVOCATE': 1, 'AGRICULTURE': 2, 'APPAREL': 3, 'ARTS': 4,
    'AUTOMOBILE': 5, 'AVIATION': 6, 'Advocate': 7, 'Arts': 8, 'Automation Testing': 9,
    'BANKING': 10, 'BPO': 11, 'BUSINESS-DEVELOPMENT': 12, 'Blockchain': 13, 
    'Business Analyst': 14, 'CHEF': 15, 'CONSTRUCTION': 16, 'CONSULTANT': 17, 
    'Civil Engineer': 18, 'DESIGNER': 19, 'DIGITAL-MEDIA': 20, 'Data Science': 21, 
    'Database': 22, 'DevOps Engineer': 23, 'DotNet Developer': 24, 'ENGINEERING': 25, 
    'ETL Developer': 26, 'Electrical Engineering': 27, 'FINANCE': 28, 'FITNESS': 29, 
    'HEALTHCARE': 30, 'HR': 31, 'Hadoop': 32, 'Health and fitness': 33, 
    'INFORMATION-TECHNOLOGY': 34, 'Java Developer': 35, 'Mechanical Engineer': 36, 
    'Network Security Engineer': 37, 'Operations Manager': 38, 'PMO': 39, 
    'PUBLIC-RELATIONS': 40, 'Python Developer': 41, 'SALES': 42, 'SAP Developer': 43, 
    'Sales': 44, 'TEACHER': 45, 'Testing': 46, 'Web Designing': 47
}

ID2LABEL = {v: k for k, v in LABELS.items()}

# Load model and tokenizer (replace path with your model directory)
MODEL_PATH = "./bert_model"
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

def predict_with_bert(text):
    """Predict label and probabilities using BERT."""
    inputs = tokenizer(
        text,
        padding=True,
        truncation=True,
        return_tensors="pt",
        max_length=512
    )

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = torch.softmax(logits, dim=1).flatten()

    probs_dict = {ID2LABEL[i]: float(probs[i]) for i in range(len(probs))}
    best_label = max(probs_dict, key=probs_dict.get)
    best_prob = probs_dict[best_label]

    return {
        "predicted_label": best_label,
        "predicted_probability": best_prob,
        "all_probabilities": probs_dict
    }
