export type Permission = 'station:read' | 'circuit:prepare' | 'partner:write' | 'submission:create';
export interface Session {
  userId: string;
  name: string;
  organizationId: string;
  organizationName: string;
  stationIds: string[];
  permissions: Permission[];
  mode: 'demo';
}
export interface Station {
  id: string;
  organizationId: string;
  name: string;
  site: string;
  timezone: string;
  configurationVersion: string;
  profile: 'Fixe' | 'Mobile';
  technicalAvailability: 'unknown';
}
export interface Circuit {
  id: string;
  organizationId: string;
  stationId: string;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  description: string;
  status: 'documentary' | 'prepared';
  version: number;
}
export interface Partner {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  contact: string;
  phone: string | null;
  phoneConfirmed: boolean;
  status: 'À contacter' | 'En échange' | 'À rappeler';
  note: string;
  reminder: string | null;
  version: number;
}
export interface Submission {
  id: string;
  circuitId: string;
  circuitVersion: number;
  title: string;
  status: 'received';
  sentAt: string;
}
export interface Overview {
  stations: Station[];
  circuits: Circuit[];
  partners: Partner[];
  submissions: Submission[];
  availability: { freeSlots: null; reason: string };
}

export const fieldChecklist = [
  'Largeur',
  'Revêtement',
  'Pentes et dévers',
  'Obstacles',
  'Barrières et ponts',
  'Demi-tours',
  'Croisements',
  'Dangers',
  'Échappatoires',
  'Retour',
  'Compatibilité',
] as const;

export interface FieldEvidence {
  circuitId: string;
  circuitVersion: number;
  stationId: string;
  site: string;
  configurationVersion: string;
  testerId: string;
  testedAt: string;
  completeRoundTrip: boolean;
  traceHasGaps: boolean;
  traceReference: string;
  photoReferences: string[];
  conditions: string;
  checklist: Record<string, boolean>;
}

// Local validation concerns this exact station/site/version only. It never authorizes launch.
export function assessLocalEvidence(
  circuit: Circuit,
  station: Station,
  evidence: FieldEvidence,
): string[] {
  const errors: string[] = [];
  if (evidence.circuitId !== circuit.id || evidence.circuitVersion !== circuit.version)
    errors.push('Version du circuit différente.');
  if (
    circuit.organizationId !== station.organizationId ||
    circuit.stationId !== station.id ||
    evidence.stationId !== station.id ||
    evidence.site !== station.site ||
    evidence.configurationVersion !== station.configurationVersion
  )
    errors.push('Périmètre station/site/configuration différent.');
  if (!evidence.testerId.trim() || !Number.isFinite(Date.parse(evidence.testedAt)))
    errors.push('Testeur et date requis.');
  if (!evidence.completeRoundTrip || evidence.traceHasGaps || !evidence.traceReference.trim())
    errors.push('Trace aller-retour intégrale requise.');
  if (fieldChecklist.some((item) => evidence.checklist[item] !== true))
    errors.push('Checklist incomplète.');
  if (
    !evidence.photoReferences.length ||
    evidence.photoReferences.some((ref) => !ref.trim()) ||
    !evidence.conditions.trim()
  )
    errors.push('Photos et conditions de validité requises.');
  return errors;
}
