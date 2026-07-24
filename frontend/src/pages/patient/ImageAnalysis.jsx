import { useState } from "react";
import { motion } from "motion/react";
import { ScanHeart, Upload, Loader2, AlertTriangle, CheckCircle, Stethoscope, X, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { hospitalDataService } from "../../services/hospitalDataService";

export default function ImageAnalysis() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageType, setImageType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const { t } = useTranslation();

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setResults(null);
    } else {
      alert(t('imageAnalysis.error', 'Please upload an image file'));
    }
  };

  const analyzeImage = async () => {
    if (!file || !imageType) return;

    setIsAnalyzing(true);
    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock results based on image type
    const mockResults = {
      predictedDisease: imageType === 'xray' ? t('imageAnalysis.predictedDiseaseXray', 'Mild Pneumonia') : 
                       imageType === 'mri' ? t('imageAnalysis.predictedDiseaseMri', 'Degenerative Disc Disease') :
                       imageType === 'ct' ? t('imageAnalysis.predictedDiseaseCt', 'Small Pulmonary Nodule') : t('imageAnalysis.predictedDiseaseDefault', 'Normal'),
      confidence: Math.floor(Math.random() * 15) + 85,
      imagePreview: preview,
      aiExplanation: imageType === 'xray' ? 
        t('imageAnalysis.aiExplanationXray', 'The chest X-ray shows mild opacity in the lower right lung field, consistent with early-stage pneumonia. No significant pleural effusion or cardiomegaly observed.') :
        imageType === 'mri' ?
        t('imageAnalysis.aiExplanationMri', 'The MRI scan shows mild degenerative changes in the lumbar spine with disc dehydration at L4-L5 level. No significant neural compression noted.') :
        imageType === 'ct' ?
        t('imageAnalysis.aiExplanationCt', 'The CT scan reveals a small 4mm pulmonary nodule in the right upper lobe. Features suggest benign etiology. No other significant abnormalities.') :
        t('imageAnalysis.aiExplanationDefault', 'The image appears within normal limits with no significant pathological findings detected.'),
      suggestedSpecialist: imageType === 'xray' ? t('imageAnalysis.suggestedSpecialistXray', 'Pulmonologist') :
                          imageType === 'mri' ? t('imageAnalysis.suggestedSpecialistMri', 'Orthopedic Surgeon') :
                          imageType === 'ct' ? t('imageAnalysis.suggestedSpecialistCt', 'Radiologist') : t('imageAnalysis.suggestedSpecialistDefault', 'General Physician'),
      severity: imageType === 'xray' ? t('imageAnalysis.severityXray', 'Moderate') : t('imageAnalysis.severityDefault', 'Low'),
      followUpRecommendation: imageType === 'xray' ? t('imageAnalysis.followUpRecommendationXray', 'Follow-up X-ray in 2 weeks') :
                               imageType === 'mri' ? t('imageAnalysis.followUpRecommendationMri', 'Physical therapy and follow-up in 4 weeks') :
                               imageType === 'ct' ? t('imageAnalysis.followUpRecommendationCt', 'Follow-up CT scan in 6 months') : t('imageAnalysis.followUpRecommendationDefault', 'Routine follow-up')
    };
    
    setResults(mockResults);
    setIsAnalyzing(false);

    // Save to hospitalDataService
    const patientName = user?.name || "Alice Cooper";
    const patientId = user?.id || "patient-1";
    hospitalDataService.addImageAnalysis({
      patientId,
      patientName,
      type: imageType === 'xray' ? 'X-ray' : imageType === 'mri' ? 'MRI' : 'CT Scan',
      date: new Date().toISOString().split("T")[0],
      status: "AI Processed",
      aiFinding: mockResults.predictedDisease,
      confidence: mockResults.confidence,
      severity: mockResults.severity,
      explanation: mockResults.aiExplanation,
      suggestedSpecialist: mockResults.suggestedSpecialist,
      followUpRecommendation: mockResults.followUpRecommendation
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('imageAnalysis.dashboardTitle', 'Medical Image Analysis')}</h1>
          <p className="text-gray-600">{t('imageAnalysis.description', 'AI-powered medical image analysis for X-rays, MRIs, and CT scans')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              {t('imageAnalysis.uploadTitle', 'Upload Medical Image')}
            </h2>

            {/* Image Type Selection */}
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700 block mb-2">{t('imageAnalysis.imageTypeLabel', 'Image Type')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'xray', label: t('imageAnalysis.imageTypeXray', 'Chest X-ray') },
                  { value: 'mri', label: t('imageAnalysis.imageTypeMri', 'MRI') },
                  { value: 'ct', label: t('imageAnalysis.imageTypeCt', 'CT Scan') },
                  { value: 'skin', label: t('imageAnalysis.imageTypeSkin', 'Skin Disease') }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setImageType(type.value)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      imageType === type.value
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-emerald-50'
                    } border`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer"
              >
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">{t('imageAnalysis.uploadPlaceholder', 'Click to upload or drag and drop')}</p>
                <p className="text-sm text-gray-400">{t('imageAnalysis.uploadFileTypes', 'PNG, JPG, JPEG files only')}</p>
              </label>
            </div>

            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-gray-100 rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setResults(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            <button
              onClick={analyzeImage}
              disabled={!file || !imageType || isAnalyzing}
              className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('imageAnalysis.analyzingImage', 'Analyzing Image...')}
                </>
              ) : (
                <>
                  <ScanHeart className="w-5 h-5" />
                  {t('imageAnalysis.analyzeImage', 'Analyze Image')}
                </>
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              {t('imageAnalysis.resultsTitle', 'Analysis Results')}
            </h2>
            
            {results ? (
              <div className="space-y-4">
                <div className={`p-4 border rounded-xl ${getSeverityColor(results.severity)}`}>
                  <h3 className="text-lg font-bold mb-1">{results.predictedDisease}</h3>
                  <p className="text-sm font-medium">Confidence: {results.confidence}%</p>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <h4 className="font-semibold text-gray-700 mb-2">{t('imageAnalysis.aiExplanation', 'AI Explanation')}</h4>
                  <p className="text-sm text-gray-600">{results.aiExplanation}</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">{t('imageAnalysis.recommendation', 'Recommendation')}</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>{t('imageAnalysis.specialist', 'Suggested Specialist')}:</strong> {results.suggestedSpecialist}</p>
                    <p><strong>{t('imageAnalysis.followUp', 'Follow-up')}:</strong> {results.followUpRecommendation}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <Stethoscope className="w-16 h-16 mb-4 opacity-50" />
                <p>{t('imageAnalysis.resultsPlaceholder', 'Upload and analyze an image to see results here.')}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}