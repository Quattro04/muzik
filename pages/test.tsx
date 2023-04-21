import Layout from "@/components/Layout";
import { useSongs } from "@/context/SongsContext";
import { useEffect, useState } from "react";
import YouTube from 'react-youtube';
import ytdl from 'ytdl-core';

export default function Text() {

    const { songs, fetchSongs} = useSongs();
    const [ showYt, setShowYt ] = useState<boolean>(false);

    useEffect(() => {
        fetchSongs();
        gett();
    }, [])

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1,
        },
    };

    const gett = async () => {
        let info = await ytdl.getInfo('YxIiPLVR6NA');
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        console.log('info ', info)
        console.log('Formats with only audio: ' + audioFormats.length);
    }

    return (
        <Layout>
            {showYt &&
                <div className="h-12">
                    <YouTube key={songs[0].id} videoId={songs[0].id} opts={opts} />
                </div>
            }
            {!showYt && songs && songs.length > 0 &&
                <div onClick={() => setShowYt(true)} className="text-white">{songs[0].title}</div>
            }


            {/* {songs.map((song, idx) => (
                <YouTube key={song.id} videoId={song.id} />
            ))} */}
        </Layout>
    )
}
