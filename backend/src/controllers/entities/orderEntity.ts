import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./userEntity";
import { Product } from "./productEntity";
import { Logistic } from "./logisticEntity";
import { Payment } from "./paymentEntity";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    order_id: string;
    
    @Column()
    quantity_requested: number;

    @Column({ default: "Not Confirmed" })
    logistics_status: string;

    @Column({ default: "Not Started" })
    delivery_status: "Not Started" | "In Transit" | "Delivered";

    // Many orders belong to one listing
    @ManyToOne(() => Product, (product) => product.orders)
    @JoinColumn({ name: "product_id" })
    product: Product;

    // Many order belonging to one buyer (User)
    @ManyToOne(() => User, (user) => user.orders)
    buyer: User;

    @OneToOne(() => Logistic, (logistic) => logistic.order)
    logistic: Logistic;

    // One order can have many payment attempt retrys
    @OneToMany(() => Payment, (payment) => payment.order)
    payments: Payment[];
}