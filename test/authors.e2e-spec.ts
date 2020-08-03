import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthorsModule } from '../src/author/author.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Book } from '../src/book/book.entity';
import { Author } from '../src/author/author.entity';
import { BooksModule } from '../src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthorController (e2e)', () => {
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
        AuthorsModule,
        GraphQLModule.forRoot({
          debug: true,
          include: [BooksModule, AuthorsModule],
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
  
  const author: { firstName: string; lastName: string } = {
    firstName: 'Author1',
    lastName: 'AuthorLastName 1'
  };

  let id = 0;

  const updatedAuthor: { firstName: string; lastName: string } = {
    firstName: 'Author1 updated',
    lastName: 'AuthorLastName 1 updated'
  };

  const createAuthorObject = JSON.stringify(author).replace(
    /\"([^(\")"]+)\":/g,
    '$1:',
  );

  const createAuthorQuery = `
  mutation {
    createAuthor(author: ${createAuthorObject}) {
      firstName
      lastName
      id
    }
  }`;


  it('createAuthor', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createAuthorQuery,
      })
      .expect(({ body }) => {
        const data = body.data.createAuthor;
        id = data.id;
        expect(data.firstName).toBe(author.firstName);
        expect(data.lastName).toBe(author.lastName);
      })
      .expect(200);
  });

  it('getAuthor', () => {
    const getAuthorQuery = `
  query {
    getAuthor(id: ${id}) {
      firstName
      lastName
      id
    }
  }
  `
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: getAuthorQuery,
      })
      .expect(({ body }) => {
        const authorResult = body.data.getAuthor;
        expect(authorResult.firstName).toBe(author.firstName);
        expect(authorResult.lastName).toBe(author.lastName);
      })
      .expect(200);
  });

  it('deleteAuthor', () => {
    const deleteAuthorQuery = `
      mutation {
        deleteAuthor(id: "${id}")
      }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: deleteAuthorQuery,
      })
      .expect(({ body }) => {
        const data = body.data.deleteAuthor;
        expect(Number(data)).toBe(Number(id));
      })
      .expect(200);
  });
})
