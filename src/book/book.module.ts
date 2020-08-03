import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BooksService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book])],
  providers: [BooksService, BookResolver],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
