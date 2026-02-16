// Example: Using Appwrite MCP Server with your React Movie App
// This shows how you could integrate MCP tools into your application

import { spawn } from 'child_process';

class AppwriteMCPClient {
  constructor() {
    this.server = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = spawn('node', ['../mcp-server/appwrite-server.js'], {
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.server.stdout.on('data', (data) => {
        try {
          const response = JSON.parse(data.toString());
          const request = this.pendingRequests.get(response.id);
          if (request) {
            this.pendingRequests.delete(response.id);
            if (response.error) {
              request.reject(new Error(response.error.message));
            } else {
              request.resolve(response.result);
            }
          }
        } catch (e) {
          console.error('Failed to parse MCP response:', e);
        }
      });

      this.server.stderr.on('data', (data) => {
        const message = data.toString();
        if (message.includes('Appwrite MCP server running')) {
          resolve();
        }
      });

      this.server.on('error', reject);
    });
  }

  async callTool(name, args = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.pendingRequests.set(id, { resolve, reject });

      const message = {
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name, arguments: args }
      };

      this.server.stdin.write(JSON.stringify(message) + '\n');
    });
  }

  async stop() {
    if (this.server) {
      this.server.kill();
      this.server = null;
    }
  }
}

// Example usage in your React app context
export class MovieDataService {
  constructor() {
    this.mcpClient = new AppwriteMCPClient();
  }

  async initialize() {
    await this.mcpClient.start();
  }

  // Get all movies from your Appwrite database
  async getAllMovies(limit = 25, offset = 0) {
    try {
      const result = await this.mcpClient.callTool('list_documents', {
        databaseId: process.env.VITE_APPWRITE_DATABASE_ID,
        collectionId: process.env.VITE_APPWRITE_COLLECTION_ID,
        limit,
        offset
      });
      
      return result.content[0] ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Failed to get movies:', error);
      throw error;
    }
  }

  // Add a movie to your watchlist/favorites
  async addToWatchlist(userId, movieData) {
    try {
      const result = await this.mcpClient.callTool('create_document', {
        databaseId: process.env.VITE_APPWRITE_DATABASE_ID,
        collectionId: 'watchlist', // Assuming you have a watchlist collection
        data: {
          userId,
          movieId: movieData.id,
          title: movieData.title,
          poster_path: movieData.poster_path,
          addedAt: new Date().toISOString()
        }
      });
      
      return result.content[0] ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      throw error;
    }
  }

  // Search movies in your database
  async searchMovies(query) {
    try {
      const result = await this.mcpClient.callTool('search_documents', {
        databaseId: process.env.VITE_APPWRITE_DATABASE_ID,
        collectionId: process.env.VITE_APPWRITE_COLLECTION_ID,
        queries: [`contains('title', '${query}')`]
      });
      
      return result.content[0] ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Failed to search movies:', error);
      throw error;
    }
  }

  // Get user's movie statistics
  async getUserStats(userId) {
    try {
      const result = await this.mcpClient.callTool('search_documents', {
        databaseId: process.env.VITE_APPWRITE_DATABASE_ID,
        collectionId: 'user_activities', // Assuming you track user activities
        queries: [`equal('userId', '${userId}')`]
      });
      
      return result.content[0] ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }

  async cleanup() {
    await this.mcpClient.stop();
  }
}

// Example React Hook for using the MCP service
export const useMovieData = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initService = async () => {
      try {
        const movieService = new MovieDataService();
        await movieService.initialize();
        setService(movieService);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initService();

    return () => {
      if (service) {
        service.cleanup();
      }
    };
  }, []);

  return { service, loading, error };
};

// Example component using the MCP service
export const MovieListWithMCP = () => {
  const { service, loading, error } = useMovieData();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (service) {
      const loadMovies = async () => {
        try {
          const result = await service.getAllMovies();
          setMovies(result.documents || []);
        } catch (err) {
          console.error('Failed to load movies:', err);
        }
      };

      loadMovies();
    }
  }, [service]);

  if (loading) return <div>Loading MCP service...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Movies from Appwrite (via MCP)</h2>
      {movies.map(movie => (
        <div key={movie.$id}>
          <h3>{movie.title}</h3>
          <p>{movie.overview}</p>
        </div>
      ))}
    </div>
  );
};
