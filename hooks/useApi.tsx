import { Song } from "@/context/SongsContext";
import { useUser } from "@/context/UserContext";
import { YtVideo } from "@/pages/search";

export function useApi() {

    const { user } = useUser();

    const getSongs = async () => {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/songs`);
            if (res.status !== 200) {
                throw new Error('Error fetching songs: ' + res.status);
            }
            const songsRes = await res.json();
            return songsRes.data;
        } catch(e: any) {
            return { error: e };
        }
    }

    const addSongFromYt = async (ytVideo: YtVideo, image: string, releaseYear: string, artist: string, title: string) => {
        const body = {
            id: ytVideo.videoId,
            url: ytVideo.url,
            image,
            duration: ytVideo.seconds,
            timestamp: ytVideo.timestamp,
            releaseYear,
            artist,
            title,
            user
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt-add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const resp = await res.json();
            return resp;
        } catch (e: any) {
            throw new Error(e);
        }
    }

    const getYtVideos = async (query: string) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/yt-search?q=${query}`);
        const songsRes = await res.json();
        return songsRes.videos;
    }

    return {
        getSongs,
        addSongFromYt,
        getYtVideos
    }

}