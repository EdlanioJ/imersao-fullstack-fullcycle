import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankAccount } from './models/bank-account.model';
import { BankAccountController } from './controllers/bank-account/bank-account.controller';
import { ConsoleModule } from 'nestjs-console';
import { FixturesCommand } from './fixtures/fixtures.command';
import { PixKeyController } from './controllers/pix-key/pix-key.controller';
import { PixKey } from './models/pix-key.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Transaction } from './models/transaction.model';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TransactionSubscriber } from './subscribers/transaction-subscriber/transaction-subscriber.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConsoleModule,
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      port: Number(process.env.TYPEORM_PORT),
      database: process.env.TYPEORM_DATABASE,
      entities: [BankAccount, PixKey, Transaction],
    }),
    TypeOrmModule.forFeature([BankAccount, PixKey, Transaction]),
    ClientsModule.register([
      {
        name: 'CODPIX_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'github.com.edlanioj.codepix',
          protoPath: [join(__dirname, 'protofiles/pixKey.proto')],
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER],
            clientId: process.env.KAFKA_CLIENT_ID,
          },
          consumer: {
            groupId:
              !process.env.KAFKA_CONSUMER_GROUP_ID ||
              process.env.KAFKA_CONSUMER_GROUP_ID === ''
                ? 'consumer-' + Math.random()
                : process.env.KAFKA_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    BankAccountController,
    PixKeyController,
    TransactionController,
  ],
  providers: [AppService, FixturesCommand, TransactionSubscriber],
})
export class AppModule {}
