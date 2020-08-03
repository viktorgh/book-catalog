import { Resolver, Query, Int, Args, Mutation } from '@nestjs/graphql';
import { BooksService } from './book.service';
import { Book } from './book.entity';
import { Connection } from 'typeorm/index';
import { BookInput } from './create-book.args'

@Resolver(of => Book)
export class BookResolver {
  constructor(
    private booksService: BooksService,
    private connection: Connection
  ) {}

  @Query(returns => Book)
  async getBooks(@Args('title', { type: () => String}) title: string): Promise<Book[]> {
    return this.booksService.findAll(title)
  }

  @Query(returns => Book)
  async getBook(@Args('id', { type: () => Int}) id: number): Promise<Book> {
    return this.booksService.findOne(id)
  }

  @Mutation(returns => Book)
  async createBook(@Args('book', { type: () => BookInput}) book: BookInput): Promise<Book> {
    return this.booksService.create(book)
  }

  @Mutation(returns => Book)
  async deleteBook(@Args('id', { type: () => Int}) id: number): Promise<number> {
    return this.booksService.delete(id)
  }

  @Mutation(returns => Book)
  async addAuthor(
    @Args('bookId', { type: () => Int}) bookId: number,
    @Args('authorId', { type: () => Int}) authorId: number,
    ): Promise<Book> {
    return this.booksService.addAuthor(bookId, authorId)
  }
}
