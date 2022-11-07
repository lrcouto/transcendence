import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelMember {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
  
  @Column({
    nullable: false,
    default: false,
  })
  muted: boolean;
}
