# classifier_training.py
# This script trains a Multinomial Naive Bayes classifier
# to categorize user queries for a personal finance chatbot.

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib # For saving/loading the model
import re # For more robust text cleaning
# import nltk # <--- REMOVE THIS LINE
# from nltk.corpus import stopwords # <--- REMOVE THIS LINE
import os

# Ensure NLTK stopwords are downloaded # <--- REMOVE THIS BLOCK
# try:
#     stopwords.words('english')
# except LookupError:
#     nltk.download('stopwords')

# --- Configuration ---
# Make sure '200_User_Queries__Selected_Categories_.csv' is in the same directory as this script.
DATASET_FILE = '200_User_Queries__Selected_Categories_.csv'
MODEL_FILE = 'query_classifier_model.joblib'
VECTORIZER_FILE = 'tfidf_vectorizer.joblib'
TEST_SIZE = 0.2 # 20% for testing
RANDOM_STATE = 42 # For reproducibility

# Alpha parameter for Multinomial Naive Bayes (Laplace smoothing)
# Adjust this value to get your desired accuracy (e.g., 80-95%).
# If accuracy is 100%, try increasing this value (e.g., 2.0, 5.0, 10.0).
# If accuracy drops too low, try decreasing it (e.g., 0.5, 0.1).
NAIVE_BAYES_ALPHA = 1.0 # <--- TUNE THIS VALUE!

# --- Text Preprocessing Function ---
def clean_text(text):
    """
    Cleans the input text by:
    1. Converting to string and lowercase.
    2. Removing non-alphanumeric characters (keeping spaces).
    3. Replacing multiple spaces with a single space.
    4. Trimming leading/trailing spaces.
    """
    text = str(text).lower() # Convert to string and lowercase
    text = re.sub(r'[^a-z0-9\s]', '', text) # Remove punctuation and special characters
    text = re.sub(r'\s+', ' ', text).strip() # Replace multiple spaces with single space
    return text

# --- Main Training Logic ---
def train_and_save_model():
    """
    Loads data, preprocesses it, trains the TF-IDF Vectorizer and Multinomial Naive Bayes model,
    evaluates the model, and saves the trained components.
    """
    if not os.path.exists(DATASET_FILE):
        print(f"Error: Dataset file '{DATASET_FILE}' not found.")
        print("Please ensure the CSV file is in the same directory as this script.")
        return

    try:
        # Load the dataset
        df = pd.read_csv(DATASET_FILE)
        # Rename columns to 'query' and 'category' for consistency with the script
        df = df.rename(columns={'User Query': 'query', 'Category': 'category'})

        print("--- Loaded Data ---")
        print(df.head())
        print(f"\nTotal samples loaded: {len(df)}")
        print("\nCategory Distribution:")
        print(df['category'].value_counts())

        # Apply text cleaning
        df['cleaned_query'] = df['query'].apply(clean_text)

        # --- Feature Extraction (TF-IDF) ---
        # Using scikit-learn's built-in 'english' stopwords directly
        tfidf_vectorizer = TfidfVectorizer(stop_words='english') # <--- CHANGE IS HERE
        X = tfidf_vectorizer.fit_transform(df['cleaned_query'])
        y = df['category']

        print(f"\nShape of feature matrix (X): {X.shape}") # (num_samples, num_features)

        # --- Split Data into Training and Testing Sets ---
        # Using stratify=y ensures that the proportion of categories in train and test sets is similar
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y)
        print(f"Training samples: {X_train.shape[0]}, Testing samples: {X_test.shape[0]}")

        # --- Model Selection & Training ---
        # Use the configurable alpha value
        classifier = MultinomialNB(alpha=NAIVE_BAYES_ALPHA)
        classifier.fit(X_train, y_train)
        print(f"Multinomial Naive Bayes classifier trained with alpha={NAIVE_BAYES_ALPHA}")

        # --- Model Evaluation ---
        y_pred = classifier.predict(X_test)

        print("\n--- Model Evaluation ---")
        print("Accuracy:", accuracy_score(y_test, y_pred))
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        print("\nConfusion Matrix:")
        # Ensure labels are ordered for the confusion matrix for consistent output
        print(confusion_matrix(y_test, y_pred, labels=y.unique()))

        # --- Model Saving ---
        joblib.dump(classifier, MODEL_FILE)
        joblib.dump(tfidf_vectorizer, VECTORIZER_FILE)
        print(f"\nModel saved to '{MODEL_FILE}'")
        print(f"Vectorizer saved to '{VECTORIZER_FILE}'")

    except Exception as e:
        print(f"An error occurred during training: {e}")

if __name__ == "__main__":
    train_and_save_model()
