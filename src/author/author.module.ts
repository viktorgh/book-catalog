import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsService } from './author.service';
import { Author } from './author.entity';
import { AuthorResolver } from './author.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorsService, AuthorResolver],
  exports: [AuthorsService, TypeOrmModule]
})
export class AuthorsModule {}
