export type Pack = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  depositPercent: number;
  duration: number;
  capacity: number;
  items: string[];
  featured?: boolean;
  tone: "silver" | "gold" | "red";
};

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus = "unpaid" | "deposit_paid" | "paid" | "refunded";

export type Reservation = {
  id: string;
  code: string;
  createdAt: string;
  date: string;
  time: string;
  packId: string;
  packName: string;
  people: number;
  extras: string[];
  customerName: string;
  phone: string;
  email: string;
  notes: string;
  total: number;
  deposit: number;
  balance: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
};

export type DemoSettings = {
  openTime: string;
  closeTime: string;
  slotMinutes: number;
  bufferMinutes: number;
  address: string;
  instagram: string;
};

export type DemoDatabase = {
  version: 1;
  packs: Pack[];
  reservations: Reservation[];
  settings: DemoSettings;
};

export const STORAGE_KEY = "clubofflimits:demo:v1";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const afterTomorrow = new Date(today);
afterTomorrow.setDate(today.getDate() + 2);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const seedDatabase: DemoDatabase = {
  version: 1,
  packs: [
    {
      id: "plata",
      name: "Plata",
      eyebrow: "Sacale punta al caos",
      description: "El primer golpe. Ideal para probar la experiencia completa sin guardarte nada.",
      price: 35000,
      depositPercent: 30,
      duration: 50,
      capacity: 2,
      tone: "silver",
      items: ["Sala de gritos", "Dardos + box", "4 platos", "4 botellas", "Equipo de protección"],
    },
    {
      id: "oro",
      name: "Oro",
      eyebrow: "Mandale mecha",
      description: "Más tiempo, más objetos y la pared lista para que dejes tu marca.",
      price: 58000,
      depositPercent: 30,
      duration: 60,
      capacity: 3,
      tone: "gold",
      featured: true,
      items: ["Todo el circuito", "Sala de pintura", "6 platos", "8 botellas", "Video de la sesión"],
    },
    {
      id: "platino",
      name: "Platino",
      eyebrow: "La locura al máximo",
      description: "El ritual completo con un electrónico esperando el golpe final.",
      price: 102500,
      depositPercent: 30,
      duration: 75,
      capacity: 4,
      tone: "red",
      items: ["Todo el circuito", "Sala de pintura", "12 botellas", "TV o impresora", "Foto + video editado"],
    },
  ],
  reservations: [
    {
      id: "demo-1",
      code: "COL-X7K2",
      createdAt: new Date().toISOString(),
      date: isoDate(tomorrow),
      time: "17:15",
      packId: "oro",
      packName: "Oro",
      people: 2,
      extras: ["10 botellas extra"],
      customerName: "Camila R.",
      phone: "351 555-0142",
      email: "camila@example.com",
      notes: "Cumpleaños sorpresa",
      total: 68000,
      deposit: 20400,
      balance: 47600,
      status: "confirmed",
      paymentStatus: "deposit_paid",
    },
    {
      id: "demo-2",
      code: "COL-P9M4",
      createdAt: new Date().toISOString(),
      date: isoDate(afterTomorrow),
      time: "19:45",
      packId: "platino",
      packName: "Platino",
      people: 4,
      extras: [],
      customerName: "Equipo Norte",
      phone: "351 555-0880",
      email: "equipo@example.com",
      notes: "After office",
      total: 102500,
      deposit: 30750,
      balance: 71750,
      status: "pending",
      paymentStatus: "unpaid",
    },
  ],
  settings: {
    openTime: "16:00",
    closeTime: "22:00",
    slotMinutes: 60,
    bufferMinutes: 15,
    address: "Libertad 1556 · General Paz · Córdoba",
    instagram: "@clubofflimits",
  },
};

export function loadDatabase(): DemoDatabase {
  if (typeof window === "undefined") return seedDatabase;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedDatabase));
      return seedDatabase;
    }
    const parsed = JSON.parse(raw) as DemoDatabase;
    return parsed.version === 1 ? parsed : seedDatabase;
  } catch {
    return seedDatabase;
  }
}

export function saveDatabase(database: DemoDatabase) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  window.dispatchEvent(new Event("clubofflimits:updated"));
}

export function resetDatabase() {
  saveDatabase(structuredClone(seedDatabase));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function createCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `COL-${suffix}`;
}

export const timeSlots = ["16:00", "17:15", "18:30", "19:45", "21:00"];

export const extrasCatalog = [
  { id: "botellas", label: "10 botellas extra", description: "Más vidrio para extender la etapa de destrucción.", price: 10000 },
  { id: "impresora", label: "Impresora para destruir", description: "Un equipo completo preparado para destrozar con mazo.", price: 22000 },
  { id: "video", label: "Video editado vertical", description: "Un clip en formato reel, listo para compartir después de la sesión.", price: 8000 },
];
