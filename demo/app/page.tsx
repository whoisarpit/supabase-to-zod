"use client";

import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash-es";
import { example } from "./example";

export default function Home() {
  const [input, setInput] = useState(example);
  const [copied, setCopied] = useState(false);

  const {
    data: output,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["generateZodSchemas", input],
    queryFn: async () => {
      if (!input) return "";
      const response = await fetch("/api/generate", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ types: input }),
      });
      const data = (await response.json()) as { result: string };
      if (!response.ok) {
        throw new Error("Failed to generate Zod schemas. Check your input and try again.");
      }
      return data.result;
    },
  });

  const debouncedSetInput = useCallback(
    debounce((value: string) => setInput(value), 500),
    []
  );

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      setInput("");
      return;
    }
    debouncedSetInput(value);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Supabase to Zod Type Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Paste your Supabase generated types below to convert them to Zod schemas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[75vh]">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="h-10 pl-4 bg-muted border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Input: Supabase Types</h2>
            </div>
            <Editor
              height="calc(100% - 40px)"
              defaultLanguage="typescript"
              theme="vs-dark"
              onChange={handleEditorChange}
              value={input}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                placeholder: "Paste your Supabase types here...",
              }}
            />
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="h-10 pl-4 pr-1 bg-muted border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Output: Zod Schemas</h2>
              {output && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="ml-2"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="relative h-[calc(100%-40px)]">
              {isFetching && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                </div>
              )}
              <Editor
                height="100%"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={error ? error.message : output}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
