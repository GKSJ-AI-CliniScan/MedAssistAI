import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Apple, 
  Dumbbell, 
  Moon, 
  Droplets, 
  Calendar, 
  Clock, 
  Heart, 
  Utensils, 
  Coffee, 
  Activity, 
  CheckCircle, 
  Stethoscope, 
  Download, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "../../services/api";
import jsPDF from "jspdf";

export default function Recommendations() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    age: "32",
    weight: "68",
    height: "172",
    gender: "female",
    activityLevel: "moderate",
    targetGoal: "Maintenance & Preventive Health"
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    // Generate default recommendations on mount
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    if (!healthData.age || !healthData.weight || !healthData.height) return;

    setIsGenerating(true);
    
    // Calculate BMI
    const heightInMeters = parseFloat(healthData.height) / 100;
    const weightInKg = parseFloat(healthData.weight);
    const bmiVal = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    
    let bmiCategory = "Normal";
    if (bmiVal < 18.5) bmiCategory = "Underweight";
    else if (bmiVal < 25) bmiCategory = "Normal Weight";
    else if (bmiVal < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // Base calorie needs
    const bmr = healthData.gender === "male"
      ? 10 * weightInKg + 6.25 * parseFloat(healthData.height) - 5 * parseFloat(healthData.age) + 5
      : 10 * weightInKg + 6.25 * parseFloat(healthData.height) - 5 * parseFloat(healthData.age) - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    const dailyCalories = Math.round(bmr * (activityMultipliers[healthData.activityLevel] || 1.4));

    // Structured recommendations data
    const recData = {
      bmi: bmiVal,
      bmiCategory,
      dailyWaterLiters: (weightInKg * 0.035).toFixed(1),
      dailyCalories,
      dietPlan: {
        calories: dailyCalories,
        meals: [
          { 
            time: "Breakfast (07:30 - 08:30 AM)", 
            title: "High-Fiber & Complex Carbohydrates",
            foods: ["Steel-cut oatmeal with blueberries & walnuts", "Boiled organic egg / Greek yogurt", "Warm green tea with lemon"] 
          },
          { 
            time: "Mid-Morning Snack (10:30 AM)", 
            title: "Micronutrient Boost",
            foods: ["Seasonal apple or pear slices", "Handful of unsalted raw almonds (10-12)", "Coconut water / herbal infusion"] 
          },
          { 
            time: "Lunch (01:00 - 02:00 PM)", 
            title: "Balanced Lean Protein & Greens",
            foods: ["Grilled chicken breast / tofu stir-fry", "Steamed quinoa or brown basmati rice", "Generous leafy green salad with olive oil & chia seeds"] 
          },
          { 
            time: "Evening Snack (04:30 PM)", 
            title: "Sustained Energy Snack",
            foods: ["Hummus with cucumber & carrot batons", "Handful of roasted pumpkin seeds", "Decaf chamomile tea"] 
          },
          { 
            time: "Dinner (07:30 - 08:30 PM)", 
            title: "Light & Easy Digestibility",
            foods: ["Baked wild salmon or lentil stew", "Steamed broccoli, zucchini & asparagus", "Clear vegetable broth"] 
          }
        ],
        foodsToInclude: [
          "Dark leafy greens (spinach, kale, arugula)",
          "Lean proteins (salmon, skinless poultry, lentils)",
          "Healthy monounsaturated fats (avocado, extra virgin olive oil)",
          "Fermented probiotic foods (kefir, plain yogurt, kimchi)",
          "Antioxidant berries & citrus fruits"
        ],
        foodsToAvoid: [
          "Ultra-processed packaged snacks and refined flour",
          "Excess added sugars and carbonated sodas",
          "Deep-fried trans-fats and high sodium meals",
          "Late-night heavy carbohydrates before sleep"
        ]
      },
      exercisePlan: {
        dailySteps: 10000,
        weeklySchedule: [
          { day: "Monday", type: "Cardio", duration: "35 mins", activity: "Brisk incline walking or moderate outdoor jog" },
          { day: "Tuesday", type: "Strength", duration: "45 mins", activity: "Lower body & core resistance training (squats, lunges, planks)" },
          { day: "Wednesday", type: "Cardio", duration: "30 mins", activity: "Low-impact swimming, cycling, or elliptical" },
          { day: "Thursday", type: "Rest & Mobility", duration: "25 mins", activity: "Gentle Hatha yoga stretching and joint mobility drills" },
          { day: "Friday", type: "Strength", duration: "45 mins", activity: "Upper body focus (push-ups, rows, dumbbell presses)" },
          { day: "Saturday", type: "Endurance", duration: "50 mins", activity: "Outdoor hiking, trail walking, or recreational sports" },
          { day: "Sunday", type: "Active Recovery", duration: "20 mins", activity: "Restorative walk in nature and deep breathing" }
        ],
        workoutTips: [
          "Always perform 5-8 minutes of dynamic warm-up before workouts",
          "Maintain proper hydration: drink 250ml water every 20 minutes of exercise",
          "Ensure gradual overload and avoid sudden extreme joint strain",
          "Allow at least 48 hours before retraining the same muscle groups"
        ]
      },
      lifestyle: {
        waterIntake: `${(weightInKg * 0.035).toFixed(1)} Liters daily`,
        sleep: "7.5 to 8.5 hours of uninterrupted nighttime sleep",
        stressManagement: [
          "10 minutes daily 4-7-8 diaphragmatic breathing meditation",
          "Daily outdoor sunlight exposure for 15-20 minutes in the morning",
          "Digital screen detox: no smartphones or tablets 60 minutes before bedtime",
          "Regular hydration breaks every 90 minutes of desk work"
        ],
        habits: [
          "Consistent daily meal schedules without erratic late snacking",
          "Ergonomic desk setup with 5-minute movement breaks each hour",
          "Maintain oral and dental hygiene twice daily",
          "Keep ambient bedroom temperature cool (18 - 20°C)"
        ]
      },
      followUpReminder: {
        nextCheckup: "Routine health review in 3 months",
        recommendedTests: ["Complete Blood Count (CBC)", "Fasting Lipid Profile", "HbA1c Glycemic Test", "Serum Vitamin D3 & B12"],
        monitoring: ["Blood Pressure bi-weekly", "Resting Heart Rate weekly", "Hydration compliance daily"]
      }
    };

    setRecommendations(recData);
    setIsGenerating(false);
  };

  const downloadPDFRecommendations = () => {
    if (!recommendations) return;

    const doc = new jsPDF();
    const patientName = user?.name || "Sarah Williams";
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header banner
    doc.setFillColor(6, 64, 43); // Dark emerald
    doc.rect(0, 0, 210, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("MedAssist AI - Personalized Healthcare Guide", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Nutritional Plan, Physical Exercise Regimen & Clinical Recommendations", 14, 28);
    doc.text(`Date: ${dateStr}`, 150, 28);

    // Profile summary
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("HEALTH PROFILE & BMI METRICS", 14, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Patient: ${patientName}`, 14, 55);
    doc.text(`Age: ${healthData.age} Years`, 80, 55);
    doc.text(`Weight: ${healthData.weight} kg | Height: ${healthData.height} cm`, 130, 55);

    doc.text(`BMI: ${recommendations.bmi} (${recommendations.bmiCategory})`, 14, 62);
    doc.text(`Daily Calorie Target: ${recommendations.dailyCalories} kcal`, 80, 62);
    doc.text(`Hydration Goal: ${recommendations.dailyWaterLiters} L / day`, 130, 62);

    // Diet Plan
    doc.line(14, 68, 196, 68);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DAILY NUTRITION & MEAL STRUCTURE", 14, 76);

    let yOffset = 83;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    recommendations.dietPlan.meals.forEach((m) => {
      doc.setFont("helvetica", "bold");
      doc.text(m.time, 14, yOffset);
      doc.setFont("helvetica", "normal");
      doc.text(`: ${m.foods.join(", ")}`, 70, yOffset);
      yOffset += 6;
    });

    // Exercise Plan
    yOffset += 4;
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("WEEKLY EXERCISE & ACTIVITY SCHEDULE", 14, yOffset);

    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    recommendations.exercisePlan.weeklySchedule.forEach((w) => {
      doc.text(`• ${w.day} (${w.type}, ${w.duration}): ${w.activity}`, 14, yOffset);
      yOffset += 5.5;
    });

    // Follow-up
    yOffset += 4;
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("CLINICAL FOLLOW-UP & MONITORING", 14, yOffset);

    yOffset += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Next Health Review: ${recommendations.followUpReminder.nextCheckup}`, 14, yOffset);
    yOffset += 5.5;
    doc.text(`Recommended Diagnostic Tests: ${recommendations.followUpReminder.recommendedTests.join(", ")}`, 14, yOffset);

    doc.save(`MedAssist_Healthcare_Plan_${patientName.replace(/ /g, '_')}.pdf`);
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
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Module 5 • Healthcare Advisory Engine
              </span>
              <span className="text-xs text-gray-500 font-semibold">Personalized Clinical & Lifestyle Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Treatment & Lifestyle Recommendations</h1>
            <p className="text-gray-600">Tailored dietary plans, weekly exercise regimens, hydration calculations, and preventive healthcare advice</p>
          </div>

          <div className="flex items-center gap-3">
            {recommendations && (
              <button
                onClick={downloadPDFRecommendations}
                className="px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Guide
              </button>
            )}
            <Link
              to="/patient/symptom-analysis"
              className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Symptom Checker
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Health Data Input Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl shadow-sm p-6 border border-gray-100 h-fit"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Patient Metrics
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={healthData.age}
                  onChange={(e) => setHealthData({...healthData, age: e.target.value})}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => setHealthData({...healthData, weight: e.target.value})}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => setHealthData({...healthData, height: e.target.value})}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Gender</label>
                <select
                  value={healthData.gender}
                  onChange={(e) => setHealthData({...healthData, gender: e.target.value})}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Activity Level</label>
                <select
                  value={healthData.activityLevel}
                  onChange={(e) => setHealthData({...healthData, activityLevel: e.target.value})}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                >
                  <option value="sedentary">Sedentary (Desk job / minimal motion)</option>
                  <option value="light">Light Activity (1-2 days / week)</option>
                  <option value="moderate">Moderate Activity (3-5 days / week)</option>
                  <option value="active">Very Active (6-7 days intense)</option>
                </select>
              </div>

              <button
                onClick={generateRecommendations}
                disabled={!healthData.age || !healthData.weight || !healthData.height || isGenerating}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-3 rounded-2xl font-bold hover:from-emerald-700 hover:to-emerald-900 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Recalculate Health Plan
              </button>
            </div>
          </motion.div>

          {/* Recommendations Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {recommendations && (
              <>
                {/* BMI & Metabolic Overview Header */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Body Mass Index</p>
                      <p className="text-3xl font-black text-emerald-950">{recommendations.bmi}</p>
                      <span className="text-xs font-bold text-emerald-700">{recommendations.bmiCategory}</span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Daily Calorie Target</p>
                      <p className="text-3xl font-black text-blue-950">{recommendations.dailyCalories}</p>
                      <span className="text-xs font-bold text-blue-700">kcal / day</span>
                    </div>

                    <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                      <p className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">Hydration Target</p>
                      <p className="text-3xl font-black text-teal-950">{recommendations.dailyWaterLiters} L</p>
                      <span className="text-xs font-bold text-teal-700">8-10 Glasses</span>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                      <p className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">Daily Step Goal</p>
                      <p className="text-3xl font-black text-purple-950">10,000</p>
                      <span className="text-xs font-bold text-purple-700">Cardio Baseline</span>
                    </div>
                  </div>
                </div>

                {/* Dietary Guidance Section */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-emerald-600" />
                    Structured Daily Nutrition & Meal Plan
                  </h3>

                  <div className="space-y-3 mb-6">
                    {recommendations.dietPlan.meals.map((meal, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-gray-900 text-sm">{meal.time}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            {meal.title}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {meal.foods.map((food, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white text-gray-800 rounded-lg text-xs font-medium border border-gray-200">
                              {food}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50/70 rounded-2xl border border-green-200">
                      <h4 className="font-bold text-green-900 text-sm mb-2 flex items-center gap-2">
                        <Apple className="w-4 h-4 text-green-600" />
                        Nutritional Foods to Include
                      </h4>
                      <ul className="space-y-1.5 text-xs text-green-950">
                        {recommendations.dietPlan.foodsToInclude.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200">
                      <h4 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-red-600" />
                        Foods to Minimize or Avoid
                      </h4>
                      <ul className="space-y-1.5 text-xs text-red-950">
                        {recommendations.dietPlan.foodsToAvoid.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-red-500 font-bold text-sm">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Exercise Regimen */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-emerald-600" />
                    Weekly Physical Activity & Workout Schedule
                  </h3>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                          <th className="py-2.5 px-3">Day</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Duration</th>
                          <th className="py-2.5 px-3">Activity Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recommendations.exercisePlan.weeklySchedule.map((s, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-bold text-gray-900">{s.day}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                s.type === "Rest" || s.type.includes("Recovery")
                                  ? "bg-gray-100 text-gray-700"
                                  : s.type === "Cardio"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}>
                                {s.type}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-gray-600">{s.duration}</td>
                            <td className="py-2.5 px-3 text-gray-700">{s.activity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lifestyle & Clinical Follow-up Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-emerald-600" />
                      Sleep & Stress Management
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-xs font-bold text-purple-900 uppercase">Nightly Sleep Target</p>
                        <p className="text-sm font-semibold text-gray-900">{recommendations.lifestyle.sleep}</p>
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {recommendations.lifestyle.stressManagement.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Follow-up & Diagnostic Schedule
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-900 uppercase">Next Recommended Review</p>
                        <p className="text-sm font-semibold text-gray-900">{recommendations.followUpReminder.nextCheckup}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Recommended Screening Tests</p>
                        <div className="flex flex-wrap gap-1">
                          {recommendations.followUpReminder.recommendedTests.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-md text-xs font-medium border border-gray-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
