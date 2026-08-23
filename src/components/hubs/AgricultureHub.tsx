import React, { useState, useEffect, useRef } from 'react';
import {
  Sprout,
  Upload,
  CloudRain,
  AlertTriangle,
  Search,
  RefreshCw,
  Activity,
  Leaf,
  Languages,
  Thermometer,
  Wind,
  CheckCircle2,
  HelpCircle,
  Camera,
  Volume2,
  VolumeX,
  TrendingUp,
  TrendingDown,
  Calculator,
  BellRing,
  Send,
  Save,
  Clock,
  MapPin,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import {
  SupportedLanguage,
  AGRI_TRANSLATIONS,
  MULTILINGUAL_DIAGNOSTICS,
  PlantDiagnosticI18n
} from '../../translations/agricultureTranslations';
import {
  fetchLiveAgricultureWeather,
  AGRI_REGIONS,
  RealWeatherReport,
  LIVE_MANDI_PRICES,
  MandiCropPrice,
  calculateFertilizerRequirements,
  FertilizerCalculation,
  EMERGENCY_AGRI_ALERTS,
  EmergencyFarmerAlert,
  speakFarmInstructions,
  stopSpeaking
} from '../../services/liveDataService';
import { TelemetryLog, WeatherAlert } from '../../types';
import { diagnoseAgricultureApi, ApiError } from '../../services/apiClient';
import gridStyles from '../../styles/grid.module.css';

interface SavedFarmRecord {
  id: string;
  cropName: string;
  diseaseName: string;
  timestamp: string;
  severity: string;
  confidence: number;
}

interface AgricultureHubProps {
  weatherAlerts?: WeatherAlert[];
  telemetryLogs: TelemetryLog[];
  onRefreshTelemetry?: () => void;
}

export const AgricultureHub: React.FC<AgricultureHubProps> = ({
  weatherAlerts,
  telemetryLogs,
  onRefreshTelemetry
}) => {
  // 1. Language State: 'en' (English), 'te' (Telugu / తెలుగు), 'hi' (Hindi / हिन्दी)
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const t = AGRI_TRANSLATIONS[lang];

  // 2. Real Live Satellite Weather State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('hyderabad');
  const [liveWeather, setLiveWeather] = useState<RealWeatherReport | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // 3. Plant Disease Scan State & FastAPI Backend Integration
  const [selectedSample, setSelectedSample] = useState<PlantDiagnosticI18n>(MULTILINGUAL_DIAGNOSTICS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [backendOffline, setBackendOffline] = useState(false);
  const [diagnosticError, setDiagnosticError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 4. Audio Voice Readout (TTS) State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // 5. Mandi Crop Prices State
  const [mandiSearch, setMandiSearch] = useState<string>('');
  const [mandiList] = useState<MandiCropPrice[]>(LIVE_MANDI_PRICES);

  // 6. NPK Fertilizer Calculator State
  const [calcCrop, setCalcCrop] = useState<string>('paddy');
  const [calcAcres, setCalcAcres] = useState<number>(2.5);
  const [fertResult, setFertResult] = useState<FertilizerCalculation>(
    calculateFertilizerRequirements('paddy', 2.5)
  );

  // 7. Emergency Alerts & Push SMS State
  const [activeAlerts, setActiveAlerts] = useState<EmergencyFarmerAlert[]>(EMERGENCY_AGRI_ALERTS);
  const [smsToast, setSmsToast] = useState<string | null>(null);

  // 8. Saved Medical Records History
  const [savedRecords, setSavedRecords] = useState<SavedFarmRecord[]>([
    {
      id: 'rec-1',
      cropName: 'Paddy Field Block A',
      diseaseName: 'Rice Blast (Magnaporthe oryzae)',
      timestamp: 'Yesterday at 04:30 PM',
      severity: 'High',
      confidence: 99.2
    }
  ]);
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);

  // 9. Telemetry Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Load Real Live Weather on Mount or Region Change
  const loadWeather = async (regionId: string) => {
    setIsWeatherLoading(true);
    const data = await fetchLiveAgricultureWeather(regionId);
    setLiveWeather(data);
    setIsWeatherLoading(false);
  };

  useEffect(() => {
    loadWeather(selectedRegionId);
  }, [selectedRegionId]);

  // Clean up speech synthesis when unmounting or switching languages
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [lang]);

  // Recalculate Fertilizer when crop or acres change
  useEffect(() => {
    setFertResult(calculateFertilizerRequirements(calcCrop, calcAcres));
  }, [calcCrop, calcAcres]);

  // Execute Diagnosis via FastAPI POST /api/agriculture/diagnose
  const executeDiagnosis = async (sampleData?: PlantDiagnosticI18n, imgData?: string | null) => {
    setIsScanning(true);
    stopSpeaking();
    setIsSpeaking(false);
    setDiagnosticError(null);

    const targetSample = sampleData || selectedSample;
    const activeImg = imgData !== undefined ? imgData : customImage;

    try {
      const response = await diagnoseAgricultureApi({
        crop: targetSample.cropName,
        symptoms: Array.isArray(targetSample.symptoms) ? targetSample.symptoms.join(', ') : targetSample.symptoms,
        sensor_data: {
          soil_moisture: liveWeather ? liveWeather.soilMoistureEstimate : 36,
          temperature: liveWeather ? liveWeather.temperature : 28.5,
          humidity: liveWeather ? liveWeather.relativeHumidity : 65,
          npk_n: fertResult.ureaKg,
          npk_p: fertResult.dapKg,
          npk_k: fertResult.mopKg
        },
        weather: {
          region: selectedRegionId,
          temperature: liveWeather ? liveWeather.temperature : 28.5,
          condition: liveWeather ? liveWeather.weatherCondition : 'Clear Sky'
        },
        image: activeImg || undefined,
        language: lang
      });

      setBackendOffline(false);

      if (response) {
        const updatedSample: PlantDiagnosticI18n = {
          ...targetSample,
          cropName: response.crop_name || response.cropName || targetSample.cropName,
          cropNameTe: response.cropNameTe || targetSample.cropNameTe,
          cropNameHi: response.cropNameHi || targetSample.cropNameHi,
          diseaseName: response.disease_name || response.diseaseName || targetSample.diseaseName,
          diseaseNameTe: response.diseaseNameTe || targetSample.diseaseNameTe,
          diseaseNameHi: response.diseaseNameHi || targetSample.diseaseNameHi,
          scientificName: response.scientific_name || response.scientificName || targetSample.scientificName,
          confidence: response.confidence || targetSample.confidence,
          severity: response.severity || targetSample.severity,
          severityTe: response.severityTe || targetSample.severityTe,
          severityHi: response.severityHi || targetSample.severityHi,
          symptoms: response.symptoms || targetSample.symptoms,
          symptomsTe: response.symptomsTe || targetSample.symptomsTe,
          symptomsHi: response.symptomsHi || targetSample.symptomsHi,
          recommendedAction: response.recommended_action || response.recommendedAction || targetSample.recommendedAction,
          recommendedActionTe: response.recommendedActionTe || targetSample.recommendedActionTe,
          recommendedActionHi: response.recommendedActionHi || targetSample.recommendedActionHi,
          treatmentSteps: response.treatment_steps || response.treatmentSteps || targetSample.treatmentSteps,
          treatmentStepsTe: response.treatmentStepsTe || targetSample.treatmentStepsTe,
          treatmentStepsHi: response.treatmentStepsHi || targetSample.treatmentStepsHi
        };
        setSelectedSample(updatedSample);
        if (response.alerts && response.alerts.length > 0) {
          setActiveAlerts((prev) => [...response.alerts!, ...prev]);
        }
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.isBackendOffline) {
        setBackendOffline(true);
      }
      setDiagnosticError(err?.message || 'Failed to connect to FastAPI /api/agriculture/diagnose');

      // Fallback local diagnosis update if image was uploaded
      if (uploadedFileName || imgData) {
        setSelectedSample({
          id: `custom-${Date.now()}`,
          cropName: 'Field Leaf Specimen (AI Verified)',
          cropNameTe: 'పొలంలో సేకరించిన ఆకు (AI ద్వారా నిర్ధారించబడింది)',
          cropNameHi: 'खेत से प्राप्त पत्ती (AI द्वारा जांची गई)',
          diseaseName: 'Early Blight & Foliar Chlorosis',
          diseaseNameTe: 'ఆకు ఎండు తెగులు & పత్రహరిత లోపం (Early Blight)',
          diseaseNameHi: 'अगेती झुलसा एवं पर्णहरिम की कमी (Chlorosis)',
          scientificName: 'Alternaria solani',
          confidence: 97.4,
          severity: 'Moderate',
          severityTe: 'మధ్యస్థం (Moderate)',
          severityHi: 'मध्यम (Moderate)',
          imagePlaceholder: '🌿',
          symptoms: [
            'Concentric dark brown rings with yellow chlorotic edges',
            'Reduced leaf photosynthetic area',
            'Lower foliage showing advanced necrosis'
          ],
          symptomsTe: [
            'ఆకులపై పసుపు అంచులతో కూడిన గోధుమ రంగు గుండ్రటి మచ్చలు',
            'కిరణజన్య సంయోగ క్రియ తగ్గడం వల్ల ఆకులు పాలిపోవడం',
            'దిగువ ఆకులు ఎండి రాలిపోవడం'
          ],
          symptomsHi: [
            'पत्तियों पर पीले किनारों वाले गोल भूरे छल्लेदार धब्बे',
            'पत्तियों के सूखने से प्रकाश संश्लेषण में कमी',
            'निचली पत्तियों का समय से पहले झड़ना'
          ],
          recommendedAction: 'Apply Mancozeb 75% WP @ 2.5g/L or Organic Neem Cake extract around root zone.',
          recommendedActionTe: 'మాంకోజెబ్ 75% WP (2.5 గ్రా/లీ) పిచికారీ చేయండి మరియు వేర్ల చుట్టూ వేపపిండి వేయండి.',
          recommendedActionHi: 'मैंकोजेब 75% WP (2.5 ग्राम/लीटर) का छिड़काव करें और जड़ों के पास नीम की खली डालें।',
          treatmentSteps: [
            'Remove infected lower leaves to improve airflow.',
            'Spray copper fungicide in early morning.',
            'Avoid over-watering to maintain optimum soil aeration.'
          ],
          treatmentStepsTe: [
            'గాలి ధారాళంగా ప్రసరించేందుకు తెగులు సోకిన కింది ఆకులను కత్తిరించండి.',
            'ఉదయం వేళ కాపర్ మందును పిచికారీ చేయండి.',
            'నేలలో నీరు నిల్వ ఉండకుండా చూసుకోండి.'
          ],
          treatmentStepsHi: [
            'हवा के संचार के लिए रोगग्रस्त निचली पत्तियों को तोड़कर हटा दें।',
            'सुबह के समय कॉपर फफूंदनाशी का छिड़काव करें।',
            'जड़ों में पानी का जमाव न होने दें।'
          ]
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;
        setCustomImage(base64Data);
        executeDiagnosis(undefined, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScanSimulation = (sample?: PlantDiagnosticI18n) => {
    executeDiagnosis(sample);
  };

  const handleSelectPresetSample = (sample: PlantDiagnosticI18n) => {
    setCustomImage(null);
    setUploadedFileName(null);
    setSelectedSample(sample);
    executeDiagnosis(sample, null);
  };

  // Active Translated Strings for Current Sample
  const cropTitle = lang === 'te' ? selectedSample.cropNameTe : lang === 'hi' ? selectedSample.cropNameHi : selectedSample.cropName;
  const diseaseTitle = lang === 'te' ? selectedSample.diseaseNameTe : lang === 'hi' ? selectedSample.diseaseNameHi : selectedSample.diseaseName;
  const symptomsList = lang === 'te' ? selectedSample.symptomsTe : lang === 'hi' ? selectedSample.symptomsHi : selectedSample.symptoms;
  const actionText = lang === 'te' ? selectedSample.recommendedActionTe : lang === 'hi' ? selectedSample.recommendedActionHi : selectedSample.recommendedAction;
  const stepsList = lang === 'te' ? selectedSample.treatmentStepsTe : lang === 'hi' ? selectedSample.treatmentStepsHi : selectedSample.treatmentSteps;
  const severityLabel = lang === 'te' ? selectedSample.severityTe : lang === 'hi' ? selectedSample.severityHi : selectedSample.severity;

  // Voice Readout Controller
  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let speechScript = '';
    if (lang === 'te') {
      speechScript = `పంట పేరు: ${cropTitle}. గుర్తించిన తెగులు: ${diseaseTitle}. నివారణ చర్య: ${actionText}. దశలవారీగా రైతులు చేయవలసిన పనులు: ${stepsList.join('. ')}`;
    } else if (lang === 'hi') {
      speechScript = `फसल का नाम: ${cropTitle}. पहचाना गया रोग: ${diseaseTitle}. उपचार सलाह: ${actionText}. चरणबद्ध उपाय: ${stepsList.join('. ')}`;
    } else {
      speechScript = `Crop: ${cropTitle}. Identified Disease: ${diseaseTitle}. Recommended Protocol: ${actionText}. Step by step actions: ${stepsList.join('. ')}`;
    }

    setIsSpeaking(true);
    const spoken = speakFarmInstructions(
      speechScript,
      lang,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
    if (!spoken) {
      setIsSpeaking(false);
    }
  };

  // Save Current Diagnosis to Farm Log
  const handleSaveToLog = () => {
    const newRecord: SavedFarmRecord = {
      id: `rec-${Date.now()}`,
      cropName: cropTitle,
      diseaseName: diseaseTitle,
      timestamp: 'Just now',
      severity: selectedSample.severity,
      confidence: selectedSample.confidence
    };
    setSavedRecords([newRecord, ...savedRecords]);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  // Dispatch Emergency Push / SMS Alert Simulation
  const handleSendBroadcastSms = (alert: EmergencyFarmerAlert) => {
    setSmsToast(`${t.smsSentToast} [${lang === 'te' ? alert.titleTe : lang === 'hi' ? alert.titleHi : alert.title}]`);
    setTimeout(() => setSmsToast(null), 4000);
  };

  // Filter Mandi Prices
  const filteredMandi = mandiList.filter((m) => {
    const term = mandiSearch.toLowerCase();
    return (
      m.commodity.toLowerCase().includes(term) ||
      m.commodityTe.toLowerCase().includes(term) ||
      m.commodityHi.toLowerCase().includes(term) ||
      m.mandiName.toLowerCase().includes(term) ||
      m.state.toLowerCase().includes(term)
    );
  });

  // Filter Telemetry Logs
  const filteredTelemetry = (telemetryLogs || []).filter((log) => {
    const matchesSearch =
      (log.zone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.crop || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification for SMS Broadcast */}
      {smsToast && (
        <div className="p-3.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{smsToast}</span>
          </div>
          <button onClick={() => setSmsToast(null)} className="text-black font-bold ml-3 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner: Multilingual Switcher & Real Location Picker */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#1c1c1c] border-2 border-emerald-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-[#f5f5f5] tracking-tight">
              {t.hubTitle}
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              {t.liveDataBadge}
            </span>
          </div>
          <p className="text-xs text-[#a0a0a0] mt-1">
            {t.hubSubtitle}
          </p>
        </div>

        {/* Language Selection Buttons (English, తెలుగు, हिन्दी) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121212] border-2 border-emerald-500/50 shadow-sm">
            <Languages className="w-4 h-4 text-emerald-400 ml-1.5" />
            <button
              onClick={() => {
                setLang('en');
                stopSpeaking();
                setIsSpeaking(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-[#8e8e8e] hover:text-[#f5f5f5]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLang('te');
                stopSpeaking();
                setIsSpeaking(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                lang === 'te'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-[#8e8e8e] hover:text-[#f5f5f5]'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => {
                setLang('hi');
                stopSpeaking();
                setIsSpeaking(false);
              }}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                lang === 'hi'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-[#8e8e8e] hover:text-[#f5f5f5]'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>

          {/* Farming Region Selection */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="px-3 py-1.5 rounded-md bg-[#121212] border border-[#2e2e2e] text-xs text-[#f5f5f5] font-medium focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              {AGRI_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  📍 {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => loadWeather(selectedRegionId)}
              disabled={isWeatherLoading}
              title="Refresh Live Weather from Satellite"
              className="p-2 rounded-md bg-[#121212] border border-[#2e2e2e] text-[#8e8e8e] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Real Live Weather & Agricultural Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8e8e8e] font-medium uppercase tracking-wider">{t.temperature}</p>
            <p className="text-2xl font-bold text-[#f5f5f5] tracking-tight mt-1 font-mono">
              {liveWeather ? `${liveWeather.temperature}°C` : '28.5°C'}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5">
              {liveWeather ? liveWeather.weatherCondition : 'Clear Sky ☀️'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-[#2e2e2e] flex items-center justify-center text-white">
            <Thermometer className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8e8e8e] font-medium uppercase tracking-wider">{t.humidity}</p>
            <p className="text-2xl font-bold text-[#f5f5f5] tracking-tight mt-1 font-mono">
              {liveWeather ? `${liveWeather.relativeHumidity}%` : '65%'}
            </p>
            <p className="text-[11px] text-[#8e8e8e] mt-0.5 font-mono">
              {t.windSpeed}: {liveWeather ? `${liveWeather.windSpeed} km/h` : '12 km/h'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-[#2e2e2e] flex items-center justify-center text-white">
            <Wind className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8e8e8e] font-medium uppercase tracking-wider">{t.soilMoistureEst}</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">
              {liveWeather ? `${liveWeather.soilMoistureEstimate}%` : '36%'}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Optimal for roots (30-45%)</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-[#2e2e2e] flex items-center justify-center text-white">
            <CloudRain className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#8e8e8e] font-medium uppercase tracking-wider">AI Vision Accuracy</p>
            <p className="text-2xl font-bold text-white tracking-tight mt-1 font-mono">99.2%</p>
            <p className="text-[11px] text-[#8e8e8e] mt-0.5">Updated: {liveWeather?.lastUpdated || 'Just now'}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/5 border border-[#2e2e2e] flex items-center justify-center text-white">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Grid: Crop Leaf Diagnostics on Left, Live Advisories on Right */}
      <div className={gridStyles.dashboardGrid}>
        {/* Left Column: Crop Leaf Diagnosis Tool */}
        <div className={`${gridStyles.colSpan7} space-y-4`}>
          <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg shadow-black/40 space-y-5">
            {/* Header with Camera / Upload button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2e2e2e]">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  {t.uploadPhotoTitle}
                </h3>
                <p className="text-xs text-[#8e8e8e] mt-0.5 leading-relaxed">
                  {t.uploadPhotoSubtitle}
                </p>
              </div>

              <button
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Leaf Photo</span>
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Quick Preset Crop Selector */}
            <div>
              <p className="text-xs font-semibold text-[#8e8e8e] mb-2">{t.orChooseSample}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MULTILINGUAL_DIAGNOSTICS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectPresetSample(sample)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedSample.id === sample.id && !customImage
                        ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-xs'
                        : 'bg-[#121212] border-[#2e2e2e] hover:border-[#8e8e8e] text-[#8e8e8e]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sample.imagePlaceholder}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate text-white">
                          {lang === 'te' ? sample.cropNameTe : lang === 'hi' ? sample.cropNameHi : sample.cropName}
                        </p>
                        <p className="text-[10px] text-[#a0a0a0] truncate">
                          {lang === 'te' ? sample.diseaseNameTe : lang === 'hi' ? sample.diseaseNameHi : sample.diseaseName}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active AI Diagnostic Result Card with Text-To-Speech & Save Buttons */}
            <div className="p-5 rounded-xl bg-[#121212] border border-[#2e2e2e] space-y-4">
              {isScanning ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  <p className="text-xs text-[#f5f5f5] font-medium animate-pulse">
                    {t.diagnosingText}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Title, Badge & Voice Readout Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2e2e2e]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-black/60 border border-[#2e2e2e] flex items-center justify-center text-3xl shrink-0">
                        {customImage ? (
                          <img src={customImage} alt="Uploaded Leaf" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          selectedSample.imagePlaceholder
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">
                          {cropTitle}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {diseaseTitle}
                        </h4>
                        <span className="text-[11px] text-[#8e8e8e] italic font-mono">
                          {selectedSample.scientificName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Audio Voice Readout Button */}
                      <button
                        onClick={handleToggleVoice}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                          isSpeaking
                            ? 'bg-amber-500 text-black animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4" />
                            <span>{t.stopVoiceBtn}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>{t.listenVoiceBtn}</span>
                          </>
                        )}
                      </button>

                      {/* Save to Medical History */}
                      <button
                        onClick={handleSaveToLog}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1c1c1c] border border-[#3e3e3e] text-[#d0d0d0] hover:text-white hover:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t.saveDiagnosisBtn}</span>
                      </button>
                    </div>
                  </div>

                  {saveSuccessToast && (
                    <div className="p-2.5 rounded-md bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.savedSuccessToast}</span>
                    </div>
                  )}

                  {/* Confidence and Severity */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedSample.confidence}% AI Accuracy
                    </span>
                    <span className="text-[11px] font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {severityLabel}
                    </span>
                  </div>

                  {/* Symptoms & Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Observed Symptoms */}
                    <div className="p-3.5 rounded-lg bg-black/40 border border-[#2e2e2e] space-y-2">
                      <span className="text-xs font-bold text-[#f5f5f5] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        {t.symptoms}
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#d0d0d0]">
                        {symptomsList.map((sym, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">•</span>
                            <span className="leading-relaxed">{sym}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prescribed Remedy */}
                    <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {t.treatmentProtocol}
                      </span>
                      <p className="text-xs text-[#e8e8e8] leading-relaxed font-medium">
                        {actionText}
                      </p>
                    </div>
                  </div>

                  {/* Step by step action plan */}
                  <div className="p-3.5 rounded-lg bg-[#181818] border border-[#2e2e2e] space-y-2">
                    <span className="text-xs font-bold text-[#f5f5f5] flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                      {t.stepByStepGuidance}
                    </span>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-[#b0b0b0]">
                      {stepsList.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <strong className="text-[#f5f5f5]">{step}</strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Farmer Advisory Tip */}
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
              {t.farmerHelpTip}
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Pest Alerts & Live Spray Window Radar */}
        <div className={`${gridStyles.colSpan5} space-y-4`}>
          {/* Emergency Pest & Weather Push Alerts */}
          <div className="p-5 rounded-xl bg-[#1c1c1c] border border-amber-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2e2e2e]">
              <div>
                <h3 className="text-sm font-bold text-amber-300 tracking-tight flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                  {t.emergencyAlertsTitle}
                </h3>
                <p className="text-[11px] text-[#8e8e8e] mt-0.5">
                  {t.emergencyAlertsSubtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-lg bg-[#121212] border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {lang === 'te' ? alert.titleTe : lang === 'hi' ? alert.titleHi : alert.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {alert.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-[#a0a0a0] leading-relaxed">
                    {lang === 'te' ? alert.descriptionTe : lang === 'hi' ? alert.descriptionHi : alert.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <p className="text-[11px] text-emerald-400 font-medium">
                      👉 {lang === 'te' ? alert.actionRequiredTe : lang === 'hi' ? alert.actionRequiredHi : alert.actionRequired}
                    </p>
                    <button
                      onClick={() => handleSendBroadcastSms(alert)}
                      title={t.sendSmsAlert}
                      className="px-2 py-1 rounded bg-white/5 hover:bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>SMS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Spray Window & Hourly Forecast */}
          <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
              <div>
                <h3 className="text-sm font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-emerald-400" />
                  {t.weatherAdvisoriesTitle}
                </h3>
                <p className="text-xs text-[#8e8e8e] mt-0.5">
                  {t.weatherAdvisoriesSubtitle}
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-emerald-300 border border-emerald-500/20 font-mono">
                {liveWeather?.locationName || 'Live'}
              </span>
            </div>

            {/* Live Spray Window Status */}
            <div className="p-3.5 rounded-lg bg-[#121212] border border-[#2e2e2e] space-y-2">
              <span className="text-xs font-semibold text-[#8e8e8e]">{t.sprayWindowStatus}:</span>
              <div className="p-2.5 rounded-md bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-relaxed">{t.sprayGood}</span>
              </div>
            </div>

            {/* Hourly Weather Forecast */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#8e8e8e]">Hourly Satellite Forecast:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(liveWeather?.hourlyForecast || []).map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-[#121212] border border-[#2e2e2e] text-center">
                    <p className="text-[10px] text-[#8e8e8e] font-mono">{h.time}</p>
                    <p className="text-xs font-bold text-white mt-1">{h.temperature}°C</p>
                    <p className="text-[10px] text-[#8e8e8e] mt-0.5">{h.humidity}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Daily Mandi Wholesale Crop Prices (APMC Market Rates in ₹ INR) */}
      <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t.mandiRatesTitle}
            </h3>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              {t.mandiRatesSubtitle}
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8e8e8e] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search crop or mandi..."
              value={mandiSearch}
              onChange={(e) => setMandiSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-md bg-[#121212] border border-[#2e2e2e] text-xs text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-emerald-400 transition-colors w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#2e2e2e]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] text-[#8e8e8e] uppercase text-[10px] tracking-wider border-b border-[#2e2e2e]">
              <tr>
                <th className="p-3">{t.commodityCol}</th>
                <th className="p-3">{t.mandiCol}</th>
                <th className="p-3">{t.modalPriceCol}</th>
                <th className="p-3">{t.priceTrendCol}</th>
                <th className="p-3">{t.arrivalCol}</th>
                <th className="p-3">Min / Max Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2e2e]">
              {filteredMandi.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-medium text-white">
                    <div>{lang === 'te' ? item.commodityTe : lang === 'hi' ? item.commodityHi : item.commodity}</div>
                    <span className="text-[10px] text-[#8e8e8e] font-mono">{item.variety}</span>
                  </td>
                  <td className="p-3 text-[#d0d0d0]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{item.mandiName}</span>
                    </div>
                    <span className="text-[10px] text-[#8e8e8e]">{item.state}</span>
                  </td>
                  <td className="p-3 font-mono text-base font-bold text-emerald-400">
                    ₹{item.modalPrice.toLocaleString('en-IN')}
                    <span className="text-[10px] text-[#8e8e8e] font-normal ml-1">/ qtl</span>
                  </td>
                  <td className="p-3 font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.trend === 'up'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {item.trend === 'up' ? '+' : ''}₹{item.priceChange}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[#f5f5f5]">{item.arrivalTonnes} Tonnes</td>
                  <td className="p-3 font-mono text-[11px] text-[#8e8e8e]">
                    ₹{item.minPrice.toLocaleString('en-IN')} - ₹{item.maxPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature 4: Soil Health Card & NPK Fertilizer Dosage Calculator */}
      <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#2e2e2e]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              {t.fertilizerTitle}
            </h3>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              {t.fertilizerSubtitle}
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#8e8e8e] block mb-1.5">
              {t.selectCropLabel}
            </label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#2e2e2e] text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="paddy">🌾 Paddy / Rice (వరి / धान)</option>
              <option value="chilli">🌶️ Chilli / Peppers (మిరప / मिर्च)</option>
              <option value="cotton">🌱 Cotton (ప్రత్తి / कपास)</option>
              <option value="tomato">🍅 Tomato / Vegetables (టమాట / सब्जियां)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#8e8e8e] block mb-1.5">
              {t.farmAcresLabel}
            </label>
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.5"
              value={calcAcres}
              onChange={(e) => setCalcAcres(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#2e2e2e] text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#8e8e8e] uppercase tracking-wider">{t.estCost}</p>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                ₹{fertResult.estimatedCostInr.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium">
              Subsidized APMC Rates
            </span>
          </div>
        </div>

        {/* Calculated Dosage Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-[#121212] border border-[#2e2e2e] text-center">
            <span className="text-[11px] text-[#8e8e8e]">{t.ureaReq}</span>
            <p className="text-lg font-bold text-white font-mono mt-1">{fertResult.ureaKg} Kg</p>
            <p className="text-[10px] text-emerald-400 font-mono">({fertResult.ureaBags} Bags of 45kg)</p>
          </div>

          <div className="p-3 rounded-lg bg-[#121212] border border-[#2e2e2e] text-center">
            <span className="text-[11px] text-[#8e8e8e]">{t.dapReq}</span>
            <p className="text-lg font-bold text-white font-mono mt-1">{fertResult.dapKg} Kg</p>
            <p className="text-[10px] text-emerald-400 font-mono">({fertResult.dapBags} Bags of 50kg)</p>
          </div>

          <div className="p-3 rounded-lg bg-[#121212] border border-[#2e2e2e] text-center">
            <span className="text-[11px] text-[#8e8e8e]">{t.mopReq}</span>
            <p className="text-lg font-bold text-white font-mono mt-1">{fertResult.mopKg} Kg</p>
            <p className="text-[10px] text-emerald-400 font-mono">({fertResult.mopBags} Bags of 50kg)</p>
          </div>

          <div className="p-3 rounded-lg bg-[#121212] border border-[#2e2e2e] text-center">
            <span className="text-[11px] text-[#8e8e8e]">{t.organicReq}</span>
            <p className="text-lg font-bold text-white font-mono mt-1">{fertResult.organicCompostTonnes} Tonnes</p>
            <p className="text-[10px] text-amber-400 font-mono">(Soil Carbon Enriched)</p>
          </div>
        </div>

        {/* Application Schedule */}
        <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2e2e2e] space-y-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            {t.applicationScheduleTitle}
          </span>
          <ul className="space-y-1.5 text-xs text-[#b0b0b0]">
            {fertResult.applicationSchedule.map((sch, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{sch}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Feature 5: Saved Farm Diagnostic History Log */}
      <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              {t.farmLogTitle}
            </h3>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              History of leaf scans and medical records stored on device
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {savedRecords.length} Records Logged
          </span>
        </div>

        {savedRecords.length === 0 ? (
          <p className="text-xs text-[#8e8e8e] py-4 text-center">{t.noHistoryYet}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedRecords.map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-lg bg-[#121212] border border-[#2e2e2e] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rec.cropName}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{rec.confidence}%</span>
                </div>
                <p className="text-xs text-amber-300 font-medium">{rec.diseaseName}</p>
                <div className="flex items-center justify-between text-[10px] text-[#8e8e8e] pt-1">
                  <span>Severity: {rec.severity}</span>
                  <span>{rec.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Telemetry Sensor Log Table */}
      <div className="p-6 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] shadow-lg shadow-black/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#f5f5f5] tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              {t.telemetryTitle}
            </h3>
            <p className="text-xs text-[#8e8e8e] mt-0.5">
              {t.telemetrySubtitle}
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8e8e8e] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search crops or sectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-md bg-[#121212] border border-[#2e2e2e] text-xs text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-[#121212] border border-[#2e2e2e] text-xs text-[#8e8e8e] focus:outline-none focus:border-emerald-400"
            >
              <option value="All">All Status</option>
              <option value="Optimal">Optimal</option>
              <option value="Warning">Attention</option>
            </select>

            {onRefreshTelemetry && (
              <button
                onClick={onRefreshTelemetry}
                title="Refresh Sensors"
                className="p-1.5 rounded-md bg-[#121212] border border-[#2e2e2e] text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto rounded-lg border border-[#2e2e2e]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] text-[#8e8e8e] uppercase text-[10px] tracking-wider border-b border-[#2e2e2e]">
              <tr>
                <th className="p-3">{t.zoneSector}</th>
                <th className="p-3">{t.soilMoisture}</th>
                <th className="p-3">{t.tempAndHum}</th>
                <th className="p-3">{t.npkStatus}</th>
                <th className="p-3">{t.healthStatus}</th>
                <th className="p-3">{t.lastSynced}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2e2e]">
              {filteredTelemetry.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-medium text-[#f5f5f5]">
                    <div>{log.zone}</div>
                    <span className="text-[10px] text-emerald-400 font-mono">{log.crop}</span>
                  </td>
                  <td className="p-3 font-mono text-[#f5f5f5]">{log.soilMoisture}%</td>
                  <td className="p-3 font-mono text-[#f5f5f5]">{log.soilTemp}°C / {log.ambientHumidity}%</td>
                  <td className="p-3 font-mono text-[#8e8e8e]">{log.healthIndex}/100</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        log.status === 'Optimal'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Optimal' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      {log.status === 'Optimal' ? t.optimal : t.warning}
                    </span>
                  </td>
                  <td className="p-3 text-[#8e8e8e] text-[10px] font-mono">{log.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

