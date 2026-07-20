import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
  OneToOne
} from 'typeorm';
import { Product } from '../entity';
import { Wallet } from '../entity';
import { Order } from '../entity';
import { Review } from '../entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  BUYER = 'BUYER',
  FARMER = 'FARMER'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // Consolidated into a single primary key

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  businessName?: string;

  @Column({ type: 'varchar' })
  userName!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  securityQuestion?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  securityAnswer?: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isComplete!: boolean; // New column to track if onboarding is done

  // Storing as a simple-array translates to a text column split by commas in SQL
  @Column({ type: 'simple-array', nullable: true })
  location?: string[];
  
  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email?: string;
  
  @Column({ type: 'varchar', nullable: true })
  profilePic?: string;
  
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet?: Wallet;

  // Farmer-only payout fields - nullable for Buyer
  @Column({ type: 'varchar', nullable: true })
  accountNumber?: string;
  
  @Column({ type: 'varchar', nullable: true })
  accountName?: string;
  
  @Column({ type: 'varchar', nullable: true })
  bankName?: string;

  // Corrected relations pointing to their inverse properties
  @OneToMany(() => Product, (product) => product.farmer)
  products?: Product[];
  
  @OneToMany(() => Order, (order) => order.buyer)
  orders?: Order[];
  
  @OneToMany(() => Review, (review) => review.author)
  reviews?: Review[];
}