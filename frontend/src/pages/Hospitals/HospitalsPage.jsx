import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Phone, Mail, Star, Search, Filter, X,
  Clock, ShieldCheck, Video, ChevronRight, Stethoscope,
  AlertCircle, CheckCircle2, Users, Award
} from 'lucide-react';
import { HOSPITALS, LOCATIONS, DEPARTMENTS } from '../../data/hospitalsData';
import RippleButton from '../../components/ui/RippleButton';

const SPECIALTY_COLORS = {
  'General Physician': 'cyan',
  'Cardiologist': 'rose',
  'Dermatologist': 'violet',
  'Neurologist': 'indigo',
  'Orthopedic Surgeon': 'amber',
  'Pediatrician': 'emerald',
  'Gynecology': 'pink',
  'ENT': 'teal',
};

const colorMap = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', text: 'text-cyan-300' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/25', text: 'text-rose-300' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-300' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', text: 'text-indigo-300' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-300' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-300' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/25', text: 'text-pink-300' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/25', text: 'text-teal-300' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/25', text: 'text-purple-300' },
};

export const HospitalsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [expandedHospital, setExpandedHospital] = useState(null);

  const filteredHospitals = useMemo(() => {
    let list = HOSPITALS;

    if (selectedLocation !== 'All Locations') {
      list = list.filter(h => h.location === selectedLocation);
    }

    if (selectedDept !== 'All Departments') {
      list = list.filter(h =>
        h.departments.some(d => d.toLowerCase().includes(selectedDept.toLowerCase())) ||
        h.doctors.some(d => d.specialization.toLowerCase().includes(selectedDept.toLowerCase().replace('ist', '').replace('ian', '')))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.departments.some(d => d.toLowerCase().includes(q)) ||
        h.doctors.some(d => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchQuery, selectedLocation, selectedDept]);

  const totalDoctors = HOSPITALS.reduce((acc, h) => acc + h.doctors.length, 0);

  return (
    <div className="space-y-6 pb-14">

      {/* ── Header Banner ── */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 text-[10px] font-extrabold uppercase tracking-widest">
              <Building2 size={11} /> Andhra Pradesh Clinical Network
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Hospitals & Specialists Directory
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              Explore accredited hospitals and certified medical specialists across all districts of Andhra Pradesh. Search by location, specialty, doctor name, or hospital type.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 shrink-0">
            {[
              { label: 'Hospitals', value: HOSPITALS.length, color: 'text-purple-400' },
              { label: 'Doctors', value: totalDoctors, color: 'text-cyan-400' },
              { label: 'Cities', value: LOCATIONS.length - 1, color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.label} className="text-center p-3 rounded-2xl bg-white/5 border border-white/8 min-w-[72px]">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="glass-card rounded-3xl p-5 border border-white/8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, doctors, specializations, or cities..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-10 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Filter by City / Location</label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition-all"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc} className="bg-slate-900 text-slate-200">{loc}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Filter by Department / Specialty</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition-all"
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
              ))}
            </select>
          </div>

          {(selectedLocation !== 'All Locations' || selectedDept !== 'All Departments' || searchQuery) && (
            <div className="flex items-end">
              <button
                onClick={() => { setSelectedLocation('All Locations'); setSelectedDept('All Departments'); setSearchQuery(''); }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <X size={13} /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-purple-400 font-bold">{filteredHospitals.length}</span> hospital{filteredHospitals.length !== 1 ? 's' : ''}
          {selectedLocation !== 'All Locations' ? ` in ${selectedLocation}` : ' across Andhra Pradesh'}
          {selectedDept !== 'All Departments' ? ` · ${selectedDept}` : ''}
        </div>
      </div>

      {/* ── Location Quick Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-2">
        {LOCATIONS.map(loc => (
          <button
            key={loc}
            onClick={() => setSelectedLocation(loc)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0
              ${selectedLocation === loc
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white hover:bg-white/10'}`}
          >
            {loc === 'All Locations' ? '🌐 All Cities' : `📍 ${loc}`}
          </button>
        ))}
      </div>

      {/* ── Hospital Cards ── */}
      {filteredHospitals.length === 0 ? (
        <div className="glass-card rounded-3xl p-14 text-center border border-white/8 space-y-4">
          <Building2 size={40} className="text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Hospitals Found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">Try adjusting your search filters or clearing the location selection.</p>
          <button
            onClick={() => { setSelectedLocation('All Locations'); setSelectedDept('All Departments'); setSearchQuery(''); }}
            className="px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mx-auto block"
          >
            Show All Hospitals
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHospitals.map((hospital, idx) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-3xl border border-white/8 hover:border-purple-500/30 overflow-hidden transition-all"
            >
              {/* Hospital Card Header */}
              <div className="flex flex-col lg:flex-row gap-0">
                {/* Image */}
                <div className="relative lg:w-52 h-40 lg:h-auto shrink-0 overflow-hidden">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/80 lg:to-slate-950/0" />
                  {hospital.emergencyAvailable && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <AlertCircle size={9} /> 24/7 Emergency
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="text-base font-extrabold text-white leading-tight">{hospital.name}</h2>
                      <p className="text-xs text-purple-300 font-semibold">{hospital.type}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <MapPin size={11} className="text-cyan-400" />
                        <span>{hospital.address}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/25 rounded-xl px-2.5 py-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-amber-300 font-black text-sm">{hospital.rating}</span>
                        <span className="text-slate-500 text-[10px]">({hospital.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <Clock size={11} /> {hospital.openingHours}
                      </div>
                    </div>
                  </div>

                  {/* Contact Row */}
                  <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5"><Phone size={11} className="text-emerald-400" />{hospital.phone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={11} className="text-cyan-400" />{hospital.email}</span>
                    <span className="flex items-center gap-1.5">
                      {hospital.consultationTypes.includes('Online Video') ? <Video size={11} className="text-indigo-400" /> : null}
                      {hospital.consultationTypes.join(' • ')}
                    </span>
                  </div>

                  {/* Departments */}
                  <div className="flex flex-wrap gap-1.5">
                    {hospital.departments.map(dept => (
                      <span key={dept} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[10px] text-slate-300 font-semibold">
                        {dept}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-1">
                    <RippleButton
                      variant="primary"
                      className="px-4 py-2 text-xs font-bold gap-1.5"
                      onClick={() => navigate(`/appointments?hospital=${encodeURIComponent(hospital.name)}`)}
                    >
                      <Stethoscope size={13} /> Book Appointment
                    </RippleButton>
                    <button
                      onClick={() => setExpandedHospital(expandedHospital === hospital.id ? null : hospital.id)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Users size={13} /> {expandedHospital === hospital.id ? 'Hide' : 'View'} Doctors ({hospital.doctors.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Doctors Panel */}
              <AnimatePresence>
                {expandedHospital === hospital.id && (
                  <motion.div
                    key="doctors"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/8 p-5 bg-white/2">
                      <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Award size={14} className="text-purple-400" /> Available Specialists at {hospital.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {hospital.doctors.map(doctor => {
                          const specColor = SPECIALTY_COLORS[doctor.specialization] || 'purple';
                          const colors = colorMap[specColor] || colorMap.purple;
                          return (
                            <div
                              key={doctor.id}
                              className={`rounded-2xl p-4 border ${colors.border} ${colors.bg} space-y-3`}
                            >
                              <div className="flex items-start gap-3">
                                <img
                                  src={doctor.avatar}
                                  alt={doctor.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=80&auto=format&fit=crop&q=80'; }}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-extrabold text-white leading-tight">{doctor.name}</p>
                                  <p className={`text-xs font-bold ${colors.text}`}>{doctor.specialization}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{doctor.qualification}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px]">
                                <div className="bg-white/5 rounded-lg px-2 py-1.5">
                                  <span className="text-slate-500 block">Experience</span>
                                  <span className="text-white font-bold">{doctor.experience} Years</span>
                                </div>
                                <div className="bg-white/5 rounded-lg px-2 py-1.5">
                                  <span className="text-slate-500 block">Fee</span>
                                  <span className="text-white font-bold">₹{doctor.consultationFee}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star size={11} className="text-amber-400 fill-amber-400" />
                                  <span className="text-amber-300 font-bold text-xs">{doctor.rating}</span>
                                  <span className="text-slate-500 text-[10px]">({doctor.reviews})</span>
                                </div>
                                <button
                                  onClick={() => navigate(`/appointments?doctor=${encodeURIComponent(doctor.name)}&specialty=${encodeURIComponent(doctor.specialization)}&hospital=${encodeURIComponent(hospital.name)}`)}
                                  className={`px-3 py-1.5 rounded-lg ${colors.bg} ${colors.border} border ${colors.text} text-[10px] font-bold transition-all hover:opacity-80 flex items-center gap-1`}
                                >
                                  Book <ChevronRight size={11} />
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {doctor.availableTimeSlots.slice(0, 3).map(slot => (
                                  <span key={slot} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 font-semibold">{slot}</span>
                                ))}
                                {doctor.availableTimeSlots.length > 3 && (
                                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-500 font-semibold">+{doctor.availableTimeSlots.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalsPage;
