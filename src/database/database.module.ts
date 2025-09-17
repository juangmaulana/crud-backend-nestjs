import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService], // <-- Ekspor agar bisa dipakai modul lain
})
export class DatabaseModule {}