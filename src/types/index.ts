export interface IFamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  gender: string;
  phone?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'user' | 'admin';
  dob?: string;
  gender?: string;
  familyMembers: IFamilyMember[];
  createdAt: string;
  bookingCount?: number;
  lastBookingDate?: string | null;
  totalSpent?: number;
}

export interface ITestParameter {
  name: string;
  unit?: string;
  referenceRange?: string;
}

export interface ITest {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  sampleType: string;
  reportTime: string;
  preparation: string;
  parameters: Array<string | ITestParameter>;
  available: boolean;
  featured?: boolean;
  popular?: boolean;
}

export interface IReportResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
}

export interface IReportData {
  generatedAt: string;
  sampleCollectedAt?: string;
  technicianName?: string;
  pathologistName?: string;
  notes?: string;
  results: IReportResult[];
}

export type BookingStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Sample Collected'
  | 'Testing'
  | 'Report Ready'
  | 'Completed'
  | 'Cancelled';

export interface IBooking {
  _id: string;
  bookingId: string;
  userId: string;
  testId: string;
  testName: string;
  patientDetails: {
    type: 'self' | 'family';
    name: string;
    age: number;
    gender: string;
    phone: string;
    relation?: string;
  };
  collectionMethod: 'home' | 'lab';
  address?: {
    street: string;
    city: string;
    pincode: string;
  };
  date: string;
  timeSlot: string;
  price: number;
  status: BookingStatus;
  reportData?: IReportData;
  createdAt: string;
}

export interface IAdminStats {
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}
