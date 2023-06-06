import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SEED_USERS } from './data/seed-data';
import { SEED_ITEMS } from './data/seed-data';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('ENVIRONMENT') === 'prod';
  }

  async executeSeed() {
    if (this.isProd)
      throw new UnauthorizedException("DANGER, you can't run SEED on PROD");
    //clean db
    await this.deleteDBTables();

    //create user
    const user = await this.loadUsers();

    //create items
    await this.loadItems(user);

    return true;
  }

  async deleteDBTables() {
    //delete items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //delete users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    // const user = await this.usersRepository.findOne({
    //   where: {
    //     isActive: true,
    //   },
    // });

    // for (const item of SEED_ITEMS) {
    //   await this.itemsService.create(item, user);
    // }

    const itemsPromise = [];
    for (const item of SEED_ITEMS) {
      itemsPromise.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromise);
  }
}
