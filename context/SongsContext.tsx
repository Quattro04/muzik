import { useApi } from "@/hooks/useApi";
import React, { useContext, useState, useEffect, createContext, ReactNode } from "react";

interface SongsCtx {
    songs: Song[];
    fetchSongs: (callback?: () => void) => Promise<void>;
    playedSong: Song | undefined;
    playSong: (_: Song, callback?: () => void) => void;
    isPlaying: boolean;
    setIsPlaying: (_: boolean) => void;
    nextSong: () => void;
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
        nextSong: () => {},
        stop: () => {}
    }
);

export interface Song {
    id: string;
    file: string;
    title: string;
    artist: string;
    duration: number;
    timestamp: string;
    releaseYear: string;
    image: string;
    users: string[];
    createdAt: string;
}

export function SongsContextProvider({ children }: { children: ReactNode }) {

    const [songs, setSongs] = useState<Song[]>([]);
    const [playedSong, setPlayedSong] = useState<Song | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const { getSongs } = useApi();


    const fetchData = async (callback?: () => void) => {
        
        const songs = await getSongs();

        if (songs.error) {
            alert(songs.error.message);
        } else {
            setSongs(songs);
        }
        callback?.();
    }

    const nextSong = () => {
        const randomSong = Math.floor(Math.random() * songs.length);
        playSong(songs[randomSong]);
    }

    const stop = () => {
        setPlayedSong(undefined);
        setIsPlaying(false);
    }

    const playSong = (song: Song, callback?: () => void) => {
        setPlayedSong(song);
        callback?.();
    }

    return (
        <SongsContext.Provider
            value={{
                songs,
                fetchSongs: fetchData,
                playedSong,
                playSong,
                isPlaying,
                setIsPlaying,
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