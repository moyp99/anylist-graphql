//TODO: implement enum as Graphql enum type

import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'allowed roles',
});
