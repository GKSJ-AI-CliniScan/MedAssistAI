/**
 * Realistic Demo Hospital & Specialist Directory
 * MedAssist AI – Healthcare Clinical Platform
 * 
 * Note: These entries represent accredited demonstration healthcare facilities and certified medical specialists.
 */

export const HOSPITALS = [
  {
    id: "hosp-apollo-vizag",
    name: "Apollo Care Hospital",
    type: "Super Specialty & Multi-Organ Transplant Center",
    location: "Visakhapatnam",
    address: "Waltair Main Road, Ram Nagar, Visakhapatnam, Andhra Pradesh 530002",
    phone: "+91 891 272 7272",
    email: "care.vizag@apollocare.org",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 342,
    emergencyAvailable: true,
    openingHours: "Open 24/7 (Emergency & IPD)",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Dermatology", "Neurology", "Pediatrics"],
    description: "Apollo Care Hospital Visakhapatnam is a premier super-specialty medical facility equipped with advanced catheterization labs, a dedicated stroke unit, comprehensive oncology care, and 24/7 emergency response.",
    doctors: [
      {
        id: "doc-ananya-rao",
        name: "Dr. Ananya Rao",
        specialization: "General Physician",
        qualification: "MBBS, MD (Internal Medicine) - AIIMS",
        experience: 10,
        consultationFee: 600,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu", "Hindi"],
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Ananya Rao specializes in internal medicine, comprehensive health screening, lifestyle disorder management, hypertension, and post-viral recovery care.",
        rating: 4.9,
        reviews: 184
      },
      {
        id: "doc-priya-reddy",
        name: "Dr. Priya Reddy",
        specialization: "Dermatologist",
        qualification: "MBBS, MD (Dermatology, Venereology & Leprosy)",
        experience: 8,
        consultationFee: 750,
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "11:30 AM", "02:30 PM", "04:00 PM", "05:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu"],
        avatar: "https://images.unsplash.com/photo-1594824813590-7814b7e802ea?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Priya Reddy is a leading clinical and cosmetic dermatologist specializing in inflammatory skin conditions, allergic dermatitis, acne treatments, and advanced laser therapies.",
        rating: 4.8,
        reviews: 142
      }
    ]
  },
  {
    id: "hosp-medlife-vizag",
    name: "MedLife Multispeciality Hospital",
    type: "Tertiary Care & Cardiac Sciences Institute",
    location: "Visakhapatnam",
    address: "Sector 6, MVP Colony, Visakhapatnam, Andhra Pradesh 530017",
    phone: "+91 891 255 8899",
    email: "helpdesk@medlifevizag.com",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 289,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Orthopedics", "ENT", "Gynecology", "Cardiology", "Neurology"],
    description: "MedLife Multispeciality Hospital delivers comprehensive multi-disciplinary healthcare services with robotic surgery capabilities, cardiac ICUs, advanced orthopedics, and comprehensive diagnostics.",
    doctors: [
      {
        id: "doc-rahul-sharma",
        name: "Dr. Rahul Sharma",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology), FACC",
        experience: 12,
        consultationFee: 900,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["09:30 AM", "11:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Hindi", "Telugu"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Rahul Sharma is a senior interventional cardiologist with extensive experience in coronary interventions, cardiac rhythm disorders, and preventive cardiac wellness.",
        rating: 4.9,
        reviews: 210
      },
      {
        id: "doc-arjun-kumar",
        name: "Dr. Arjun Kumar",
        specialization: "Neurologist",
        qualification: "MBBS, MD (Medicine), DM (Neurology)",
        experience: 15,
        consultationFee: 1000,
        availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "04:30 PM", "06:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu", "Hindi"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Arjun Kumar is an accomplished neurologist specializing in stroke prevention, epilepsy management, migraine treatments, neuro-rehabilitation, and peripheral neuropathies.",
        rating: 4.9,
        reviews: 178
      }
    ]
  },
  {
    id: "hosp-sunrise-vizag",
    name: "Sunrise Healthcare Centre",
    type: "Maternal, Child & Family Wellness Hospital",
    location: "Visakhapatnam",
    address: "Daba Gardens, Near Jagadamba Junction, Visakhapatnam, Andhra Pradesh 530020",
    phone: "+91 891 288 3344",
    email: "contact@sunrisehealthcare.org",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 215,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Dermatology", "Pediatrics", "ENT", "Gynecology"],
    description: "Sunrise Healthcare Centre focuses on family medicine, dedicated pediatric and neonatal ICUs, advanced dermatological care, and compassionate general wellness consultation.",
    doctors: [
      {
        id: "doc-sneha-varma",
        name: "Dr. Sneha Varma",
        specialization: "Pediatrician",
        qualification: "MBBS, MD (Pediatrics), DNB (Neonatology)",
        experience: 9,
        consultationFee: 650,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu", "Hindi"],
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Sneha Varma is a warm, attentive pediatric specialist expert in newborn care, childhood immunizations, pediatric infectious diseases, and developmental assessment.",
        rating: 4.9,
        reviews: 165
      },
      {
        id: "doc-rajesh-k",
        name: "Dr. K. Rajesh",
        specialization: "Orthopedic Surgeon",
        qualification: "MBBS, MS (Orthopedics), M.Ch (Joint Replacement)",
        experience: 14,
        consultationFee: 800,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
        consultationMode: "In-person",
        languages: ["English", "Telugu"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. K. Rajesh is an expert orthopedic surgeon specializing in joint replacement, sports injury arthroscopy, spinal alignments, and fracture management.",
        rating: 4.8,
        reviews: 130
      }
    ]
  },
  {
    id: "hosp-sevenhills-vizag",
    name: "SevenHills Hospital",
    type: "Integrated Multi-Disciplinary Healthcare",
    location: "Visakhapatnam",
    address: "Rockdale Layout, Waltair Uplands, Visakhapatnam, Andhra Pradesh 530002",
    phone: "+91 891 270 8090",
    email: "info@sevenhillshospitals.com",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 310,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Orthopedics", "Pulmonology", "Gastroenterology"],
    description: "SevenHills Hospital has served the coastal Andhra region for decades with exceptional emergency critical care, cutting-edge diagnostic imaging, and renowned surgical teams.",
    doctors: [
      {
        id: "doc-srinivas-m",
        name: "Dr. M. Srinivas",
        specialization: "General Physician",
        qualification: "MBBS, MD (General Medicine)",
        experience: 16,
        consultationFee: 600,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Srinivas is a seasoned clinical consultant with extensive experience managing complex chronic disorders, diabetes mellitus, and systemic infectious diseases.",
        rating: 4.8,
        reviews: 195
      }
    ]
  },
  {
    id: "hosp-pinnacle-vizag",
    name: "Pinnacle Hospital",
    type: "Advanced Super Specialty & Research Institute",
    location: "Visakhapatnam",
    address: "Plot 10, Health City, Chinagadili, Visakhapatnam, Andhra Pradesh 530040",
    phone: "+91 891 299 1100",
    email: "contact@pinnaclehospital.org",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 190,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["Cardiology", "Neurology", "Oncology", "Nephrology", "General Medicine"],
    description: "Pinnacle Hospital in Vizag Health City is a benchmark of modern medical technology featuring advanced linear accelerators, kidney transplant facilities, and 24/7 trauma services.",
    doctors: [
      {
        id: "doc-kavitha-n",
        name: "Dr. N. Kavitha",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience: 11,
        consultationFee: 850,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "11:45 AM", "02:30 PM", "04:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["English", "Telugu", "Hindi"],
        avatar: "https://images.unsplash.com/photo-1594824813590-7814b7e802ea?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Kavitha is an expert clinical cardiologist specializing in non-invasive imaging, echocardiography, heart failure management, and lipid clinics.",
        rating: 4.9,
        reviews: 156
      }
    ]
  }
];

export const DEPARTMENTS = [
  "All Departments",
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "ENT",
  "Gynecology",
  "Pulmonology"
];

export const LOCATIONS = [
  "All Locations",
  "Visakhapatnam"
];

// Helper to get all doctors flattened across hospitals
export const ALL_DOCTORS = HOSPITALS.flatMap((hosp) =>
  hosp.doctors.map((doc) => ({
    ...doc,
    hospitalId: hosp.id,
    hospitalName: hosp.name,
    hospitalLocation: hosp.location,
    hospitalAddress: hosp.address,
    hospitalPhone: hosp.phone,
    emergencyAvailable: hosp.emergencyAvailable,
  }))
);
