import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Order } from "../entity"; // Adjusted to match your shared standard path structure

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum PaymentMethod {
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  USSD = "USSD",
  WALLET = "WALLET"
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  paymentId!: string;

  // Using decimal for exact monetary handling without floating-point issues
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CARD })
  paymentMethod!: PaymentMethod;


  // Stores reference IDs from Stripe for webhooks and tracking
  @Column({ type: 'varchar', nullable: true, unique: true })
  stripePaymentIntentId?: string;

  // Stores the complete, raw gateway metadata or webhook event payload for auditing logs
  @Column({ type: 'jsonb', nullable: true })
  gatewayMetadata?: Record<string, any>;
 
  @Column({ type: 'uuid' })
  orderId!: string;

 
  // RELATIONSHIPS
  

  // Ties this transaction attempt directly back to the target order
  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "orderId" })
  order!: Order;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}