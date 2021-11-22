import { ResourceWithOptions } from "admin-bro";
import { EventModel } from "../../models/event";
import { isAdmin, isSuperAdmin, isStaff } from "./guards";

export const EventResource: ResourceWithOptions = {
  resource: EventModel,
  options: {
    properties: {
      title: { isTitle: true },
      _id: { isId: true, isVisible: { show: true, list: false, filter: false, edit: false } },
      description: { isVisible: { show: true, list: false, filter: false, edit: true } },
      created_at: { isVisible: { show: true, list: false, filter: true, edit: false } }
    },
    actions: {
      list: { isAccessible: isStaff },
      show: { isAccessible: isStaff },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isAdmin },
      delete: { isAccessible: isAdmin },
      bulkDelete: { isAccessible: isSuperAdmin },
      search: { isAccessible: isStaff }
    },
    navigation: {
      name: "Database",
    }
  }
}
