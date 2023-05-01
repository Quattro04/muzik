import Layout from "@/components/Layout";
import { useSongs } from "@/context/SongsContext";
import { useUser } from "@/context/UserContext";
import Head from "next/head";

export default function Add() {

    const { songs, fetchSongs } = useSongs();
    const { user } = useUser();

    const addUserToSong = async (songId: number) => {
        const res = await fetch('/api/audio/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: songId, user })
        })

        fetchSongs();
    }

    return (
        <>
            <Head>
                <title>Muzik | Add</title>
                <meta name="description" content="Personal muzik storage and player" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                {user &&
                    <ul className="flex w-full flex-col mb-auto mx-auto max-w-screen-xl">
                        {songs.map((song, idx) =>
                            <li
                                key={idx}
                                className="relative basis-12 flex items-center flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 relative mr-4">
                                    <img
                                        className="h-full rounded"
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/images/${song.id}.jpg`}
                                        alt="Art cover"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="flex flex-1 flex-col overflow-hidden">
                                    <span className="text-white text-xs sm:text-sm mb-1 pointer-events-none truncate">
                                        {song.title}
                                    </span>
                                    <span className="text-white text-xs sm:text-sm opacity-50 pointer-events-none truncate">
                                        {song.artist}
                                    </span>
                                </div>
                                {song.users.includes(user) &&
                                    <button
                                        className="text-white font-medium rounded-lg text-sm px-4 ml-auto lg:px-5 py-2 lg:py-2.5 mr-2 pointer-events-none focus:outline-none"
                                        disabled
                                    >
                                        Added
                                    </button>
                                }
                                {!song.users.includes(user) &&
                                    <button
                                        className="text-white font-medium rounded-lg text-sm px-4 ml-auto lg:px-5 py-2 lg:py-2.5 mr-2 bg-gray-700 hover:bg-gray-500 focus:outline-none"
                                        onClick={() => addUserToSong(song.id)}
                                    >
                                        Add
                                    </button>
                                }
                            </li>
                        )}
                    </ul>
                }
            </Layout>
        </>
)
}