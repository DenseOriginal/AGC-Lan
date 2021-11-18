import { ResourceWithOptions } from "admin-bro";
import { LanModel } from "../../models/lan";
import { denyGuard, isAdmin, isStaff, isSuperAdmin } from "./guards";

export const LanResource: ResourceWithOptions = {
  resource: LanModel,
  options: {
    properties: {
      name: { isTitle: true },
      _id: { isVisible: { show: true, list: false, filter: false, edit: false } },
      description: { isVisible: { show: true, list: false, filter: false, edit: true } },
      start: { isVisible: { filter: false } },
      end: { isVisible: { filter: false } },
      created_at: { isVisible: { show: true, list: false, filter: false, edit: false } },
      last_updated: { isVisible: { show: true, list: false, filter: false, edit: false } },
      cover_url: { isVisible: { show: true, list: false, filter: false, edit: true } },
      users: { isVisible: { show: true, list: true, filter: false, edit: false } },
      seats: { isArray: true, isVisible: { show: true, list: false, filter: false, edit: true } }
    },
    actions: {
      list: { isAccessible: isStaff }, // Makes sure the person viewing this is an admin
      show: { isAccessible: isStaff }, // Makes sure the person viewing this is an admin
      new: { isAccessible: isSuperAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isSuperAdmin },
      bulkDelete: { isAccessible: denyGuard },
      search: { isAccessible: isStaff }
    },
    navigation: {
       name: "Database",
    }
  }
};