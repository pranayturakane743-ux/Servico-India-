export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconName?: string;
  basePrice: number;
  image?: string;
  avatar?: string;
  color?: string;
  technician?: TechnicianProfile;
}

export interface TechnicianProfile {
  name: string;
  experience: string;
  rating: number;
  jobsCompleted: number;
  certifications: string[];
  activeZone?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export type WizardStep = 'DETAILS' | 'OTP' | 'PAYMENT' | 'TRACKING' | 'INVOICE';

export interface BookingDetails {
  bookingId?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  amount: number;
  hours?: number;
}
