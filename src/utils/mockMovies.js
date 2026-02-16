// Mock movie data for testing when TMDB API is not accessible
export const mockMovies = [
    {
        id: 1,
        title: "The Shawshank Redemption",
        overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
        release_date: "1994-09-23",
        vote_average: 8.7,
        vote_count: 26000,
        original_language: "en",
        genre_ids: [18, 80]
    },
    {
        id: 2,
        title: "The Godfather",
        overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
        release_date: "1972-03-14",
        vote_average: 8.7,
        vote_count: 19000,
        original_language: "en",
        genre_ids: [18, 80]
    },
    {
        id: 3,
        title: "The Dark Knight",
        overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        backdrop_path: "/hqkIcbrOHL86UncnHIsHVcVmzue.jpg",
        release_date: "2008-07-18",
        vote_average: 8.5,
        vote_count: 32000,
        original_language: "en",
        genre_ids: [18, 28, 80, 53]
    },
    {
        id: 4,
        title: "Pulp Fiction",
        overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        backdrop_path: "/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
        release_date: "1994-09-10",
        vote_average: 8.5,
        vote_count: 27000,
        original_language: "en",
        genre_ids: [80, 18]
    },
    {
        id: 5,
        title: "Forrest Gump",
        overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.",
        poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
        backdrop_path: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg",
        release_date: "1994-06-23",
        vote_average: 8.4,
        vote_count: 26000,
        original_language: "en",
        genre_ids: [35, 18, 10749]
    },
    {
        id: 6,
        title: "Inception",
        overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        release_date: "2010-07-15",
        vote_average: 8.4,
        vote_count: 35000,
        original_language: "en",
        genre_ids: [28, 878, 53]
    }
];

export const getMockMovies = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                results: mockMovies,
                total_results: mockMovies.length,
                total_pages: 1,
                page: 1
            });
        }, 500); // Simulate network delay
    });
};
