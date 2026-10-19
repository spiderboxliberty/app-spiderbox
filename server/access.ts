import type { Permission, Session } from '../src/domain';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function requirePermission(session: Session | undefined, permission: Permission): Session {
  if (!session) throw new ApiError(401, 'Session requise.');
  if (!session.permissions.includes(permission)) throw new ApiError(403, 'Action non autorisée.');
  return session;
}

// Return the same response for an unknown ID and an ID outside the user's scope.
export function scopedResource<T extends { organizationId: string; stationId?: string }>(
  session: Session,
  resource: T | undefined,
): T {
  if (
    !resource ||
    resource.organizationId !== session.organizationId ||
    (resource.stationId && !session.stationIds.includes(resource.stationId))
  ) {
    throw new ApiError(404, 'Ressource introuvable.');
  }
  return resource;
}

export function checkVersion(actual: number, expected: number) {
  if (actual !== expected)
    throw new ApiError(409, 'Les données ont changé. Rechargez avant de réessayer.');
}
