export type FormStatus = 'Draft' | 'Pending' | 'FinanceApproved' | 'Approved' | 'Rejected';

export type UserRole = 'submitter' | 'finance_approver' | 'final_approver';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  department?: string;
}

export interface Flight {
  id: string;
  date: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  flightNo: string;
  priorityPass: boolean;
  windowSeat: boolean;
}

export interface HotelBooking {
  id: string;
  dateIn: string;
  dateOut: string;
  location: string;
  hotelName: string;
  boardBasis: string;
  estimatedCost: string;
}

export interface CarHire {
  id: string;
  pickupDate: string;
  dropoffDate: string;
  location: string;
}

export interface ShuttleService {
  id: string;
  pickupDate: string;
  shuttleCompany: string;
  pickupAddress: string;
  dropoffAddress: string;
  mobileNumber: string;
}

export interface DailyAllowances {
  international: {
    nightsAway: number | '';
    amount: number | '';
  };
  local: {
    nightsAway: number | '';
    stAmount: number | '';
  };
}

export interface ApprovalRecord {
  approverName: string;
  approverId: string;
  date: string;
  stage: 'finance' | 'final';
  comment?: string;
}

export interface RejectionRecord {
  rejectedBy: string;
  rejectedById: string;
  date: string;
  stage: 'finance' | 'final';
  comment: string;
}

export interface TravelForm {
  id: string;
  tripNo: string;
  applicantId: string;
  applicantName: string;
  travelFromDate: string;
  travelToDate: string;
  purpose: string;
  costCode: string;
  flights: Flight[];
  hotels: HotelBooking[];
  carHires: CarHire[];
  shuttles: ShuttleService[];
  dailyAllowances: DailyAllowances;
  status: FormStatus;
  approvals: ApprovalRecord[];
  rejection?: RejectionRecord;
  createdAt: string;
  updatedAt: string;
}
