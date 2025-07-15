# extract_model_params.py
# This script loads the trained Python model and vectorizer,
# then prints their key parameters in a JavaScript/TypeScript-friendly format.
# You will copy this output directly into your Next.js route.ts file.

import joblib
import json
import numpy as np # Keep numpy import as it's used by joblib internally

try:
    # Load the trained model and vectorizer
    model = joblib.load('query_classifier_model.joblib')
    vectorizer = joblib.load('tfidf_vectorizer.joblib')
except FileNotFoundError:
    print("Error: 'query_classifier_model.joblib' or 'tfidf_vectorizer.joblib' not found.")
    print("Please ensure you have run 'classifier_training.py' successfully first,")
    print("and that these .joblib files are in the same directory as this script.")
    exit() # Exit if the files aren't found

# Extract parameters from TF-IDF Vectorizer
# Get vocabulary as a list of words, ordered by their index
tfidf_vocabulary_list = sorted(vectorizer.vocabulary_.items(), key=lambda item: item[1])
tfidf_vocabulary_words = [word for word, index in tfidf_vocabulary_list]

# Get IDF values
tfidf_idf = vectorizer.idf_.tolist() # Convert numpy array to list for JSON

# Create a word-to-index map for efficient lookup in JS
# FIX: Convert numpy.int64 values to standard Python int
tfidf_vocab_map = {word: int(index) for word, index in vectorizer.vocabulary_.items()}


# Extract parameters from Multinomial Naive Bayes Model
model_classes = model.classes_.tolist()
model_class_log_prior = model.class_log_prior_.tolist()
model_feature_log_prob = model.feature_log_prob_.tolist() # Convert numpy array to list for JSON

print("// ============================================================================")
print("// --- START OF MODEL PARAMETERS (COPY FROM HERE) ---")
print("// Copy these constants directly into your src/app/api/chatbot/route.ts file")

print(f"\nconst TFIDF_VOCABULARY = {json.dumps(tfidf_vocabulary_words, indent=2)};")
print(f"\nconst TFIDF_IDF = {json.dumps(tfidf_idf, indent=2)};")
print(f"\nconst TFIDF_VOCAB_MAP = {json.dumps(tfidf_vocab_map, indent=2)};") # For quick word-to-index lookup

print(f"\nconst MODEL_CLASSES = {json.dumps(model_classes, indent=2)};")
print(f"\nconst MODEL_CLASS_LOG_PRIOR = {json.dumps(model_class_log_prior, indent=2)};")
print(f"\nconst MODEL_FEATURE_LOG_PROB = {json.dumps(model_feature_log_prob, indent=2)};")

print("// --- END OF MODEL PARAMETERS (COPY UP TO HERE) ---")
print("// ============================================================================")
