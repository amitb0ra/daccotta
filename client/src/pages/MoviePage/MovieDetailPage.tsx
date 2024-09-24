const KEY = import.meta.env.VITE_TMDB_API

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Play } from "lucide-react"
import LazyImage from "@/components/custom/LazyLoadImage/LazyImage"
import { useMovieProviders } from "@/services/movieService"

const image_url = "https://image.tmdb.org/t/p"

interface Genre {
    id: number
    name: string
}

interface CrewMember {
    id: number
    name: string
    job: string
}

interface CastMember {
    id: number
    name: string
    character: string
    profile_path: string
}

interface MovieDetails {
    title: string
    overview: string
    backdrop_path: string
    poster_path: string
    release_date: string
    vote_average: number
    genres: Genre[]
    runtime: number
    status: string
    credits?: {
        crew: CrewMember[]
        cast: CastMember[]
    }
    tagline: string
}

const MovieDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const { data: providers, isLoading: isProvidersLoading } =
        useMovieProviders(id!)

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=` +
                        `${KEY}` +
                        `&append_to_response=credits`
                )
                const data: MovieDetails = await response.json()
                setMovie(data)
                console.log("Movie data:", data)
            } catch (error) {
                console.error("Error fetching movie details:", error)
            }
            setIsLoading(false)
        }

        fetchMovieDetails()
    }, [id])

    if (isLoading || isProvidersLoading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
            </div>
        )
    }

    if (!movie) {
        return (
            <div className="flex justify-center items-center h-screen">
                Movie not found
            </div>
        )
    }

    const director =
        movie.credits?.crew.find((person) => person.job === "Director")?.name ||
        "Unknown"
    const firstRentProvider = providers?.rent?.[0]
    const firstBuyProvider = providers?.buy?.[0]
    
    return (
        <div className=" max-h-screen text-white overflow-auto  ">
            <main className=" mx-auto px-4">
                <div className="md:flex md:space-x-6 mt-8">
                    <div className="md:w-1/3 mb-6 md:mb-0 flex lg:justify-start justify-center">
                        <LazyImage
                            src={`${image_url}/w500${movie.poster_path}`}
                            alt={`${movie.title} poster`}
                            className="rounded-lg shadow-lg lg:w-full lg:h-auto w-[15rem]  "
                        />
                    </div>
                    <div className="md:w-2/3 justify-center flex flex-col">
                        <h2 className="text-4xl font-bold mb-2">
                            {movie.title} (
                            {new Date(movie.release_date).getFullYear()})
                        </h2>
                        <p className="text-gray-400 mb-4">{movie.tagline}</p>
                        <div className="flex space-x-2 mb-4">
                            {movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="bg-gray-800 text-xs px-2 py-1 rounded"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <div className="flex  items-center space-x-4 mb-6">
                            <div className="flex items-center">
                                <Star className="text-yellow-400 w-6 h-6 mr-1" />
                                <span className="text-2xl font-bold">
                                    {movie.vote_average.toFixed(1)}
                                </span>
                            </div>
                            {/* <button className="flex items-center bg-white text-black px-4 py-2 rounded">
                                <Play className="w-4 h-4 mr-2" />
                                Watch Trailer
                            </button> */}
                            {firstRentProvider && (
                                <button
                                    className="flex items-center bg-white text-black px-4 py-2 rounded"
                                    onClick={() =>
                                        window.open(providers.link, "_blank")
                                    }
                                >
                                    <img
                                        src={`${image_url}/w45${firstRentProvider.logo_path}`}
                                        alt={firstRentProvider.provider_name}
                                        className="w-6 mr-2"
                                    />
                                    Rent at {firstRentProvider.provider_name}
                                </button>
                            )}

                            {/* Buy Button */}
                            {firstBuyProvider && (
                                <button
                                    className="flex items-center bg-white text-black px-4 py-2 rounded"
                                    onClick={() =>
                                        window.open(providers.link, "_blank")
                                    }
                                >
                                    <img
                                        src={`${image_url}/w45${firstBuyProvider.logo_path}`}
                                        alt={firstBuyProvider.provider_name}
                                        className="w-6 h-6 mr-2"
                                    />
                                    Buy at {firstBuyProvider.provider_name}
                                </button>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Overview</h3>
                        <p className="mb-4 w-[85%]">{movie.overview}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p>{movie.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Release Date:</p>
                                <p>
                                    {new Date(
                                        movie.release_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Runtime:</p>
                                <p>
                                    {Math.floor(movie.runtime / 60)}h{" "}
                                    {movie.runtime % 60}m
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Director:</p>
                                <p>{director}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="mt-12">
                    <h3 className="text-2xl font-bold mb-4">Top Cast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {movie.credits?.cast.slice(0, 6).map((castMember) => (
                            <div key={castMember.id} className="text-center">
                                <LazyImage
                                    src={`${image_url}/w200${castMember.profile_path}`}
                                    alt={castMember.name}
                                    className="rounded-full mx-auto mb-2 w-24 h-24 object-cover"
                                />
                                <p className="font-semibold">
                                    {castMember.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {castMember.character}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* You can add the Official Videos section here if you have that data */}

                {/* You can add the Similar Movies section here if you have that data */}
            </main>
        </div>
    )
}

export default MovieDetailPage