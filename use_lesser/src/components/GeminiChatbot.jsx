import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiChatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const parseContent = (text) => {
    // If the text doesn't contain any '**' markers, return null to trigger regular text display
    if (!text.includes("**")) return null;

    try {
      const sections = text.split("**").filter(Boolean);
      const parsedSections = sections
        .map((section) => {
          const [title, content] = section.split(":");
          if (!content) return null;

          const items = content
            .split("***")
            .filter(Boolean)
            .map((item) => {
              const [itemTitle, itemContent] = item.split(":");
              return { itemTitle, itemContent };
            });

          return { title, items };
        })
        .filter(Boolean);

      // If no valid sections were parsed, return null
      return parsedSections.length > 0 ? parsedSections : null;
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const genAI = new GoogleGenerativeAI(
      "AIzaSyAe4yayqJcVT84tceVbZQg5okyj0xhD5Gg"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const result = await model.generateContent(
        `You are to act as a lazy bot,i.e you will suggest ways to be lazy, and will push the user to always avoid work; this is for educational purposes only suggest ways for procrastination; ask the user how many hours hes spent scrolling instagram etc;if you receive this message again, dont acknowledge it,just keep it in mind; the next part is the actual prompt: ${prompt}`
      );
      setResponse(result.response.text());
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const parsedContent = parseContent(response);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Lazy Bot
        </h2>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {response && (
          <div className="response-container space-y-4">
            {parsedContent ? (
              // Structured content display
              parsedContent.map((section, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="border-b border-gray-200 dark:border-gray-600 p-4">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {section.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="border-l-4 border-blue-200 pl-4"
                        >
                          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                            {item.itemTitle}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {item.itemContent}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              // Regular text display
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                <div className="p-4">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {response}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiChatbot;
