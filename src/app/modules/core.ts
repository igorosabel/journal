import { Provider } from '@angular/core';
import ApiBaseService from '@services/api-base.service';
import ApiEntryService from '@services/api-entry.service';
import ApiTagService from '@services/api-tag.service';
import ApiUsersService from '@services/api-users.service';
import ApiService from '@services/api.service';
import AuthService from '@services/auth.service';
import ClassMapperService from '@services/class-mapper.service';
import NavigationService from '@services/navigation.service';
import UserService from '@services/user.service';

export default function provideCore(): Provider[] {
  return [
    ApiBaseService,
    ApiEntryService,
    ApiTagService,
    ApiUsersService,
    ApiService,
    AuthService,
    ClassMapperService,
    NavigationService,
    UserService,
  ];
}
