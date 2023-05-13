import React, { useContext, useState, createContext, ReactNode } from "react";

interface SongsCtx {
    songs: Song[];
    fetchSongs: (callback?: () => void) => Promise<void>;
    playedSong: Song | undefined;
    loadingSong: number | undefined;
    setLoadingSong: (_: number | undefined) => void;
    playSong: (_: Song) => void;
    isPlaying: boolean;
    setIsPlaying: (_: boolean) => void;
    nextSong: () => void;
    stop: () => void;
    setSongQueue: (_: Song[]) => void;
    sort: ({ parameter, desc }: { parameter: string, desc: boolean }) => void;
};

const SongsContext = createContext<SongsCtx>(
    {
        songs: [],
        fetchSongs: () => Promise.resolve(),
        playedSong: undefined,
        loadingSong: undefined,
        setLoadingSong: () => {},
        playSong: () => {},
        isPlaying: false,
        setIsPlaying: () => {},
        nextSong: () => {},
        stop: () => {},
        setSongQueue: () => {},
        sort: () => {},
    }
);

export interface Song {
    id: number;
    ytId: string;
    file: string;
    title: string;
    artist: string;
    duration: number;
    timestamp: string;
    releaseYear: string;
    image: string;
    users: string;
    createdAt: string;
}

export function SongsContextProvider({ children }: { children: ReactNode }) {

    const [songs, setSongs] = useState<Song[]>([]);
    const [playedSong, setPlayedSong] = useState<Song | undefined>(undefined);
    const [loadingSong, setLoadingSong] = useState<number | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [songQueue, setSongQueue] = useState<Song[]>([]);

    const fetchData = async (callback?: () => void) => {
        const res = await fetch('/api/audio');
        const songs = await res.json();

        if (songs.error) {
            alert(songs.error.message);
        } else {
            setSongs(songs);
        }
        callback?.();
    }

    const playSong = (song: Song) => {
        setPlayedSong(song);
        setLoadingSong(song.id);
    }

    const nextSong = () => {
        const songToPlay = songQueue.shift();
        if (songToPlay) {
            playSong(songToPlay);
        }
    }

    const stop = () => {
        setPlayedSong(undefined);
        setIsPlaying(false);
    }

    const sort = ({ parameter, desc }: { parameter: string, desc: boolean }) => {
        switch (parameter) {
            case 'Added':
                const temp: Song[] = JSON.parse(JSON.stringify(songs));
                const newSongs = temp.sort((a, b) => {
                    const aDate = new Date(a.createdAt);
                    const bDate = new Date(b.createdAt);
                    return desc ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
                })
                setSongs(newSongs);
                break;
        }
    }

    return (
        <SongsContext.Provider
            value={{
                songs,
                fetchSongs: fetchData,
                playedSong,
                loadingSong,
                setLoadingSong,
                playSong,
                isPlaying,
                setIsPlaying,
                nextSong,
                stop,
                setSongQueue,
                sort
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