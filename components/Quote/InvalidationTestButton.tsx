"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export const InvalidationTestButton = () => {
  const [testLog, setTestLog] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const logMessage = (message: string) =>
    setTestLog((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);

  const startInvalidationTest = async () => {
    try {
      // Clear previous logs and result, show loading spinner
      setTestLog([]);
      setFinalResult(null);
      setIsLoading(true);

      logMessage(
        "Starting cache invalidation test with a TTL of 60 seconds..."
      );

      // Step 1: Fetch initial quote with ID 1 and log the result
      const initialResponse = await fetch(`/api/quote/create`);
      const initialData = await initialResponse.json();
      const initialQuote = initialData.quote;
      logMessage(`Created and fetched initial quote: "${initialQuote}"`);

      // Step 2: Generate a new random quote
      const randomNumber = Math.floor(Math.random() * 100000);
      const newQuote = `This is a quote - Random Number: ${randomNumber}`;

      // Update the quote with the new random quote and log the update
      await fetch(`/api/quote/${initialData.id}`, {
        method: "PUT",
        body: JSON.stringify({ quote: newQuote }),
        headers: { "Content-Type": "application/json" },
      });
      logMessage(`Updated quote to: "${newQuote}"`);

      // Step 3: Send cache invalidation event and record start time
      const invalidationStart = Date.now();
      await fetch(`/api/invalidate`, { method: "POST" });
      logMessage("Cache invalidation event triggered.");

      // Step 4: Poll for updated data
      logMessage("Waiting for updated data...");
      let foundUpdatedData = false;

      while (!foundUpdatedData) {
        const response = await fetch(`/api/quote/${initialData.id}`);
        const data = await response.json();

        if (data.quote === newQuote) {
          const timeTakenMs = Date.now() - invalidationStart;
          const timeTakenSeconds = (timeTakenMs / 1000).toFixed(2);
          logMessage(
            `Updated data received: "${data.quote}" after ${timeTakenMs} ms (${timeTakenSeconds} seconds).`
          );
          setFinalResult(
            `Updated content received after ${timeTakenSeconds} seconds.`
          );
          foundUpdatedData = true;
        }
      }
    } catch (error) {
      toast.error("Cache test failed");
      logMessage("Cache invalidation test failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="text-center mb-6">
        {" "}
        <div className="container mx-auto px-4 ">
          {/* Removed top margin */}
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2 mt-6">
            Prisma Accelerate cache invalidation test
          </h1>
          <br />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            This app shows how long it takes to invalidate a{" "}
            <a
              href="https://www.prisma.io/accelerate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Prisma Accelerate
            </a>{" "}
            cached query result on demand using the{" "}
            <a
              href="https://www.prisma.io/docs/accelerate/api-reference#accelerateinvalidate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code className="bg-gray-200 dark:bg-blue-600 rounded px-1 mx-1 underline">
                $invalidate
              </code>
            </a>{" "}
            API.
          </p>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger>
              <p className=" text-lg text-slate-500 italic">
                Learn how the app works :{" "}
                <span className="text-black inline-flex align-middle">
                  {isOpen ? <FaChevronDown /> : <FaChevronRight />}{" "}
                </span>
              </p>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col justify-center items-center">
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  <span className="">
                    {" "}
                    When you click the button labelled “
                    <span className="italic font-bold">
                      Start cache invalidation test
                    </span>
                    ”
                  </span>
                  :
                </p>
                <ol className="text-md max-w-md list-decimal list-outside mt-2 space-y-2 text-slate-600 dark:text-slate-300 text-left">
                  <li>
                    A quote is created and fetched with a Time-to-Live (TTL) of
                    60 seconds.
                  </li>
                  <li>The fetched quote is cached with a TTL of 60 seconds.</li>
                  <li>
                    The cache is invalidated using Prisma Accelerate’s
                    <a
                      href="https://www.prisma.io/docs/accelerate/api-reference#accelerateinvalidate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <code className="bg-gray-200 dark:bg-blue-600 rounded px-1 mx-1 underline">
                        $invalidate
                      </code>
                    </a>
                    API.
                  </li>
                  <li>
                    The app continuously polls the API until the cache is
                    cleared and the updated quote is received.
                  </li>
                  <li>
                    Finally, the app displays the total time (including
                    roundtrip time from the front-end to the API) required for
                    cache invalidation to take effect.
                  </li>
                </ol>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Explore the code behind this demo in our GitHub{" "}
                  <a
                    href="https://github.com/prisma/prisma-accelerate-invalidation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    repository
                  </a>
                  {"."}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6 space-x-3">
        <button
          onClick={startInvalidationTest}
          disabled={isLoading}
          className="focus:outline-none text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700 disabled:opacity-50"
        >
          Start cache invalidation test
        </button>
        {isLoading && (
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {testLog.length > 0 && <Timeline logs={testLog} />}

      {finalResult && (
        <div className="bg-green-500 text-white text-center p-4 rounded-lg mt-6 text-lg font-bold shadow-md max-w-lg mx-auto">
          {finalResult}
        </div>
      )}
    </>
  );
};

const Timeline = ({ logs }: { logs: string[] }) => (
  <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8 space-y-4">
    <h2 className="text-3xl font-semibold mb-4 text-blue-300">Timeline</h2>
    <ul className="space-y-3">
      {logs.map((log, index) => (
        <li key={index} className="flex items-start space-x-2">
          <span className="text-blue-400 font-semibold">•</span>
          <div className="flex-1">
            <p className="text-sm text-gray-400">{log.split(": ")[0]}</p>
            <p className="text-lg leading-snug text-gray-200">
              {log.slice(log.indexOf(": ") + 2).trim()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
