import { NextApiRequest, NextApiResponse } from 'next';
import stream from 'youtube-audio-stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { ytid } = req.query

    try {
        console.log('da');
        stream(`http://youtube.com/watch?v=${ytid}`).pipe(res)
      } catch (err) {
        console.error(err)
        if (!res.headersSent) {
          res.writeHead(500)
          res.end('internal system error')
        }
      }
};