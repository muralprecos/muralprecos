import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROLES, hasRole } from "@/lib/authorization/roles";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!hasRole(session.roles, ROLES.ADMIN)) {
    redirect("/unauthorized");
  }

  return children;
}
