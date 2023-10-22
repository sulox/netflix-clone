import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }
        
        await serverAuth(req, res);

        //We want to count all movies in our database without loading them
        const movieCount = await prismadb.movie.count();
        //Create a random index using movie count
        const randomIndex = Math.floor(Math.random() * movieCount);

        //We want to find a random movie object from database
        //We're gonna use pagination to make our algorithm for random movie
        const randomMovies = await prismadb.movie.findMany({
            take: 1,
            skip: randomIndex
        });

        //Returning first(0) from array of randonMovies, as there is only one movie in the array
        return res.status(200).json(randomMovies[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}