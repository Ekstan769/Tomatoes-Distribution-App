import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { User, Order } from "../entity"; 

export enum Destination {
  LAGOS = 'Lagos',
  IBADAN = 'Ibadan',
  PORT_HARCOURT = 'Port Harcourt',
  ONITSHA = 'Onitsha'
}

export enum PackagingType {
  SACK = 'Sack',
  RAFFIA_BASKET = 'Raffia Basket',
  PLASTIC_CRATE = 'Plastic crate',
  WOODEN_CRATE = 'Wooden crate'
}

export enum Origin {
  KANO = 'Kano',
  KADUNA = 'Kaduna',
  GOMBE = 'Gombe',
  PLATEAU = 'Plateau'
}

export enum Season {
  DRY = "Dry Season",
  RAINY = "Rainy Season"
}

export enum TransportMode {
  COVERED_TRUCK = "Covered Truck",
  COLD_VAN = "Refrigerated Reefer Van",
  OPEN_TRUCK = "Traditional Open Truck"
}

export enum StorageType {
  COLD = "Cold Storage",
  FALSE = "No Storage",
  OPEN = "Open Storage",
  SHED = "Shaded Storage"
}

export enum DamageLevel {
  LOW = "Low",
  MODERATE = "Moderate",
  NONE = "None",
  SEVERE = "Severe"
}

@Entity('logistics')
export class Logistics {
  @PrimaryGeneratedColumn('uuid')
  logisticId!: string;

  @Column({ type: 'enum', enum: Origin })
  originState!: Origin;

  @Column({ type: 'enum', enum: Destination })
  destinationCity!: Destination;

  @Column({ type: 'enum', enum: PackagingType })
  packagingType!: PackagingType;

  @Column({ type: 'enum', enum: Season })
  season!: Season;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  routeDistanceKm!: number;

  @Column({ type: 'enum', enum: TransportMode })
  transportMode!: TransportMode;

  @Column({ type: 'int' })
  quantitySentCrates!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hoursSinceHarvestAtDispatch!: number;

  @Column({ type: 'boolean', default: false })
  coldStorageAvailable!: boolean;

  @Column({ type: 'enum', enum: StorageType, nullable: true })
  storageType!: StorageType;

  @Column({ type: 'enum', enum: DamageLevel, default: DamageLevel.NONE })
  damageLevel!: DamageLevel;

  @Column({ type: 'varchar' })
  plateNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  driverName?: string;

  @Column({ type: 'varchar', nullable: true })
  driverPhoneNumber?: string;

 
  // FOREIGN KEY COLUMNS
 

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string;

 
  // RELATIONSHIPS
 

  // Tracks which user (operator/driver/farmer) registered this delivery log
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  // link back to the Order entity
  @OneToOne(() => Order, (order) => order.logistics, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}