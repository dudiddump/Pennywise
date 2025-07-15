# classifier_training.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import joblib # For saving/loading the model
import re # For more robust text cleaning

# --- 1. Data Collection & Labeling ---
# Load your dataset from the CSV file
# Make sure '200_User_Queries__Selected_Categories_.csv' is in the same directory as this script,
# or provide the full path to the file.
try:
    df = pd.read_csv("C:/Users/USER/OneDrive - Universiti Teknologi PETRONAS/Documents/4.0 FYP Project/ml-model-training/200_User_Queries__Selected_Categories_.csv")
    # Rename columns to 'query' and 'category' for consistency with the script
    df = df.rename(columns={'User Query': 'query', 'Category': 'category'})
except FileNotFoundError:
    print("Error: '200_User_Queries__Selected_Categories_.csv' not found.")
    print("Please ensure the CSV file is in the same directory as the script or provide the correct path.")
    exit() # Exit if the file isn't found

print("--- Loaded Data ---")
print(df.head())
print(f"\nTotal samples loaded: {len(df)}")
print("\nCategory Distribution:")
print(df['category'].value_counts())

# --- 2. Text Preprocessing ---
# Function for basic text cleaning
def clean_text(text):
    text = str(text).lower() # Convert to string and lowercase
    text = re.sub(r'[^a-z0-9\s]', '', text) # Remove punctuation and special characters
    text = re.sub(r'\s+', ' ', text).strip() # Replace multiple spaces with single space
    return text

df['cleaned_query'] = df['query'].apply(clean_text)

# --- 3. Feature Extraction (TF-IDF) ---
vectorizer = TfidfVectorizer(max_features=1000, stop_words='english') # Added stop_words for better feature extraction
X = vectorizer.fit_transform(df['cleaned_query'])
y = df['category']

print(f"\nShape of feature matrix (X): {X.shape}") # (num_samples, num_features)

# --- Split Data into Training and Testing Sets ---
# Using stratify=y ensures that the proportion of categories in train and test sets is similar
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"Training samples: {X_train.shape[0]}, Testing samples: {X_test.shape[0]}")

# --- 4. Model Selection & 5. Model Training ---
model = MultinomialNB()
model.fit(X_train, y_train)

# --- 6. Model Evaluation ---
y_pred = model.predict(X_test)

print("\n--- Model Evaluation ---")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:")
# Ensure labels are ordered for the confusion matrix for consistent output
print(confusion_matrix(y_test, y_pred, labels=y.unique()))

# --- 7. Model Saving ---
model_filename = 'query_classifier_model.joblib'
vectorizer_filename = 'tfidf_vectorizer.joblib'

joblib.dump(model, model_filename)
joblib.dump(vectorizer, vectorizer_filename)
print(f"\nModel saved to {model_filename}")
print(f"Vectorizer saved to {vectorizer_filename}")

# --- Example of Loading and Using the Model ---
# This part is for testing the saved model locally
# loaded_model = joblib.load(model_filename)
# loaded_vectorizer = joblib.load(vectorizer_filename)

# new_query = "how much is left in my food budget?"
# new_query_cleaned = clean_text(new_query) # Use the same cleaning function
# new_query_vectorized = loaded_vectorizer.transform([new_query_cleaned])
# prediction = loaded_model.predict(new_query_vectorized)
# print(f"\nNew query: '{new_query}' -> Predicted category: '{prediction[0]}'")

# new_query_2 = "Should I buy more stocks?"
# new_query_2_cleaned = clean_text(new_query_2)
# new_query_2_vectorized = loaded_vectorizer.transform([new_query_2_cleaned])
# prediction_2 = loaded_model.predict(new_query_2_vectorized)
# print(f"New query: '{new_query_2}' -> Predicted category: '{prediction_2[0]}'")

# new_query_3 = "Plan a budget for my new apartment."
# new_query_3_cleaned = clean_text(new_query_3)
# new_query_3_vectorized = loaded_vectorizer.transform([new_query_3_cleaned])
# prediction_3 = loaded_model.predict(new_query_3_vectorized)
# print(f"New query: '{new_query_3}' -> Predicted category: '{prediction_3[0]}'")
