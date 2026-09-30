import React, { useState } from 'react';
import { AppState, CareReachStore } from '../../services/store';
import {
  User,
  Shield,
  MapPin,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Save,
  Phone,
  Building2,
  Heart
} from 'lucide-react';

interface Props {
  state: AppState;
}

export const StudentProfilePage: React.FC<Props> = ({ state }) => {
  const student = state.student;

  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);
  const [phone, setPhone] = useState(student.phone);
  const [hostelName, setHostelName] = useState(student.hostelName);
  const [hostelRoom, setHostelRoom] = useState(student.hostelRoom);
  const [college, setCollege] = useState(student.college);

  // Allergies & conditions
  const [allergiesText, setAllergiesText] = useState(student.medicalInfo.allergies.join(', '));
  const [conditionsText, setConditionsText] = useState(student.medicalInfo.existingConditions.join(', '));
  const [medicationsText, setMedicationsText] = useState(student.medicalInfo.currentMedications.join(', '));
  const [bloodGroup, setBloodGroup] = useState(student.medicalInfo.bloodGroup || 'B+');

  // Emergency contact
  const [contactName, setContactName] = useState(student.emergencyContact.name);
  const [contactPhone, setContactPhone] = useState(student.emergencyContact.phone);

  // Privacy toggles
  const [shareRoomNumber, setShareRoomNumber] = useState(student.privacySettings.shareRoomNumber);
  const [shareMedicalHistory, setShareMedicalHistory] = useState(student.privacySettings.shareMedicalHistory);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    CareReachStore.updateStudentProfile({
      name,
      age: Number(age),
      phone,
      hostelName,
      hostelRoom,
      college,
      emergencyContact: {
        name: contactName,
        relation: 'Primary Contact',
        phone: contactPhone
      },
      medicalInfo: {
        allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
        existingConditions: conditionsText.split(',').map((s) => s.trim()).filter(Boolean),
        currentMedications: medicationsText.split(',').map((s) => s.trim()).filter(Boolean),
        bloodGroup
      },
      privacySettings: {
        shareRoomNumber,
        shareMedicalHistory,
        allowLocationTracking: true
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-sky-500/40"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                Hostel Resident Profile
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{student.name}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.college} • {student.hostelName}
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" /> Changes Saved
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Personal & Hostel Details */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-sky-600" /> Personal & Hostel Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hostel Block Name</label>
                <input
                  type="text"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={hostelRoom}
                  onChange={(e) => setHostelRoom(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Baseline & Emergency Information */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-600" /> Medical Baseline & Emergency Data
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Known Drug & Food Allergies (Comma separated)
                </label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Peanuts, Sulfa"
                  className="w-full p-3 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-950 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Existing Medical Conditions
                </label>
                <input
                  type="text"
                  value={conditionsText}
                  onChange={(e) => setConditionsText(e.target.value)}
                  placeholder="e.g. Asthma, Migraine, Type 1 Diabetes"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Current Medications (Daily or SOS)
                </label>
                <input
                  type="text"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  placeholder="e.g. Inhaler, Cetirizine 10mg"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emergency Contact Name & Relation
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emergency Contact Phone Number
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Privacy & Location Minimization Controls */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" /> Privacy & Location Minimization
            </h3>

            <p className="text-xs text-slate-600">
              CareReach is designed with privacy-by-design. You decide exactly what consulting doctors are permitted to see.
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Share Exact Room Number With Matched Doctor
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    If disabled, the doctor only sees the hostel block building name.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={shareRoomNumber}
                  onChange={(e) => setShareRoomNumber(e.target.checked)}
                  className="h-5 w-5 text-sky-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Share Allergy & Medication Baseline During Triage
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Recommended so doctors do not suggest treatments conflicting with your allergies.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={shareMedicalHistory}
                  onChange={(e) => setShareMedicalHistory(e.target.checked)}
                  className="h-5 w-5 text-sky-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile & Privacy Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
