interface EnvironmentVars {
  clientId: string;
  guildId: string;
  verifiedRoleId: string;
  staffRoleId: string;
  adminRoleId: string;
  superAdminRoleId: string;
  everyoneRoleId: string;
}; 

const devEnvironment: EnvironmentVars = {
  clientId: "808050665527967805",
  guildId: "778709596163407895",
  verifiedRoleId: "911571420302180372",
  staffRoleId: "911716242929356800",
  adminRoleId: "911716338655957022",
  superAdminRoleId: "911716410160459776",
  everyoneRoleId: "778709596163407895",
};

const prodEnvironment: EnvironmentVars = {
  clientId: "905507754830098442",
  guildId: "243374306501984256",
  verifiedRoleId: "916296303426801664",
  staffRoleId: "243374978907504641",
  adminRoleId: "683420225894613139",
  superAdminRoleId: "252739867082096640",
  everyoneRoleId: "243374306501984256",
}

export const environment = process.env.NODE_ENV === "production" ? prodEnvironment : devEnvironment;