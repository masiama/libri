import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { books } from '@prisma/client';
import { parse } from 'node-html-parser';

import prisma from './utils/prisma';
import { BookRequest } from '../../src/types';

interface OLResponse {
  [key: string]: {
    thumbnail_url: string;
    details: {
      title: string;
      authors?: {
        key: string;
        name: string;
      }[];
    };
  };
}

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

app.get('/locations', async (req, res) => {
  try {
    const locations = await prisma.locations.findMany({
      orderBy: [{ title: 'asc' }],
    });
    res.status(200).json(locations);
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

    const { type, locationId, ...info } = data;

    if (type === 'manual') {
      const book = await prisma.books.upsert({
        where: { isbn },
        update: { title: info.title },
        create: { isbn, locationId, ...info },
      });

      return res.status(200).json(book);
    }

    let object: books | undefined = void 0;

    const rahvaraamatr = await fetch(
      `https://web.rahvaraamat.ee/product/search?name=${isbn}`,
    );
    const rahvaraamat = (await rahvaraamatr.json())[0];
    if (rahvaraamat) {
      object = {
        isbn,
        title: rahvaraamat.name[0] + rahvaraamat.name.slice(1).toLowerCase(),
        author: rahvaraamat.authors.map((a: any) => a.name).join(', '),
        thumbnail: rahvaraamat.thumb_file_url,
        locationId,
      };
    }

    if (!object) {
      const mnogoknigr = await fetch(`https://mnogoknig.lv/lv/search/${isbn}`);
      const mnogoknig = await mnogoknigr.text();
      if (mnogoknig) {
        const searchDocument = parse(mnogoknig);
        const bookLink = searchDocument
          .querySelector('.products a')
          ?.getAttribute('href');
        if (bookLink) {
          const bookr = await fetch(bookLink);
          const book = await bookr.text();
          const bookDocument = parse(book);

          object = {
            isbn,
            title:
              bookDocument
                .querySelector('#product_mainimage')
                ?.getAttribute('alt') || '',
            author:
              bookDocument
                .querySelector('[itemprop=author]')
                ?.innerHTML.split(', ')
                .map(a => {
                  const arr = a.split(' ');
                  return (
                    arr[0][0] +
                    arr[0].slice(1).toLowerCase() +
                    ' ' +
                    arr.slice(1).join(' ')
                  );
                })
                .join(', ') || null,
            thumbnail:
              bookDocument
                .querySelector('#product_mainimage')
                ?.getAttribute('src') || null,
            locationId,
          };
        }
      }
    }

    if (!object) {
      const troykaonliner = await fetch(
        `https://www.troykaonline.com/Search?q=${isbn}`,
      );
      const troykaonline = await troykaonliner.text();
      if (troykaonline) {
        const document = parse(troykaonline);

        object = {
          isbn,
          title:
            document.querySelector('.product-block .name a')?.innerHTML || '',
          author:
            document.querySelector('.product-block .author a')?.innerHTML ||
            null,
          thumbnail:
            document
              .querySelector('.product-block img')
              ?.getAttribute('src')
              ?.replace('small', 'large') || null,
          locationId,
        };
      }
    }

    if (!object) {
      const openlibraryr = await fetch(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`,
      );
      const openlibrary: OLResponse = await openlibraryr.json();
      const info = openlibrary[`ISBN:${isbn}`];
      if (info) {
        object = {
          isbn,
          title: info.details.title,
          author: info.details.authors?.map(a => a.name).join(', ') || null,
          thumbnail: info.thumbnail_url?.replace('-S', '-M'),
          locationId,
        };
      }
    }

    if (!object || !object.title)
      throw new Error('Failed to find book by provided ISBN');

    const book = await prisma.books.upsert({
      where: { isbn },
      update: {
        title: object.title,
      },
      create: object,
    });

    return res.status(200).json(book);
  } catch (e) {
    console.log(e);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
