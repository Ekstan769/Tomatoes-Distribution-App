import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./orderEntity";

@Entity()
export class Logistic {
    @PrimaryGeneratedColumn("uuid")
    batch_id: string;

    @Column()
    origin: string;

    @Column()
    destination: string;

    @Column()
    packaging_type: string;

    @Column()
    transport_mode: string;

    @Column()
    hours_since_harvest_at_dispatch: number;

    @Column()
    estimated_transit_time_hours: number;

    // Prediction fields - nullable until the FastAPI call returns
    @Column({ type: "float", nullable: true })
    spoilage_probability?: number;

    @Column({ nullable: true })
    predicted_spoilage_status?: 0 | 1;

    @Column({ nullable: true })
    risk_level: "Low" | "Medium" | "High";

    @Column({ nullable: true })
    recommended_action?: string;

    @OneToOne(() => Order, (order) => order.Logistic)
    @JoinColumn({ name: "order_id" })
    order: Order;
}