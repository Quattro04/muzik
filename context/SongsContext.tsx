import React, { useContext, useState, createContext, ReactNode } from "react";

interface SongsCtx {
    songs: Song[];
    fetchSongs: (callback?: () => void) => Promise<void>;
    playingSong: Song | undefined;
    userPlayedSong: Song | undefined;
    loadingSong: number | undefined;
    setLoadingSong: (_: number | undefined) => void;
    playSong: (_: number) => void;
    userClickedPlaySong: (_: Song) => void;
    nextSong: () => void;
    stop: () => void;
};

const SongsContext = createContext<SongsCtx>(
    {
        songs: [],
        fetchSongs: () => Promise.resolve(),
        playingSong: undefined,
        userPlayedSong: undefined,
        loadingSong: undefined,
        setLoadingSong: () => {},
        playSong: () => {},
        userClickedPlaySong: () => {},
        nextSong: () => {},
        stop: () => {}
    }
);

export interface Song {
    id: number;
    title: string;
    artist: string;
    releaseYear: string;
    users: string;
    createdAt: string;
}

export function SongsContextProvider({ children }: { children: ReactNode }) {

    const [songs, setSongs] = useState<Song[]>([]);
    const [playingSong, setPlayingSong] = useState<Song | undefined>(undefined);
    const [userPlayedSong, setUserPlayedSong] = useState<Song | undefined>(undefined);
    const [loadingSong, setLoadingSong] = useState<number | undefined>(undefined);

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

    const nextSong = () => {
        // const randomSong = Math.floor(Math.random() * songs.length);
        // playSong(songs[randomSong]);
    }

    const stop = () => {
        setPlayingSong(undefined);
        setUserPlayedSong(undefined);
    }

    const playSong = (id: number) => {
        const songToPlay = songs.find(s => s.id === id);
        if (songToPlay) {
            setPlayingSong(songToPlay);
        }
    }

    const userClickedPlaySong = (song: Song) => {
        setUserPlayedSong(song);
    }

    return (
        <SongsContext.Provider
            value={{
                songs,
                fetchSongs: fetchData,
                playingSong,
                userPlayedSong,
                loadingSong,
                setLoadingSong,
                playSong,
                userClickedPlaySong,
                nextSong,
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