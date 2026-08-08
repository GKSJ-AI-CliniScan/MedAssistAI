import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart, 
  Droplets, 
  Users, 
  Navigation, 
  Loader2, 
  Bell, 
  CheckCircle, 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Hospital, 
  Radio, 
  Clock 
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";

export default function Emergency() {
  const { user } = useAuth();
  const [isAlertSent, setIsAlertSent] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [alertLocation, setAlertLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("hospitals"); // 'hospitals', 'bloodbanks', 'contacts'
  const { t } = useTranslation();

  const emergencyContacts = [
    { id: 1, name: "National Emergency / Ambulance", number: "911", subtitle: "Standard Emergency Hotline (24/7)" },
    { id: 2, name: "Emergency Medical & Ambulance", number: "108", subtitle: "Fast Medical Response Dispatch" },
    { id: 3, name: "Police Emergency", number: "100", subtitle: "Public Safety & Law Enforcement" },
    { id: 4, name: "Fire & Rescue Department", number: "101", subtitle: "Fire Emergency & Disaster Relief" },
  ];

  const nearbyEmergencyHospitals = [
    {
      id: 1,
      name: "MedAssist Central Trauma & Emergency Center",
      address: "104 Healthcare Boulevard, Medical District",
      distance: "1.2 km away",
      phone: "+1 (555) 911-0001",
      emergencyAvailable: true,
      hasICU: true,
      hasTrauma: true,
      etaMinutes: 4
    },
    {
      id: 2,
      name: "City Acute Care & Coronary Care Unit",
      address: "480 Downtown Avenue, Metro Center",
      distance: "2.5 km away",
      phone: "+1 (555) 911-0002",
      emergencyAvailable: true,
      hasICU: true,
      hasTrauma: true,
      etaMinutes: 7
    },
    {
      id: 3,
      name: "St. Jude Regional Emergency Hospital",
      address: "712 North Hills Road, Suburb",
      distance: "4.1 km away",
      phone: "+1 (555) 911-0003",
      emergencyAvailable: true,
      hasICU: true,
      hasTrauma: false,
      etaMinutes: 11
    }
  ];

  const bloodBanks = [
    { id: 1, name: "MedAssist Blood Transfusion Center", address: "104 Healthcare Blvd", phone: "+1 (555) 234-1111", availableBlood: ["A+", "B+", "O+", "AB+", "O-"] },
    { id: 2, name: "Metro Red Cross Blood Center", address: "550 Wellness Ave", phone: "+1 (555) 234-2222", availableBlood: ["A-", "B-", "O-", "AB-", "A+"] },
    { id: 3, name: "City Trauma Blood Reserve", address: "890 Emergency Way", phone: "+1 (555) 234-3333", availableBlood: ["O+", "O-", "B+", "A+"] },
  ];

  const personalEmergencyContacts = [
    { id: 1, name: "Dr. Alexander Smith (Primary Physician)", phone: "+1 (555) 444-4444", relation: "Doctor" },
    { id: 2, name: "Robert Williams (Emergency Contact / Family)", phone: "+1 (555) 555-5555", relation: "Family" },
    { id: 3, name: "Sarah Miller (Next of Kin)", phone: "+1 (555) 666-6666", relation: "Emergency" },
  ];

  useEffect(() => {
    // Detect location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAlertLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Location lookup error:", error);
          setAlertLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const sendEmergencyAlert = async () => {
    setIsBroadcasting(true);
    // Simulate GPS beacon & contact broadcast
    await new Promise(res => setTimeout(res, 1500));
    setIsBroadcasting(false);
    setIsAlertSent(true);
  };

  const callNumber = (number) => {
    window.open(`tel:${number}`);
  };

  const getDirections = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Module 4 • Emergency Protocol
              </span>
              <span className="text-xs text-gray-500 font-semibold">24/7 Rapid Emergency Response</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Healthcare & SOS Dispatch</h1>
            <p className="text-gray-600">Immediate access to national emergency hotlines, GPS beacon broadcast, trauma centers, and blood banks</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:911"
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              CALL 911 / 108 NOW
            </a>
          </div>
        </motion.div>

        {/* One-Click Emergency SOS Broadcast Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-3xl shadow-xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-6 h-6 animate-pulse text-red-200" />
                <span className="font-black text-sm uppercase tracking-widest text-red-200">Instant GPS Emergency Beacon</span>
              </div>
              <h2 className="text-3xl font-black mb-2">One-Touch Emergency SOS Broadcast</h2>
              <p className="text-red-100 text-sm leading-relaxed mb-4">
                Instantly transmit your precise GPS coordinates, primary emergency contacts, and medical alert profile to nearby ambulance dispatchers.
              </p>

              {isAlertSent && alertLocation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30"
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                    <span>Emergency Beacon Active & Dispatched</span>
                  </div>
                  <p className="text-xs text-red-100">
                    Live Coordinates: <strong>{alertLocation.lat.toFixed(4)}, {alertLocation.lng.toFixed(4)}</strong> • Alerts sent to 3 primary contacts.
                  </p>
                </motion.div>
              )}
            </div>

            <button
              onClick={sendEmergencyAlert}
              disabled={isBroadcasting || isAlertSent}
              className={`px-10 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                isAlertSent
                  ? "bg-white/20 text-white cursor-default border border-white/30"
                  : "bg-white text-red-700 hover:bg-red-50 shadow-white/20"
              }`}
            >
              {isBroadcasting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Broadcasting SOS...
                </>
              ) : isAlertSent ? (
                <>
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  SOS Dispatched
                </>
              ) : (
                <>
                  <Bell className="w-6 h-6 text-red-600 animate-bounce" />
                  DISPATCH SOS ALERT
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Emergency Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { id: "hospitals", label: "Emergency & Trauma Centers", icon: Hospital },
            { id: "bloodbanks", label: "Blood Banks & Reserves", icon: Droplets },
            { id: "contacts", label: "Emergency Contacts & Doctors", icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "hospitals" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nearbyEmergencyHospitals.map(h => (
              <div key={h.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                      ETA: {h.etaMinutes} mins
                    </span>
                    <span className="text-xs font-bold text-gray-500">{h.distance}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1">{h.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {h.address}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {h.hasICU && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold">24/7 ICU</span>}
                    {h.hasTrauma && <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-[11px] font-bold">Level 1 Trauma</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => getDirections(h.address)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </button>
                  <button
                    onClick={() => callNumber(h.phone)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" /> Emergency Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "bloodbanks" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bloodBanks.map(b => (
              <div key={b.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-gray-900 text-base">{b.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{b.address}</p>

                  <p className="text-xs font-bold text-gray-600 mb-2">Available Blood Groups:</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {b.availableBlood.map((bg, i) => (
                      <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg text-xs font-black border border-rose-200">
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => callNumber(b.phone)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Contact Blood Bank ({b.phone})
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* National Hotlines */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                National Emergency Hotlines
              </h3>
              <div className="space-y-3">
                {emergencyContacts.map(c => (
                  <div key={c.id} className="p-4 bg-red-50/60 rounded-2xl border border-red-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.subtitle}</p>
                    </div>
                    <button
                      onClick={() => callNumber(c.number)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call {c.number}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Contacts */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Personal Emergency Contacts
              </h3>
              <div className="space-y-3">
                {personalEmergencyContacts.map(p => (
                  <div key={p.id} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.phone} • {p.relation}</p>
                    </div>
                    <button
                      onClick={() => callNumber(p.phone)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}