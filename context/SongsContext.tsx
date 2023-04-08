import { Song } from "@/pages";
import React, { useContext, useState, useEffect, createContext, ReactNode } from "react";

interface SongsCtx {
    songs: Song[];
    fetchSongs: () => Promise<void>
};

const SongsContext = createContext<SongsCtx>({ songs: [], fetchSongs: () => Promise.resolve() });

export function SongsContextProvider({ children }: { children: ReactNode }) {

    const [songs, setSongs] = useState<Song[]>([]);

    const fetchData = async () => {
        const res = await fetch('http://localhost:3000/songs', {
        headers: {
            'Authentication': process.env.NEXT_PUBLIC_AUTH_TOKEN as string
            }
        });
        const songsRes = await res.json();
        setSongs(songsRes.data);
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SongsContext.Provider
            value={{
                songs,
                fetchSongs: () => fetchData()
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