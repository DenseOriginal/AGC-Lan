import AdminJS, { AdminJSOptions } from "adminjs"
import mongooseAdminBro from "@adminjs/mongoose";
import expressAdminBro from "@adminjs/express";
import { UserResource } from "./users";
import { LanResource } from "./lan";
import { Router } from "express";
import { requestGuardIsStaff } from "../../config/guards";
import { LanUserResource } from "./lan-user";
import { EventResource } from "./event";
import { TournamentResource } from "./tournament";

AdminJS.registerAdapter(mongooseAdminBro);
const AdminBroOptions: AdminJSOptions = {
  resources: [
    UserResource,
    LanResource,
    LanUserResource,
    EventResource,
    TournamentResource
  ],
  rootPath: '/staff',
  logoutPath: '/logout',
  branding: {
    companyName: 'Staff - AG Lan',
    withMadeWithLove: true, // Just because why not
    favicon: '/favicon/favicon.ico',
    logo: ''
  },
  pages: {
    ticketScan: {
      component: AdminJS.bundle('../../../views/admin-bro/scan-ticket/index'),
    }
  },
  dashboard: {
    // The import needs to be outside of src to prevent typescript from compiling it
    // And fucking with the export type.
    // Before: export default Dashboard;
    // After: exports.default = Dashboard;
    // AdminBro doesn't like this new syntax, so it dies...
    component: AdminJS.bundle('../../../views/admin-bro/custom-dashboard')
  }
}

const adminBro = new AdminJS(AdminBroOptions);
const preRouter = Router(); // Create a router that the adminBro router should be based on
preRouter.use(requestGuardIsStaff); // Protext the dashboard with isStaff guard
preRouter.use((req, res, next) => {
  // AdminBro uses req.session.adminUser to authenticate a user
  // So we can set the session.adminUser to our own req.user
  (req.session as any).adminUser = req.user;

  // Then call next to progress the request
  next();
});

const router = expressAdminBro.buildRouter(adminBro, preRouter);

// Function so that all the setup stuff happens in here, the app type is Express
// But typescript is dumb, and doesn't recognize that type
// So just use any. I should propably figure out why?
export function setupAdminBro(app: any) {
  app.use(adminBro.options.rootPath, router);
}