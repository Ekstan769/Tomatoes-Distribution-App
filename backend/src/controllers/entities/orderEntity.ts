import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "../entity";
import { Product } from "../entity";
//import { Logistic } from "../entity";
//import { Payment } from "../entity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    orderId!: string;
    
    @Column()
    quantityRequested!: number;

    @Column({ default: "Not Confirmed" })
    logisticStatus?: string;

    @Column({ default: "Not Started" })
    deliveryStatus?: "Not Started" | "In Transit" | "Delivered";

    // Many orders belong to one listing
    @ManyToOne(() => Product, (product) => product.orders)
    @JoinColumn({ name: "productId" })
    product!: Product;

    // Many order belonging to one buyer (User)
    @ManyToOne(() => User, (user) => user.orders)
    buyer!: User;

    @OneToOne(() => Logistics, (logistics) => logistics.order)
    @JoinColumn({ name: "logisticId" })
    logistics!: Logistic;

    // One order can have many payment attempt retrys
    @OneToMany(() => Payment, (payment) => payment.order)
    @JoinColumn({ name: "paymentId" })
    payments!: Payment[];
}