import { ResourceWithOptions } from "admin-bro";
import { TournamentModel } from "../../models/tournament";
import { isAdmin, isSuperAdmin, isStaff } from "./guards";

export const TournamentResource: ResourceWithOptions = {
  resource: TournamentModel,
  options: {
    properties: {
      title: { isTitle: true },
      _id: { isId: true, isVisible: { show: true, list: false, filter: false, edit: false } },
      description: { isVisible: { show: true, list: false, filter: false, edit: true } },
      created_at: { isVisible: { show: true, list: false, filter: true, edit: false } },
      public: { isVisible: true },
      users: { isVisible: { show: true, list: true, filter: false, edit: false } },
      lan: { isVisible: { show: true, list: true, filter: true, edit: false } },
      teamSize: { isVisible: true },
      show_calendar: { isVisible: true },
    },
    listProperties: ["title", "public", "users", "lan"],
    actions: {
      list: { isAccessible: isStaff },
      show: { isAccessible: isStaff },
      new: { isAccessible: isAdmin },
      edit: { isAccessible: isStaff },
      delete: { isAccessible: isAdmin },
      bulkDelete: { isAccessible: isSuperAdmin },
      search: { isAccessible: isStaff }
    },
    navigation: {
      name: "Database",
    }
  }
}
