import { db } from "@/lib/db";

export async function companyAccess(userId: string, companyId: string, management = false) {
  const member = await db.companyMember.findUnique({ where: { companyId_userId: { companyId, userId } } });
  return Boolean(member && (!management || member.role === "OWNER" || member.role === "ADMIN"));
}

export async function channelAccess(userId: string, channelId: string) {
  return Boolean(await db.chatParticipant.findUnique({ where: { channelId_userId: { channelId, userId } } }));
}

export async function vaultAccess(userId: string, projectId: string, write = false) {
  const project = await db.vaultProject.findUnique({ where: { id: projectId }, select: { ownerId: true, companyId: true } });
  if (!project) return false;
  if (project.ownerId === userId) return true;
  if (!project.companyId) return false;
  return companyAccess(userId, project.companyId, write);
}
