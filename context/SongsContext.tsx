import React, { useContext, useState, useEffect, createContext, ReactNode } from "react";

interface SongsCtx {
    songs: Song[];
    fetchSongs: (callback?: () => void) => Promise<void>;
    playedSong: PlayedSong | undefined;
    playSong: (_: Song, idx: number) => void;
    isPlaying: boolean;
    setIsPlaying: (_: boolean) => void;
    queueNextSong: () => void;
    stop: () => void;
};

const SongsContext = createContext<SongsCtx>(
    {
        songs: [],
        fetchSongs: () => Promise.resolve(),
        playedSong: undefined,
        playSong: () => {},
        isPlaying: false,
        setIsPlaying: () => {},
        queueNextSong: () => {},
        stop: () => {}
    }
);

export interface Song {
    file: string;
    title: string;
    artist: string;
    duration: number;
    timestamp: string;
    releaseYear: string;
    image: string;
    createdAt: string;
}

export interface PlayedSong extends Song {
    audioSrc: string | undefined;
    index: number;
}

export function SongsContextProvider({ children }: { children: ReactNode }) {

    const [songs, setSongs] = useState<Song[]>([]);
    const [playedSong, setPlayedSong] = useState<PlayedSong | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const fetchData = async (callback?: () => void) => {
        const res = await fetch('http://localhost:3000/songs', {
        headers: {
            'Authentication': process.env.NEXT_PUBLIC_AUTH_TOKEN as string
            }
        });
        const songsRes = await res.json();
        setSongs(songsRes.data);
        callback?.();
    }

    const fetchSong = (song: Song, idx: number) => {
        fetch(`http://localhost:3000/song/${song.file}`, {
            headers: {
                'Authentication': process.env.NEXT_PUBLIC_AUTH_TOKEN as string
            }
        })
        .then((response) => {
            const reader = response.body?.getReader();
            return new ReadableStream({
            start(controller) {
                const pump = (): any => {
                    return reader?.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        return pump();
                    });
                }
                return pump();
            },
            });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((url) => {
            setPlayedSong({
                ...song,
                audioSrc: url,
                index: idx
            })
        })
        .catch((err) => console.error(err));
    }

    const queueNextSong = () => {

    }

    const stop = () => {
        setPlayedSong(undefined);
        setIsPlaying(false);
    }

    // useEffect(() => {
    //     fetchData();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <SongsContext.Provider
            value={{
                songs,
                fetchSongs: fetchData,
                playedSong,
                playSong: fetchSong,
                isPlaying,
                setIsPlaying,
                queueNextSong,
                stop
            }}
        >
            {children}
        </SongsContext.Provider>
    );
}

export function useSongs() {
    const context = useContext(SongsContext);
    if (context === undefined) {
        throw new Error("Context must be used within a Provider");
    }
    return context;
}