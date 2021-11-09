import AdminBro, { AdminBroOptions } from "admin-bro"
import mongooseAdminBro from "@admin-bro/mongoose";
import expressAdminBro from "@admin-bro/express";
import { UserModel } from "../../models/user";
import { LanModel } from "../../models/lan";
import { UserResource } from "./users";
import { LanResource } from "./lan";

AdminBro.registerAdapter(mongooseAdminBro);
const AdminBroOptions: AdminBroOptions = {
  resources: [
    UserResource,
    LanResource
  ],
  rootPath: '/staff'
}

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminBro.buildRouter(adminBro)

// Function so that all the setup stuff happens in here, the app type is Express
// But typescript is dumb, and doesn't recognize that type
// So just use any. I should propably figure out why?
export function setupAdminBro(app: any) {
  app.use(adminBro.options.rootPath, router)
}