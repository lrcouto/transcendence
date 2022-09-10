import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from 'src/entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

type friendInfo = {
  username: string;
  status: string;
  rating: number;
};

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friedshipRepository: Repository<Friendship>,
    private readonly usersService: UsersService,
  ) {}

  findOneFriendship(userId: string, friendId: string): Promise<Friendship> {
    return this.friedshipRepository.findOne({
      relations: {
        user: true,
        friend: true,
      },
      where: {
        user: { id: userId },
        friend: { id: friendId },
      },
    });
  }

  findAllFriends(userId: string): Promise<Friendship[]> {
    return this.friedshipRepository.find({
      relations: {
        user: true,
        friend: true,
      },
      where: [{ user: { id: userId } }],
    });
  }

  async checkUserAndFriend(userId: string, friendId: string) {
    const user = await this.usersService.findUser(userId);
    const friend = await this.usersService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
  }

  async addFriend(userId: string, friendId: string) {
    const user = await this.usersService.findUser(userId);
    const friend = await this.usersService.findUser(friendId);
    if (!friend || !user) {
      throw new NotFoundException();
    }
    let friendship = await this.findOneFriendship(userId, friendId);
    if (friendship) {
      return;
    }
    friendship = this.friedshipRepository.create({
      user: user,
      friend: friend,
    });
    return this.friedshipRepository.save(friendship);
  }

  async deleteFriend(userId: string, friendId: string) {
    await this.checkUserAndFriend(userId, friendId);
    const friendship = await this.findOneFriendship(userId, friendId);
    if (!friendship) {
      throw new NotFoundException();
    }
    this.friedshipRepository.delete(friendship.id);
  }

  async getFriends(userId: string) {
    const friendshipList: Awaited<Promise<Friendship[]>> =
      await this.findAllFriends(userId);
    const friends: Array<friendInfo> = [];

    friendshipList.map((friendship) => {
      const friend = {} as friendInfo;

      friend.username = friendship.friend.username;
      friend.status = friendship.friend.status;
      friend.rating = friendship.friend.rating;
      friends.push(friend);
    });

    return friends;
  }
}
