import fs from 'fs';
import path from 'path';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  role: 'user' | 'admin';
  dob?: string;
  gender?: string;
  familyMembers: Array<{
    id: string;
    name: string;
    relation: string;
    age: number;
    gender: string;
    phone?: string;
  }>;
  createdAt: string;
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
  status: 'Pending' | 'Confirmed' | 'Sample Collected' | 'Testing' | 'Report Ready' | 'Completed' | 'Cancelled';
  reportData?: {
    generatedAt: string;
    sampleCollectedAt?: string;
    technicianName?: string;
    pathologistName?: string;
    notes?: string;
    results: Array<{
      parameter: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: 'normal' | 'high' | 'low';
    }>;
  };
  createdAt: string;
}

export interface IDatabase {
  users: IUser[];
  tests: ITest[];
  bookings: IBooking[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

export const initialTests: ITest[] = [
  {
    _id: 'test-1',
    name: 'Complete Blood Count (CBC)',
    description: 'Comprehensive evaluation of red blood cells, white blood cells, platelets, and hemoglobin to assess general health, detect infections, and diagnose anemia.',
    category: 'Blood Tests',
    price: 399,
    sampleType: 'Blood (EDTA Whole Blood)',
    reportTime: '6 Hours',
    preparation: 'No fasting required. Maintain normal hydration before sample collection.',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', referenceRange: '13.0 - 17.0' },
      { name: 'Total Leukocyte Count (WBC)', unit: 'cells/mcL', referenceRange: '4,000 - 11,000' },
      { name: 'Platelet Count', unit: 'lakh/mcL', referenceRange: '1.50 - 4.50' },
      { name: 'RBC Count', unit: 'million/mcL', referenceRange: '4.5 - 5.9' },
      { name: 'Packed Cell Volume (PCV)', unit: '%', referenceRange: '40.0 - 50.0' },
      { name: 'Mean Corpuscular Volume (MCV)', unit: 'fL', referenceRange: '80 - 100' },
      { name: 'Neutrophils', unit: '%', referenceRange: '40 - 75' },
      { name: 'Lymphocytes', unit: '%', referenceRange: '20 - 45' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-2',
    name: 'Thyroid Profile (Total T3, Total T4, TSH)',
    description: 'Gold-standard screening for thyroid gland activity and metabolism regulation. Diagnoses hypothyroidism and hyperthyroidism.',
    category: 'Thyroid',
    price: 499,
    sampleType: 'Blood (Serum)',
    reportTime: '12 Hours',
    preparation: 'Overnight fasting (8-10 hours) is recommended. Take thyroid medication after giving the sample unless instructed otherwise.',
    parameters: [
      { name: 'Total Triiodothyronine (T3)', unit: 'ng/dL', referenceRange: '60 - 200' },
      { name: 'Total Thyroxine (T4)', unit: 'mcg/dL', referenceRange: '4.5 - 12.0' },
      { name: 'Thyroid Stimulating Hormone (TSH)', unit: 'uIU/mL', referenceRange: '0.4 - 4.2' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-3',
    name: 'HbA1c (Glycosylated Hemoglobin)',
    description: 'Measures your average blood sugar level over the past 2 to 3 months. Essential for diabetes diagnosis, management, and treatment monitoring.',
    category: 'Diabetes',
    price: 450,
    sampleType: 'Blood (EDTA Whole Blood)',
    reportTime: '8 Hours',
    preparation: 'No fasting required. Can be taken at any time of the day.',
    parameters: [
      { name: 'HbA1c Level', unit: '%', referenceRange: '< 5.7 (Normal), 5.7 - 6.4 (Prediabetic), >= 6.5 (Diabetic)' },
      { name: 'Estimated Average Glucose (eAG)', unit: 'mg/dL', referenceRange: '90 - 120' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-4',
    name: 'Liver Function Test (LFT)',
    description: 'Assesses liver enzyme levels, protein synthesis, and bilirubin clearance to detect liver damage, hepatitis, fatty liver, or gallstones.',
    category: 'Liver',
    price: 699,
    sampleType: 'Blood (Serum)',
    reportTime: '12 Hours',
    preparation: 'Overnight fasting of 10-12 hours is recommended. Avoid alcohol for 24 hours prior to testing.',
    parameters: [
      { name: 'Bilirubin Total', unit: 'mg/dL', referenceRange: '0.2 - 1.2' },
      { name: 'Bilirubin Direct', unit: 'mg/dL', referenceRange: '0.0 - 0.3' },
      { name: 'SGOT / AST', unit: 'U/L', referenceRange: '10 - 40' },
      { name: 'SGPT / ALT', unit: 'U/L', referenceRange: '7 - 56' },
      { name: 'Alkaline Phosphatase (ALP)', unit: 'U/L', referenceRange: '44 - 147' },
      { name: 'Total Protein', unit: 'g/dL', referenceRange: '6.4 - 8.3' },
      { name: 'Serum Albumin', unit: 'g/dL', referenceRange: '3.5 - 5.0' },
      { name: 'A/G Ratio', unit: '', referenceRange: '1.2 - 2.2' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-5',
    name: 'Kidney Function Test (KFT / RFT)',
    description: 'Monitors renal health by evaluating urea, creatinine, uric acid, and electrolytes to assess filtration capacity.',
    category: 'Kidney',
    price: 650,
    sampleType: 'Blood (Serum)',
    reportTime: '12 Hours',
    preparation: 'Fasting of 8-10 hours is preferred. Drink adequate water.',
    parameters: [
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', referenceRange: '7 - 20' },
      { name: 'Serum Creatinine', unit: 'mg/dL', referenceRange: '0.6 - 1.2' },
      { name: 'Uric Acid', unit: 'mg/dL', referenceRange: '3.5 - 7.2' },
      { name: 'Estimated GFR', unit: 'mL/min/1.73m2', referenceRange: '> 90' },
      { name: 'Serum Calcium', unit: 'mg/dL', referenceRange: '8.5 - 10.2' },
      { name: 'Serum Phosphorus', unit: 'mg/dL', referenceRange: '2.5 - 4.5' }
    ],
    available: true,
    featured: false,
    popular: true
  },
  {
    _id: 'test-6',
    name: 'Lipid Profile (Cholesterol & Triglycerides)',
    description: 'Comprehensive cardiovascular risk profile assessing good cholesterol (HDL), bad cholesterol (LDL), VLDL, and triglycerides.',
    category: 'Blood Tests',
    price: 550,
    sampleType: 'Blood (Serum)',
    reportTime: '12 Hours',
    preparation: 'Mandatory 10-12 hours overnight fasting. Only plain water is permitted.',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '< 200 (Desirable)' },
      { name: 'HDL Cholesterol (Good)', unit: 'mg/dL', referenceRange: '> 50' },
      { name: 'LDL Cholesterol (Bad)', unit: 'mg/dL', referenceRange: '< 100' },
      { name: 'Triglycerides', unit: 'mg/dL', referenceRange: '< 150' },
      { name: 'VLDL Cholesterol', unit: 'mg/dL', referenceRange: '5 - 30' },
      { name: 'TC / HDL Ratio', unit: '', referenceRange: '3.3 - 4.4' }
    ],
    available: true,
    featured: false,
    popular: true
  },
  {
    _id: 'test-7',
    name: 'Vitamin D (25-Hydroxy)',
    description: 'Crucial test for bone density, calcium absorption, muscle recovery, immune defense, and general energy levels.',
    category: 'Vitamins',
    price: 799,
    sampleType: 'Blood (Serum)',
    reportTime: '24 Hours',
    preparation: 'No fasting required. Avoid high-dose vitamin supplements 24 hours prior to blood draw.',
    parameters: [
      { name: '25-Hydroxy Vitamin D', unit: 'ng/mL', referenceRange: '30.0 - 100.0 (Sufficient), 20 - 30 (Insufficient), < 20 (Deficient)' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-8',
    name: 'Vitamin B12 (Cobalamin)',
    description: 'Evaluates nerve health, red blood cell manufacturing, brain function, and unexplained fatigue or numbness.',
    category: 'Vitamins',
    price: 699,
    sampleType: 'Blood (Serum)',
    reportTime: '24 Hours',
    preparation: 'Fasting of 8-10 hours recommended for optimum accuracy.',
    parameters: [
      { name: 'Vitamin B12', unit: 'pg/mL', referenceRange: '211 - 911' }
    ],
    available: true,
    featured: false,
    popular: false
  },
  {
    _id: 'test-9',
    name: 'Full Body Comprehensive Health Checkup',
    description: 'Our most comprehensive diagnostic package featuring 75+ vital parameters: CBC, Diabetes (HbA1c & Glucose), Lipid Profile, Liver Function, Kidney Function, Thyroid Profile, and Urine Routine.',
    category: 'Full Body Checkups',
    price: 1499,
    sampleType: 'Blood & Urine',
    reportTime: '24 Hours',
    preparation: 'Strict 10-12 hours overnight fasting required. First morning urine sample preferred.',
    parameters: [
      { name: 'Complete Blood Count (24 parameters)', unit: 'Panels', referenceRange: 'Standard Normal' },
      { name: 'Fasting Blood Glucose', unit: 'mg/dL', referenceRange: '70 - 100' },
      { name: 'HbA1c', unit: '%', referenceRange: '< 5.7' },
      { name: 'Complete Lipid Profile (8 parameters)', unit: 'Panels', referenceRange: 'Optimal' },
      { name: 'Liver Function Test (11 parameters)', unit: 'Panels', referenceRange: 'Normal' },
      { name: 'Kidney Function Test (9 parameters)', unit: 'Panels', referenceRange: 'Normal' },
      { name: 'Thyroid Profile (T3, T4, TSH)', unit: 'Panels', referenceRange: 'Normal' },
      { name: 'Urine Routine Examination (15 parameters)', unit: 'Panels', referenceRange: 'Clear / Negative' }
    ],
    available: true,
    featured: true,
    popular: true
  },
  {
    _id: 'test-10',
    name: 'Hormone Profile - Testosterone Total',
    description: 'Evaluates male vitality, muscle mass, reproductive function, and hormonal balance.',
    category: 'Hormones',
    price: 599,
    sampleType: 'Blood (Serum)',
    reportTime: '24 Hours',
    preparation: 'Morning sample (between 7:00 AM and 10:00 AM) is recommended when testosterone levels are highest.',
    parameters: [
      { name: 'Testosterone Total', unit: 'ng/dL', referenceRange: '240 - 870' }
    ],
    available: true,
    featured: false,
    popular: false
  }
];

class DatabaseStore {
  private db: IDatabase;

  constructor() {
    this.db = this.loadData();
  }

  private loadData(): IDatabase {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.tests && parsed.users && parsed.bookings) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed reading database file, resetting to initial state', err);
      }
    }

    const initial: IDatabase = {
      users: [],
      tests: initialTests,
      bookings: []
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: IDatabase): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed saving database file', err);
    }
  }

  public getDatabase(): IDatabase {
    return this.db;
  }

  public persist(): void {
    this.saveData(this.db);
  }
}

export const dbStore = new DatabaseStore();
