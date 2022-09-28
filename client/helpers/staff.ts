export function isStaff(user: User): boolean {
  return user && (user.role == 'STAFF' || user.role == 'ADMIN' || user.role == 'SUPERADMIN');
}