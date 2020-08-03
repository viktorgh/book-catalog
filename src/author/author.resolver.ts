import { Book } from '../book/book.entity';
import { Resolver, Query, Int, Args, Mutation } from '@nestjs/graphql';
import { AuthorsService } from './author.service';
import { Author } from './author.entity';

@Resolver(of => Book)
export class AuthorResolver {
  constructor(
    protected readonly  authorsService: AuthorsService,
  ) {}

  @Query(returns => Author)
  async getAuthors(
    @Args('minNumberOfBooks', { type: () => Int})
      minNumberOfBooks: number,
    @Args('maxNumberOfBooks', { type: () => Int})
      maxNumberOfBooks: number
  ): Promise<Author[]> {
    return this.authorsService.findAll(minNumberOfBooks, maxNumberOfBooks)
  }

  @Query(returns => Author)
  async getAuthor(@Args('id', { type: () => Int}) id: number): Promise<Author> {
    return this.authorsService.findOne(id)
  }

  @Mutation(returns => Author)
  async createAuthor(@Args('author', { type: () => Author}) author: Author): Promise<Author> {
    return this.authorsService.create(author)
  }

  @Mutation(returns => Author)
  async deleteAuthor(@Args('id', { type: () => Int}) id: number): Promise<number> {
    return this.authorsService.delete(id)
  }
}
