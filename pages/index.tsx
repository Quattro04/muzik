import Head from 'next/head'
import { FormEvent, useEffect, useState } from 'react'

import Player from '@/components/Player'
import Layout from '@/components/Layout'
import { Song, useSongs } from '@/context/SongsContext'
import BarsAnimaiton from '@/components/BarsAnimation'
import { useRouter } from 'next/router'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useInfo } from '@/context/InfoContext'
import { useUser } from '@/context/UserContext'

export default function Home() {

    const [isLoading, setLoading] = useState(true)
    const [songLoading, setSongLoading] = useState<number>(-1);
    const [username, setUsername] = useState<string>('');
    
    const router = useRouter();
    const { songs, playedSong, isPlaying, fetchSongs, playSong } = useSongs();
    const { isMobile } = useInfo();
    const { user, setUser } = useUser();
    

    useEffect(() => {
        fetchSongs(() => {
            setLoading(false)
        });
    }, [])

    const onPlaySong = (song: Song) => {
        playSong(song);
    }

    const getIndex = (song: Song | undefined) => {
        if (!song || !user) return -1;
        return songs.filter(s => s.users.includes(user)).findIndex(s => s === song);
    }

    const usernameSubmit = (e: FormEvent) => {
        setUser(username);
        localStorage.setItem('user', username);
        e.preventDefault();
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
                    <ul className="flex w-full flex-col mb-auto divide-y divide-lightblue mx-auto max-w-screen-xl">
                        {songs.filter(s => s.users.includes(user)).map((song, idx) =>
                            <li
                                key={idx}
                                className={`relative basis-12 flex items-center flex-1 pr-4 cursor-pointer rounded ${playedSong?.id === song.id ? 'bg-lightblue' : ''}`}
                                style={{ paddingLeft: songLoading === idx ? (isMobile ? '71px' : '87px') : '0' }}
                                onClick={() => onPlaySong(song)}
                            >
                                {songLoading !== idx && (getIndex(playedSong) !== idx || !isPlaying) &&
                                    <img className="mr-4 sm:mr-8 rounded" src={song.image} width={55} height={40} alt="Art cover" />
                                }
                                <span className="text-white flex-1 text-xs sm:text-sm mr-4 pointer-events-none">{song.title}</span>
                                <span className="text-white flex-1 text-xs sm:text-sm opacity-80 mr-4 pointer-events-none">{song.artist}</span>
                                <span className="text-white text-xs sm:text-sm opacity-80 pointer-events-none" style={{ flexBasis: '40px' }}>{song.releaseYear}</span>
                                {songLoading === idx &&
                                    <div className="flex items-center absolute left-0 top-0 w-full h-full pl-3">
                                        <LoadingSpinner width={30} height={30} />
                                    </div>
                                }
                            </li>
                        )}
                    </ul>
                }
                {!user &&
                    <form className="flex flex-1 items-center justify-center" onSubmit={(e) => usernameSubmit(e)}>
                        <input
                            type="text"
                            className="text-xs sm:text-sm border rounded-lg block pl-3 p-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
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
