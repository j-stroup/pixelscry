import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { DATABASE_URL } from '$env/static/private';

const adapter = new PrismaLibSql({ url: DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
