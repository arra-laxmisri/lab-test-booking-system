import bcrypt from 'bcryptjs';
import { dbStore, initialTests } from './db.js';

export async function seedDatabase() {
  const db = dbStore.getDatabase();

  // Seed tests if missing
  if (!db.tests || db.tests.length === 0) {
    db.tests = [...initialTests];
  }

  // Seed users if empty
  if (!db.users || db.users.length === 0) {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('User@123', 10);

    const adminUser = {
      _id: 'usr-admin-01',
      name: 'Dr. MediLab Admin',
      email: 'admin@medilab.com',
      phone: '9876543210',
      password: adminPassword,
      address: 'MediLab Central Tower, Healthcare Boulevard',
      role: 'admin' as const,
      dob: '1985-04-12',
      gender: 'Other',
      familyMembers: [],
      createdAt: new Date('2026-01-01T08:00:00Z').toISOString()
    };

    const demoUser = {
      _id: 'usr-demo-01',
      name: 'Aarav Sharma',
      email: 'demo@medilab.com',
      phone: '9876501234',
      password: userPassword,
      address: 'Flat 402, Sunshine Heights, MG Road, Mumbai',
      role: 'user' as const,
      dob: '1992-07-15',
      gender: 'Male',
      familyMembers: [
        {
          id: 'fam-1',
          name: 'Priya Sharma',
          relation: 'Spouse',
          age: 32,
          gender: 'Female',
          phone: '9876501235'
        },
        {
          id: 'fam-2',
          name: 'Ramesh Sharma',
          relation: 'Father',
          age: 64,
          gender: 'Male',
          phone: '9876501236'
        }
      ],
      createdAt: new Date('2026-02-10T10:00:00Z').toISOString()
    };

    db.users = [adminUser, demoUser];
  }

  // Seed realistic sample bookings for demo user if bookings are empty
  if (!db.bookings || db.bookings.length === 0) {
    db.bookings = [
      {
        _id: 'bk-sample-01',
        bookingId: 'MLB-72810',
        userId: 'usr-demo-01',
        testId: 'test-9',
        testName: 'Full Body Comprehensive Health Checkup',
        patientDetails: {
          type: 'self',
          name: 'Aarav Sharma',
          age: 34,
          gender: 'Male',
          phone: '9876501234'
        },
        collectionMethod: 'home',
        address: {
          street: 'Flat 402, Sunshine Heights, MG Road',
          city: 'Mumbai',
          pincode: '400001'
        },
        date: '2026-09-30',
        timeSlot: '09:00 AM - 10:00 AM',
        price: 1499,
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
      },
      {
        _id: 'bk-sample-02',
        bookingId: 'MLB-61944',
        userId: 'usr-demo-01',
        testId: 'test-2',
        testName: 'Thyroid Profile (Total T3, Total T4, TSH)',
        patientDetails: {
          type: 'family',
          name: 'Priya Sharma',
          age: 32,
          gender: 'Female',
          phone: '9876501235',
          relation: 'Spouse'
        },
        collectionMethod: 'home',
        address: {
          street: 'Flat 402, Sunshine Heights, MG Road',
          city: 'Mumbai',
          pincode: '400001'
        },
        date: '2026-09-29',
        timeSlot: '10:00 AM - 11:00 AM',
        price: 499,
        status: 'Sample Collected',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        _id: 'bk-sample-03',
        bookingId: 'MLB-54021',
        userId: 'usr-demo-01',
        testId: 'test-1',
        testName: 'Complete Blood Count (CBC)',
        patientDetails: {
          type: 'self',
          name: 'Aarav Sharma',
          age: 34,
          gender: 'Male',
          phone: '9876501234'
        },
        collectionMethod: 'lab',
        date: '2026-09-25',
        timeSlot: '11:00 AM - 12:00 PM',
        price: 399,
        status: 'Report Ready',
        reportData: {
          generatedAt: new Date(Date.now() - 3600000 * 70).toISOString(),
          sampleCollectedAt: new Date(Date.now() - 3600000 * 76).toISOString(),
          technicianName: 'Rajesh K. (Lab Technologist)',
          pathologistName: 'Dr. Ananya Sharma, MD (Pathology)',
          notes: 'Hemoglobin and total leukocyte count within standard healthy biological parameters.',
          results: [
            { parameter: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'normal' },
            { parameter: 'Total Leukocyte Count (WBC)', value: '6,800', unit: 'cells/mcL', referenceRange: '4,000 - 11,000', status: 'normal' },
            { parameter: 'Platelet Count', value: '2.80', unit: 'lakh/mcL', referenceRange: '1.50 - 4.50', status: 'normal' },
            { parameter: 'Packed Cell Volume (PCV)', value: '43.2', unit: '%', referenceRange: '40.0 - 50.0', status: 'normal' },
            { parameter: 'Neutrophils', value: '62', unit: '%', referenceRange: '40 - 75', status: 'normal' },
            { parameter: 'Lymphocytes', value: '31', unit: '%', referenceRange: '20 - 45', status: 'normal' }
          ]
        },
        createdAt: new Date(Date.now() - 3600000 * 80).toISOString()
      },
      {
        _id: 'bk-sample-04',
        bookingId: 'MLB-49102',
        userId: 'usr-demo-01',
        testId: 'test-3',
        testName: 'HbA1c (Glycosylated Hemoglobin)',
        patientDetails: {
          type: 'family',
          name: 'Ramesh Sharma',
          age: 64,
          gender: 'Male',
          phone: '9876501236',
          relation: 'Father'
        },
        collectionMethod: 'home',
        address: {
          street: 'Flat 402, Sunshine Heights, MG Road',
          city: 'Mumbai',
          pincode: '400001'
        },
        date: '2026-09-18',
        timeSlot: '09:00 AM - 10:00 AM',
        price: 450,
        status: 'Completed',
        reportData: {
          generatedAt: new Date(Date.now() - 3600000 * 240).toISOString(),
          sampleCollectedAt: new Date(Date.now() - 3600000 * 246).toISOString(),
          technicianName: 'Manoj Patel (Phlebotomist)',
          pathologistName: 'Dr. Ananya Sharma, MD (Pathology)',
          notes: 'Glycemic control indicates moderate pre-diabetic range. Diet consultation advised.',
          results: [
            { parameter: 'HbA1c Level', value: '5.9', unit: '%', referenceRange: '< 5.7 (Normal), 5.7 - 6.4 (Prediabetic)', status: 'high' },
            { parameter: 'Estimated Average Glucose (eAG)', value: '123', unit: 'mg/dL', referenceRange: '90 - 120', status: 'high' }
          ]
        },
        createdAt: new Date(Date.now() - 3600000 * 250).toISOString()
      }
    ];

    dbStore.persist();
  }
}
