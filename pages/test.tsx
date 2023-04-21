import Layout from "@/components/Layout";
import { useSongs } from "@/context/SongsContext";
import { useEffect, useState } from "react";
import YouTube from 'react-youtube';

export default function Text() {

    // const { songs } = useSongs();
    const [ showYt, setShowYt ] = useState<boolean>(false);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1,
        },
    };

    const ready = (e: any) => {
        console.log('REDYYYYY ');
        console.log(e);
    }

    return (
        <Layout>
            {showYt &&
                // <div className="h-12">
                //     <YouTube videoId="YxIiPLVR6NA" opts={opts} onReady={(e) => ready(e)} />
                // </div>
                <video src="https://www.youtube.com/embed/tgbNymZ7vqY" controls />
            }
            {!showYt &&
                <div onClick={() => setShowYt(true)} className="text-white">TOITLE</div>
            }


            {/* {songs.map((song, idx) => (
                <YouTube key={song.id} videoId={song.id} />
            ))} */}
        </Layout>
    )
}
