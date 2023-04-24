import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ytId, image, duration, timestamp, releaseYear, artist, title, user } = req.body;

    try {
        await prisma.song.create({
            data: {
                ytId,
                file: '',
                title,
                artist,
                duration,
                timestamp,
                image,
                releaseYear,
                users: user,
                createdAt: new Date().toISOString()
            }
        })
        return res.json({ message: 'Song added successfully' })
    } catch (e) {
        console.error('Error adding song: ', e)
        return res.json({ error: 'Error adding song: ' + e})
    }
}
