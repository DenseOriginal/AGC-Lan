import { ResourceWithOptions } from "adminjs";
import { LanUserModel } from "../../models/lan-user";
import { isAdmin } from "./guards";

export const LanUserResource: ResourceWithOptions = {
  resource: LanUserModel,
  options: {
    properties: {
      _id: { isTitle: true }
    },
    actions: {
      list: { isAccessible: false },
      show: { isAccessible: isAdmin },
      new: { isAccessible: false },
      edit: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
      search: { isAccessible: false }
    },
  }
}
