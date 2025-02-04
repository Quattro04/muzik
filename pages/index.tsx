import Head from 'next/head'
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react'

import Player from '@/components/Player'
import Layout from '@/components/Layout'
import { Song, useSongs } from '@/context/SongsContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useInfo } from '@/context/InfoContext'
import { useUser } from '@/context/UserContext'
import BarsAnimaiton from '@/components/BarsAnimation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

interface Sorted {
    parameter: string;
    desc: boolean;
}

export default function Home() {

    const [isLoading, setIsLoading] = useState(true)
    const [username, setUsername] = useState<string>('');
    const [sorted, setSorted] = useState<Sorted>({ parameter: 'Added', desc: true });

    const { songs, playedSong, isPlaying, fetchSongs, playSong, loadingSong, setLoadingSong, setSongQueue, sort} = useSongs();
    const { isMobile } = useInfo();
    const { user, setUser } = useUser();
    

    useEffect(() => {
        fetchSongs(() => {
            setIsLoading(false)
        });
    }, [])

    useEffect(() => {
        sort(sorted);
    }, [sorted])

    const shuffle = (array: Song[]) => {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }

    const onPlaySong = (song: Song) => {
        setLoadingSong(song.id)
        playSong(song);

        if (user) {
            const queuedSongs = songs.filter(s => s.users.includes(user)).filter(s => s.id !== song.id);
            shuffle(queuedSongs);
            setSongQueue(queuedSongs);
        }
    }

    const usernameSubmit = (e: FormEvent) => {
        setUser(username);
        localStorage.setItem('user', username);
        e.preventDefault();
    }

    const parseDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getDate()} ${monthNames[date.getMonth()].slice(0,3)} ${date.getFullYear()}`
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
                        <li className="flex flex-1 items-center sticky top-0 py-2 sm:py-3 px-3 sm:px-6 border-b-2 border-slate-800 z-10 bg-darkblue">
                            <div className="w-10 sm:w-12 mr-4" />
                            <span className="flex grow-[2] shrink-[2] basis-0 text-white text-xs sm:text-sm opacity-80 pointer-events-none text-slate-400">
                                Title
                            </span>
                            <span className="flex-1 text-center text-white text-xs sm:text-sm opacity-80 pointer-events-none text-slate-400">
                                Released
                            </span>
                            <div
                                className="flex-1 text-right flex items-center justify-end"
                            >
                                <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() => setSorted({ parameter: 'Added', desc: !sorted.desc })}
                                >
                                    <FontAwesomeIcon
                                        icon={sorted.desc ? faArrowDown : faArrowUp}
                                        style={{ fontSize: 12, color: "#3d92c3", padding: '10px 15px', cursor: 'pointer' }}
                                    />
                                    <span
                                        className="text-white text-xs sm:text-sm opacity-80 text-slate-400"
                                    >
                                        Added
                                    </span>
                                </div>
                            </div>
                        </li>
                        {songs.filter(s => s.users.includes(user)).map((song, idx) =>
                            <li
                                key={idx}
                                className={`relative basis-12 flex items-center flex-1 py-2 sm:py-3 px-3 sm:px-6 cursor-pointer rounded`}
                                onClick={() => onPlaySong(song)}
                            >
                                {loadingSong !== song.id && (playedSong?.id !== song.id || !isPlaying) &&
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 relative mr-4">
                                        <Image
                                            width={48}
                                            height={48}
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
                                {loadingSong !== song.id && playedSong?.id === song.id && isPlaying &&
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-4">
                                        <BarsAnimaiton />
                                    </div>
                                }
                                <div className="flex grow-[2] shrink-[2] basis-0 flex-col overflow-hidden">
                                    <span className={`text-xs sm:text-sm mb-1 pointer-events-none truncate ${playedSong?.id === song.id && loadingSong !== song.id ? 'text-green' : 'text-white'}`}>
                                        {song.title}
                                    </span>
                                    <span className="text-white text-xs sm:text-sm opacity-60 pointer-events-none truncate">
                                        {song.artist}
                                    </span>
                                </div>
                                <span className="flex-1 text-center text-white text-xs sm:text-sm opacity-80 pointer-events-none">
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
