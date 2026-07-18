import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index,
  OneToMany
} from 'typeorm';
import { Review } from './reviewEntity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Index({ unique: true }) // Efficient indexed ordering
  productId!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'timestamp' })
  spoilageTime?: Date; // Used as expiration time

  @Column({ type: 'jsonb', nullable: true })
  preservationMethods?: string[];

  @Column({ type: 'float', default: 0 })
  distance!: number; // Storing as float for simple sorting

  @Column({ type: 'float', default: 0 })
  rating?: number; // Average rating

  @Column({ type: 'boolean', default: false })
  isProtected!: boolean; // Whether review logic is protected

  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
