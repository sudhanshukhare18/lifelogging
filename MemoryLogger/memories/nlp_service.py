import os
import spacy
from sentence_transformers import SentenceTransformer
from transformers import pipeline
import torch

# --- 1. Global Model State & Configuration ---
# Global variables to hold model instances (initialized to None)
_spacy_nlp = None
_embedding_model = None
_emotion_analyzer = None
_models_loaded = False

# Configuration constants
_device = "cuda" if torch.cuda.is_available() else "cpu"
EMBEDDING_MODEL_NAME = os.environ.get('EMBEDDING_MODEL_NAME', 'all-MiniLM-L6-v2') 
EMOTION_MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"


# --- 2. Model Loading Function (Lazy) ---

def _load_nlp_models():
    """
    Loads all required models only once, the first time this function is called.
    This prevents memory overload during the initial server boot.
    """
    global _spacy_nlp, _embedding_model, _emotion_analyzer, _models_loaded
    
    if _models_loaded:
        return

    print(f"--- LAZY LOADING: Device set to use {_device} ---")
    try:
        # 1. SpaCy Model for Lemmatization and Stopword Removal
        print("--- LAZY LOADING: Initializing spaCy (en_core_web_sm) ---")
        # Ensure 'en_core_web_sm' is downloaded locally or via your Render build script
        _spacy_nlp = spacy.load("en_core_web_sm")
        
        # 2. Embedding Model
        print(f"--- LAZY LOADING: Initializing SentenceTransformer ({EMBEDDING_MODEL_NAME}) ---")
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, device=_device)
        
        # 3. Emotion Detection Model
        print(f"--- LAZY LOADING: Initializing Emotion Analyzer ({EMOTION_MODEL_NAME}) ---")
        # device=0 for CUDA, device=-1 for CPU
        _emotion_analyzer = pipeline(
            "text-classification", 
            model=EMOTION_MODEL_NAME, 
            top_k=1, 
            # Use 0 for CUDA device, -1 for CPU device
            device=0 if _device == 'cuda' else -1 
        )
        
        _models_loaded = True
        print("--- LAZY LOADING: All models successfully initialized. ---")

    except Exception as e:
        print(f"FATAL ERROR: Failed to load all required AI models: {e}")
        _models_loaded = False
        # Raise environment error to stop any dependent calls from proceeding
        raise EnvironmentError(f"AI models failed to load. Cannot process memory: {e}")


# --- 3. Service Functions ---

def preprocess_text(text: str) -> str:
    """
    Cleans and preprocesses text using spaCy for better embedding generation.
    Steps: Lowercase, Tokenize, Lemmatize, Remove Stopwords & Punctuation.
    (Assumes _load_nlp_models has been called and _spacy_nlp is available)
    """
    # Use the global model instance
    doc = _spacy_nlp(text.lower())
    # Join the lemma of tokens that are not stopwords and are alphabetic
    return " ".join([token.lemma_ for token in doc if not token.is_stop and token.is_alpha])

def get_embedding(text: str) -> list:
    """
    Generates a numerical vector embedding for the input text.
    Returns the vector as a standard Python list (for JSONField storage).
    """
    _load_nlp_models() # Ensures models are loaded before use
    
    if not _models_loaded:
        # Return a 384-dimensional zero vector if models are unavailable
        return [0.0] * 384 
    
    preprocessed_text = preprocess_text(text)
    
    # Encode the preprocessed text
    # convert_to_tensor=False ensures it returns a NumPy array which is then converted to a list
    vector = _embedding_model.encode(preprocessed_text, convert_to_tensor=False).tolist()
    return vector

def get_emotion(text: str) -> str:
    """
    Detects the primary emotion (label) in the input text.
    """
    _load_nlp_models() # Ensures models are loaded before use
    
    if not _models_loaded or not text:
        return 'unknown'
    
    try:
        # Use the global model instance
        # The pipeline returns a list of dictionaries, e.g., [[{'label': 'joy', 'score': 0.98}]]
        result = _emotion_analyzer(text)
        # Extract the label of the top result
        return result[0][0]['label']
    except Exception as e:
        print(f"Error during emotion analysis: {e}")
        return 'error'


def process_memory_text(text: str) -> dict:
    """
    Main function called by the ViewSet to process text before storage.
    """
    # This function is now the entry point that triggers lazy loading
    _load_nlp_models()

    if not _models_loaded:
        # If loading still failed, return a structured error response
        raise EnvironmentError("AI models failed to load. Cannot process memory.")

    return {
        'embedding': get_embedding(text),
        'emotion_label': get_emotion(text)
    }
