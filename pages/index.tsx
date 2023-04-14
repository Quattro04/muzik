import Head from 'next/head'
import { useEffect, useState } from 'react'

import Player from '@/components/Player'
import Layout from '@/components/Layout'
import { Song, useSongs } from '@/context/SongsContext'
import BarsAnimaiton from '@/components/BarsAnimation'
import { useRouter } from 'next/router'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useInfo } from '@/context/InfoContext'

export default function Home() {

    const [isLoading, setLoading] = useState(true)
    const { songs, playedSong, isPlaying, fetchSongs, playSong } = useSongs();
    const [songLoading, setSongLoading] = useState<number>(-1);

    const router = useRouter();
    const { isMobile } = useInfo();

    useEffect(() => {
        fetchSongs(() => {
            setLoading(false)
        });
    }, [])

    const onPlaySong = (song: Song, index: number) => {
        setSongLoading(index);
        playSong(song, index, () => {
            setSongLoading(-1);
        })
    }

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
                                className={`relative basis-12 flex items-center flex-1 pr-4 cursor-pointer rounded ${songLoading === idx || playedSong?.index === idx ? 'bg-lightblue' : ''}`}
                                style={{ paddingLeft: songLoading === idx ? (isMobile ? '71px' : '87px') : '0' }}
                                onClick={() => onPlaySong(song, idx)}
                            >
                                {songLoading !== idx && (playedSong?.index !== idx || !isPlaying) &&
                                    <img className="mr-4 sm:mr-8 rounded" src={song.image} width={55} height={40} alt="Art cover" />
                                }
                                {songLoading !== idx && playedSong?.index === idx && isPlaying &&
                                    <BarsAnimaiton className="mr-4 sm:mr-8" width={55} height={40} />
                                }
                                <span className="text-white flex-1 text-xs sm:text-sm mr-4">{song.title}</span>
                                <span className="text-white flex-1 text-xs sm:text-sm opacity-80 mr-4">{song.artist}</span>
                                <span className="text-white text-xs sm:text-sm opacity-80" style={{ flexBasis: '40px' }}>{song.releaseYear}</span>
                                {songLoading === idx &&
                                    <div className="flex items-center absolute left-0 top-0 w-full h-full pl-3">
                                        <LoadingSpinner width={30} height={30} />
                                    </div>
                                }
                            </li>
                        )}
                    </ul>
                }
            </Layout>
        </>
    )
}
