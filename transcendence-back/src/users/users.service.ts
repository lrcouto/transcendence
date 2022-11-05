import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dto/users.dtos';
import { ChannelMember, User } from 'src/entity';
import { Repository, Not } from 'typeorm';
import { MatchHistoryService } from 'src/match-history/match-history.service';
import { Intra42UserData } from 'src/auth/strategies/intra42.strategy';
import { channelType } from 'src/entity/channel-type.entity';
import { ChannelTypeService } from 'src/channels/channel-type.service';
import { status } from 'src/entity/user.entity';

export class matchInfos {
  opponent: string;
  userScore: number;
  opponentScore: number;
  isWinner: boolean;
}

type channelInfo = {
  id: number;
  name: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly matchHistoryService: MatchHistoryService,
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
    private readonly channeTypeService: ChannelTypeService,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  findUser(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findUserOrFail(id: string) {
    return this.userRepository.findOneByOrFail({ id });
  }

  findUserByName(name: string) {
    return this.userRepository.findOneBy({ username: name });
  }

  private async checkUser(id: string) {
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserProfile(id: string) {
    const { username, rating, status, image_url } = await this.findUser(id);

    const profile = {
      name: username,
      image_url: image_url,
      status: status,
      rating: rating,
      matchHistory: await this.matchHistoryService.buildMatchHistory(id),
    };

    return profile;
  }

  findUserByExternalId(external_id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ external_id });
    return user;
  }

  async validate(intra42User: Intra42UserData) {
    const user = await this.findUserByExternalId(intra42User.external_id);
    if (user) return user;
    return this.create(intra42User);
  }

  create(userInfo: Intra42UserData): Promise<User> {
    const newUser: User = this.userRepository.create({
      username: userInfo.username,
      email: userInfo.email,
      external_id: userInfo.external_id,
      image_url: userInfo.image_url,
      rating: 0,
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, userDto: UpdateUserDto) {
    const user = await this.checkUser(id);
    user.update(userDto);
    this.userRepository.save(user);
  }

  async getUserChannelsInfos(userId: string) {
    const directMessageType = await this.channeTypeService.getChannelType(
      channelType.DIRECT_MESSAGES,
    );
    const channelsInfos = await this.channelMemberRepository.find({
      relations: {
        channel: true,
        user: true,
      },
      where: {
        user: { id: userId },
        channel: { type: { id: Not(directMessageType.id) } },
      },
    });
    return channelsInfos;
  }

  async getChannels(id: string) {
    await this.checkUser(id);
    const channelsInfos = await this.getUserChannelsInfos(id);

    const channels: Array<channelInfo> = [];

    channelsInfos.map((element) => {
      const channel = {} as channelInfo;

      channel.id = element.channel.id;
      channel.name = element.channel.name;
      channels.push(channel);
    });
    return channels;
  }

  private async setStatus(id: string, status: status) {
    const user = await this.checkUser(id);
    user.status = status;
    this.userRepository.save(user);
  }

  setStatusOnline(id: string) {
    this.setStatus(id, status.ONLINE);
  }

  setStatusOffline(id: string) {
    this.setStatus(id, status.OFFLINE);
  }

  async getStatus(id: string) {
    const user = await this.findUser(id);
    return user.status;
  }

  async setSecret(id: string, secret: string) {
    const user = await this.checkUser(id);
    user.secret = secret;
    this.userRepository.save(user);
  }

  async enableTwoFactorAuth(id: string) {
    const user = await this.checkUser(id);
    user.hasTwoFactorAuth = true;
    this.userRepository.save(user);
  }
}
