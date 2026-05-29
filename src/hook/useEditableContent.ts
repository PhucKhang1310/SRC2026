import { useEffect, useState } from "react";
import {
  getEditableContent,
  type EditableContent,
} from "../data/contentData";

export const useEditableContent = () => {
  const [content, setContent] = useState<EditableContent>(() =>
    getEditableContent(),
  );

  useEffect(() => {
    const refreshContent = () => setContent(getEditableContent());

    window.addEventListener("storage", refreshContent);
    window.addEventListener("editable-content-change", refreshContent);

    return () => {
      window.removeEventListener("storage", refreshContent);
      window.removeEventListener("editable-content-change", refreshContent);
    };
  }, []);

  return content;
};
