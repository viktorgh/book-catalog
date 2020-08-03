import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Book } from '../book/book.entity'
import { JoinTable } from 'typeorm/index';
@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @ManyToMany(type => Book,
    book => book.authors)
  @JoinTable({
    name: 'book_authors',
    joinColumns: [
      { name: 'author_id' }
    ],
    inverseJoinColumns: [
      { name: 'book_id' }
    ]
  })
  books!: Book[];
}
