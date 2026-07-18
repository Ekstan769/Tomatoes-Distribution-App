//EXPECTED STRUCTURE PLS CHANGE APPROPRIATELY
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
  OneToOne,
  Index
} from 'typeorm';
import { Product } from '../entity';
import { Wallet } from '../entity';
//import { Order } from '../entity';
import { Review } from '../entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  BUYER = 'BUYER',
  FARMER = 'FARMER'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId!: string;

  @Column()
  role!: "Farmer" | "Buyer | Admin";

  @Column()
  businessName?: string;

  @Column()
  userName!: string;

  @Index({ unique: true })
  @Column()
  phoneNumber!: string;
  
  @Index()
  @Column()
  securityQuestion?: string;

  @Index()
  @Column()
  securityAnswer?: string;

  @Column()
  password!: string;

  @Column()
  location?: string[];
  
  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  email?: string;
  
  @Column({ nullable: true })
  profilePic?: string;
  
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet?: Wallet;


  // Farmer- only payout fields - nullable for Buyer
  @Column({ nullable: true })
  accountNumber?: string;
  
  @Column({ nullable: true })
  accountName?: string;
  
  @Column({ nullable: true })
  bankName?: string;
  
  

  //One farmer creates many products
  @OneToMany(() => Product, (product) => product)
  products?: Product[];
  
  //One buyer places many products
  @OneToMany(() => Order, (order) => order)
  orders?: Order[];
  
  //One user writes many reviews
  @OneToMany(() => Review, (review) => review)
  reviews?: Review[];

}