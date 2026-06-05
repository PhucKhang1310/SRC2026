import { useContext } from "react";
import { PageContentContext } from "../context/pageContentContextValue";

export const usePageContent = () => {
    const context = useContext(PageContentContext);
    if (!context) {
        throw new Error("usePageContent must be used inside PageContentProvider");
    }

    return context;
};
