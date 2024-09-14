// import React from "react"
// import MovieCard from "./MovieCard"
// import { sampleMovies } from "./MovieCardData"

// type Props = {
//     heading: string
// }

// const MovieCarouselCards: React.FC<Props> = ({ heading }) => {
//     return (
//         <div className="w-full flex flex-col justify-start my-6 gap-1 items-start px-4">
//             <h2 className="text-xl font-semibold mb-2">{heading}</h2>
//             <div className="w-full overflow-x-auto">
//                 <div className="flex flex-nowrap gap-4 pb-4">
//                     {sampleMovies.map((movie) => (
//                         <div key={movie.id} className="flex-shrink-0">
//                             <MovieCard
//                                 poster_path={movie.poster_path}
//                                 movie_id={movie.id}
//                                 title={movie.title}
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MovieCarouselCards
import React from "react"

import MovieCard from "./MovieCard"
import { MovieListType, useMovieList } from "@/services/movieService"

interface MovieListProps {
    type: MovieListType
    heading: string
}

const MovieList: React.FC<MovieListProps> = ({ type, heading }) => {
    const { data: movies, isLoading, error } = useMovieList(type, 1)

    if (isLoading) return <div className="text-center py-8">Loading...</div>
    if (error)
        return (
            <div className="text-center py-8 text-red-500">
                Error fetching movies
            </div>
        )

    return (
        <div className="w-full flex flex-col justify-start my-6 gap-1 items-start px-4">
            <h2 className="text-xl font-semibold mb-2">{heading}</h2>
            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex flex-nowrap gap-4  pb-4">
                    {movies?.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0">
                            <MovieCard
                                poster_path={movie.poster_path}
                                movie_id={movie.id}
                                title={movie.title}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MovieList