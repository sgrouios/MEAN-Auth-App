import { Tokens } from "src/app/models/tokens";
import { UserProfile } from "src/app/models/user-profile";

export class TestStubs {
    static tokens: Tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-id',
          name: 'name',
          username: 'username',
          email: 'email'
        }
      }

      static userProfile: UserProfile = {
        id: 'userId',
        name: 'name',
        email: 'email',
        username: 'username',
        profileInformation: 'info',
        profileImage: 'image'
      }
}