import React from 'react';
import WatchlistButton from './WatchlistButton';

const MovieCard = ({ 
    movie,
    onClick 
}) => {
    const { id, title, vote_average, poster_path, release_date, original_language, overview } = movie;

    return (
        <div className="group relative bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={onClick}>
            <div className="aspect-[2/3] relative overflow-hidden">
                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Watchlist Button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <WatchlistButton movie={movie} size="small" />
                </div>

                {/* Rating Badge */}
                {vote_average > 0 && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{vote_average.toFixed(1)}</span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* View Details Button */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium hover:bg-white/30 transition-colors duration-200">
                        View Details
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 flex-1 group-hover:text-blue-300 transition-colors duration-200">
                        {title}
                    </h3>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-400 mb-2">
                    <span>{release_date ? release_date.split('-')[0] : 'N/A'}</span>
                    <span>•</span>
                    <span>{original_language?.toUpperCase()}</span>
                </div>

                {overview && (
                    <p className="text-gray-300 text-xs line-clamp-3">
                        {overview.length > 120 ? `${overview.substring(0, 120)}...` : overview}
                    </p>
                )}
            </div>
        </div>
    );
};
export default MovieCard
