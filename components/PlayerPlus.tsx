
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faForward,
    faPlay
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSongs } from "@/context/SongsContext";

export default function PlayerPlus() {

    const audioRefs = useRef<Array<HTMLAudioElement>>([]);
    const [audioSrcs, setAudioSrcs] = useState<Array<string>>(['','','','','']);
    const [playingAudio, setPlayingAudio ] = useState<number>(-1);

    const { userPlayedSong, playingSong, playSong, nextSong, setLoadingSong, songs } = useSongs();

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
            audioRefs.current[i].addEventListener('error', (e: any) => {
                console.log('HTML Audio Error: ');
                console.log(e.target?.error);
                setTimeout(() => {
                    nextSong();
                }, 5000)
            }, true);
    
            audioRefs.current[i].addEventListener('ended', () => {
                setPlayingAudio(i+1);
            });
    
            audioRefs.current[i].addEventListener('loadeddata', () => { 
                setLoadingSong(undefined)
                if (i === playingAudio) {
                    const slashArr = audioRefs.current[i].src.split('/');
                    const id = Number(slashArr[slashArr.length-1].split('.')[0]);
                    playSong(id);
                }
            });
        }
    }, [])

    useEffect(() => {
        if (userPlayedSong) {
            const index = songs.findIndex(s => s.id === userPlayedSong.id);
            setPlayingAudio(0);
            setAudioSrcs([
                `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index].id}.mp3`,
                `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+1].id}.mp3`,
                `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+2].id}.mp3`,
                `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+3].id}.mp3`,
                `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+4].id}.mp3`
            ]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPlayedSong]);

    useEffect(() => {
        if (playingSong) {
            const metadata = new MediaMetadata({
                title: playingSong.title,
                artist: playingSong.artist,
                album: "",
                artwork: [{ src: `${process.env.NEXT_PUBLIC_API_URL}/images/${playingSong.id}.jpg`, sizes: "720x720", type: "image/jpeg" }]
            });
            navigator.mediaSession.metadata = metadata;
        }
    }, [playingSong]);

    useEffect(() => {
        if (playingAudio > -1) {
            audioRefs.current[playingAudio].play();
        }
    }, [playingAudio]);

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
            {[0,1,2,3,4].map(i => (
                <audio key={i} className="w-full" ref={el => el ? audioRefs.current[i] = el : {}} src={audioSrcs[i]} controls={playingAudio === i ? true : false} />
            ))}
            {/* <FontAwesomeIcon
                icon={faForward}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => nextSong()}
            /> */}
        </div>
    )
}
