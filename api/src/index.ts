import express from 'express';
import dotenv from 'dotenv';
import { Optional, Record, Static, String} from "runtypes"

import prisma from './utils/prisma';

export const BookRequest = Record({
	title: String,
	author: Optional(String),
	thumbnail: Optional(String),
})
export type BookRequest = Static<typeof BookRequest>

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/books', async (req, res) => {
	try {
		const books = await prisma.books.findMany();
		res.status(200).json(books);
	} catch (e) {
		return res.status(500).send("Internal Server Error")
	}
});

app.post('/book/:isbn', async ({ body, params: { isbn }}, res) => {
	try {
		const data = BookRequest.check(body);

		const book = await prisma.books.upsert({
			where: { isbn },
			update: { title: data.title },
			create: { isbn, ...data },
		});

		return res.status(200).json(book)
	} catch (e) {
		return res.status(500).send("Internal Server Error")
	}
});

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
