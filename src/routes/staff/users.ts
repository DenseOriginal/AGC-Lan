import { ResourceWithOptions } from "admin-bro";
import { UserModel } from "../../models/user";
import { denyGuard, isSuperAdmin, multiple, notYourself, userIsNotSuperAdmin } from "./guards";

export const UserResource: ResourceWithOptions = {
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
      picture_url: { isVisible: { filter: false } },
      discord_id: { isVisible: { filter: false } },
      last_login: { isVisible: { edit: false } },
      date_joined: { isVisible: { edit: false } },
    },
    listProperties: ['first_name', 'last_name', 'email', 'username'],
    actions: {
      list: { isAccessible: isSuperAdmin }, // This makes sure only superadmins can see this
      show: { isAccessible: multiple(isSuperAdmin, notYourself) }, // This makes sure only superadmins can see this
      edit: { isAccessible: multiple(isSuperAdmin, notYourself, userIsNotSuperAdmin) },
      delete: { isAccessible: multiple(isSuperAdmin, notYourself) },
      bulkDelete: { isAccessible: denyGuard },
      search: { isAccessible: multiple(isSuperAdmin, notYourself) },
      new: { isAccessible: denyGuard },
    },
    navigation: {
       name: "Database",
    }
  }
};