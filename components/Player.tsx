
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayedSong } from "@/pages";


export default function Player({ song }: { song: PlayedSong | undefined }) {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState<boolean>(false);
    const [songCurrentTime, setSongCurrentTime] = useState<number>(0);
    const [songDuration, setSongDuration] = useState<number>(0);
    const playAnimationRef = useRef(0);

    useEffect(() => {
        if (song && song.audioSrc && audioRef.current) {
            audioRef.current.onloadeddata = () => {
                play();
            };
            audioRef.current.src = song.audioSrc;
            setSongDuration(song.duration)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [song])

    const play = () => {
        audioRef.current?.play();
        playAnimationRef.current = requestAnimationFrame(repeat);
        setPlaying(true);
    }

    const pause = () => {
        audioRef.current?.pause();
        setPlaying(false);
        cancelAnimationFrame(playAnimationRef.current);
    }

    const repeat = useCallback(() => {
        console.log('run');

        const currentTime = audioRef.current?.currentTime;
        if (currentTime) {
            setSongCurrentTime(currentTime);
        }      
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);

    return (
        <div className="flex flex-1 justify-center align-center p-3 border-lightblue border-t-2">
            <div className="absolute bg-green left-0" style={{ width: `${(songCurrentTime / songDuration) * 100}%`, height: '2px', marginTop: -14 }}></div>
            <FontAwesomeIcon
                icon={playing ? faPause : faPlay}
                style={{ fontSize: 20, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => playing ? pause() : play()}
            />
            <audio ref={audioRef} />
        </div>
    )
}
