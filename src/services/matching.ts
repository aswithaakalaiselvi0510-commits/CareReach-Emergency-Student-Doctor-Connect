import { DoctorProfile, EmergencyRequest } from '../types';

export interface DoctorMatchScore {
  doctor: DoctorProfile;
  totalScore: number;
  distanceKm: number;
  scoreBreakdown: {
    availabilityScore: number; // Max 40
    proximityScore: number;    // Max 30
    specializationScore: number; // Max 15
    responseTimeScore: number; // Max 15
  };
  explanation: string;
}

// Haversine formula to compute great-circle distance between two coordinates in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
}

/**
 * Transparent Ranking Formula:
 * Total Score (100) =
 *   Availability Weight (40): AVAILABLE = 40, BUSY = 15, OFFLINE = 0
 * + Proximity Weight (30): Max 30 points for <= 1 km, decays smoothly to 0 at 15 km
 * + Specialization Relevance (15): Matches reported symptoms
 * + Response Time Factor (15): Under 5 min = 15 pts, 10 min = 10 pts, etc.
 */
export function calculateDoctorMatchScore(
  doctor: DoctorProfile,
  request: Partial<EmergencyRequest>,
  studentCoords: { lat: number; lng: number }
): DoctorMatchScore {
  const distanceKm = calculateDistanceKm(
    studentCoords.lat,
    studentCoords.lng,
    doctor.coordinates.lat,
    doctor.coordinates.lng
  );

  // 1. Availability (40 pts)
  let availabilityScore = 0;
  if (doctor.verificationStatus === 'VERIFIED') {
    if (doctor.status === 'AVAILABLE') {
      availabilityScore = 40;
    } else if (doctor.status === 'BUSY') {
      availabilityScore = 15;
    } else {
      availabilityScore = 0;
    }
  }

  // 2. Proximity (30 pts)
  // 1km or less gets 30, 5km gets ~20, 10km gets ~10, >15km gets min 2
  let proximityScore = Math.max(0, Math.round(30 - distanceKm * 2));
  if (distanceKm <= 1.0) proximityScore = 30;

  // 3. Specialization Relevance (15 pts)
  let specializationScore = 8; // baseline for general medicine / urgent care
  const spec = doctor.specialization.toLowerCase();
  const symptoms = (request.symptoms || []).map((s) => s.toLowerCase());
  const desc = (request.description || '').toLowerCase();

  if (spec.includes('general') || spec.includes('family') || spec.includes('urgent')) {
    specializationScore = 13;
  }
  if (symptoms.some((s) => s.includes('stomach') || s.includes('vomit')) && (spec.includes('gastro') || spec.includes('internal'))) {
    specializationScore = 15;
  }
  if (symptoms.some((s) => s.includes('cold') || s.includes('fever') || s.includes('cough')) && (spec.includes('internal') || spec.includes('general'))) {
    specializationScore = 15;
  }
  if (symptoms.some((s) => s.includes('injury') || s.includes('sprain') || s.includes('pain')) && (spec.includes('ortho') || spec.includes('sports') || spec.includes('urgent'))) {
    specializationScore = 15;
  }
  if (spec.includes('pediatric') || spec.includes('adolescent')) {
    specializationScore = 14;
  }

  // 4. Response Time Factor (15 pts)
  let responseTimeScore = 5;
  if (doctor.estimatedResponseTimeMinutes <= 3) {
    responseTimeScore = 15;
  } else if (doctor.estimatedResponseTimeMinutes <= 5) {
    responseTimeScore = 12;
  } else if (doctor.estimatedResponseTimeMinutes <= 10) {
    responseTimeScore = 8;
  }

  const totalScore = Math.min(100, availabilityScore + proximityScore + specializationScore + responseTimeScore);

  let explanation = '';
  if (doctor.status === 'AVAILABLE') {
    explanation = `${doctor.name} is online now (${distanceKm} km away) with an estimated ~${doctor.estimatedResponseTimeMinutes} min response time.`;
  } else if (doctor.status === 'BUSY') {
    explanation = `${doctor.name} is currently in another consultation (${distanceKm} km away).`;
  } else {
    explanation = `${doctor.name} is currently offline.`;
  }

  return {
    doctor,
    totalScore,
    distanceKm,
    scoreBreakdown: {
      availabilityScore,
      proximityScore,
      specializationScore,
      responseTimeScore,
    },
    explanation,
  };
}

export function rankDoctors(
  doctors: DoctorProfile[],
  request: Partial<EmergencyRequest>,
  studentCoords: { lat: number; lng: number }
): DoctorMatchScore[] {
  return doctors
    .map((doc) => calculateDoctorMatchScore(doc, request, studentCoords))
    .sort((a, b) => b.totalScore - a.totalScore);
}
