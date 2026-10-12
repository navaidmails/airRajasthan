import { TrackingResult, TrackingShipment } from "./types";

export interface ITrackingProvider {
  name: string;
  isMock: boolean;
  trackShipment(reference: string): Promise<TrackingResult>;
}

export class MockTrackingProvider implements ITrackingProvider {
  name = "AirRajasthan Demo Tracking Engine";
  isMock = true;

  private sampleShipments: Record<string, TrackingShipment> = {
    "AR-7842-DEL": {
      trackingNumber: "AR-7842-DEL",
      origin: "JAI - Jaipur International Airport",
      destination: "DXB - Dubai International Airport",
      flightNumber: "AR-881 Cargo",
      aircraftType: "Boeing 737-800BCF",
      pieces: 18,
      weight: 1250,
      weightUnit: "KG",
      status: "IN_TRANSIT",
      statusLabel: "In Flight (Cruising Corridor)",
      commodity: "Handicrafts & Precious Artifacts",
      estimatedDelivery: "2026-10-12 18:30 UTC",
      isDemo: true,
      milestones: [
        {
          stage: "Booking Confirmed",
          location: "Jaipur OCC Hub",
          timestamp: "2026-10-11 14:00 IST",
          status: "COMPLETED",
          description: "Airway bill generated, space allocation reserved on AR-881.",
        },
        {
          stage: "Cargo Received at Airside Shed",
          location: "JAI Terminal 1 Cargo Gate",
          timestamp: "2026-10-11 21:15 IST",
          status: "COMPLETED",
          description: "Weighing and ULD pallet consolidation completed.",
        },
        {
          stage: "Customs & Security Screened",
          location: "JAI Customs Air Cargo Wing",
          timestamp: "2026-10-12 04:30 IST",
          status: "COMPLETED",
          description: "X-ray screening clear; export clearance stamped.",
        },
        {
          stage: "Loaded onto Freighter",
          location: "JAI Apron Bay 7",
          timestamp: "2026-10-12 08:45 IST",
          status: "COMPLETED",
          description: "Main deck pallets secured by loadmaster.",
        },
        {
          stage: "In Flight",
          location: "En Route to DXB",
          timestamp: "2026-10-12 10:20 IST",
          status: "CURRENT",
          description: "Departed JAI on schedule. Flight time remaining: 1h 45m.",
        },
        {
          stage: "Scheduled Arrival & Ramp Transfer",
          location: "DXB Cargo Mega Terminal",
          timestamp: "Expected 2026-10-12 13:45 GST",
          status: "UPCOMING",
          description: "Break-bulk handling and consignee notification.",
        },
      ],
    },
    "AR-9104-JAI": {
      trackingNumber: "AR-9104-JAI",
      origin: "BOM - Chhatrapati Shivaji Maharaj Mumbai",
      destination: "JAI - Jaipur Cargo Terminal",
      flightNumber: "AR-402 Feeder",
      aircraftType: "Road Feeder Service (RFS)",
      pieces: 42,
      weight: 3400,
      weightUnit: "KG",
      status: "DELIVERED",
      statusLabel: "Consignment Delivered",
      commodity: "Textile Machinery Spares",
      estimatedDelivery: "2026-10-10 16:00 IST",
      isDemo: true,
      milestones: [
        {
          stage: "Booking Issued",
          location: "Mumbai Gateway",
          timestamp: "2026-10-09 10:00 IST",
          status: "COMPLETED",
          description: "Consolidated bonded RFS manifest logged.",
        },
        {
          stage: "Departed Origin Terminal",
          location: "BOM Air Cargo Facility",
          timestamp: "2026-10-09 17:30 IST",
          status: "COMPLETED",
          description: "Transit seal applied; dispatched via bonded corridor.",
        },
        {
          stage: "Arrived at Destination Hub",
          location: "JAI Sanganer Cargo Terminal",
          timestamp: "2026-10-10 11:15 IST",
          status: "COMPLETED",
          description: "Ramp reception verified, seals intact.",
        },
        {
          stage: "Delivered to Consignee",
          location: "Jaipur Industrial Zone",
          timestamp: "2026-10-10 15:45 IST",
          status: "COMPLETED",
          description: "Proof of delivery signed by consignee representative.",
        },
      ],
    },
    "AR-3321-BOM": {
      trackingNumber: "AR-3321-BOM",
      origin: "JAI - Jaipur Cargo Complex",
      destination: "LHR - London Heathrow Terminal 4",
      flightNumber: "AR-920 Direct",
      aircraftType: "Wide-body Charter Feeder",
      pieces: 6,
      weight: 890,
      weightUnit: "KG",
      status: "CUSTOMS_CLEARED",
      statusLabel: "Customs Cleared • Awaiting Ramp Staging",
      commodity: "Pharmaceuticals (+2°C to +8°C Active Cool)",
      estimatedDelivery: "2026-10-13 14:00 GMT",
      isDemo: true,
      milestones: [
        {
          stage: "Temperature Controlled Reception",
          location: "JAI Cold Storage Vault",
          timestamp: "2026-10-12 06:00 IST",
          status: "COMPLETED",
          description: "Temp logged at +4.2°C. Envirotainer active power check passed.",
        },
        {
          stage: "Customs Regulatory Clearance",
          location: "JAI Pharma Air Cargo Desk",
          timestamp: "2026-10-12 09:30 IST",
          status: "CURRENT",
          description: "Export drug controller paperwork verified; ramp release authorized.",
        },
        {
          stage: "Tarmac Loading",
          location: "JAI Flight Line",
          timestamp: "Expected 2026-10-12 16:00 IST",
          status: "UPCOMING",
          description: "Pre-cooled apron tug transfer directly to cargo hold.",
        },
      ],
    },
  };

  async trackShipment(reference: string): Promise<TrackingResult> {
    const cleanRef = reference.trim().toUpperCase();
    const shipment = this.sampleShipments[cleanRef];

    if (!shipment) {
      return {
        found: false,
        message: "No demo shipment found for this airway bill reference. Please try sample references: AR-7842-DEL, AR-9104-JAI, or AR-3321-BOM.",
      };
    }

    return {
      found: true,
      shipment,
    };
  }
}

export class TrackingService {
  private static provider: ITrackingProvider = new MockTrackingProvider();

  static setProvider(newProvider: ITrackingProvider) {
    this.provider = newProvider;
  }

  static async track(reference: string): Promise<TrackingResult> {
    if (!reference || reference.trim().length === 0) {
      return {
        found: false,
        message: "Please enter a valid Airway Bill or Consignment reference number.",
      };
    }
    return await this.provider.trackShipment(reference);
  }

  static getSampleReferences(): string[] {
    return ["AR-7842-DEL", "AR-9104-JAI", "AR-3321-BOM"];
  }
}
