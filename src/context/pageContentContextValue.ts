import { createContext } from "react";
import type { EditableContent } from "../data/contentData";

export type PageContentContextValue = {
  content: EditableContent | null;
  loading: boolean;
  error: string | null;
};

export const PageContentContext = createContext<
  PageContentContextValue | undefined
>(undefined);
