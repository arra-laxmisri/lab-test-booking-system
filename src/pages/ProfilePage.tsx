import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { IFamilyMember } from '../types/index.js';
import { api } from '../services/api.js';
import { 
  User, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'Male');

  const [familyMembers, setFamilyMembers] = useState<IFamilyMember[]>(
    user?.familyMembers || []
  );

  // New family member modal/inline form
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [famName, setFamName] = useState('');
  const [famRelation, setFamRelation] = useState('Spouse');
  const [famAge, setFamAge] = useState<number | ''>('');
  const [famGender, setFamGender] = useState('Female');
  const [famPhone, setFamPhone] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await api.user.updateProfile({
        name,
        phone,
        address,
        dob,
        gender,
        familyMembers,
      });

      updateUser(res.user);
      setSuccessMessage('Profile information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!famName.trim() || !famAge) return;

    const newMember: IFamilyMember = {
      id: 'fam-' + Date.now(),
      name: famName.trim(),
      relation: famRelation.trim(),
      age: Number(famAge),
      gender: famGender,
      phone: famPhone.trim() || undefined,
    };

    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    setFamName('');
    setFamAge('');
    setFamPhone('');
    setShowAddFamily(false);
  };

  const handleRemoveFamilyMember = (id: string) => {
    const updated = familyMembers.filter((m) => m.id !== id);
    setFamilyMembers(updated);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile & Family Members
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage your personal medical profile, home delivery address, and registered family members.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Personal Demographics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-xl text-xs sm:text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 font-mono bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Default Home Collection Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Street / City / Pincode"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </div>

        {/* Family Members Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold text-slate-900">Registered Family Members</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAddFamily(true)}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Family Member</span>
            </button>
          </div>

          {/* Add Member Form Modal / Inline Box */}
          {showAddFamily && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-900">Add New Family Member</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={famName}
                    onChange={(e) => setFamName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={famRelation}
                    onChange={(e) => setFamRelation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={famAge}
                    onChange={(e) => setFamAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Years"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFamily(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="px-3.5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Add Member
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          {familyMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{member.name}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {member.relation} · {member.age} yrs · {member.gender}
                    </p>
                    {member.phone && (
                      <p className="text-slate-400 text-[11px] font-mono mt-0.5">
                        Ph: {member.phone}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFamilyMember(member.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                    aria-label="Remove family member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No family members added yet. Add family members to quickly book tests on their behalf.
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Profile Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
