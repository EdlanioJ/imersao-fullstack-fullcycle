import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PixKeyExistsDto } from 'src/dto/pix-key-exists.dto';
import { PixKeyDto } from 'src/dto/pix-key.dto';
import { PixService } from 'src/grpc-types/pix-service.grpc';
import { BankAccount } from 'src/models/bank-account.model';
import { PixKey } from 'src/models/pix-key.model';
import { Repository } from 'typeorm';

@Controller('bank-acount/:bankAccountId/pix-key')
export class PixKeyController {
  constructor(
    @InjectRepository(PixKey)
    private pixKeyRepo: Repository<PixKey>,

    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,

    @Inject('CODPIX_PACKAGE')
    private client: ClientGrpc,
  ) {}
  @Get()
  index(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAcountId: string,
  ) {
    return this.pixKeyRepo.find({
      where: {
        bank_account_id: bankAcountId,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  @Post()
  async store(
    @Param('bankAccountId', new ParseUUIDPipe({ version: '4' }))
    bankAcountId: string,

    @Body(new ValidationPipe({ errorHttpStatusCode: 422 }))
    body: PixKeyDto,
  ) {
    await this.bankAccountRepo.findOneOrFail(bankAcountId);

    const pixService: PixService = this.client.getService('PixService');

    const notFound = await this.checkPixKeyNotFound(body);

    if (!notFound) {
      throw new UnprocessableEntityException('PixKey already exists');
    }

    const createdPixKey = await pixService
      .registerPixKey({
        ...body,
        accountId: bankAcountId,
      })
      .toPromise();

    if (createdPixKey.error) {
      throw new InternalServerErrorException(createdPixKey.error);
    }

    const pixKey = this.pixKeyRepo.create({
      id: createdPixKey.id,
      bank_account_id: bankAcountId,
      ...body,
    });

    return await this.pixKeyRepo.save(pixKey);
  }

  async checkPixKeyNotFound(params: { key: string; kind: string }) {
    const pixService: PixService = this.client.getService('PixService');

    try {
      await pixService.find(params).toPromise();
      return false;
    } catch (e) {
      if (e.details === 'no key was found') {
        return true;
      }

      throw new InternalServerErrorException('server no avalible');
    }
  }

  @Get('exists')
  @HttpCode(204)
  async exist(
    @Query(new ValidationPipe({ errorHttpStatusCode: 422 }))
    params: PixKeyExistsDto,
  ) {
    const pixService: PixService = this.client.getService('PixService');

    try {
      await pixService.find(params).toPromise();
    } catch (e) {
      if (e.details === 'no key was found') {
        throw new NotFoundException(e.details);
      }

      throw new InternalServerErrorException('server no avalible');
    }
  }
}
