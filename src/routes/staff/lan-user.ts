import { ResourceWithOptions } from "admin-bro";
import { LanUserModel } from "../../models/lan-user";
import { denyGuard } from "./guards";

export const LanUserResource: ResourceWithOptions = {
  resource: LanUserModel,
  options: {
    actions: {
      list: { isAccessible: false },
      show: { isAccessible: false },
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
      search: { isAccessible: false }
    },
  }
}
