import { environment } from "../environment";

export const allowStaff = { id: environment.staffRoleId, type: 1, permission: true };
export const allowAdmin = { id: environment.adminRoleId, type: 1, permission: true };
export const allowSuperAdmin = { id: environment.superAdminRoleId, type: 1, permission: true };