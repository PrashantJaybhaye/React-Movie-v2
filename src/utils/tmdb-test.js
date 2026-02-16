/**
 * Tests the connection to TMDB API
 * @returns {Promise<void>}
 */
export const testTMDBConnection = async () => {
    try {
        const apiToken = import.meta.env.VITE_TMDB_API_KEY;
        if (!apiToken) {
            console.warn('TMDB API token is not set. Please set VITE_TMDB_API_KEY in your environment variables.');
            return;
        }

        const response = await fetch('https://api.themoviedb.org/3/configuration', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`TMDB API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('TMDB API connection successful!', {
            status: response.status,
            imagesBaseUrl: data.images?.secure_base_url,
        });
        return true;
    } catch (error) {
        console.error('TMDB API connection test failed:', error);
        return false;
    }
};
