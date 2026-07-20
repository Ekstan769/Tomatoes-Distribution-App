import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Product } from '../entity';
import { User } from '../entity'; // Imported to link the author correctly

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Explicit foreign key column for easier querying
  @Column({ type: 'uuid' })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  // Explicit foreign key column for the reviewer
  @Column({ type: 'uuid' })
  authorId!: string;

  // Replaced the flat userName string with a proper relationship mapping
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author!: User; 

  // Restricting the float down to standard 1-5 integers or matching scale
  @Column({ type: 'int' }) 
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date; // Changed from optional to definite
}