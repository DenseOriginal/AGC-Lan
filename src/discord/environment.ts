interface EnvironmentVars {
  guildId: string;
  verifiedRoleId: string;
  staffRoleId: string;
  adminRoleId: string;
  superAdminRoleId: string;
}; 

const devEnvironment: EnvironmentVars = {
  guildId: "778709596163407895",
  verifiedRoleId: "911571420302180372",
  staffRoleId: "911716242929356800",
  adminRoleId: "911716338655957022",
  superAdminRoleId: "911716410160459776",
};

const prodEnvironment: EnvironmentVars = {
  guildId: "243374306501984256",
  verifiedRoleId: "",
  staffRoleId: "243374978907504641",
  adminRoleId: "683420225894613139",
  superAdminRoleId: "252739867082096640",
}

export const environment = process.env.NODE_ENV === "production" ? prodEnvironment : devEnvironment;