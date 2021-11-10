import { ActionContext, IsFunction } from "admin-bro";
import { roles } from "../../config/passport";

// Admin bro guards

export const denyGuard = () => false;

export const isSuperAdmin = ({ currentAdmin }: ActionContext) => {
  return currentAdmin && (roles[(currentAdmin.role as string)] > 2);
}

export const isAdmin = ({ currentAdmin }: ActionContext) => {
  return currentAdmin && (roles[(currentAdmin.role as string)] > 1);
}

export const isStaff = ({ currentAdmin }: ActionContext) => {
  return currentAdmin && (roles[(currentAdmin.role as string)] > 0);
}

export const notYourself = ({ currentAdmin, record }: ActionContext) => {
  return currentAdmin?._id != record?.params._id;
}

export const userIsNotSuperAdmin = ({ record }: ActionContext) => {
  return !record?.params.is_superadmin;
}

export const multiple = (...fns: IsFunction[]): IsFunction => {
  return (context: ActionContext) => fns.every(fn => fn(context));
}

export const or = (...fns: IsFunction[]): IsFunction => {
  return (context: ActionContext) => fns.some(fn => fn(context));
}