import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { GraphQLModule } from '@nestjs/graphql';
import { Book } from '../src/book/book.entity';
import { BooksModule } from '../src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../src/author/author.entity';

describe('BookController (e2e)', () => {
  let app;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'catalog',
          autoLoadEntities: true,
          entities: [Book, Author],
          synchronize: true,
        }),
        BooksModule,
        GraphQLModule.forRoot({
          debug: true,
          include: [BooksModule, BooksModule],
          typePaths: ['../src/schema.gql'],
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  const book: { title: string, authorIds: number[] } = {
    title: 'Book1',
    authorIds: [1]
  };

  let id = 0;

  const updatedBook: { title: string } = {
    title: 'Book1 updated'
  };

  const createBookObject = JSON.stringify(book).replace(
    /\"([^(\")"]+)\":/g,
    '$1:',
  );

  const createBookQuery = `
  mutation {
    createBook(book: ${createBookObject}) {
      title
      id
    }
  }`;


  it('createBook', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createBookQuery,
      })
      .expect(({ body }) => {
        const data = body.data.createBook;
        id = data.id;
        expect(data.title).toBe(book.title);
      })
      .expect(200);
  });

  it('getBook', () => {
    const getBookQuery = `
  query {
    getBook(id: ${id}) {
      title
      id
    }
  }
  `
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: getBookQuery,
      })
      .expect(({ body }) => {
        const bookResult = body.data.getBook;
        expect(bookResult.title).toBe(book.title);
      })
      .expect(200);
  });

  const updateBookObject = JSON.stringify(updatedBook).replace(
    /\"([^(\")"]+)\":/g,
    '$1:',
  );


  it('deleteBook', () => {
    const deleteBookQuery = `
      mutation {
        deleteBook(id: "${id}")
      }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: deleteBookQuery,
      })
      .expect(({ body }) => {
        const data = body.data.deleteBook;
        expect(Number(data)).toBe(Number(id));
      })
      .expect(200);
  });
})
