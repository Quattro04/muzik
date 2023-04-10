
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faVolumeHigh
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayedSong, useSongs } from "@/context/SongsContext";

export default function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    // const [playing, setPlaying] = useState<boolean>(false);
    const [songCurrentTime, setSongCurrentTime] = useState<number>(0);
    const [songDuration, setSongDuration] = useState<number>(0);
    const [songVolume, setSongVolume] = useState<number>(0);
    const [changingSongVolume, setChangingSongVolume] = useState<boolean>(false);
    const playAnimationRef = useRef(0);

    const { playedSong, queueNextSong, stop, isPlaying, setIsPlaying} = useSongs();

    useEffect(() => {
        return () => {
            stop();
            cancelAnimationFrame(playAnimationRef.current);
            // if (audioRef.current && audioRef.current.src) {
            //     audioRef.current.src = '';
            // }
        }
    }, [])

    useEffect(() => {
        if (playedSong && playedSong.audioSrc && audioRef.current) {
            audioRef.current.onended = () => {
                queueNextSong();
            };
            audioRef.current.onloadeddata = () => {
                play();
                const localVol = localStorage.getItem('volume');
                if (localVol) {
                    volumeSet(Number(localVol));
                } else {
                    volumeSet(audioRef.current?.volume ? audioRef.current?.volume : 0);
                }
            };
            audioRef.current.src = playedSong.audioSrc;
            setSongDuration(playedSong.duration)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playedSong])

    const play = () => {
        audioRef.current?.play();
        playAnimationRef.current = requestAnimationFrame(repeat);
        setIsPlaying(true);
    }

    const pause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
        cancelAnimationFrame(playAnimationRef.current);
    }

    const timeSkip = (event: any) => {
        const ratio = event.pageX / window.innerWidth;
        if (audioRef.current) {
            audioRef.current.currentTime = Math.round(songDuration * ratio);
        }
    }

    const volumeSet = (volume: number) => {
        if (audioRef.current === null) return;
        audioRef.current.volume = volume;
        setSongVolume(volume);
        localStorage.setItem('volume', volume.toString())
    }

    const onVolumeMouseMove = (event: any) => {
        if (!changingSongVolume) return;
        const desiredVolume = event.pageX - event.target.getBoundingClientRect().left;
        const vol = desiredVolume / event.target.getBoundingClientRect().width;
        volumeSet(vol)
    }

    const onVolumeMouseUp = (event: any) => {
        onVolumeMouseMove(event);
        setChangingSongVolume(false);
    }

    const repeat = useCallback(() => {
        const currentTime = audioRef.current?.currentTime;
        if (currentTime) {
            setSongCurrentTime(currentTime);
        }      
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);

    const parseSeconds = (s: number): string => {
        const seconds = Math.round(s);
        const secondsLeft = seconds % 60;
        const secondsLeftString = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}:${secondsLeftString}`;
    }

    return (
        <div className="flex flex-1 justify-center align-center p-3 border-lightblue border-t-2">
            <div
                className="absolute bg-green left-0 index-10"
                style={{ width: `${(songCurrentTime / songDuration) * 100}%`, height: '2px', marginTop: -14 }}
            />
            <div
                className="absolute left-0 index-20 w-full cursor-pointer"
                style={{ height: '20px', marginTop: -24 }}
                onMouseUp={timeSkip}
            />
            <div className="flex items-center justify-center w-full">
                {playedSong &&
                    <span className="text-xs text-green flex-1">{parseSeconds(songCurrentTime)}</span>
                }
                <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                    style={{ fontSize: 20, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                    onClick={() => isPlaying ? pause() : play()}
                />
                <div className="flex items-center absolute" style={{ right: '80px' }}>
                    <div
                        className="flex items-center w-32 h-4 mr-3 cursor-pointer"
                        onMouseDown={() => setChangingSongVolume(true)}
                        onMouseMove={onVolumeMouseMove}
                        onMouseUp={onVolumeMouseUp}
                    >
                        <div className="w-full bg-lightblue rounded pointer-events-none" style={{ height: '4px' }}>
                            <div className="bg-blue rounded pointer-events-none" style={{ width: `${songVolume * 100}%`, height: '4px' }} />
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={faVolumeHigh}
                        style={{ fontSize: 12, color: "white" }}
                    />
                </div>
                {playedSong &&
                    <span className="text-xs text-white flex-1 flex justify-end">{parseSeconds(songDuration)}</span>
                }
            </div>
            <audio ref={audioRef} />
        </div>
    )
}
