from transformers import BertTokenizerFast, BertForTokenClassification
import torch
import re

MODEL_PATH = "./bert_resume_ner"  # your trained model

# Load model + tokenizer only once
tokenizer = BertTokenizerFast.from_pretrained(MODEL_PATH)
model = BertForTokenClassification.from_pretrained(MODEL_PATH)

# Get labels back
id2label = model.config.id2label


def extract_entities_with_ner(text: str):
    """Extract entities (Skills, Name, Projects, etc.) from resume text"""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    predictions = torch.argmax(outputs.logits, dim=2)

    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    labels = [id2label[p.item()] for p in predictions[0]]

    entities = {}
    current_entity = None
    current_label = None

    for token, label in zip(tokens, labels):
        if label.startswith("B-"):
            if current_label:
                entities.setdefault(current_label, []).append(" ".join(current_entity))
            current_label = label[2:]
            current_entity = [token.replace("##", "")]
        elif label.startswith("I-") and current_label == label[2:]:
            current_entity.append(token.replace("##", ""))
        else:
            if current_label:
                entities.setdefault(current_label, []).append(" ".join(current_entity))
                current_entity = None
                current_label = None

    # Save last entity
    if current_label:
        entities.setdefault(current_label, []).append(" ".join(current_entity))

    # 🔥 Clean results before returning
    return clean_ner_entities(entities)


def clean_ner_entities(ner_result):
    """
    Cleans raw NER outputs: removes special tokens, joins subwords,
    filters punctuation/nonsense tokens.
    """
    cleaned_result = {}

    for field, values in ner_result.items():
        cleaned_values = []
        for val in values:
            # Remove unwanted tokens
            if val in ["[CLS]", "[SEP]", "[PAD]"]:
                continue
            if not re.search(r"[a-zA-Z0-9]", val):  # skip if only punctuation
                continue

            # Fix spacing (BERT subwords)
            val = val.replace(" ##", "").strip()

            cleaned_values.append(val)

        # Deduplicate + keep meaningful values
        cleaned_values = list(dict.fromkeys(cleaned_values))

        cleaned_result[field] = cleaned_values

    return cleaned_result
