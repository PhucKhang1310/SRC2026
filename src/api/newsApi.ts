const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getNews = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
};
