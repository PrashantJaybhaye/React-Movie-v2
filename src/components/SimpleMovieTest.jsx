import React, { useState } from 'react';
import { getMockMovies } from '../utils/mockMovies';

const SimpleMovieTest = () => {
    const [movies, setMovies] = useState([]);

    const handleLoadMockMovies = () => {
        const mockData = getMockMovies();
        setMovies(mockData.slice(0, 5));
    };

    return (
        <section className="simple-movie-test">
            <h2 className="section-title">Mock Movies Preview</h2>
            <button className="btn" type="button" onClick={handleLoadMockMovies}>
                Load Mock Movies
            </button>
            <ul className="movie-list">
                {movies.map((movie) => (
                    <li key={movie.id} className="movie-item">
                        <span className="movie-title">{movie.title}</span>
                        <span className="movie-year">{movie.release_date?.slice(0, 4)}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default SimpleMovieTest;
