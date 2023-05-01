import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'

import Player from '@/components/Player'
import Layout from '@/components/Layout'
import { Song, useSongs } from '@/context/SongsContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useInfo } from '@/context/InfoContext'
import { useUser } from '@/context/UserContext'

export default function Home() {

    const [isLoading, setIsLoading] = useState(true)
    const [username, setUsername] = useState<string>('');

    const { songs, playedSong, isPlaying, fetchSongs, playSong, loadingSong, setLoadingSong } = useSongs();
    const { isMobile } = useInfo();
    const { user, setUser } = useUser();
    

    useEffect(() => {
        fetchSongs(() => {
            setIsLoading(false)
        });
    }, [])

    const onPlaySong = (song: Song) => {
        setLoadingSong(song.id)
        playSong(song);
    }

    const usernameSubmit = (e: FormEvent) => {
        setUser(username);
        localStorage.setItem('user', username);
        e.preventDefault();
    }

    const parseDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`
    }

    return (
        <>
            <Head>
                <title>{`${playedSong?.title ? playedSong?.title : 'Muzik'} - ${playedSong?.artist ? playedSong?.artist : 'Home'}`}</title>
                <meta name="description" content="Personal muzik storage and player" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                {user &&
                    <ul className="flex w-full flex-col mb-auto mx-auto max-w-screen-xl">
                        <li className="flex flex-1 items-center py-2 sm:py-3 px-3 sm:px-6 border-b-2 border-slate-800 z-10 bg-darkblue">
                            <div className="w-10 sm:w-12 mr-4" />
                            <span className="flex grow-[2] shrink-[2] basis-0 text-white text-xs sm:text-sm opacity-80 pointer-events-none text-slate-400">
                                Title
                            </span>
                            <span className="flex-1 text-right text-white text-xs sm:text-sm opacity-80 pointer-events-none text-slate-400">
                                Released
                            </span>
                            <span className="flex-1 text-right text-white text-xs sm:text-sm opacity-80 pointer-events-none text-slate-400">
                                Added
                            </span>
                        </li>
                        {songs.filter(s => s.users.includes(user)).map((song, idx) =>
                            <li
                                key={idx}
                                className={`relative basis-12 flex items-center flex-1 py-2 sm:py-3 px-3 sm:px-6 cursor-pointer rounded ${loadingSong === song.id || playedSong?.id === song.id ? 'bg-lightblue' : ''}`}
                                onClick={() => onPlaySong(song)}
                            >
                                {loadingSong !== song.id &&
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 relative mr-4">
                                        <img
                                            className="h-full rounded"
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/images/${song.id}.jpg`}
                                            alt="Art cover"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                }
                                {loadingSong === song.id &&
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-4">
                                        <LoadingSpinner width={30} height={30} />
                                    </div>
                                }
                                <div className="flex grow-[2] shrink-[2] basis-0 flex-col overflow-hidden">
                                    <span className="text-white text-xs sm:text-sm mb-1 pointer-events-none truncate">
                                        {song.title}
                                    </span>
                                    <span className="text-white text-xs sm:text-sm opacity-50 pointer-events-none truncate">
                                        {song.artist}
                                    </span>
                                </div>
                                <span className="flex-1 text-right text-white text-xs sm:text-sm opacity-80 pointer-events-none">
                                    {song.releaseYear}
                                </span>
                                <span className="flex-1 text-right text-white text-xs sm:text-sm opacity-80 pointer-events-none">
                                    {parseDate(song.createdAt)}
                                </span>
                            </li>
                        )}
                    </ul>
                }
                {!user &&
                    <form className="flex flex-1 items-center justify-center" onSubmit={(e) => usernameSubmit(e)}>
                        <input
                            type="text"
                            className="text-md border rounded-lg block pl-3 p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </form>
                }
                <div className="fixed bottom-0 w-full flex bg-darkblue">
                    <Player />
                </div>
            </Layout>
        </>
    )
}
