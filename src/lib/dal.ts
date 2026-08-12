import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionPayload, getSessionToken } from "@/lib/session";

export const verifySession = cache(async () => {
  const session = await getSessionPayload();

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, role: session.role };
});

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

export const getUser = cache(async () => {
  await verifySession();
  const token = await getSessionToken();

  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`Error al obtener el usuario (${response.status})`);
      return null;
    }

const data = (await response.json()) as { user: CurrentUser };
    return data.user;
  } catch (error) {
    console.error("Error al obtener el usuario: ", error);
    return null;
  }
});