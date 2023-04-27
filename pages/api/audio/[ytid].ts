import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ytid } = req.query

    try {
        const url = `https://www.youtube.com/watch?v=${ytid}`
        const videoInfo = await ytdl.getInfo(url);
        const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });

        res.setHeader('Content-Length', audioFormat.contentLength);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.videoId}.mp3"`);

        ytdl(url, { format: audioFormat }).pipe(res);
    } catch (e) {
        console.log('ERROR YTDL: ', e);
    }
}
