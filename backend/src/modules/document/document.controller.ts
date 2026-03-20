import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('generate')
  async generateDocuments(
    @Request() req: { user: { id: string } },
    @Body('projectId') projectId: string,
  ) {
    return this.documentService.generateDocuments(req.user.id, projectId);
  }

  @Get(':projectId')
  async findByProjectId(
    @Request() req: { user: { id: string } },
    @Param('projectId') projectId: string,
  ) {
    return this.documentService.findByProjectId(req.user.id, projectId);
  }

  @Get('detail/:id')
  async findOne(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.documentService.findOne(req.user.id, id);
  }

  @Put(':id')
  async update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentService.update(req.user.id, id, updateDocumentDto);
  }
}
