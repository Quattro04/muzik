import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ytid } = req.query
    const url = `https://www.youtube.com/watch?v=${ytid}`
    const videoInfo = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audioonly' });
    ytdl(url, { format: audioFormat }).pipe(res);
}
