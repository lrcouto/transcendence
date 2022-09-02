import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from 'src/entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friedshipRepository: Repository<Friendship>,
    private readonly userService: UsersService,
  ) {}

  async addFriend(userId: string, friendId: string) {
    const user = await this.userService.findUser(userId);
    const friend = await this.userService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
    console.log('implementação');
  }
  
  async executeFriendshipQuery(userId: string) : Promise<Friendship[]> {
    
    const friendships = await this.friedshipRepository.find({
      relations: {
        user: true,
        friend: true,
      },
      where: [
        { user: { id: userId } }
      ]
    });
    
    return friendships;
  }
  
  async getFriends(userId: string) {

    const friendships: Awaited<Promise<Friendship[]>> = await this.executeFriendshipQuery(userId); 
    
    let friends: Array<string> = [];
    
    friendships.map( (friendship) => {
      friends.push(friendship.friend.username);
    })
    
    return friends;
  }
}
