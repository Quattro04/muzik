import { NextApiRequest, NextApiResponse } from 'next';
import yts from 'yt-search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { query } = req.query

    try {
        const resp = await yts(query as string);
        const videos = resp.videos.slice(0, 6);
        return res.json({ videos });
    } catch (e) {
        console.error('Error searching youtube: ', e)
        return res.json({ error: 'Error searching youtube: ' + e})
    }
}


