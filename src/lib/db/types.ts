import type { ImageSourcePropType } from "react-native";

export type City = "Kandahar" | "Kabul";
export type ServiceType = "shared" | "vip";
export type PaymentMethod = "hesabpay" | "cash";

export type TripStatus =
  | "scheduled"
  | "boarding"
  | "on-road"
  | "full"
  | "needs-driver"
  | "draft"
  | "completed";

export type DriverStatus = "on-road" | "trip-today" | "free" | "rest";
export type BookingStatus = "new" | "confirmed" | "cancelled" | "completed";

export type DriverReview = {
  author: string;
  initials: string;
  rating: number;
  text: string;
  route: string;
  ago: string;
};

export type Driver = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  tripsThisMonth: number;
  totalTrips: number;
  base: City;
  status: DriverStatus;
  statusNote: string;
  phone: string;
  vehicleModel: string;
  plate: string;
  photo?: ImageSourcePropType;
  permitEndsInDays?: number;
  joinedLabel: string;
  homeTerminal: string;
  emergencyContact: string;
  vehicleColor?: string;
  nextServiceKm?: number;
  motValid?: string;
  reviewCount?: number;
  online?: boolean;
  review?: DriverReview;
  reviews?: DriverReview[];
};

export type SeatStatus = "available" | "paid" | "due" | "walk-in" | "driver";

export type Seat = {
  /** "01" … "04" */
  id: string;
  status: SeatStatus;
  occupant?: string;
  price: number;
  legroom?: boolean;
  note?: string;
};

export type Trip = {
  id: string;
  code: string;
  from: City;
  to: City;
  /** ISO date, e.g. 2026-11-19 */
  date: string;
  dateLabel: string;
  departTime: string;
  departPeriod: "AM" | "PM";
  arriveTime: string;
  arrivePeriod: "AM" | "PM";
  duration: string;
  distanceKm: number;
  service: ServiceType;
  price: number;
  seatsTotal: number;
  seatsBooked: number;
  driverId?: string;
  vehiclePlate: string;
  status: TripStatus;
  boardingPoint: string;
  dropOffPoint: string;
  /** 0–100, only for trips on the road */
  progress?: number;
  locationLabel?: string;
  etaLabel?: string;
  dispatchNote?: string;
  reportTime?: string;
  gate?: string;
};

export type Booking = {
  id: string;
  code: string;
  tripId: string;
  passengerName: string;
  initials: string;
  phone: string;
  seats: string[];
  people: number;
  luggage?: string;
  pickup?: string;
  amount: number;
  payment: PaymentMethod;
  paymentStatus: "paid" | "unpaid";
  status: BookingStatus;
  createdAtLabel: string;
  reference?: string;
  thirdTrip?: boolean;
  kids?: string;
  note?: string;
};

export type OwnerStats = {
  monthLabel: string;
  revenue: number;
  driverPay: number;
  trips: number;
  seatsSold: number;
  seatsCapacity: number;
  carsFullPct: number;
  cancelled: number;
  cancelledPct: number;
  weekly: { label: string; value: number }[];
  byService: { label: string; value: number; pct: number }[];
  byPayment: { label: string; value: number; pct: number }[];
  byDirection: { label: string; value: number; pct: number }[];
  topDrivers: { driverId: string; value: number }[];
};

export type DriverStats = {
  monthLabel: string;
  earned: number;
  trips: number;
  paid: number;
  nextPayoutDate: string;
  passengers: number;
  km: number;
  hours: number;
  rating: number;
  onTimePct: number;
  weekly: { label: string; value: number }[];
  byDirection: { label: string; value: number }[];
  byService: { label: string; value: number }[];
  payouts: { id: string; label: string; meta: string; amount: number }[];
  lifetimeTrips: number;
  lifetimeKm: number;
};

export type PassengerProfile = {
  name: string;
  initials: string;
  phone: string;
  email: string;
  trips: number;
  savedPassengers: number;
  joinedLabel: string;
};
