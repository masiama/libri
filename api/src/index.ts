import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import prisma from './utils/prisma';
import { BookRequest } from '../../src/types';

dotenv.config();

const app = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(express.json());

app.get('/books', async (req, res) => {
  try {
    const books = await prisma.books.findMany({ orderBy: [{ title: 'asc' }] });
    res.status(200).json(books);
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/book/:isbn', async ({ params: { isbn } }, res) => {
  try {
    const book = await prisma.books.findFirst({ where: { isbn } });
    if (book) res.status(200).json({ data: book });
    else res.status(404).json({ error: 'Book is not found' });
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/book/:isbn', async ({ body, params: { isbn } }, res) => {
  try {
    const data = BookRequest.check(body);

    const book = await prisma.books.upsert({
      where: { isbn },
      update: { title: data.title },
      create: { isbn, ...data },
    });

    return res.status(200).json(book);
  } catch (e) {
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
