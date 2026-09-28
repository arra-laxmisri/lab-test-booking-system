import { dbStore, IBooking } from '../config/db.js';

export class BookingModel {
  static async find(query?: { userId?: string; status?: string; search?: string }): Promise<IBooking[]> {
    let bookings = dbStore.getDatabase().bookings;

    if (query?.userId) {
      bookings = bookings.filter(b => b.userId === query.userId);
    }

    if (query?.status && query.status !== 'All') {
      bookings = bookings.filter(b => b.status.toLowerCase() === query.status!.toLowerCase());
    }

    if (query?.search) {
      const q = query.search.toLowerCase();
      bookings = bookings.filter(b => 
        b.bookingId.toLowerCase().includes(q) ||
        b.testName.toLowerCase().includes(q) ||
        b.patientDetails.name.toLowerCase().includes(q) ||
        b.patientDetails.phone.includes(q)
      );
    }

    // Sort newest first
    return [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async findById(id: string): Promise<IBooking | null> {
    const booking = dbStore.getDatabase().bookings.find(b => b._id === id || b.bookingId === id);
    return booking || null;
  }

  static async create(data: Omit<IBooking, '_id' | 'bookingId' | 'createdAt'>): Promise<IBooking> {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `MLB-${randomDigits}`;

    const newBooking: IBooking = {
      ...data,
      _id: 'bk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      bookingId,
      createdAt: new Date().toISOString()
    };

    dbStore.getDatabase().bookings.push(newBooking);
    dbStore.persist();
    return newBooking;
  }

  static async updateById(id: string, update: Partial<IBooking>): Promise<IBooking | null> {
    const bookings = dbStore.getDatabase().bookings;
    const index = bookings.findIndex(b => b._id === id || b.bookingId === id);
    if (index === -1) return null;

    const current = bookings[index];
    const newStatus = update.status || current.status;

    // If transitioning to Report Ready or Completed and no report data yet, generate realistic report
    let reportData = update.reportData || current.reportData;
    if ((newStatus === 'Report Ready' || newStatus === 'Completed') && !reportData) {
      reportData = {
        generatedAt: new Date().toISOString(),
        sampleCollectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        technicianName: 'Suresh Verma (Sr. Lab Technologist)',
        pathologistName: 'Dr. Ananya Sharma, MD (Pathology)',
        notes: 'All control values within normal biological reference limits. Clinically correlated.',
        results: [
          { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'normal' },
          { parameter: 'Total WBC Count', value: '7,400', unit: 'cells/mcL', referenceRange: '4,000 - 11,000', status: 'normal' },
          { parameter: 'Platelet Count', value: '2.45', unit: 'lakh/mcL', referenceRange: '1.50 - 4.50', status: 'normal' },
          { parameter: 'Blood Glucose Fasting', value: '94', unit: 'mg/dL', referenceRange: '70 - 100', status: 'normal' },
          { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.6 - 1.2', status: 'normal' },
          { parameter: 'Total Cholesterol', value: '185', unit: 'mg/dL', referenceRange: '< 200', status: 'normal' }
        ]
      };
    }

    bookings[index] = {
      ...current,
      ...update,
      reportData
    };

    dbStore.persist();
    return bookings[index];
  }

  static async deleteById(id: string): Promise<boolean> {
    const bookings = dbStore.getDatabase().bookings;
    const index = bookings.findIndex(b => b._id === id || b.bookingId === id);
    if (index === -1) return false;

    bookings.splice(index, 1);
    dbStore.persist();
    return true;
  }
}
