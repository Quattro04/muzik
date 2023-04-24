import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, user } = req.body;

    try {
        const song = await prisma.song.findFirst({
            where: {
              id: id
            }
        });

        await prisma.song.update({
            where: {
              id: id,
            },
            data: {
              users: `${song?.users},${user}`,
            },
        });
        return res.json({ message: 'Song added successfully' })
    } catch (e) {
        console.error('Error adding song: ', e)
        return res.json({ error: 'Error adding song: ' + e})
    }
}
