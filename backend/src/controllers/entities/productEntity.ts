import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Review, Order, User } from '../entity';
import { Origin, Destination, PackagingType, TransportMode, StorageType, DamageLevel } from './logisticEntity'; // Adjust paths as needed

export enum Ripeness {
  UNRIPE = 'UNRIPE',
  RIPE = 'RIPE',
  OVER_RIPE = 'OVER_RIPE'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId!: string; // Redundant explicit index removed

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedSpoilageTime?: Date; // Corrected camelCase consistency

  @Column({ type: 'jsonb', nullable: true })
  preservationMethods?: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  distance!: number; // Decimal is safer for GPS/sorting calculations than float

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating!: number; // Changed from optional to definite with a default value

  @Column({ type: 'boolean', default: false })
  isProtected!: boolean;

  
  // FARMER FORM FIELDS
  
  
  @Column({ type: 'date' })
  harvestDate!: string; // e.g., '2026-07-20'

  @Column({ type: 'time' })
  harvestTime!: string; // e.g., '13:00:00'

  @Column({ type: 'enum', enum: Origin })
  originState!: Origin;

  @Column({ type: 'enum', enum: Destination })
  destinationMarket!: Destination;

  @Column({ type: 'int' })
  quantitySentCrates!: number;

  @Column({ type: 'enum', enum: PackagingType })
  packagingType!: PackagingType;

  @Column({ type: 'enum', enum: TransportMode })
  transportMode!: TransportMode;

  @Column({ type: 'boolean', default: false })
  coldStorageAvailable!: boolean;

  @Column({ type: 'enum', enum: StorageType, nullable: true })
  storageType?: StorageType;

  @Column({ type: 'enum', enum: Ripeness, default: Ripeness.RIPE })
  ripenessLevel!: Ripeness;

  @Column({ type: 'enum', enum: DamageLevel, default: DamageLevel.NONE })
  initialDamageLevel!: DamageLevel;

  
  // RELATIONSHIPS

  // Connects the product back to the farmer who created it
  @Column({ type: 'uuid' })
  farmerId!: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'farmerId' })
  farmer!: User;

  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @OneToMany(() => Order, (order) => order.product) // Pointed to inverse field
  orders?: Order[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}