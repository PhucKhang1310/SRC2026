import { useEffect, useState } from "react";
import { getPageContent } from "../api/pageContentApi";
import type { EditableContent } from "../data/contentData";
import { PageContentContext } from "./pageContentContextValue";
import LoadingPage from "../components/loading/LoadingPage";

export const PageContentProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [content, setContent] = useState<EditableContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getPageContent(controller.signal)
            .then(setContent)
            .catch((error: Error) => {
                if (error.name !== "AbortError") setError(error.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    if (loading) {
        return <LoadingPage label="Loading page content" />;
    }

    return (
        <PageContentContext value={{ content, loading, error }}>
            {children}
        </PageContentContext>
    );
};
