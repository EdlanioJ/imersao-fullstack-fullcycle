import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';

import { BankAccount } from './bank-account.model';

export enum PixKeyKind {
  nif = 'nil',
  email = 'email',
}
@Entity({ name: 'pix_key' })
export class PixKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  kind: PixKeyKind;

  @Column()
  key: string;

  @Column()
  bank_account_id: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @BeforeInsert()
  generateId() {
    if (this.id) {
      return;
    }
    this.id = uuidv4();
  }
}
