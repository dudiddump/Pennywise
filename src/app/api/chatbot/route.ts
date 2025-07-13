// app/api/chatbot/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";
import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

dotenv.config();

export async function POST(req: NextRequest) {
  try {
    const { userMessage } = await req.json();

    // CSV file paths
    const primaryPath = path.join(process.cwd(), "public/data/Primary data.csv");
    const assistantPath = path.join(
      process.cwd(),
      "public/data/AI-Powered Personal Finance Assistant_ Unlocking a Smarter(Sheet1).csv"
    );

    // Helper: Parse CSV into plain text
    const parseCSV = (csvFilePath: string) =>
      new Promise<string>((resolve, reject) => {
        const file = fs.readFileSync(csvFilePath, "utf8");
        Papa.parse(file, {
          header: true,
          complete: (results: any) => {
            const combinedText = results.data
              .map((row: any) => Object.values(row).join(" "))
              .join("\n");
            resolve(combinedText);
          },
          error: reject,
        });
      });

    // Load + merge CSVs
    const primaryData = await parseCSV(primaryPath);
    const assistantData = await parseCSV(assistantPath);
    const allText = `${primaryData}\n${assistantData}`;

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.createDocuments([allText]);

    // Create embeddings and vector store using OpenAI
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // Set up Chat model
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = loadQAStuffChain(model);

    // Retrieve relevant documents and ask the chatbot
    const relevantDocs = await vectorStore.similaritySearch(userMessage, 4);
    const response = await chain.invoke({
      input_documents: relevantDocs,
      question: userMessage,
    });

    return NextResponse.json({ response: response.text });
  } catch (err: any) {
    console.error("Chatbot error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
