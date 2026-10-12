export interface TrackingMilestone {
  stage: string;
  location: string;
  timestamp: string;
  status: "COMPLETED" | "CURRENT" | "UPCOMING";
  description: string;
}

export interface TrackingShipment {
  trackingNumber: string;
  origin: string;
  destination: string;
  flightNumber?: string;
  aircraftType?: string;
  pieces: number;
  weight: number;
  weightUnit: string;
  status: "BOOKED" | "RECEIVED" | "CUSTOMS_CLEARED" | "IN_TRANSIT" | "ARRIVED" | "DELIVERED";
  statusLabel: string;
  estimatedDelivery?: string;
  commodity: string;
  milestones: TrackingMilestone[];
  isDemo: true;
}

export interface TrackingResult {
  found: boolean;
  shipment?: TrackingShipment;
  message?: string;
}
