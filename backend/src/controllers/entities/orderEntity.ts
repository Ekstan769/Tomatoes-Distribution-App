import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToOne, 
  OneToMany, 
  JoinColumn 
} from "typeorm";
import { User, Product, Logistics } from "../entity"; // Assuming these are correctly exported from your entity index
import { Payment } from "../entity"; // Adjust import path as necessary

export enum DeliveryStatus {
  NOT_STARTED = "Not Started",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered"
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn("uuid")
  orderId!: string;
  
  @Column({ type: 'int' })
  quantityRequested!: number;

  @Column({ type: 'varchar', default: "Not Confirmed" })
  logisticStatus!: string;

  @Column({ 
    type: 'enum', 
    enum: DeliveryStatus, 
    default: DeliveryStatus.NOT_STARTED 
  })
  deliveryStatus!: DeliveryStatus;

  // FOREIGN KEY COLUMNS


  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'uuid' })
  buyerId!: string;

  @Column({ type: 'uuid', nullable: true })
  logisticsId?: string;


  // RELATIONSHIPS

  // Many orders belong to one listing
  @ManyToOne(() => Product, (product) => product.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "productId" })
  product!: Product;

  // Many orders belong to one buyer (User)
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "buyerId" })
  buyer!: User;

  // One order is tied to one logistics tracking entry
  @OneToOne(() => Logistics, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: "logisticsId" })
  logistics?: Logistics;

  // One order can have many payment attempts (Removed invalid @JoinColumn)
  @OneToMany(() => Payment, (payment) => payment.order)
  payments?: Payment[];
}