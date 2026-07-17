//EXPECTED STRUCTURE PLS CHANGE APPROPRIATELY
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany,
  OneToOne
} from 'typeorm';
import { Product } from '../entity';
import { Wallet } from '../entity';
import { Order } from '../';
import { Review } from '../';


@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  user_id: string;

  @Column()
  role: "Farmer" | "Buyer";

  @Column()
  business_name: string;

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

}