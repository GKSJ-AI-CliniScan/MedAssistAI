/**
 * Comprehensive Andhra Pradesh Healthcare Hospital & Specialist Directory
 * MedAssist AI – Real-World Healthcare Clinical Platform
 * 
 * Note: These entries represent accredited demonstration healthcare facilities and certified medical specialists across all major districts of Andhra Pradesh.
 */

export const HOSPITALS = [
  // ── 1. VISAKHAPATNAM ──
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
    departments: ["General Medicine", "Cardiology", "Dermatology", "Neurology", "Pediatrics", "Orthopedics"],
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
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "05:30 PM"],
        consultationMode: "In-person",
        languages: ["English", "Telugu"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Dr. Arjun Kumar is an expert in neuro-diagnostics, chronic migraine management, stroke rehabilitation, epilepsy care, and peripheral neuropathy disorders.",
        rating: 4.7,
        reviews: 165
      }
    ]
  },

  // ── 2. VIJAYAWADA ──
  {
    id: "hosp-manipal-vijayawada",
    name: "Manipal Super Specialty Hospital",
    type: "Comprehensive Tertiary Medical Care Centre",
    location: "Vijayawada",
    address: "Kanakadurga Varadhi, Tadepalli, Vijayawada - Guntur Highway, Andhra Pradesh 522501",
    phone: "+91 866 225 5000",
    email: "contact.vja@manipalhospitals.com",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewsCount: 420,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Neurology", "Gastroenterology", "Orthopedics", "Pediatrics"],
    description: "Manipal Hospital Vijayawada offers state-of-the-art emergency trauma care, advanced minimally invasive surgeries, cardiology, nephrology, and comprehensive pediatric diagnostics.",
    doctors: [
      {
        id: "doc-k-srinivas-vja",
        name: "Dr. K. Srinivas Rao",
        specialization: "General Physician",
        qualification: "MBBS, MD (General Medicine)",
        experience: 14,
        consultationFee: 650,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Hindi"],
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
        bio: "Senior consultant physician specializing in infectious diseases, metabolic disorders, geriatric health, and preventative wellness.",
        rating: 4.9,
        reviews: 230
      },
      {
        id: "doc-v-lakshmi-vja",
        name: "Dr. V. Lakshmi Prameela",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience: 11,
        consultationFee: 850,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "12:30 PM", "03:30 PM", "05:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1594824813590-7814b7e802ea?w=400&auto=format&fit=crop&q=80",
        bio: "Specialist in non-invasive cardiology, preventive echocardiography, heart failure management, and hypertensive heart disease.",
        rating: 4.8,
        reviews: 175
      }
    ]
  },
  {
    id: "hosp-ramesh-vijayawada",
    name: "Ramesh Cardiac & Multispeciality Hospitals",
    type: "Cardiovascular & Emergency Trauma Institute",
    location: "Vijayawada",
    address: "MG Road, Near Benz Circle, Vijayawada, Andhra Pradesh 520010",
    phone: "+91 866 248 8888",
    email: "care@rameshhospitals.com",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 310,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["Cardiology", "Neurology", "Orthopedics", "General Medicine", "ENT"],
    description: "Ramesh Hospitals is a leading healthcare pioneer in Andhra Pradesh renowned for world-class cardiac care, emergency stroke interventions, and critical care medicine.",
    doctors: [
      {
        id: "doc-p-ramesh-babu",
        name: "Dr. P. Ramesh Babu",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology), FSCAI",
        experience: 20,
        consultationFee: 1000,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
        availableTimeSlots: ["10:00 AM", "11:30 AM", "03:00 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Pioneering interventional cardiologist with over two decades of clinical experience in advanced angioplasty and structural heart therapies.",
        rating: 4.9,
        reviews: 380
      }
    ]
  },

  // ── 3. GUNTUR ──
  {
    id: "hosp-nri-guntur",
    name: "NRI General & Super Specialty Hospital",
    type: "Medical College Hospital & Multi-Discipline Center",
    location: "Guntur",
    address: "Chinakakani, Mangalagiri - Guntur Road, Guntur, Andhra Pradesh 522503",
    phone: "+91 863 234 4000",
    email: "info@nrias.net",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 260,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Orthopedics", "Dermatology", "Pediatrics", "Cardiology"],
    description: "NRI Hospital Guntur provides affordable, top-tier clinical healthcare and super-specialty surgery with a 1000+ bed capacity and modern diagnostic infrastructure.",
    doctors: [
      {
        id: "doc-t-sudhakar-gnt",
        name: "Dr. T. Sudhakar",
        specialization: "Orthopedic Surgeon",
        qualification: "MBBS, MS (Orthopedics), MCh (Ortho)",
        experience: 16,
        consultationFee: 700,
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Specialist in joint replacement surgery, arthroscopy, sports trauma injuries, and spinal decompression therapies.",
        rating: 4.8,
        reviews: 190
      },
      {
        id: "doc-m-radhika-gnt",
        name: "Dr. M. Radhika",
        specialization: "Pediatrician",
        qualification: "MBBS, MD (Pediatrics)",
        experience: 9,
        consultationFee: 500,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
        bio: "Specializes in newborn and pediatric care, immunization, developmental assessments, and childhood nutritional disorders.",
        rating: 4.9,
        reviews: 145
      }
    ]
  },

  // ── 4. TIRUPATI ──
  {
    id: "hosp-svims-tirupati",
    name: "SVIMS Super Specialty Hospital",
    type: "Autonomous Medical Research Institute & Hospital",
    location: "Tirupati",
    address: "Alipiri Road, Tirupati, Andhra Pradesh 517507",
    phone: "+91 877 228 7777",
    email: "director@svims.ac.in",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 390,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["Cardiology", "Neurology", "General Medicine", "Dermatology", "Orthopedics"],
    description: "Sri Venkateswara Institute of Medical Sciences (SVIMS) is an apex tertiary care university hospital delivering advanced cardiology, neurology, nephrology, and oncology services.",
    doctors: [
      {
        id: "doc-k-balaji-tpt",
        name: "Dr. K. Balaji Prasad",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience: 13,
        consultationFee: 750,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: ["09:00 AM", "10:30 AM", "01:30 PM", "04:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Tamil"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Expert in complex cardiac catheterization, pacemaker implantation, hypertension, and acute coronary care.",
        rating: 4.8,
        reviews: 215
      },
      {
        id: "doc-s-kavitha-tpt",
        name: "Dr. S. Kavitha",
        specialization: "General Physician",
        qualification: "MBBS, MD (Internal Medicine)",
        experience: 11,
        consultationFee: 550,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "05:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Tamil"],
        avatar: "https://images.unsplash.com/photo-1594824813590-7814b7e802ea?w=400&auto=format&fit=crop&q=80",
        bio: "Specializes in diabetes management, infectious diseases, preventive health checks, and chronic disease mitigation.",
        rating: 4.9,
        reviews: 160
      }
    ]
  },

  // ── 5. KURNOOL ──
  {
    id: "hosp-kims-kurnool",
    name: "KIMS Super Specialty Hospital",
    type: "Tertiary Multi-Discipline Hospital",
    location: "Kurnool",
    address: "NH 44, Joharapuram Road, Kurnool, Andhra Pradesh 518002",
    phone: "+91 8518 244 555",
    email: "kurnool@kimshospitals.com",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 220,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Orthopedics", "Cardiology", "Neurology", "Pediatrics"],
    description: "KIMS Hospital Kurnool offers comprehensive super-specialty healthcare with modern cardiac labs, neuro-surgery, joint replacement units, and 24/7 emergency response in the Rayalaseema region.",
    doctors: [
      {
        id: "doc-y-venkat-knl",
        name: "Dr. Y. Venkata Subbaiah",
        specialization: "General Physician",
        qualification: "MBBS, MD (Medicine)",
        experience: 12,
        consultationFee: 500,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:30 AM", "11:30 AM", "02:00 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Kannada"],
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
        bio: "Experienced physician focusing on chronic disease care, tropical fevers, hypertension, and preventive clinical medicine.",
        rating: 4.8,
        reviews: 155
      }
    ]
  },

  // ── 6. KAKINADA ──
  {
    id: "hosp-medicover-kakinada",
    name: "Medicover Hospitals",
    type: "European Standard Multi-Speciality Center",
    location: "Kakinada",
    address: "Main Road, Ramanayyapeta, Kakinada, Andhra Pradesh 533003",
    phone: "+91 884 233 4455",
    email: "info.kakinada@medicoverhospitals.in",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 195,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Dermatology", "Cardiology", "Orthopedics", "Pediatrics"],
    description: "Medicover Hospitals Kakinada brings European clinical standards to the Godavari region with advanced surgical units, modern cardiology, and expert diagnostics.",
    doctors: [
      {
        id: "doc-g-satish-kkd",
        name: "Dr. G. Satish Kumar",
        specialization: "Dermatologist",
        qualification: "MBBS, DVD, MD (Dermatology)",
        experience: 10,
        consultationFee: 600,
        availableDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Specializes in skin allergy treatment, eczema, psoriasis management, clinical phototherapy, and dermatological surgery.",
        rating: 4.8,
        reviews: 130
      }
    ]
  },

  // ── 7. RAJAHMUNDRY ──
  {
    id: "hosp-gsl-rajahmundry",
    name: "GSL Medical Centre & Super Specialty Hospital",
    type: "Teaching Hospital & Tertiary Care Centre",
    location: "Rajahmundry",
    address: "NH 16, Lakshmipuram, Rajahmundry, Andhra Pradesh 533296",
    phone: "+91 883 248 4999",
    email: "gslmedical@gslmc.com",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 240,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
    description: "GSL Medical Centre provides comprehensive multi-specialty healthcare with advanced ICUs, cancer therapy facilities, 24-hour trauma support, and super-specialty outpatient clinics.",
    doctors: [
      {
        id: "doc-n-chaitanya-rjy",
        name: "Dr. N. Chaitanya Varma",
        specialization: "General Physician",
        qualification: "MBBS, MD (General Medicine)",
        experience: 12,
        consultationFee: 500,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Consultant physician with expertise in complex metabolic disorders, respiratory infections, hypertension, and post-illness rehabilitation.",
        rating: 4.8,
        reviews: 165
      }
    ]
  },

  // ── 8. NELLORE ──
  {
    id: "hosp-simhapuri-nellore",
    name: "Simhapuri Super Speciality Hospital",
    type: "Tertiary Multi-Specialty Healthcare Centre",
    location: "Nellore",
    address: "NH 16, Podalakur Road, Nellore, Andhra Pradesh 524004",
    phone: "+91 861 234 5678",
    email: "care@simhapurihospital.com",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewsCount: 275,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Orthopedics", "Neurology", "Dermatology"],
    description: "Simhapuri Hospitals is one of the largest super-specialty hospitals in South Coastal Andhra Pradesh featuring 300+ beds, cardiac care units, neuro-sciences, and joint replacement.",
    doctors: [
      {
        id: "doc-p-sudhir-nlr",
        name: "Dr. P. Sudhir Reddy",
        specialization: "Cardiologist",
        qualification: "MBBS, MD, DM (Cardiology)",
        experience: 14,
        consultationFee: 800,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "05:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Tamil"],
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
        bio: "Senior interventional cardiologist with extensive experience in coronary stenting, arrhythmias, pacemaker checks, and preventive cardiac wellness.",
        rating: 4.9,
        reviews: 205
      }
    ]
  },

  // ── 9. ANANTAPUR ──
  {
    id: "hosp-saveera-anantapur",
    name: "Saveera Super Speciality Hospital",
    type: "Multi-Disciplinary Tertiary Hospital",
    location: "Anantapur",
    address: "Near Saptagiri Circle, Anantapur, Andhra Pradesh 515001",
    phone: "+91 8554 225 566",
    email: "info@saveerahospital.com",
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 180,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Orthopedics", "Pediatrics"],
    description: "Saveera Hospital Anantapur provides specialized emergency, cardiac, surgical, and multi-specialty clinical care for patients across Anantapur and Sri Sathya Sai districts.",
    doctors: [
      {
        id: "doc-k-mohan-atp",
        name: "Dr. K. Mohan Reddy",
        specialization: "General Physician",
        qualification: "MBBS, MD (General Medicine)",
        experience: 11,
        consultationFee: 500,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "11:30 AM", "02:30 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English", "Kannada"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Physician specializing in diabetes, hypertension, tropical viral infections, and adult immunizations.",
        rating: 4.8,
        reviews: 140
      }
    ]
  },

  // ── 10. KADAPA ──
  {
    id: "hosp-fathima-kadapa",
    name: "Fathima Super Speciality Hospital",
    type: "Medical Institute & Multi-Specialty Centre",
    location: "Kadapa",
    address: "RIMS Road, Kadapa, Andhra Pradesh 516002",
    phone: "+91 8562 255 111",
    email: "contact@fathimahospital.org",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 160,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Orthopedics", "Cardiology", "Dermatology"],
    description: "Fathima Hospital Kadapa offers round-the-clock emergency medical response, intensive care units, and specialist outpatient clinics for the YSR Kadapa region.",
    doctors: [
      {
        id: "doc-m-syed-kdp",
        name: "Dr. Syed M. Khader",
        specialization: "General Physician",
        qualification: "MBBS, MD (Medicine)",
        experience: 10,
        consultationFee: 450,
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
        availableTimeSlots: ["09:30 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "Urdu", "English"],
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
        bio: "Consultant physician with focus on general clinical diagnoses, lifestyle disease care, and gastrointestinal conditions.",
        rating: 4.7,
        reviews: 110
      }
    ]
  },

  // ── 11. VIZIANAGARAM ──
  {
    id: "hosp-mims-vizianagaram",
    name: "MIMS Super Specialty Hospital",
    type: "Teaching Hospital & Trauma Centre",
    location: "Vizianagaram",
    address: "Nellimarla, Vizianagaram, Andhra Pradesh 535217",
    phone: "+91 8922 244 800",
    email: "info@mimshospital.org",
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviewsCount: 170,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Pediatrics", "Dermatology", "Orthopedics", "Cardiology"],
    description: "Maharajah's Institute of Medical Sciences (MIMS) Hospital delivers expert healthcare, emergency ICU services, and specialized outpatient care in North Coastal Andhra Pradesh.",
    doctors: [
      {
        id: "doc-k-suresh-vzm",
        name: "Dr. K. Suresh Kumar",
        specialization: "General Physician",
        qualification: "MBBS, MD (Internal Medicine)",
        experience: 12,
        consultationFee: 450,
        availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
        bio: "Internal medicine specialist treating infectious fevers, hypertension, diabetic care, and preventive healthcare.",
        rating: 4.8,
        reviews: 125
      }
    ]
  },

  // ── 12. ELURU ──
  {
    id: "hosp-asram-eluru",
    name: "ASRAM Medical Institute Hospital",
    type: "Super Specialty & Teaching Hospital",
    location: "Eluru",
    address: "NH 16, Malkapuram, Eluru, Andhra Pradesh 534005",
    phone: "+91 8812 288 288",
    email: "asramhospital@asram.in",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 190,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
    description: "Alluri Sitarama Raju Academy of Medical Sciences (ASRAM) Hospital is a premier multi-specialty institution serving the West Godavari and Eluru districts.",
    doctors: [
      {
        id: "doc-v-ravi-elr",
        name: "Dr. V. Ravi Teja",
        specialization: "General Physician",
        qualification: "MBBS, MD (General Medicine)",
        experience: 11,
        consultationFee: 500,
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTimeSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "05:00 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
        bio: "Specializes in clinical internal medicine, cardiac risk screening, diabetic management, and post-viral recovery.",
        rating: 4.8,
        reviews: 135
      }
    ]
  },

  // ── 13. ONGOLE ──
  {
    id: "hosp-sanghamitra-ongole",
    name: "Sanghamitra Super Speciality Hospital",
    type: "Tertiary Multi-Specialty Centre",
    location: "Ongole",
    address: "Kurnool Road, Ongole, Prakasam District, Andhra Pradesh 523002",
    phone: "+91 8592 280 900",
    email: "info@sanghamitrahospital.com",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviewsCount: 165,
    emergencyAvailable: true,
    openingHours: "Open 24/7",
    consultationTypes: ["In-person", "Online Video"],
    departments: ["General Medicine", "Cardiology", "Orthopedics", "Pediatrics"],
    description: "Sanghamitra Hospital Ongole delivers advanced cardiology, orthopedics, trauma care, and super-specialty clinical consultations in Prakasam district.",
    doctors: [
      {
        id: "doc-k-prasad-ong",
        name: "Dr. K. Prasad Babu",
        specialization: "General Physician",
        qualification: "MBBS, MD (Medicine)",
        experience: 13,
        consultationFee: 500,
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: ["10:00 AM", "12:00 PM", "03:00 PM", "05:30 PM"],
        consultationMode: "Both (In-person & Online)",
        languages: ["Telugu", "English"],
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
        bio: "Consultant physician with expertise in systemic infections, hypertension, diabetes care, and general clinical triage.",
        rating: 4.8,
        reviews: 120
      }
    ]
  }
];

export const DEPARTMENTS = [
  "All Departments",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Gynecology",
  "ENT"
];

export const LOCATIONS = [
  "All Locations",
  "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Tirupati",
  "Kurnool",
  "Kakinada",
  "Rajahmundry",
  "Nellore",
  "Anantapur",
  "Kadapa",
  "Vizianagaram",
  "Eluru",
  "Ongole"
];
