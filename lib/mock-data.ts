export interface Dispenser {
  id: string;
  name: string;
  location: string;
  floor: number;
  soapLevel: number;
  batteryLevel: number;
  status: "ok" | "low" | "critical" | "offline";
  lastRefill: string;
  usageCount: number;
  assignedTo: string[];
}

export interface Event {
  id: string;
  type: "refill" | "critical_alert" | "low_soap" | "low_battery" | "offline" | "unusual_activity" | "refill_confirmed";
  dispenserId: string;
  dispenserName: string;
  timestamp: string;
  details: string;
}

export const MOCK_DISPENSERS: Dispenser[] = [
  {
    id: "disp-1",
    name: "Main Hallway",
    location: "Floor 1, Hallway A",
    floor: 1,
    soapLevel: 85,
    batteryLevel: 92,
    status: "ok",
    lastRefill: "2026-03-24T08:30:00Z",
    usageCount: 142,
    assignedTo: ["maint-1"],
  },
  {
    id: "disp-2",
    name: "Restroom 101",
    location: "Floor 1, Restroom 101",
    floor: 1,
    soapLevel: 25,
    batteryLevel: 45,
    status: "low",
    lastRefill: "2026-03-22T10:15:00Z",
    usageCount: 287,
    assignedTo: ["maint-1"],
  },
  {
    id: "disp-3",
    name: "Cafeteria",
    location: "Floor 1, Cafeteria",
    floor: 1,
    soapLevel: 8,
    batteryLevel: 12,
    status: "critical",
    lastRefill: "2026-03-20T14:45:00Z",
    usageCount: 512,
    assignedTo: ["maint-1"],
  },
  {
    id: "disp-4",
    name: "Second Floor Hallway",
    location: "Floor 2, Hallway B",
    floor: 2,
    soapLevel: 65,
    batteryLevel: 78,
    status: "ok",
    lastRefill: "2026-03-23T09:00:00Z",
    usageCount: 198,
    assignedTo: ["maint-2"],
  },
  {
    id: "disp-5",
    name: "Restroom 201",
    location: "Floor 2, Restroom 201",
    floor: 2,
    soapLevel: 0,
    batteryLevel: 5,
    status: "offline",
    lastRefill: "2026-03-18T11:30:00Z",
    usageCount: 0,
    assignedTo: ["maint-2"],
  },
  {
    id: "disp-6",
    name: "Classroom Wing",
    location: "Floor 2, Classroom Wing",
    floor: 2,
    soapLevel: 72,
    batteryLevel: 88,
    status: "ok",
    lastRefill: "2026-03-24T07:00:00Z",
    usageCount: 156,
    assignedTo: ["maint-2"],
  },
  {
    id: "disp-7",
    name: "Third Floor Hallway",
    location: "Floor 3, Hallway C",
    floor: 3,
    soapLevel: 45,
    batteryLevel: 62,
    status: "ok",
    lastRefill: "2026-03-23T16:20:00Z",
    usageCount: 234,
    assignedTo: ["maint-3"],
  },
  {
    id: "disp-8",
    name: "Admin Office",
    location: "Floor 3, Admin Office",
    floor: 3,
    soapLevel: 92,
    batteryLevel: 95,
    status: "ok",
    lastRefill: "2026-03-24T06:00:00Z",
    usageCount: 67,
    assignedTo: ["maint-3"],
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "evt-1",
    type: "refill",
    dispenserId: "disp-1",
    dispenserName: "Main Hallway",
    timestamp: "2026-03-24T08:30:00Z",
    details: "Soap level refilled from 15% to 95%",
  },
  {
    id: "evt-2",
    type: "critical_alert",
    dispenserId: "disp-3",
    dispenserName: "Cafeteria",
    timestamp: "2026-03-24T10:15:00Z",
    details: "Soap level critical: 8%",
  },
  {
    id: "evt-3",
    type: "low_battery",
    dispenserId: "disp-2",
    dispenserName: "Restroom 101",
    timestamp: "2026-03-24T09:45:00Z",
    details: "Battery level low: 45%",
  },
  {
    id: "evt-4",
    type: "offline",
    dispenserId: "disp-5",
    dispenserName: "Restroom 201",
    timestamp: "2026-03-24T08:00:00Z",
    details: "Device offline for 6+ hours",
  },
  {
    id: "evt-5",
    type: "refill_confirmed",
    dispenserId: "disp-1",
    dispenserName: "Main Hallway",
    timestamp: "2026-03-24T08:35:00Z",
    details: "Refill confirmed by maintenance",
  },
  {
    id: "evt-6",
    type: "low_soap",
    dispenserId: "disp-2",
    dispenserName: "Restroom 101",
    timestamp: "2026-03-24T07:20:00Z",
    details: "Soap level low: 25%",
  },
  {
    id: "evt-7",
    type: "unusual_activity",
    dispenserId: "disp-3",
    dispenserName: "Cafeteria",
    timestamp: "2026-03-24T06:50:00Z",
    details: "Unusual button press frequency detected",
  },
  {
    id: "evt-8",
    type: "refill",
    dispenserId: "disp-4",
    dispenserName: "Second Floor Hallway",
    timestamp: "2026-03-23T09:00:00Z",
    details: "Soap level refilled from 20% to 98%",
  },
];

export function getStatusColor(status: Dispenser["status"]): string {
  switch (status) {
    case "ok":
      return "#10B981"; // Green
    case "low":
      return "#F59E0B"; // Yellow
    case "critical":
      return "#DC2626"; // Red
    case "offline":
      return "#9CA3AF"; // Gray
    default:
      return "#6B7280";
  }
}

export function getStatusLabel(status: Dispenser["status"]): string {
  switch (status) {
    case "ok":
      return "OK";
    case "low":
      return "Low";
    case "critical":
      return "Critical";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
}

export function getEventTypeIcon(type: Event["type"]): string {
  switch (type) {
    case "refill":
      return "🔄";
    case "critical_alert":
      return "🚨";
    case "low_soap":
      return "⚠️";
    case "low_battery":
      return "🔋";
    case "offline":
      return "❌";
    case "unusual_activity":
      return "⚡";
    case "refill_confirmed":
      return "✅";
    default:
      return "📝";
  }
}

export function getEventTypeLabel(type: Event["type"]): string {
  switch (type) {
    case "refill":
      return "Refill";
    case "critical_alert":
      return "Critical Alert";
    case "low_soap":
      return "Low Soap";
    case "low_battery":
      return "Low Battery";
    case "offline":
      return "Offline";
    case "unusual_activity":
      return "Unusual Activity";
    case "refill_confirmed":
      return "Refill Confirmed";
    default:
      return "Event";
  }
}
