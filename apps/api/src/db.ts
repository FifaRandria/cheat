import { PrismaClient, type Prisma } from "@prisma/client";

export const db = new PrismaClient();

/** Les colonnes Json de Prisma attendent un type indexé ; nos objets sont du JSON valide. */
export const asJson = (value: unknown) => value as Prisma.InputJsonValue;
