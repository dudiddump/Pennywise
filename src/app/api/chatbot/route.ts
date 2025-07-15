// src/app/api/chatbot/route.ts
// This file defines a server-side API endpoint for your chatbot.
// It now integrates a custom ML model for query classification
// before calling the Gemini API.

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

// ============================================================================
// --- START OF MODEL PARAMETERS (PASTE YOUR COPIED OUTPUT HERE) ---
// IMPORTANT: These are the actual parameters extracted from your trained Python model.

// Explicitly define types for the model parameters for better TypeScript inference
const TFIDF_VOCABULARY: string[] = [
  "beginners",
  "best",
  "bills",
  "budget",
  "build",
  "categories",
  "category",
  "create",
  "cryptocurrency",
  "deposit",
  "did",
  "entertainment",
  "exceed",
  "expense",
  "expenses",
  "fixed",
  "generate",
  "good",
  "groceries",
  "help",
  "highest",
  "includes",
  "income",
  "invest",
  "investment",
  "june",
  "list",
  "lowrisk",
  "meal",
  "month",
  "monthly",
  "option",
  "plan",
  "quarter",
  "recommend",
  "rent",
  "rm1000",
  "rm1500",
  "rm200",
  "rm3000",
  "rm5000",
  "roboadvisor",
  "safely",
  "savings",
  "shortterm",
  "spend",
  "spending",
  "stocks",
  "student",
  "total",
  "vacation",
  "way",
  "week",
  "weekly",
  "whats"
];

const TFIDF_IDF: number[] = [
  3.2587824703356527,
  3.4700915640028596,
  3.4700915640028596,
  1.908855753386637,
  3.6642475784438173,
  3.307572634505085,
  3.5307161858192946,
  2.971100397883872,
  3.905409635260705,
  3.5952547069568657,
  3.2587824703356527,
  3.5952547069568657,
  3.5952547069568657,
  3.307572634505085,
  3.6642475784438173,
  3.5952547069568657,
  3.4700915640028596,
  3.905409635260705,
  4.357394759003762,
  3.167810692129926,
  3.5307161858192946,
  3.4700915640028596,
  3.0452083700375936,
  2.8693177035739295,
  2.971100397883872,
  3.6642475784438173,
  3.307572634505085,
  3.412933150162911,
  3.5307161858192946,
  3.0452083700375936,
  2.936009078072602,
  3.412933150162911,
  3.905409635260705,
  3.5307161858192946,
  3.905409635260705,
  3.4700915640028596,
  3.6642475784438173,
  3.905409635260705,
  3.5307161858192946,
  3.738355550597539,
  3.4700915640028596,
  3.905409635260705,
  3.4700915640028596,
  3.4700915640028596,
  3.412933150162911,
  4.357394759003762,
  3.5307161858192946,
  3.5952547069568657,
  3.6642475784438173,
  3.6642475784438173,
  3.905409635260705,
  3.4700915640028596,
  3.5952547069568657,
  3.5307161858192946,
  2.776944383442914
];

// Use Record<string, number> to explicitly define the shape of the map
const TFIDF_VOCAB_MAP: Record<string, number> = {
  "list": 26,
  "expense": 13,
  "categories": 5,
  "month": 29,
  "generate": 16,
  "monthly": 30,
  "budget": 3,
  "includes": 21,
  "rent": 35,
  "bills": 2,
  "savings": 43,
  "invest": 23,
  "stocks": 47,
  "fixed": 15,
  "deposit": 9,
  "category": 6,
  "highest": 20,
  "spending": 46,
  "quarter": 33,
  "help": 19,
  "create": 7,
  "rm3000": 39,
  "income": 22,
  "whats": 54,
  "best": 1,
  "way": 51,
  "rm5000": 40,
  "safely": 42,
  "weekly": 53,
  "meal": 28,
  "rm200": 38,
  "cryptocurrency": 8,
  "good": 17,
  "investment": 24,
  "beginners": 0,
  "did": 10,
  "spend": 45,
  "groceries": 18,
  "recommend": 34,
  "roboadvisor": 41,
  "total": 49,
  "expenses": 14,
  "june": 25,
  "lowrisk": 27,
  "option": 31,
  "shortterm": 44,
  "plan": 32,
  "vacation": 50,
  "rm1500": 37,
  "exceed": 12,
  "entertainment": 11,
  "week": 52,
  "build": 4,
  "student": 48,
  "rm1000": 36
};

const MODEL_CLASSES: string[] = [
  "Budget Creation",
  "Expense Inquiry",
  "Investment Advice"
];

const MODEL_CLASS_LOG_PRIOR: number[] = [
  -1.1048819016817046,
  -1.1048819016817046,
  -1.086189768669552
];

const MODEL_FEATURE_LOG_PROB: number[][] = [
  [
    -5.183943688723654,
    -5.183943688723654,
    -3.4104400763990492,
    -2.516535307775698,
    -3.3882095305105873,
    -5.183943688723654,
    -5.183943688723654,
    -2.7950359375797644,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -3.4104400763990492,
    -5.183943688723654,
    -5.183943688723654,
    -3.0319659020538294,
    -5.183943688723654,
    -3.4104400763990492,
    -2.909982598661966,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -3.1690859516570136,
    -5.183943688723654,
    -2.930719329465999,
    -5.183943688723654,
    -3.6696902078225277,
    -5.183943688723654,
    -5.183943688723654,
    -3.4104400763990492,
    -3.3882095305105873,
    -3.6696902078225277,
    -3.1690859516570136,
    -3.3004171884439426,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -3.4104400763990492,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -5.183943688723654,
    -3.3882095305105873,
    -5.183943688723654,
    -3.6696902078225277,
    -5.183943688723654,
    -5.183943688723654,
    -3.1690859516570136,
    -5.183943688723654
  ],
  [
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.7872335322731225,
    -5.073984415311348,
    -2.8594824449673473,
    -3.202182238409757,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.0436660456035862,
    -3.2928554461097024,
    -3.2928554461097024,
    -2.8594824449673473,
    -3.0791680596924507,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.7222654450352577,
    -5.073984415311348,
    -3.202182238409757,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.0791680596924507,
    -2.8594824449673473,
    -5.073984415311348,
    -5.073984415311348,
    -2.721523487130157,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.202182238409757,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -5.073984415311348,
    -3.7222654450352577,
    -3.202182238409757,
    -5.073984415311348,
    -5.073984415311348,
    -3.0791680596924507,
    -5.073984415311348,
    -5.073984415311348,
    -3.2928554461097024,
    -5.073984415311348,
    -5.073984415311348
  ],
  [
    -2.9550756796477287,
    -3.2377396174365747,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.547262932375869,
    -3.1431262876940105,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.1431262876940105,
    -5.1299528499796025,
    -3.547262932375869,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -2.7615377052559507,
    -2.8971778088675926,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.158158152102922,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.158158152102922,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.2610760170412347,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.2377396174365747,
    -3.2610760170412347,
    -3.2377396174365747,
    -5.1299528499796025,
    -3.158158152102922,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.1431262876940105,
    -5.1299528499796025,
    -5.1299528499796025,
    -5.1299528499796025,
    -3.2377396174365747,
    -5.1299528499796025,
    -5.1299528499796025,
    -2.774783435525438
  ]
];

// --- END OF MODEL PARAMETERS ---
// ============================================================================


// English Stop Words (matching scikit-learn's default 'english' list for TfidfVectorizer)
const ENGLISH_STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could",
  "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
  "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's",
  "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
  "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "just", "me", "more", "most", "mustn't",
  "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
  "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't",
  "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
  "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);


// Function to clean text (matches Python's clean_text)
function cleanText(text: string): string {
    let cleaned = text.toLowerCase();
    // Remove non-alphanumeric characters except spaces
    cleaned = cleaned.replace(/[^a-z0-9\s]/g, '');
    // Replace multiple spaces with single space, then trim leading/trailing spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}

// Function to transform query to TF-IDF vector (matches Python's TfidfVectorizer logic)
function transformQueryToTfidf(query: string): number[] {
    const cleanedQuery = cleanText(query);
    // Split into words and filter out stopwords and empty strings
    // AND filter words that are not in our TFIDF_VOCAB_MAP
    const words = cleanedQuery.split(' ').filter(word =>
        word.length > 0 &&
        !ENGLISH_STOP_WORDS.has(word) &&
        TFIDF_VOCAB_MAP.hasOwnProperty(word) // Ensure the word exists in our trained vocabulary
    );

    // Calculate Term Frequency (TF) for each word in the query
    const termCounts: { [key: string]: number } = {};
    words.forEach(word => {
        termCounts[word] = (termCounts[word] || 0) + 1;
    });

    // Initialize TF-IDF vector with zeros, size of the vocabulary
    const tfidfVector = new Array(TFIDF_VOCABULARY.length).fill(0);

    // Calculate TF-IDF for words present in the query and vocabulary
    for (const word of Object.keys(termCounts)) {
        // Use non-null assertion operator (!) because we've already checked with hasOwnProperty
        const vocabIndex: number = TFIDF_VOCAB_MAP[word]!;

        const tf = termCounts[word]; // Term Frequency for this word in the query
        const termIdf = TFIDF_IDF[vocabIndex]; // IDF value for this word from trained vectorizer
        tfidfVector[vocabIndex] = tf * termIdf;
    }
    return tfidfVector;
}

// Function to predict category using Naive Bayes logic (matches Python's MultinomialNB)
function predictNaiveBayes(tfidfVector: number[]): string {
    let bestClass = '';
    let maxLogProb = -Infinity;

    // Iterate through each possible class
    for (let i = 0; i < MODEL_CLASSES.length; i++) {
        let currentClassLogProb = MODEL_CLASS_LOG_PRIOR[i]; // Start with the log prior probability of the class

        // Add log probabilities of features given the class
        for (let j = 0; j < tfidfVector.length; j++) {
            // Only consider features that are present (non-zero TF-IDF value) in the query
            // and are part of the model's features
            if (tfidfVector[j] > 0 && j < MODEL_FEATURE_LOG_PROB[i].length) {
                currentClassLogProb += tfidfVector[j] * MODEL_FEATURE_LOG_PROB[i][j];
            }
        }

        // Update best class if current class has a higher probability
        if (currentClassLogProb > maxLogProb) {
            maxLogProb = currentClassLogProb;
            bestClass = MODEL_CLASSES[i];
        }
    }
    return bestClass;
}


export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing question in request body.' }, { status: 400 });
    }

    // --- ML Model Integration: Classify the user query ---
    const tfidfVector = transformQueryToTfidf(question);
    const predictedCategory = predictNaiveBayes(tfidfVector);
    console.log(`User query: "${question}" classified as: "${predictedCategory}"`);
    // --- End ML Model Integration ---

    // Access the API key from environment variables.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
    }

    // --- Read data from ALL Excel/CSV files in public/data ---
    let allFinancialData = '';
    const dataDirectoryPath = path.join(process.cwd(), 'public', 'data');

    try {
      const files = await fs.readdir(dataDirectoryPath);
      const dataPromises = files.map(async (file) => {
        const filePath = path.join(dataDirectoryPath, file);
        const fileExtension = path.extname(file).toLowerCase();

        if (fileExtension === '.csv') {
          console.log(`Reading CSV file: ${file}`);
          const content = await fs.readFile(filePath, 'utf8');
          return `--- Data from ${file} ---\n${content}\n`;
        } else if (fileExtension === '.xlsx') {
          console.log(`Reading XLSX file: ${file}`);
          const fileBuffer = await fs.readFile(filePath);
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          let sheetData = '';
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            sheetData += `--- Sheet: ${sheetName} ---\n${csv}\n`;
          });
          return `--- Data from ${file} ---\n${sheetData}\n`;
        }
        return '';
      });

      const contents = await Promise.all(dataPromises);
      allFinancialData = contents.filter(Boolean).join('\n');

      if (allFinancialData.trim() === '') {
        allFinancialData = 'No relevant financial data files were found or processed.';
      } else {
        console.log("All financial data files processed successfully.");
      }

    } catch (fileError) {
      console.error(`Error processing financial data files in ${dataDirectoryPath}:`, fileError);
      allFinancialData = 'An error occurred while loading financial data files.';
    }
    // --- END Data Reading ---

    // Define the prompt for the AI assistant, now refined by the predicted category.
    let refinedPrompt: string;

    switch (predictedCategory) {
      case "Expense Inquiry":
        refinedPrompt = `You are an AI personal finance assistant specializing in expense analysis. Based on the following financial data and user query, provide a concise summary or analysis of their expenses. Focus on extracting relevant numbers and trends from the data if possible. Do not provide disclaimers. Do not mention that you are an AI. Do not provide any information about the data you were trained on.

        ${allFinancialData}

        User query: "${question}"`;
        break;
      case "Budget Creation":
        refinedPrompt = `You are an AI personal finance assistant specializing in budget planning. Based on the user's query, provide helpful and actionable advice on how to create or adjust a budget. If relevant, suggest how they might use the provided financial data to inform their budget. Do not provide disclaimers. Do not mention that you are an AI. Do not provide any information about the data you were trained on.

        ${allFinancialData}

        User query: "${question}"`;
        break;
      case "Investment Advice":
        refinedPrompt = `You are an AI investment advisor. Based on the user's query, provide general, helpful advice on investment strategies. Do NOT provide specific financial recommendations or act as a financial planner. Emphasize general principles. Do not provide disclaimers. Do not mention that you are an AI. Do not provide any information about the data you were trained on.

        User query: "${question}"`; // Financial data might be less relevant for general investment advice unless the query asks about specific numbers.
        break;
      default: // Fallback for unclassified or general queries
        refinedPrompt = `You are an AI personal finance assistant. Provide helpful and concise advice on finance, budgeting, expenses, and investment based on the following user query. Use the provided financial data as context if relevant, but do not directly quote it unless necessary. Do not provide disclaimers. Do not mention that you are an AI. Do not provide any information about the data you were trained on.

        ${allFinancialData}

        User query: "${question}"`;
        break;
    }


    // Construct the payload for the Gemini API call.
    const payload = {
      contents: [{ role: "user", parts: [{ text: refinedPrompt }] }],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Make the HTTP POST request to the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Check if the Gemini API returned a valid response structure
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const aiResponseText = result.candidates[0].content.parts[0].text;
      return NextResponse.json({ answer: aiResponseText });
    } else {
      console.error("Unexpected API response structure from Gemini:", result);
      return NextResponse.json({ error: 'Failed to get a valid response from the AI.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
