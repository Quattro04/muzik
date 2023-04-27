
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faForward,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSongs } from "@/context/SongsContext";

export default function Player() {

    const audioRefs = useRef<Array<HTMLAudioElement>>([]);
    const [playingAudio, setPlayingAudio ] = useState<number>(0);
    
    const [audioSrc1, setAudioSrc1] = useState<string>("");
    const [audioSrc2, setAudioSrc2] = useState<string>("");
    const [audioSrc3, setAudioSrc3] = useState<string>("");
    const [audioSrc4, setAudioSrc4] = useState<string>("");
    const [audioSrc5, setAudioSrc5] = useState<string>("");

    const { playedSong, nextSong, setLoadingSong } = useSongs();
    const [firstTime, setFirstTime] = useState<boolean>(true);

    useEffect(() => {

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

        // audioRef handlers

        for (let i = 0; i < 5; i++) {
            audioRefs.current[i].addEventListener('error', function(e: any) {
                console.log('HTML Audio Error: ');
                console.log(e.target?.error);
                setTimeout(() => {
                    nextSong();
                }, 5000)
            }, true);
    
            audioRefs.current[i].addEventListener('ended', () => {
                nextSong();
            });
    
            audioRefs.current[i].addEventListener('loadeddata', function () {
                setLoadingSong(undefined)
            });
        }
    }, [])

    useEffect(() => {
        if (playedSong) {
            const metadata = new MediaMetadata({
                title: playedSong.title,
                artist: playedSong.artist,
                album: "",
                artwork: [{ src: playedSong.image, sizes: "1280x720", type: "image/jpeg" }]
            });
              
            navigator.mediaSession.metadata = metadata;

            setAudioSrc1(`api/audio/${playedSong.ytId}`)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedSong])

    const play = () => {
        audioRefs.current[playingAudio].play();
    }

    const pause = () => {
        audioRefs.current[playingAudio].pause();
    }

    const repeatSong = () => {
        audioRefs.current[playingAudio].currentTime = 0;
    }

    return (
        <div className="flex flex-1 justify-center items-center p-3 border-lightblue border-t-2">
            {/* {[0,1,2,3,4].map(i => (
                <audio key={i} className="w-full" ref={el => el ? audioRefs.current[i] = el : {}} src={audioSrc1} />
            ))} */}
            <audio className="w-full" ref={el => el ? audioRefs.current[0] = el : {}} src={audioSrc1} />
            <audio className="w-full" ref={el => el ? audioRefs.current[1] = el : {}} src={audioSrc2} />
            <audio className="w-full" ref={el => el ? audioRefs.current[2] = el : {}} src={audioSrc3} />
            <audio className="w-full" ref={el => el ? audioRefs.current[3] = el : {}} src={audioSrc4} />
            <audio className="w-full" ref={el => el ? audioRefs.current[4] = el : {}} src={audioSrc5} />
            <FontAwesomeIcon
                icon={faForward}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => nextSong()}
            />
        </div>
    )
}
