import React, { useState, useEffect } from 'react';
import { ITest, IBooking } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Users, 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface BookingFlowPageProps {
  test: ITest;
  onBack: () => void;
  onBookingSuccess: (booking: IBooking) => void;
  onRequireLogin: () => void;
}

export const BookingFlowPage: React.FC<BookingFlowPageProps> = ({
  test,
  onBack,
  onBookingSuccess,
  onRequireLogin,
}) => {
  const { user, setAuthData } = useAuth();

  // Booking state
  const [patientType, setPatientType] = useState<'self' | 'family'>('self');
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string>('');
  
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState<number | ''>(30);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [relation, setRelation] = useState('');

  const [collectionMethod, setCollectionMethod] = useState<'home' | 'lab'>('home');
  const [streetAddress, setStreetAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400001');

  // Tomorrow's date as default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM - 10:00 AM');

  // Wizard Step
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync user info if user logs in
  useEffect(() => {
    if (user && patientType === 'self') {
      if (!patientName) setPatientName(user.name);
      if (!patientPhone) setPatientPhone(user.phone);
      if (!streetAddress && user.address) setStreetAddress(user.address);
    }
  }, [user, patientType]);

  const handlePatientTypeChange = (type: 'self' | 'family') => {
    setPatientType(type);
    if (type === 'self' && user) {
      setPatientName(user.name);
      setPatientPhone(user.phone);
      setRelation('');
    } else if (type === 'family') {
      if (user?.familyMembers && user.familyMembers.length > 0) {
        const first = user.familyMembers[0];
        setSelectedFamilyMemberId(first.id);
        setPatientName(first.name);
        setPatientAge(first.age);
        setPatientGender(first.gender as any);
        setPatientPhone(first.phone || user.phone);
        setRelation(first.relation);
      } else {
        setPatientName('');
        setPatientAge('');
        setRelation('');
      }
    }
  };

  const handleSelectSavedFamilyMember = (id: string) => {
    setSelectedFamilyMemberId(id);
    const member = user?.familyMembers.find((m) => m.id === id);
    if (member) {
      setPatientName(member.name);
      setPatientAge(member.age);
      setPatientGender(member.gender as any);
      setPatientPhone(member.phone || user?.phone || '');
      setRelation(member.relation);
    }
  };

  const timeSlots = [
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
  ];

  // Validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMessage('');
    if (currentStep === 1) {
      return true;
    }
    if (currentStep === 2) {
      if (!patientName.trim()) {
        setErrorMessage('Please enter the patient’s full name.');
        return false;
      }
      if (!patientAge || Number(patientAge) <= 0 || Number(patientAge) > 120) {
        setErrorMessage('Please enter a valid patient age.');
        return false;
      }
      if (!patientPhone.trim() || patientPhone.trim().length < 8) {
        setErrorMessage('Please provide a valid 10-digit mobile contact number.');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (collectionMethod === 'home') {
        if (!streetAddress.trim() || !city.trim() || !pincode.trim()) {
          setErrorMessage('Please enter complete street address, city, and pincode for home pickup.');
          return false;
        }
      }
      return true;
    }
    if (currentStep === 4) {
      if (!selectedDate) {
        setErrorMessage('Please pick a booking appointment date.');
        return false;
      }
      if (!selectedTimeSlot) {
        setErrorMessage('Please select an available time window.');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorMessage('');
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.bookings.create({
        testId: test._id,
        patientDetails: {
          type: patientType,
          name: patientName.trim(),
          age: Number(patientAge),
          gender: patientGender,
          phone: patientPhone.trim(),
          relation: patientType === 'family' ? relation : undefined,
        },
        collectionMethod,
        address: collectionMethod === 'home' ? {
          street: streetAddress.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        } : undefined,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });

      if (res.token && res.user) {
        setAuthData(res.token, res.user);
      }

      onBookingSuccess(res.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Test Overview</span>
        </button>
      </div>

      {/* Selected Test Summary Header Banner */}
      <div className="bg-teal-800 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-200">
            Booking Diagnostic Test
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            {test.name}
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            {test.sampleType} · Report in {test.reportTime}
          </p>
        </div>

        <div className="text-left sm:text-right bg-teal-900/50 p-3 rounded-xl border border-teal-700/50 shrink-0">
          <span className="text-[11px] text-teal-200 block">Total Payable Fee</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold">₹</span>
            <span className="text-2xl font-bold font-mono tabular-nums">{test.price}</span>
          </div>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span className="text-slate-800 font-bold">
            {step === 1 && 'Patient Selection'}
            {step === 2 && 'Patient Details'}
            {step === 3 && 'Collection Method'}
            {step === 4 && 'Date & Time Slot'}
            {step === 5 && 'Booking Summary'}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* STEP 1: Select Patient (Self vs Family Member) */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Who is this test for?</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select whether this diagnostic sample is being collected for yourself or a family member.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePatientTypeChange('self')}
                className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  patientType === 'self'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  patientType === 'self' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">For Myself</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user ? user.name : 'Your own diagnostic testing'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePatientTypeChange('family')}
                className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  patientType === 'family'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  patientType === 'family' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Family Member</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Parent, spouse, child, or sibling
                  </p>
                </div>
              </button>
            </div>

            {/* Saved Family Member Quick Selector */}
            {patientType === 'family' && user?.familyMembers && user.familyMembers.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <p className="text-xs font-semibold text-slate-700">Choose from saved family profiles:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {user.familyMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleSelectSavedFamilyMember(member.id)}
                      className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        selectedFamilyMemberId === member.id
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <p className="font-bold">{member.name}</p>
                      <p className="text-slate-500 text-[11px]">{member.relation} · {member.age} yrs · {member.gender}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Patient Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Patient Details</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter details exactly as they should appear on the official medical lab report.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g., Aarav Sharma"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age (in years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g., 34"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Biological Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e: any) => setPatientGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-white cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="10-digit mobile number for sample dispatch alerts"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono"
                />
              </div>

              {patientType === 'family' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relation with Patient (Optional)
                  </label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="e.g., Father, Mother, Spouse, Child"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Collection Method & Address */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Choose Collection Method</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose convenient home sample pickup or walk in to our accredited diagnostic center.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCollectionMethod('home')}
                className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  collectionMethod === 'home'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  collectionMethod === 'home' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Home Sample Collection</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trained phlebotomist visits your home with a sterile cold-chain kit. (Free)
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCollectionMethod('lab')}
                className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-4 ${
                  collectionMethod === 'lab'
                    ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  collectionMethod === 'lab' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Visit Laboratory</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Visit any MediLab Diagnostic Central Center at your scheduled time.
                  </p>
                </div>
              </button>
            </div>

            {/* Address Form if Home Collection */}
            {collectionMethod === 'home' ? (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800">Home Collection Address:</p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House / Flat No. & Street Address *
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g., Flat 402, Sunshine Heights, MG Road"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Mumbai"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pincode / Postal Code *
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="e.g., 400001"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">MediLab Central Diagnostic Center</p>
                <p>Diagnostic Tower, 42 Healthcare Boulevard, Medical District</p>
                <p className="text-teal-700 font-medium">Free dedicated patient parking & wheelchair access available.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Choose Date & Time Slot */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Date & Time Slot</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose a comfortable appointment slot for sample draw. Fasting tests are best taken in morning slots.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Appointment Date *
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono bg-white cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Available Time Slots *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs text-left font-mono font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-100'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span>{slot}</span>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Booking Summary & Final Confirmation */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Review Booking Summary</h2>
              <p className="text-xs text-slate-500 mt-1">
                Please double check all information before confirming your diagnostic booking.
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3.5 bg-slate-50/70 flex justify-between items-center">
                <span className="text-slate-500">Diagnostic Investigation</span>
                <span className="font-bold text-slate-900">{test.name}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-500">Patient Name</span>
                <span className="font-bold text-slate-900">
                  {patientName} ({patientAge} yrs, {patientGender})
                </span>
              </div>

              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-500">Contact Number</span>
                <span className="font-mono text-slate-800">{patientPhone}</span>
              </div>

              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-500">Collection Method</span>
                <span className="font-semibold text-teal-800">
                  {collectionMethod === 'home' ? 'Home Sample Collection (Doorstep)' : 'Direct Lab Visit'}
                </span>
              </div>

              {collectionMethod === 'home' && (
                <div className="p-3.5 flex justify-between items-start">
                  <span className="text-slate-500">Pickup Address</span>
                  <span className="font-medium text-slate-800 text-right max-w-xs">
                    {streetAddress}, {city} - {pincode}
                  </span>
                </div>
              )}

              <div className="p-3.5 flex justify-between items-center">
                <span className="text-slate-500">Scheduled Date & Time</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {selectedDate} · {selectedTimeSlot}
                </span>
              </div>

              <div className="p-4 bg-teal-50/50 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Total Price</span>
                <span className="font-extrabold font-mono text-teal-800 text-base">
                  ₹{test.price}
                </span>
              </div>
            </div>

            {!user && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">Instant Patient Booking Enabled</p>
                    <p className="text-[11px] text-slate-600">
                      We will automatically set up your patient account using your phone number so you can track sample collection and view diagnostic test reports anytime.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="text-xs text-teal-700 hover:text-teal-900 underline font-semibold whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  Already registered? Sign in
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={loading}
              className="px-7 py-3 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Booking</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
