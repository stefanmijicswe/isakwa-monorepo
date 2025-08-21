import { Module } from '@nestjs/common';
import { RdfService } from './rdf.service';
import { FusekiService } from './fuseki.service';

@Module({
  providers: [RdfService, FusekiService],
  exports: [RdfService, FusekiService],
})
export class RdfModule {}
