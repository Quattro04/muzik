import { useEffect, useRef, useState } from 'react';

export default function Text() {

    const [audioUrl, setAudioUrl] = useState('');
    const [audioUrl2, setAudioUrl2] = useState('');
    const [playerId, setPlayerId] = useState<number>(0);

    const audioRef1 = useRef<HTMLVideoElement>(null);
    const audioRef2 = useRef<HTMLVideoElement>(null);

    const next = async () => {
        if (audioRef1.current) {
            audioRef1.current.pause();
        }
        setPlayerId(1);
        if (audioRef2.current) {
            audioRef2.current.play();
        }
    }

    useEffect(() => {
        setAudioUrl('/api/audio/4e_tXnbuv7w')
        setTimeout(() => {
            setAudioUrl2('/api/audio/tp4fUH2E8uc')
        }, 2000)
    }, [])

    return (
        <div>
            <audio src={audioUrl} controls={playerId === 0} ref={audioRef1} />
            <audio src={audioUrl2} controls={playerId === 1} ref={audioRef2} />
            <button onClick={() => next()}>SET 2</button>
            <iframe src="https://open.spotify.com/embed/track/1Sl3njkhhz8nrSPZroDQ82?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen={false} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    )
}
