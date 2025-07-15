// src/app/api/chatbot/route.ts
// This file defines a server-side API endpoint for your chatbot.
// It receives a question from the client, calls the Gemini API,
// and sends the AI's response back to the client.

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs'; // Node.js file system promises for async file operations
import path from 'path'; // Node.js path module for resolving file paths
import * as XLSX from 'xlsx'; // Import the xlsx library for Excel file parsing

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to extract the 'question' sent from the client-side ChatbotUI.tsx
    const { question } = await req.json();

    // Validate that a question was provided
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing question in request body.' }, { status: 400 });
    }

    // Access the API key from environment variables.
    const apiKey = process.env.GEMINI_API_KEY;

    // Add a check to ensure the API key is loaded
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
    }

    // --- NEW: Read data from ALL Excel/CSV files in public/data ---
    let allFinancialData = '';
    const dataDirectoryPath = path.join(process.cwd(), 'public', 'data');

    try {
      // Read all file names in the public/data directory
      const files = await fs.readdir(dataDirectoryPath);
      const dataPromises = files.map(async (file) => {
        const filePath = path.join(dataDirectoryPath, file);
        const fileExtension = path.extname(file).toLowerCase();

        // Process CSV files
        if (fileExtension === '.csv') {
          console.log(`Reading CSV file: ${file}`);
          const content = await fs.readFile(filePath, 'utf8');
          return `--- Data from ${file} ---\n${content}\n`;
        }
        // Process XLSX (Excel) files
        else if (fileExtension === '.xlsx') {
          console.log(`Reading XLSX file: ${file}`);
          // Read the Excel file as binary data
          const fileBuffer = await fs.readFile(filePath);
          // Parse the workbook
          const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
          let sheetData = '';
          // Iterate over each sheet in the workbook
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            // Convert the worksheet to CSV format string
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            sheetData += `--- Sheet: ${sheetName} ---\n${csv}\n`;
          });
          return `--- Data from ${file} ---\n${sheetData}\n`;
        }
        return ''; // Ignore other file types
      });

      // Wait for all file reading promises to resolve
      const contents = await Promise.all(dataPromises);
      allFinancialData = contents.filter(Boolean).join('\n'); // Combine all non-empty contents

      if (allFinancialData.trim() === '') {
        allFinancialData = 'No relevant financial data files were found or processed.';
      } else {
        console.log("All financial data files processed successfully.");
      }

    } catch (fileError) {
      console.error(`Error processing financial data files in ${dataDirectoryPath}:`, fileError);
      allFinancialData = 'An error occurred while loading financial data files.';
    }
    // --- END NEW ---

    // Define the prompt for the AI assistant. This tells Gemini how to behave.
    // We now include the combined financial data in the prompt.
    const prompt = `You are an AI personal finance assistant. Provide helpful and concise advice on finance, budgeting, expenses, and investment based on the following user query. Use the provided financial data as context if relevant, but do not directly quote it unless necessary. Do not provide disclaimers. Do not mention that you are an AI. Do not provide any information about the data you were trained on.

    ${allFinancialData}

    User query: "${question}"`;

    // Construct the payload for the Gemini API call.
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Make the HTTP POST request to the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Parse the JSON response from the Gemini API
    const result = await response.json();

    // Check if the Gemini API returned a valid response structure
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      // Extract the AI's generated text response
      const aiResponseText = result.candidates[0].content.parts[0].text;
      // Return the AI's answer to the client-side ChatbotUI.tsx component.
      return NextResponse.json({ answer: aiResponseText });
    } else {
      // Log an error if the API response structure is unexpected
      console.error("Unexpected API response structure from Gemini:", result);
      // Return an error message to the client
      return NextResponse.json({ error: 'Failed to get a valid response from the AI.' }, { status: 500 });
    }

  } catch (error) {
    // Catch any errors that occur during the process (e.g., network issues, parsing errors)
    console.error('Error in API route:', error);
    // Return a generic internal server error message to the client
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
