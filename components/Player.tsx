
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faForward,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSongs } from "@/context/SongsContext";

export default function Player() {

    const audioRef = useRef<HTMLVideoElement>(null);
    const [audioSrc, setAudioSrc] = useState<string>("");

    const { playedSong, nextSong } = useSongs();
    const [firstTime, setFirstTime] = useState<boolean>(true);

    useEffect(() => {
        if (playedSong && playedSong.file && audioRef.current) {
            if (firstTime) {

                const metadata = new MediaMetadata({
                    title: playedSong.title,
                    artist: playedSong.artist,
                    album: "",
                    artwork: [{ src: playedSong.image, sizes: "1280x720", type: "image/jpeg" }]
                });
                  
                navigator.mediaSession.metadata = metadata;

                navigator.mediaSession.setActionHandler('play', function() {
                    play();
                });
                navigator.mediaSession.setActionHandler('pause', function() {
                    pause();
                });
                navigator.mediaSession.setActionHandler('previoustrack', function() {
                    repeatSong();
                });
                navigator.mediaSession.setActionHandler('nexttrack', function() {
                    nextSong();
                });

                audioRef.current.addEventListener('error', function(e: any) {
                    console.log('ERORRRRORRRRR ');
                    console.log(e.target?.error.code);
                    setTimeout(() => {
                        nextSong();
                    }, 5000)
                }, true);

                audioRef.current.addEventListener('ended', () => {
                    nextSong();
                });
                setFirstTime(false);
            }
            setAudioSrc(`https://193.77.22.228/song/${encodeURI(playedSong.file)}`)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedSong])

    const play = () => {
        audioRef.current?.play();
    }

    const pause = () => {
        audioRef.current?.pause();
    }

    const repeatSong = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }

    return (
        <div className="flex flex-1 justify-center items-center p-3 border-lightblue border-t-2">
            <audio className="w-full" ref={audioRef} src={audioSrc} autoPlay controls />
            <FontAwesomeIcon
                icon={faForward}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => nextSong()}
            />
        </div>
    )
}
