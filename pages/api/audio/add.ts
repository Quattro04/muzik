import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { artist, title, releaseYear, user } = req.body;

    try {

        const existingSong = await prisma.song.findFirst({
            where: {
                artist,
                title
            }
        });

        if (!existingSong) {
            const song = await prisma.song.create({
                data: {
                    artist,
                    title,
                    releaseYear,
                    users: user,
                    createdAt: new Date().toISOString()
                }
            })
            return res.json({ message: 'Song added successfully', song })
        }
        return res.json({ error: 'Song already exists' })
    } catch (e) {
        console.error('Error adding song: ', e)
        return res.json({ error: 'Error adding song: ' + e})
    }
}
