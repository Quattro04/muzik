import { useEffect, useState } from 'react';

export default function Text() {

    const [audioUrl, setAudioUrl] = useState('');

    const play = async () => {

    }

    useEffect(() => {
        play();
    }, [])

    return (
        audioUrl && <audio src={audioUrl} controls autoPlay />
    )
}
