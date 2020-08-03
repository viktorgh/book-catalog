import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { Connection } from 'typeorm/index';
@Injectable()
export class AuthorsService {

  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
    protected readonly connection: Connection
  ) {}

  async findAll(minNumberOfBooks: number, maxNumberOfBooks: number): Promise<Author[]> {
    const query = this.connection
      .getRepository(Author)
      .createQueryBuilder("author")
      .innerJoinAndSelect(subQuery => {
        return subQuery
          .select([
            'author_id',
            'COUNT(*) AS count_subs'
          ])
          .from('book_authors', "book_authors")
          .groupBy('author_id')
      }, "count", 'author.id = count.author_id')
      .leftJoinAndSelect("author.books", "books")
    .where('count_subs >= :minNumberOfBooks', { minNumberOfBooks: minNumberOfBooks || 0 })
    if (maxNumberOfBooks) {
      query.andWhere('count_subs <= :maxNumberOfBooks', { maxNumberOfBooks })
    }
    return query.getMany()
  }

  findOne(id: number): Promise<Author> {
    return this.authorsRepository.findOne(id);
  }

  create(author: Author): Promise<Author> {
    return this.authorsRepository.save({
      firstName: author.firstName,
      lastName: author.lastName
    })
  }

  async delete(id: number): Promise<number> {
    const { affected } = await this.authorsRepository.delete({ id })
    return affected > 0 ? id : null
  }

}
