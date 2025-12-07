"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
  message: string | null;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function showLoading(msg?: string) {
    setMessage(msg ?? null);
    setIsLoading(true);
  }

  function hideLoading() {
    setIsLoading(false);
    setMessage(null);
  }

  return (
    <LoadingContext.Provider
      value={{ isLoading, message, showLoading, hideLoading }}
    >
      {children}

      {/* Overlay + modal de loading */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              fontSize: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <div className="loader" />
            <span>{message ?? "Carregando..."}</span>
          </div>

          {/* CSS do spinner */}
          <style>{`
            .loader {
              border: 4px solid #ddd;
              border-top: 4px solid #555;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used inside <LoadingProvider>");
  return ctx;
}
