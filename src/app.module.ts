import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './book/book.module';
import { Book } from './book/book.entity'
import { Author } from './author/author.entity'
import { GraphQLModule } from '@nestjs/graphql';
import { AuthorsModule } from './author/author.module';
import { Connection } from 'typeorm/index';

@Module({
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
    AuthorsModule,
    GraphQLModule.forRoot({
      debug: true,
      include: [BooksModule, AuthorsModule],
      typePaths: ['src/schema.gql'],
    }),
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
