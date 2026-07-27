import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const UserContext = createContext();

const initialProfile = {
  name: 'Patient User',
  email: '',
  age: 30,
  gender: 'Other',
  bloodType: 'O+',
  height: '175 cm',
  weight: '70 kg',
  emergencyContact: {
    name: '',
    relation: '',
    phone: ''
  },
  allergies: [],
  lifestyle: {
    smoking: 'Never',
    alcohol: 'Occasional',
    activityLevel: 'Moderate',
    dietType: 'Balanced'
  }
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('medassist_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);

  const [symptomSession, setSymptomSession] = useState({
    selectedSymptoms: [],
    severity: 'mild',
    duration: 3,
    notes: '',
    predictionResult: null,
    riskResult: null,
    recommendations: null
  });

  // Fetch real data from backend when authenticated
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('medassist_access_token');
    if (!token) return;

    setLoadingUser(true);
    try {
      // 1. Fetch Patient Profile
      const profileRes = await api.get('/patients/me');
      if (profileRes.data) {
        const d = profileRes.data;
        const mapped = {
          name: d.user?.full_name || d.full_name || profile.name,
          email: d.user?.email || d.email || profile.email,
          age: d.age || 30,
          gender: d.gender || 'Other',
          bloodType: d.blood_group || d.bloodType || 'O+',
          height: d.height_cm ? `${d.height_cm} cm` : '175 cm',
          weight: d.weight_kg ? `${d.weight_kg} kg` : '70 kg',
          emergencyContact: {
            name: d.emergency_contact_name || '',
            relation: d.emergency_contact_relation || '',
            phone: d.emergency_contact_phone || ''
          },
          allergies: d.allergies ? (Array.isArray(d.allergies) ? d.allergies : d.allergies.split(',').map(s=>s.trim())) : [],
          lifestyle: {
            smoking: d.smoking_status || 'Never',
            alcohol: d.alcohol_consumption || 'Occasional',
            activityLevel: d.activity_level || 'Moderate',
            dietType: d.diet_type || 'Balanced'
          }
        };
        setProfile(mapped);
      }
    } catch (e) {
      console.warn('Could not fetch patient profile from backend');
    }

    try {
      // 2. Fetch Medical History
      const histRes = await api.get('/patients/me/medical-history');
      if (histRes.data && Array.isArray(histRes.data)) {
        setMedicalHistory(histRes.data.map(item => ({
          id: item.id,
          condition: item.condition,
          diagnosedYear: item.diagnosed_year || new Date(item.created_at).getFullYear(),
          status: item.status,
          notes: item.notes || ''
        })));
      }
    } catch (e) {
      console.warn('Could not fetch medical history from backend');
    }

    try {
      // 3. Fetch Notifications
      const notifRes = await api.get('/notifications');
      if (notifRes.data && Array.isArray(notifRes.data)) {
        setNotifications(notifRes.data.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: n.read
        })));
      }
    } catch (e) {
      console.warn('Could not fetch notifications from backend');
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    localStorage.setItem('medassist_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = async (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    try {
      await api.put('/patients/me', {
        age: updatedFields.age,
        gender: updatedFields.gender,
        blood_group: updatedFields.bloodType,
        emergency_contact_name: updatedFields.emergencyContact?.name,
        emergency_contact_phone: updatedFields.emergencyContact?.phone,
        emergency_contact_relation: updatedFields.emergencyContact?.relation,
        smoking_status: updatedFields.lifestyle?.smoking,
        alcohol_consumption: updatedFields.lifestyle?.alcohol,
        activity_level: updatedFields.lifestyle?.activityLevel,
        diet_type: updatedFields.lifestyle?.dietType,
      });
    } catch (err) {
      console.error('Failed to sync profile with backend:', err);
    }
  };

  const addHistoryItem = async (item) => {
    try {
      const res = await api.post('/patients/me/medical-history', {
        condition: item.condition,
        status: item.status || 'Active',
        notes: item.notes || '',
        diagnosed_year: item.diagnosedYear || new Date().getFullYear()
      });
      setMedicalHistory((prev) => [...prev, {
        id: res.data.id,
        condition: res.data.condition,
        diagnosedYear: res.data.diagnosed_year,
        status: res.data.status,
        notes: res.data.notes
      }]);
    } catch (err) {
      console.error('Failed to save medical history item:', err);
      // Local fallback
      setMedicalHistory((prev) => [...prev, { ...item, id: `h_${Date.now()}` }]);
    }
  };

  const deleteHistoryItem = async (id) => {
    setMedicalHistory((prev) => prev.filter(item => item.id !== id));
    try {
      if (typeof id === 'number') {
        await api.delete(`/patients/me/medical-history/${id}`);
      }
    } catch (err) {
      console.error('Failed to delete medical history item from backend:', err);
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications((prev) =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      if (typeof id === 'number') {
        await api.put(`/notifications/${id}/read`);
      }
    } catch (err) {
      console.error('Failed to mark notification read on backend:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    try {
      await api.put('/notifications/mark-all-read');
    } catch (err) {
      console.error('Failed to mark all read on backend:', err);
    }
  };

  const addNotification = (title, message, type = 'info') => {
    setNotifications((prev) => [
      {
        id: `n_${Date.now()}`,
        title,
        message,
        type,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  const updateSymptomSession = (fields) => {
    setSymptomSession((prev) => ({ ...prev, ...fields }));
  };

  const clearSymptomSession = () => {
    setSymptomSession({
      selectedSymptoms: [],
      severity: 'mild',
      duration: 3,
      notes: '',
      predictionResult: null,
      riskResult: null,
      recommendations: null
    });
  };

  return (
    <UserContext.Provider value={{
      profile,
      updateProfile,
      medicalHistory,
      addHistoryItem,
      deleteHistoryItem,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      clearNotification,
      symptomSession,
      updateSymptomSession,
      clearSymptomSession,
      fetchUserData,
      loadingUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
