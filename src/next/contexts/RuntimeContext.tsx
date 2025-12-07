"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { RuntimeFormSchema } from "../components/ControlBar";
import axios from "axios";
import { RuntimeContext as PrismaRuntimeContext } from "@prisma/client";

type RuntimeContextType = {
  defaultData: RuntimeFormSchema;
  isLoading: boolean;
  updateDefaultData: (data: RuntimeFormSchema) => void;
};

const RuntimeContext = createContext<RuntimeContextType | null>(null);

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [defaultData, setDefaultData] = useState<RuntimeFormSchema>({
    rounds: 1,
    refreshRate: 0,
    frameRate: 30,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateDefaultData = (data: RuntimeFormSchema) => {
    setDefaultData(data);
    axios.post<any, any, RuntimeFormSchema>("/api/runtime-context", data);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get<PrismaRuntimeContext | null>("/api/runtime-context")
      .then((response) => {
        setDefaultData({
          rounds: response.data?.rounds ?? 1,
          refreshRate: response.data?.refreshRate ?? undefined,
          frameRate: response.data?.frameRate ?? undefined,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <RuntimeContext.Provider
      value={{ isLoading, defaultData, updateDefaultData }}
    >
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntimeContext() {
  const ctx = useContext(RuntimeContext);
  if (!ctx)
    throw new Error("useRuntimeContext must be used inside <RuntimegProvider>");
  return ctx;
}
