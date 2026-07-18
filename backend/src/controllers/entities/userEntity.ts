//EXPECTED STRUCTURE PLS CHANGE APPROPRIATELY
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
  OneToOne
} from 'typeorm';
import "reflect-metaData"
import { Product } from '../entity';
import { Wallet } from '../entity';
<<<<<<< HEAD
import { Order } from '../';
import { Review } from '../';

=======
//import { Order } from '../entity';
import { Review } from '../entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  BUYER = 'BUYER',
  FARMER = 'FARMER'
}
>>>>>>> upstream/main

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
<<<<<<< HEAD
  user_id: string;

  @Column()
  role: "Farmer" | "Buyer";
=======
  userId!: string;

  @Column({type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  businessName?: string;

  @Column({type: 'varchar'})
  userName!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: true })
  phoneNumber!: string;
  

  @Column({ type: 'varchar', nullable: true })
  securityQuestion?: string;

 
  @Column({ type: 'varchar', nullable: true })
  securityAnswer?: string;
>>>>>>> upstream/main

  @Column()
  business_name: string;

<<<<<<< HEAD
  @Column()
  name: string;
  
  @Column()
  phone: string;
  
  @Column()
  pasword_hash: string;

  @Column()
  location: string;

  // Farmer- only payout fields - nullable for Buyer
  @Column({ nullable: true })
  account_number: string;
  
  @Column({ nullable: true })
  account_name: string;
  
  @Column({ nullable: true })
  bank_name?: string;

  //One farmer creates many products
  @OneToMany(() => Product, (product) => product.farmer)
  products: Product[];
  
  //One buyer places many products
  @OneToMany(() => Order, (order) => order.buyer)
  orders: Order[];
  
  //One user writes many reviews
  @OneToMany(() => Review, (review) => review.author)
  reviews: Review[];
=======
  @Column({ type: 'varchar', nullable: true })
  location?: string[];
  
  @Column({ type: 'varchar',nullable: true })
  address?: string;

  @Column({ type: 'varchar', nullable: true })
  email?: string;
  
  @Column({type: 'varchar', nullable: true })
  profilePic?: string;
  
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet?: Wallet;


  // Farmer- only payout fields - nullable for Buyer
  @Column({ type: 'varchar',nullable: true })
  accountNumber?: string;
  
  @Column({ type: 'varchar',nullable: true })
  accountName?: string;
  
  @Column({ type: 'varchar', nullable: true })
  bankName?: string;
  
  

  //One farmer creates many products
  @OneToMany(() => Product, (product) => product)
  products?: Product[];
  
  //One buyer places many products
  //@OneToMany(() => Order, (order) => order)
  //orders?: Order[];
  
  //One user writes many reviews
  @OneToMany(() => Review, (review) => review)
  reviews?: Review[];
>>>>>>> upstream/main

}