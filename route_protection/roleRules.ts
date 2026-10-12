const routeRoles: Record<string, string> = {
  super_admin: "super-admin",
  school_admin: "school-admin",
  branch_admin: "branch-admin",
  student: "student",
  teacher: "teacher",
  parent: "parent",
  cashier: "cashier",
  librarian: "librarian",
  janitor: "janitor",
  gate_security: "gate-security",
  lab_assistant: "lab-assistant",
  guest: "guest",
};

const roleHomes: Record<string, string> = Object.fromEntries(
  Object.entries(routeRoles).map(([path, role]) => [role, `/${path}`]),
);

export function normalizeRole(role: string) {
  const normalized = role.trim().toLowerCase().replace(/[_\s]+/g, "-");
  const aliases: Record<string, string> = {
    superadmin: "super-admin",
    schooladmin: "school-admin",
    branchadmin: "branch-admin",
    gatesecurity: "gate-security",
    labassistant: "lab-assistant",
  };
  return aliases[normalized] ?? normalized;
}

export function getRoleHomePath(role: string) {
  return roleHomes[normalizeRole(role)] ?? null;
}

export function requiredRoleForPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return segment ? routeRoles[segment] : undefined;
}

export function isPublicPath(pathname: string) {
  return pathname === "/" || pathname === "/auth" || pathname.startsWith("/auth/");
}
