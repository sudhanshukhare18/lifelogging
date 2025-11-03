# memories/nlp_service.py

import spacy
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import torch
import numpy as np

# --- 1. Model Initialization ---
# Determine device (Codespace/PC)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Device set to use {device}")

try:
    # 1. SpaCy Model for Lemmatization and Stopword Removal
    NLP = spacy.load("en_core_web_sm")
    
    # 2. Embedding Model (all-MiniLM-L6-v2, 384 dimensions)
    EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2', device=device)
    
    # 3. Emotion Detection Model
    EMOTION_ANALYZER = pipeline(
        "text-classification", 
        model="j-hartmann/emotion-english-distilroberta-base", 
        top_k=1, 
        device=0 if device == 'cuda' else -1
    )
    MODELS_LOADED = True
except Exception as e:
    print(f"FATAL ERROR: Failed to load all required AI models: {e}")
    MODELS_LOADED = False


# --- 2. Service Functions ---

def preprocess_text(text: str) -> str:
    """
    Cleans and preprocesses text using spaCy for better embedding generation.
    Steps: Lowercase, Tokenize, Lemmatize, Remove Stopwords & Punctuation.
    """
    if not MODELS_LOADED:
        return text # Return raw text if spaCy failed
        
    doc = NLP(text.lower())
    # Join the lemma of tokens that are not stopwords and are alphabetic
    return " ".join([token.lemma_ for token in doc if not token.is_stop and token.is_alpha])

def get_embedding(text: str) -> list:
    """
    Generates a numerical vector embedding for the input text using the preprocessed text.
    Returns the vector as a standard Python list (for JSONField storage).
    """
    if not MODELS_LOADED:
        # Return an empty list or a zero vector if models are not available
        return [0.0] * 384 
    
    # Use the preprocessing step now that spaCy is confirmed working
    preprocessed_text = preprocess_text(text)
    
    # Encode the preprocessed text
    vector = EMBEDDING_MODEL.encode(preprocessed_text, convert_to_tensor=False).tolist()
    return vector

def get_emotion(text: str) -> str:
    """
    Detects the primary emotion (label) in the input text.
    """
    if not MODELS_LOADED or not text:
        return 'unknown'
    
    try:
        # The pipeline returns a list of dictionaries, e.g., [[{'label': 'joy', 'score': 0.98}]]
        result = EMOTION_ANALYZER(text)
        # Extract the label of the top result
        return result[0][0]['label']
    except Exception:
        return 'error'


def process_memory_text(text: str) -> dict:
    """
    Main function called by the ViewSet to process text before storage.
    """
    if not MODELS_LOADED:
        raise EnvironmentError("AI models failed to load. Cannot process memory.")

    return {
        'embedding': get_embedding(text),
        'emotion_label': get_emotion(text)
    }