import { UserModel } from "../../models/user";

export const UserResource = {
  resource: UserModel,
  options: {
    properties: {
      _id: { isVisible: false },
      refresh_token: { isVisible: false },
      first_name: { position: 1 },
      last_name: { position: 2 },
      email: { position: 3 },
      username: { position: 4 },
      class: { position: 5 },
      setup_finished: { isVisible: false },
      phone: { isVisible: false },
      accent_color: { isVisible: false },
    },
    listProperties: ['first_name', 'last_name', 'email', 'username']
  }
};