
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faForward,
    faBackward,
    faPlay,
    faPause
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useSongs } from "@/context/SongsContext";

export default function PlayerPlus() {

    // const audioRefs = useRef<Array<HTMLAudioElement>>([]);
    // const [audioSrcs, setAudioSrcs] = useState<Array<string>>(['','','','','']);
    // const [playingAudio, setPlayingAudio ] = useState<number>(-1);
    // const [songQueue, setSongQueue ] = useState<number[]>([]);

    const [audioEls, setAudioEls] = useState<Array<HTMLAudioElement>>([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

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
    }, []);

    useEffect(() => {
        if (userPlayedSong) {
            const index = songs.findIndex(s => s.id === userPlayedSong.id);
            const songsToPlay = songs.slice(index, index + 5);

            const newAudioEls = songsToPlay.map(s => {
                const audioEl = new Audio();
                audioEl.src = `${process.env.NEXT_PUBLIC_API_URL}/songs/${s.id}.mp3`;
                audioEl.addEventListener('loadeddata', () => {
                    console.log('loaded ', s.id);
                });
                audioEl.addEventListener('ended', () => {
                    playNextInQueue();
                });
                return audioEl;
            });

            setAudioEls(newAudioEls);

            // audioRefs.current[i].addEventListener('error', (e: any) => {
            //     console.log('HTML Audio Error: ');
            //     console.log(e.target?.error);
            //     setTimeout(() => {
            //         nextSong();
            //     }, 5000)
            // }, true);
    
            // audioRefs.current[i].addEventListener('ended', () => {
            //     playNextInQueue();
            // });
    
            // audioRefs.current[i].addEventListener('loadeddata', () => { 
            //     setLoadingSong(undefined);

            //     const slashArr = audioRefs.current[i].src.split('/');
            //     const id = Number(slashArr[slashArr.length-1].split('.')[0]);
            //     const newQueue = [...songQueue, id];
            //     setSongQueue(newQueue);
            // });
        }
    }, [userPlayedSong]);

    useEffect(() => {
        if (audioEls.length > 0 && currentAudioIndex < audioEls.length) {
            console.log('playing in audio ', currentAudioIndex);
            audioEls[currentAudioIndex].play();
            setIsPlaying(true);
            setLoadingSong(undefined);
        }
    }, [audioEls, currentAudioIndex]);

    // useEffect(() => {
    //     if (userPlayedSong) {
    //         const index = songs.findIndex(s => s.id === userPlayedSong.id);
    //         setPlayingAudio(0);
    //         setAudioSrcs([
    //             `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index].id}.mp3`,
    //             `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+1].id}.mp3`,
    //             `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+2].id}.mp3`,
    //             `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+3].id}.mp3`,
    //             `${process.env.NEXT_PUBLIC_API_URL}/songs/${songs[index+4].id}.mp3`
    //         ]);
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [userPlayedSong]);

    // useEffect(() => {
    //     if (playingSong) {
    //         const metadata = new MediaMetadata({
    //             title: playingSong.title,
    //             artist: playingSong.artist,
    //             album: "",
    //             artwork: [{ src: `${process.env.NEXT_PUBLIC_API_URL}/images/${playingSong.id}.jpg`, sizes: "720x720", type: "image/jpeg" }]
    //         });
    //         navigator.mediaSession.metadata = metadata;
    //     }
    // }, [playingSong]);

    // useEffect(() => {
    //     if (playingAudio > -1) {
    //         audioRefs.current[playingAudio].play();
    //     }
    // }, [playingAudio]);

    const playNextInQueue = () => {
        setCurrentAudioIndex((prevIndex) => prevIndex === 4 ? 0 : prevIndex + 1);
    };


    const play = () => {
        audioEls[currentAudioIndex].play();
        setIsPlaying(true);
    }

    const pause = () => {
        audioEls[currentAudioIndex].pause();
        setIsPlaying(false);
    }

    const repeatSong = () => {
        audioEls[currentAudioIndex].currentTime = 0;
        audioEls[currentAudioIndex].play();
        setIsPlaying(true);
    }

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    const handleSkipBackwardClick = () => {
        audioEls[currentAudioIndex].currentTime = 0;
        setIsPlaying(true);
    };

    const handleSkipForwardClick = () => {
        audioEls[currentAudioIndex].pause();
        audioEls[currentAudioIndex].currentTime = 0;
        playNextInQueue();
    };

    return (
        <div className="flex flex-1 justify-center items-center p-3 border-lightblue border-t-2">
            {/* {[0,1,2,3,4].map(i => (
                <audio key={i} className="w-full" ref={el => el ? audioRefs.current[i] = el : {}} src={audioSrcs[i]} controls={playingAudio === i ? true : false} />
            ))} */}
            {audioEls.map((audioEl, index) => (
                <audio key={index} src={audioEl.src} />
            ))}
            <FontAwesomeIcon
                icon={faBackward}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => handleSkipBackwardClick()}
            />
            <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => handlePlayPauseClick()}
            />
            <FontAwesomeIcon
                icon={faForward}
                style={{ fontSize: 16, color: "white", padding: '10px 15px', cursor: 'pointer' }}
                onClick={() => handleSkipForwardClick()}
            />
        </div>
    )
}
