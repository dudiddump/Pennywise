"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import Image from "next/image";

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "No response." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error fetching chatbot reply:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong!" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 border border-gray-300 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-4 border-b pb-3">
        <Image
          src="/avatar-bot.png"
          alt="Chatbot"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">
            Chat with PennyBot
          </h3>
          <p className="text-xs text-green-500">We're online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-4 h-80 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <Image
                src="/avatar-bot.png"
                alt="Bot"
                width={30}
                height={30}
                className="rounded-full mr-2"
              />
            )}
            {msg.sender === "user" && (
              <Image
                src="/avatar-user.png"
                alt="You"
                width={30}
                height={30}
                className="rounded-full ml-2"
              />
            )}
            <div
              className={`px-4 py-2 rounded-xl text-sm max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center text-sm text-gray-400">
            <Image
              src="/avatar-bot.png"
              alt="Bot Typing"
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
            <span>PennyBot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center mt-4 border-t pt-3 space-x-2">
        <button className="text-gray-500 hover:text-blue-500">
          <FaSmile />
        </button>
        <button className="text-gray-500 hover:text-blue-500">
          <FaPaperclip />
        </button>
        <input
          type="text"
          placeholder="Enter your message..."
          className="flex-1 bg-transparent outline-none px-3 py-2 text-sm dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatbotUI;
