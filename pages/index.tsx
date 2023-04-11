import Head from 'next/head'
import { useEffect, useState } from 'react'

import Player from '@/components/Player'
import Layout from '@/components/Layout'
import { useSongs } from '@/context/SongsContext'
import BarsAnimaiton from '@/components/BarsAnimation'
import { useRouter } from 'next/router'

export default function Home() {

    const [isLoading, setLoading] = useState(true)
    const { songs, playedSong, isPlaying, fetchSongs, playSong } = useSongs();

    const router = useRouter();

    useEffect(() => {
        fetchSongs(() => {
            setLoading(false)
        });
    }, [])

    return (
        <>
            <Head>
                <title>Muzik</title>
                <meta name="description" content="Personal muzik storage and player" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                {!isLoading &&
                    <ul className="flex w-full flex-col mb-auto divide-y divide-lightblue mx-auto max-w-screen-xl">
                        {songs.map((song, idx) =>
                            <li
                                key={idx}
                                className={`basis-12 flex items-center flex-1 pr-4 cursor-pointer rounded ${playedSong?.index === idx ? 'bg-lightblue' : ''}`}
                                onClick={() => playSong(song, idx)}
                            >
                                {(playedSong?.index !== idx || !isPlaying) &&
                                    <img className="mr-8 rounded" src={song.image} width={55} height={40} alt="Art cover" />
                                }
                                {playedSong?.index === idx && isPlaying &&
                                    <BarsAnimaiton className="mr-8" width={55} height={40} />
                                }
                                <span className="text-white flex-1 text-sm">{song.title}</span>
                                <span className="text-white flex-1 text-sm opacity-80">{song.artist}</span>
                                <span className="text-white text-sm opacity-80" style={{ flexBasis: '40px' }}>{song.releaseYear}</span>
                            </li>
                        )}
                    </ul>
                }
            </Layout>
        </>
    )
}
