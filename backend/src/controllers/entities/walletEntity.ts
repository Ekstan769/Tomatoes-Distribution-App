import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from "typeorm";
import { User } from "../entity"; // Adjusted to match your shared standard path structure

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn("uuid")
  walletId!: string;

  // Using decimal for handling financial figures accurately without float issues
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00 })
  balance!: number;

  @Column({ type: 'varchar', default: 'NGN' })
  currency!: string;

  // For verifying bank payout connections 
  @Column({ type: 'boolean', default: false })
  isPayoutSetupCompleted!: boolean;

  
  // FOREIGN KEY COLUMNS
 

  @Column({ type: 'uuid', unique: true })
  userId!: string;

  // One Wallet belongs strictly to one User
  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}