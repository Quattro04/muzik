
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faBackward,
    faForward,
} from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSongs } from "@/context/SongsContext";
import next from "next/types";
import VolumeSlider from "./VolumeSlider";
import { useInfo } from "@/context/InfoContext";

export default function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    // const [playing, setPlaying] = useState<boolean>(false);
    const [songVolume, setSongVolume] = useState<number>(0);
    const [songCurrentTime, setSongCurrentTime] = useState<number>(0);
    const [songDuration, setSongDuration] = useState<number>(0);
    const playAnimationRef = useRef(0);

    const { playedSong, nextSong, stop, isPlaying, setIsPlaying,} = useSongs();
    const { isIos, browser} = useInfo();
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

        return () => {
            stop();
            cancelAnimationFrame(playAnimationRef.current);
        }
    }, [])

    useEffect(() => {
        if (playedSong && playedSong.audioSrc && audioRef.current) {
            audioRef.current.onended = () => {
                nextSong();
            };

            audioRef.current.onloadeddata = () => {
                if (!isIos || !firstTime) {
                    playAnimationRef.current = requestAnimationFrame(repeat);
                    setIsPlaying(true);
                }
                setFirstTime(false);
                const localVol = localStorage.getItem('volume');
                if (localVol) {
                    volumeSet(Number(localVol));
                } else {
                    volumeSet(audioRef.current?.volume ? audioRef.current?.volume : 0);
                }
            };

            if (isIos) {
                audioRef.current.src = `https://193.77.22.228/song/${encodeURI(playedSong.file)}`;
            } else {
                audioRef.current.src = playedSong.audioSrc;
            }
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

    const repeatSong = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }

    const timeSkip = (event: any) => {
        const ratio = event.pageX / window.innerWidth;
        if (audioRef.current) {
            audioRef.current.currentTime = Math.round(songDuration * ratio);
        }
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

    const volumeSet = (volume: number) => {
        if (audioRef.current === null) return;
        audioRef.current.volume = volume;
        localStorage.setItem('volume', volume.toString())
        setSongVolume(volume);
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
                <div className="flex items-center">
                    <FontAwesomeIcon
                        icon={faBackward}
                        style={{ fontSize: 12, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                        onClick={() => repeatSong()}
                    />
                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        style={{ fontSize: 20, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                        onClick={() => isPlaying ? pause() : play()}
                    />
                    <FontAwesomeIcon
                        icon={faForward}
                        style={{ fontSize: 12, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                        onClick={() => nextSong()}
                    />
                </div>
                <div className="hidden sm:flex items-center absolute" style={{ right: '80px' }}>
                    <VolumeSlider volume={songVolume} onChange={volumeSet} />
                </div>
                {playedSong &&
                    <span className="text-xs text-white flex-1 flex justify-end">{parseSeconds(songDuration)}</span>
                }
            </div>
            <audio className="w-full" ref={audioRef} autoPlay={true} />
        </div>
    )
}
