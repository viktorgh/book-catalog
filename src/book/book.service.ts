import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager } from 'typeorm';
import { Book } from './book.entity';
import { BookInput } from './create-book.args'
import { Author } from '../author/author.entity'
import { Connection } from 'typeorm/index';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book)
    protected readonly booksRepository: Repository<Book>,
    protected readonly connection: Connection
  ) {}

  async findAll(title: string): Promise<Book[]> {
    return this.connection
      .getRepository(Book)
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.authors", "authors")
      .where("book.title LIKE :title", { title })
      .getMany();
  }

  async findOne(id: number): Promise<Book> {
    return this.connection
      .getRepository(Book)
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.authors", "authors")
      .where("book.id = :id", { id })
      .getOne();
  }

  async create(book: BookInput): Promise<Book> {
    const entityManager = getManager();
    const newBook = new Book()
    newBook.title = book.title
    const authors = await entityManager.findByIds(Author, book.authorIds)
    newBook.authors = authors

    return this.connection.manager.save(newBook)
  }

  async delete(id: number): Promise<number> {
    const { affected } = await this.booksRepository.delete({ id })
    return affected > 0 ? id : null
  }

  async addAuthor(bookId: number, authorId: number): Promise<Book> {
    const entityManager = getManager();
    const book = await this.booksRepository.findOne(bookId, { relations: ["authors"] });
    const author = await entityManager.findOne(Author, authorId)
    book.authors.push(author);

    return entityManager.save(book);
  }
}
