import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Author } from '../author/author.entity'
import { JoinTable } from 'typeorm/index';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title!: string;

  @ManyToMany(type => Author,
      author => author.books)
  @JoinTable({
    name: 'book_authors',
    joinColumns: [
      { name: 'book_id' }
    ],
    inverseJoinColumns: [
      { name: 'author_id' }
    ]
  })
  authors: Author[];
}
