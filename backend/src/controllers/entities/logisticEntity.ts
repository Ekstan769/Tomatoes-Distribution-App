import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './userEntity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  owner!: User;
}
