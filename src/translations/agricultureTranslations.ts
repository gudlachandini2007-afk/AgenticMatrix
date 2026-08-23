// Multilingual dictionary for Smart Agriculture supporting English (en), Telugu (te), and Hindi (hi)

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface PlantDiagnosticI18n {
  id: string;
  cropName: string;
  cropNameTe: string;
  cropNameHi: string;
  diseaseName: string;
  diseaseNameTe: string;
  diseaseNameHi: string;
  scientificName: string;
  confidence: number;
  severity: string;
  severityTe: string;
  severityHi: string;
  imagePlaceholder: string;
  symptoms: string[];
  symptomsTe: string[];
  symptomsHi: string[];
  recommendedAction: string;
  recommendedActionTe: string;
  recommendedActionHi: string;
  treatmentSteps: string[];
  treatmentStepsTe: string[];
  treatmentStepsHi: string[];
}

export const AGRI_TRANSLATIONS = {
  en: {
    hubTitle: 'Smart Agriculture & Farmer Assistant',
    hubSubtitle: 'Instant Crop Disease Diagnosis, Real-Time Weather & Live Field Sensors',
    selectLanguage: 'Select Language / భాష / भाषा:',
    liveDataBadge: 'Live Satellite Weather Active',
    regionSelectorLabel: 'Selected Farming Region:',
    uploadPhotoTitle: '📸 Take or Upload Crop Leaf Photo',
    uploadPhotoSubtitle: 'Click or drop clear leaf photo for instant AI pathogen detection and organic/chemical remedies',
    orChooseSample: 'Or test with common crops:',
    diagnosingText: '🔍 Analyzing crop leaf tissue and detecting plant diseases in realtime...',
    detectedDisease: 'Identified Plant Disease',
    scientificName: 'Scientific Name',
    symptoms: 'Observed Symptoms & Signs',
    treatmentProtocol: 'Prescribed Treatment Protocol & Farm Remedies',
    stepByStepGuidance: 'Step-by-Step Action for Farmers:',
    weatherAdvisoriesTitle: '🌤️ Live Weather & Farming Advisories',
    weatherAdvisoriesSubtitle: 'Live temperature, humidity, rainfall, and spray window guidance',
    currentWeather: 'Current Live Weather',
    temperature: 'Temperature',
    humidity: 'Air Humidity',
    soilMoistureEst: 'Estimated Soil Moisture',
    windSpeed: 'Wind Speed',
    sprayWindowStatus: 'Spray Window Condition',
    sprayGood: '✅ Favorable for spraying (Low wind & clear)',
    sprayWarning: '⚠️ Delay spraying (Rain or high wind expected)',
    telemetryTitle: '🌱 Soil Sensor & Crop Health Grid',
    telemetrySubtitle: 'Live sensor readings from monitored field sectors',
    zoneSector: 'Field Zone / Crop',
    soilMoisture: 'Soil Moisture',
    tempAndHum: 'Soil Temp / Ambient RH',
    npkStatus: 'Health Index',
    healthStatus: 'Health Status',
    lastSynced: 'Last Synced',
    optimal: 'Optimal',
    warning: 'Attention',
    critical: 'Needs Attention',
    farmerHelpTip: '💡 Farmer Tip: Spray fungicides in the early morning (6 AM - 9 AM) or late evening to prevent leaf burning from direct sunlight.',
    // 5 New Feature Keys:
    listenVoiceBtn: '🔊 Listen Voice Guidance (Audio)',
    stopVoiceBtn: '⏹️ Stop Audio Readout',
    mandiRatesTitle: '🌾 Daily Mandi Wholesale Crop Prices (APMC)',
    mandiRatesSubtitle: 'Live commodity arrival rates in ₹ INR per Quintal across major agricultural markets',
    commodityCol: 'Crop / Commodity',
    mandiCol: 'Mandi / State',
    modalPriceCol: 'Current Rate (₹ / Quintal)',
    priceTrendCol: 'Today Change',
    arrivalCol: 'Arrivals (Tonnes)',
    fertilizerTitle: '🧪 Soil Health & NPK Fertilizer Dosage Calculator',
    fertilizerSubtitle: 'Compute optimal Urea, DAP, and MOP bags tailored to your exact farm acreage',
    selectCropLabel: 'Select Crop for Nutrition Plan:',
    farmAcresLabel: 'Farm Land Area (Acres):',
    calculateBtn: 'Calculate NPK Dosage',
    recommendedDose: 'Recommended Basal & Split Fertilizer Dosage',
    ureaReq: 'Urea (46% N)',
    dapReq: 'DAP (18:46:0)',
    mopReq: 'MOP Potash (60% K)',
    organicReq: 'Organic Compost / FYM',
    estCost: 'Estimated Fertilizer Cost:',
    applicationScheduleTitle: 'Application Timing Schedule:',
    emergencyAlertsTitle: '🚨 Live Pest Outbreak & Weather Warnings',
    emergencyAlertsSubtitle: 'Real-time advisories broadcasted by Agri Departments & ICAR',
    sendSmsAlert: '📲 Send SMS / WhatsApp Alert to Farmers',
    smsSentToast: 'Alert sent successfully to registered farmer mobile numbers!',
    saveDiagnosisBtn: '💾 Save to Farm Medical Log',
    savedSuccessToast: 'Diagnosis successfully saved to local farm records!',
    farmLogTitle: '📋 Farm Diagnostic Medical History',
    noHistoryYet: 'No previous crop diagnoses saved. Run a diagnostic test above to log your crop history.'
  },
  te: {
    hubTitle: 'స్మార్ట్ వ్యవసాయం & రైతు సహాయకుడు',
    hubSubtitle: 'తక్షణ పంట వ్యాధి నిర్ధారణ, ప్రత్యక్ష వాతావరణం & పొలం సెన్సార్ సమాచారం',
    selectLanguage: 'భాష ఎంచుకోండి (Language):',
    liveDataBadge: 'లైవ్ వాతావరణ సమాచారం సక్రియం',
    regionSelectorLabel: 'వ్యవసాయ ప్రాంతం:',
    uploadPhotoTitle: '📸 పంట ఆకు ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి',
    uploadPhotoSubtitle: 'పంట తెగులును గుర్తించి సేంద్రీయ మరియు రసాయన నివారణల కోసం ఆకు ఫోటోను ఎంచుకోండి',
    orChooseSample: 'లేదా సాధారణ పంటలను పరీక్షించండి:',
    diagnosingText: '🔍 AI ద్వారా పంట ఆకును విశ్లేషిస్తోంది మరియు తెగులును గుర్తిస్తోంది...',
    detectedDisease: 'గుర్తించిన పంట తెగులు / వ్యాధి',
    scientificName: 'శాస్త్రీయ నామం',
    symptoms: 'లక్షణాలు మరియు నష్ట తీవ్రత',
    treatmentProtocol: 'రైతులకు సిఫార్సు చేసిన నివారణ చర్యలు',
    stepByStepGuidance: 'రైతులు చేయవలసిన దశలవారీ పనులు:',
    weatherAdvisoriesTitle: '🌤️ లైవ్ వాతావరణం & రైతు సూచనలు',
    weatherAdvisoriesSubtitle: 'ఉష్ణోగ్రత, తేమ, వర్ష సూచన మరియు మందుల పిచికారీ సమయం',
    currentWeather: 'ప్రస్తుత వాతావరణం',
    temperature: 'ఉష్ణోగ్రత',
    humidity: 'గాలిలో తేమ',
    soilMoistureEst: 'నేలలో తేమ శాతం',
    windSpeed: 'గాలి వేగం',
    sprayWindowStatus: 'మందుల పిచికారీ అనుకూలత',
    sprayGood: '✅ పిచికారీకి అనుకూలం (తక్కువ గాలి & స్పష్టమైన వాతావరణం)',
    sprayWarning: '⚠️ పిచికారీ వాయిదా వేయండి (వర్షం లేదా తీవ్ర గాలి అవకాశం)',
    telemetryTitle: '🌱 నేల సెన్సార్ & పంట ఆరోగ్య సమాచారం',
    telemetrySubtitle: 'పొలంలో అమర్చిన సెన్సార్ల నుండి ప్రత్యక్ష నివేదిక',
    zoneSector: 'పొలం విభాగం / పంట',
    soilMoisture: 'నేల తేమ',
    tempAndHum: 'నేల ఉష్ణోగ్రత / గాలి తేమ',
    npkStatus: 'ఆరోగ్య సూచిక',
    healthStatus: 'ఆరోగ్య స్థితి',
    lastSynced: 'తాజా సమయం',
    optimal: 'బాగుంది (Optimal)',
    warning: 'జాగ్రత్త (Attention)',
    critical: 'వెంటనే చర్య తీసుకోండి',
    farmerHelpTip: '💡 రైతు సూచన: ఎండ తీవ్రత వల్ల ఆకులు మాడకుండా ఉండటానికి పురుగుమందులను ఉదయం (6-9 గంటలు) లేదా సాయంత్రం వేళల్లో పిచికారీ చేయండి.',
    // 5 New Feature Keys:
    listenVoiceBtn: '🔊 తెలుగులో వినండి (వాయిస్ గైడెన్స్)',
    stopVoiceBtn: '⏹️ వాయిస్ ఆపండి',
    mandiRatesTitle: '🌾 తాజా మార్కెట్ యార్డ్ (మార్కెట్) పంట ధరలు',
    mandiRatesSubtitle: 'ప్రధాన వ్యవసాయ మార్కెట్లలో క్వింటాల్‌కు ప్రస్తుత ధరల వివరాలు (రూపాయల్లో)',
    commodityCol: 'పంట పేరు',
    mandiCol: 'మార్కెట్ / రాష్ట్రం',
    modalPriceCol: 'సగటు ధర (₹ / క్వింటాల్)',
    priceTrendCol: 'నేటి మార్పు',
    arrivalCol: 'రాబడులు (టన్నులు)',
    fertilizerTitle: '🧪 నేల సారం & NPK ఎరువుల మోతాదు కాలిక్యులేటర్',
    fertilizerSubtitle: 'మీ పొలం ఎకరాల విస్తీర్ణానికి సరిపోయే యూరియా, డీఏపీ, పొటాష్ ఎరువుల లెక్క',
    selectCropLabel: 'పంటను ఎంచుకోండి:',
    farmAcresLabel: 'పొలం విస్తీర్ణం (ఎకరాలు):',
    calculateBtn: 'ఎరువుల మోతాదు లెక్కించండి',
    recommendedDose: 'సిఫార్సు చేసిన ఎరువుల మోతాదు',
    ureaReq: 'యూరియా (46% నత్రజని)',
    dapReq: 'డి.ఎ.పి (DAP 18:46:0)',
    mopReq: 'పొటాష్ (MOP 60% K)',
    organicReq: 'సేంద్రీయ పశువుల ఎరువు / కంపోస్ట్',
    estCost: 'అంచనా వేసిన ఎరువుల ఖర్చు:',
    applicationScheduleTitle: 'ఎరువులు వేయవలసిన సరైన సమయాలు:',
    emergencyAlertsTitle: '🚨 తెగుళ్ల వ్యాప్తి & అత్యవసర వాతావరణ హెచ్చరికలు',
    emergencyAlertsSubtitle: 'వ్యవసాయ పరిశోధనా కేంద్రం (ICAR) జారీ చేసిన అధికారిక సమాచారం',
    sendSmsAlert: '📲 రైతు మొబైల్‌కు SMS / వాట్సాప్ అలర్ట్ పంపండి',
    smsSentToast: 'రైతు మొబైల్ నంబర్లకు హెచ్చరిక విజయవంతంగా పంపబడింది!',
    saveDiagnosisBtn: '💾 పంట ఆరోగ్య చరిత్రలో భద్రపరచండి',
    savedSuccessToast: 'పంట నివేదిక విజయవంతంగా సేవ్ చేయబడింది!',
    farmLogTitle: '📋 సేవ్ చేసిన పంట ఆరోగ్య చరిత్ర',
    noHistoryYet: 'ఇంకా ఎలాంటి రికార్డులు సేవ్ కాలేదు. పైన ఉన్న పంట ఆకును పరీక్షించి రికార్డు నమోదు చేసుకోండి.'
  },
  hi: {
    hubTitle: 'स्मार्ट कृषि एवं किसान सहायक',
    hubSubtitle: 'त्वरित फसल रोग पहचान, लाइव मौसम पूर्वानुमान एवं खेत सेंसर डेटा',
    selectLanguage: 'भाषा चुनें (Language):',
    liveDataBadge: 'लाइव मौसम सक्रिय',
    regionSelectorLabel: 'कृषि क्षेत्र चुनें:',
    uploadPhotoTitle: '📸 फसल की पत्ती का फोटो लें या अपलोड करें',
    uploadPhotoSubtitle: 'रोग की पहचान और जैविक/रासायनिक उपचार के लिए पत्ती का साफ फोटो चुनें',
    orChooseSample: 'या प्रमुख फसलों के नमूने देखें:',
    diagnosingText: '🔍 AI द्वारा फसल पत्ती की जांच और रोग का विश्लेषण हो रहा है...',
    detectedDisease: 'पहचाना गया फसल रोग',
    scientificName: 'वैज्ञानिक नाम',
    symptoms: 'रोग के लक्षण और प्रभाव',
    treatmentProtocol: 'किसानों के लिए अनुशंसित उपचार व उपाय',
    stepByStepGuidance: 'चरणबद्ध उपचार विधि:',
    weatherAdvisoriesTitle: '🌤️ लाइव मौसम एवं कृषि सलाह',
    weatherAdvisoriesSubtitle: 'तापमान, आर्द्रता, वर्षा का पूर्वानुमान एवं कीटनाशक छिड़काव का सही समय',
    currentWeather: 'वर्तमान लाइव मौसम',
    temperature: 'तापमान',
    humidity: 'हवा में नमी (आर्द्रता)',
    soilMoistureEst: 'मिट्टी की नमी',
    windSpeed: 'हवा की गति',
    sprayWindowStatus: 'दवा छिड़काव की स्थिति',
    sprayGood: '✅ छिड़काव के लिए उत्तम समय (हल्की हवा व साफ मौसम)',
    sprayWarning: '⚠️ छिड़काव टालें (वर्षा या तेज हवा का अनुमान)',
    telemetryTitle: '🌱 खेत सेंसर एवं फसल स्वास्थ्य ग्रिड',
    telemetrySubtitle: 'खेत में लगे सेंसरों से लाइव डेटा',
    zoneSector: 'खेत क्षेत्र / फसल',
    soilMoisture: 'मिट्टी की नमी',
    tempAndHum: 'मिट्टी का तापमान / नमी',
    npkStatus: 'स्वास्थ्य सूचकांक',
    healthStatus: 'स्वास्थ्य स्थिति',
    lastSynced: 'अंतिम अपडेट',
    optimal: 'उत्तम (Optimal)',
    warning: 'सतर्कता (Attention)',
    critical: 'तत्काल ध्यान दें',
    farmerHelpTip: '💡 किसान सलाह: कीटनाशकों का छिड़काव सुबह (6 से 9 बजे) या शाम के समय करें ताकि तेज धूप से फसल को नुकसान न पहुंचे।',
    // 5 New Feature Keys:
    listenVoiceBtn: '🔊 हिंदी में सुनें (ऑडियो गाइड)',
    stopVoiceBtn: '⏹️ आवाज़ रोकें',
    mandiRatesTitle: '🌾 दैनिक मंडी थोक फसल भाव (APMC)',
    mandiRatesSubtitle: 'प्रमुख कृषि मंडियों में फसलों का लाइव भाव (₹ प्रति क्विंटल)',
    commodityCol: 'फसल / उपज',
    mandiCol: 'मंडी / राज्य',
    modalPriceCol: 'वर्तमान भाव (₹ / क्विंटल)',
    priceTrendCol: 'दैनिक परिवर्तन',
    arrivalCol: 'आवक (टन)',
    fertilizerTitle: '🧪 मृदा स्वास्थ्य एवं NPK उर्वरक मात्रा कैलकुलेटर',
    fertilizerSubtitle: 'खेत के रकबे (एकड़) के अनुसार यूरिया, डीएपी और पोटाश की सही मात्रा जानें',
    selectCropLabel: 'फसल का चयन करें:',
    farmAcresLabel: 'खेत का क्षेत्रफल (एकड़):',
    calculateBtn: 'खाद की मात्रा निकालें',
    recommendedDose: 'अनुशंसित खाद की मात्रा',
    ureaReq: 'यूरिया (46% नाइट्रोजन)',
    dapReq: 'डीएपी (DAP 18:46:0)',
    mopReq: 'म्यूरेट ऑफ पोटाश (MOP 60% K)',
    organicReq: 'जैविक गोबर खाद / वर्मीकम्पोस्ट',
    estCost: 'अनुमानित उर्वरक लागत:',
    applicationScheduleTitle: 'उर्वरक देने की सही समय-सारणी:',
    emergencyAlertsTitle: '🚨 कीट प्रकोप एवं मौसम चेतावनी अलर्ट',
    emergencyAlertsSubtitle: 'कृषि विभाग एवं ICAR द्वारा जारी आधिकारिक चेतावनी',
    sendSmsAlert: '📲 किसान के मोबाइल पर SMS / व्हाट्सएप अलर्ट भेजें',
    smsSentToast: 'पंजीकृत किसानों को अलर्ट सफलतापूर्वक भेज दिया गया!',
    saveDiagnosisBtn: '💾 फसल स्वास्थ्य रिकॉर्ड में सहेजें',
    savedSuccessToast: 'फसल जांच रिकॉर्ड सुरक्षित कर लिया गया!',
    farmLogTitle: '📋 सहेजे गए फसल स्वास्थ्य रिकॉर्ड',
    noHistoryYet: 'अभी तक कोई रिकॉर्ड सुरक्षित नहीं है। ऊपर फसल पत्ती की जांच करके इतिहास दर्ज करें।'
  }
};

export const MULTILINGUAL_DIAGNOSTICS: PlantDiagnosticI18n[] = [
  {
    id: 'sample-paddy',
    cropName: 'Paddy / Rice (వరి / धान)',
    cropNameTe: 'వరి (Paddy / Rice)',
    cropNameHi: 'धान / चावल (Paddy)',
    diseaseName: 'Rice Blast Disease (Magnaporthe oryzae)',
    diseaseNameTe: 'వరి అగ్గితెగులు (Rice Blast)',
    diseaseNameHi: 'धान का झुलसा रोग (Rice Blast)',
    scientificName: 'Magnaporthe oryzae',
    confidence: 99.2,
    severity: 'High',
    severityTe: 'తీవ్రమైనది (High)',
    severityHi: 'गंभीर (High)',
    imagePlaceholder: '🌾',
    symptoms: [
      'Spindle-shaped brown lesions with grayish centers on leaves',
      'Node and neck rot leading to blank grain heads',
      'Rapid spread during high humidity and moderate temperatures'
    ],
    symptomsTe: [
      'ఆకులపై మధ్యలో బూడిద రంగుతో కూడిన కంటి ఆకారపు గోధుమ మచ్చలు',
      'కంకి మెడ విరిగి గింజలు తాలుగా మారడం (మెడ విరుపు తెగులు)',
      'అధిక గాలి తేమలో తెగులు వేగంగా వ్యాపిస్తుంది'
    ],
    symptomsHi: [
      'पत्तियों पर आंख के आकार के धूसर केंद्र वाले भूरे धब्बे',
      'बालियों की गर्दन सूख कर टूट जाना और दाने खोखले होना',
      'उच्च आर्द्रता में रोग का तेजी से प्रसार'
    ],
    recommendedAction: 'Apply Tricyclazole 75% WP @ 0.6g per liter or Isoprothiolane 40% EC @ 1.5ml per liter.',
    recommendedActionTe: 'ట్రైసైక్లాజోల్ 75% WP (0.6 గ్రాములు లీటరు నీటికి) లేదా ఐసోప్రోథియోలేన్ (1.5 మి.లీ లీటరుకు) పిచికారీ చేయండి.',
    recommendedActionHi: 'ट्राइसाइक्लाजोल 75% WP (0.6 ग्राम प्रति लीटर) या आइसोप्रोथियोलेन (1.5 मिली प्रति लीटर) का छिड़काव करें।',
    treatmentSteps: [
      'Drain excess standing water from field for 2 days to aerate soil roots.',
      'Stop nitrogen/urea fertilizer immediately as excess nitrogen increases blast severity.',
      'Spray Tricyclazole in early morning and repeat after 10 days if cloudy weather persists.'
    ],
    treatmentStepsTe: [
      'పొలంలో నిల్వ ఉన్న నీటిని 2 రోజులు తీసివేసి నేలకు గాలి తగిలేలా చేయండి.',
      'యూరియా/నత్రజని ఎరువుల వాడకాన్ని తక్షణమే ఆపండి (నత్రజని ఎక్కువైతే తెగులు పెరుగుతుంది).',
      'ట్రైసైక్లాజోల్ మందును ఉదయం వేళ పిచికారీ చేయండి, 10 రోజుల తర్వాత మరలా పిచికారీ చేయండి.'
    ],
    treatmentStepsHi: [
      'खेत से 2 दिन के लिए अतिरिक्त पानी निकालें ताकि जड़ों को हवा मिल सके।',
      'यूरिया/नाइट्रोजन खाद का उपयोग तुरंत रोकें क्योंकि इससे रोग बढ़ता है।',
      'सुबह के समय ट्राइसाइक्लाजोल का छिड़काव करें और 10 दिन बाद आवश्यकतानुसार दोहराएं।'
    ]
  },
  {
    id: 'sample-chilli',
    cropName: 'Chilli / Peppers (మిరప / मिर्च)',
    cropNameTe: 'మిరప (Chilli)',
    cropNameHi: 'मिर्च (Chilli)',
    diseaseName: 'Chilli Leaf Curl & Anthracnose (Dieback)',
    diseaseNameTe: 'మిరప ఆకు ముడత & కొమ్మ ఎండు తెగులు',
    diseaseNameHi: 'मिर्च का पर्ण कुंचन (लीफ कर्ल) एवं फल सड़न',
    scientificName: 'Begomovirus / Colletotrichum capsici',
    confidence: 97.8,
    severity: 'Moderate',
    severityTe: 'మధ్యస్థం (Moderate)',
    severityHi: 'मध्यम (Moderate)',
    imagePlaceholder: '🌶️',
    symptoms: [
      'Upward and downward curling of young leaves with stunted growth',
      'Circular sunken dark spots on ripening chillies causing fruit drop',
      'Whitefly vector transmission in dry sunny spells'
    ],
    symptomsTe: [
      'చిగురు ఆకులు పైకి ముడుచుకుపోవడం మరియు ఎదుగుదల లోపించడం',
      'కాయలపై గుండ్రటి నల్లని మచ్చలు ఏర్పడి కాయలు రాలిపోవడం',
      'తెల్లదోమ మరియు తామర పురుగుల ద్వారా తెగులు వేగంగా వ్యాప్తి'
    ],
    symptomsHi: [
      'पत्तियों का ऊपर या नीचे की ओर मुड़ना और पौधों का बौनापन',
      'मिर्च के फलों पर काले धब्बे और फलों का गिरना',
      'सफेद मक्खी और थ्रिप्स कीटों द्वारा रोग का फैलाव'
    ],
    recommendedAction: 'Spray Acetamiprid 20% SP (0.5g/L) for whitefly control + Azoxystrobin (1ml/L) for anthracnose.',
    recommendedActionTe: 'తెల్లదోమ నివారణకు ఎసిటామిప్రిడ్ (0.5 గ్రా/లీ) + కొమ్మ ఎండు నివారణకు అజాక్సిస్ట్రోబిన్ (1 మి.లీ/లీ) పిచికారీ చేయండి.',
    recommendedActionHi: 'सफेद मक्खी नियंत्रण हेतु एसिटामिप्रिड (0.5 ग्राम/लीटर) + फफूंदनाशी एजोक्सिस्ट्रोबिन (1 मिली/लीटर) छिड़कें।',
    treatmentSteps: [
      'Install yellow and blue sticky traps (15 traps per acre) in the field.',
      'Spray neem oil (10,000 ppm @ 2ml/L) as a natural repellent against sap-sucking pests.',
      'Remove and safely destroy severely infected plants to prevent field-wide viral spread.'
    ],
    treatmentStepsTe: [
      'ఎకరానికి 15 చొప్పున పసుపు మరియు నీలం రంగు జిగురు అట్టలను పొలంలో అమర్చండి.',
      'రసం పీల్చే పురుగుల నివారణకు వేపనూనె (10,000 ppm @ 2 మి.లీ/లీ) పిచికారీ చేయండి.',
      'తీవ్రంగా తెగులు సోకిన మొక్కలను పీకి పొలానికి దూరంగా కాల్చివేయండి.'
    ],
    treatmentStepsHi: [
      'खेत में प्रति एकड़ 15 पीले और नीले चिपचिपे ट्रैप (Sticky Traps) लगाएं।',
      'रस चूसक कीटों से बचाव हेतु नीम का तेल (2 मिली प्रति लीटर) का छिड़काव करें।',
      'अत्यधिक ग्रसित पौधों को उखाड़कर नष्ट करें ताकि वायरस पूरे खेत में न फैले।'
    ]
  },
  {
    id: 'sample-cotton',
    cropName: 'Cotton (ప్రత్తి / कपास)',
    cropNameTe: 'ప్రత్తి (Cotton)',
    cropNameHi: 'कपास (Cotton)',
    diseaseName: 'Bacterial Blight & Pink Bollworm Infestation',
    diseaseNameTe: 'ప్రత్తి ఆకుమచ్చ & గులాబీ రంగు కాయ తొలుచు పురుగు',
    diseaseNameHi: 'कपास का जीवाणु अंगमारी एवं गुलाबी सुंडी',
    scientificName: 'Xanthomonas citri / Pectinophora gossypiella',
    confidence: 98.4,
    severity: 'High',
    severityTe: 'తీవ్రమైనది (High)',
    severityHi: 'गंभीर (High)',
    imagePlaceholder: '🌱',
    symptoms: [
      'Angular water-soaked dark leaf spots delimited by veins',
      'Rosette flowers and premature boll dropping with internal fiber damage',
      'Black arm lesions on vegetative stems'
    ],
    symptomsTe: [
      'ఆకుల ఈనెల మధ్య కోణాకారపు నీటి మచ్చలు (కోణీయ ఆకుమచ్చ)',
      'గులాబీ పురుగు ఆశించడం వల్ల గుడ్డి పువ్వులు మరియు కాయల లోపల దూది పాడవడం',
      'కొమ్మలు నల్లబడి విరిగిపోవడం'
    ],
    symptomsHi: [
      'पत्तियों पर कोणीय पानीदार काले धब्बे जो नसों से घिरे होते हैं',
      'गुलाबी सुंडी के कारण फूलों का बंद होना और कपास की गुणवत्ता खराब होना',
      'तनों पर काले घाव'
    ],
    recommendedAction: 'Spray Copper Oxychloride 50% WP (3g/L) + Streptocycline (1g/10L) for blight; install pheromone traps.',
    recommendedActionTe: 'కాపర్ ఆక్సీక్లోరైడ్ (3 గ్రా/లీ) + స్ట్రెప్టోసైక్లిన్ (1 గ్రాము 10 లీటర్లకు) పిచికారీ చేయండి; లింగాకర్షక బుట్టలు అమర్చండి.',
    recommendedActionHi: 'कॉपर ऑक्सीक्लोराइड (3 ग्राम/लीटर) + स्ट्रेप्टोसाइक्लिन (1 ग्राम प्रति 10 लीटर) का छिड़काव करें और फेरोमोन ट्रैप लगाएं।',
    treatmentSteps: [
      'Install 8-10 Pheromone traps per acre to monitor and trap pink bollworm moths.',
      'Spray Emamectin Benzoate 5% SG @ 0.5g/L if larval damage exceeds 5% threshold.',
      'Ensure proper spacing between rows to avoid excessive damp micro-climate.'
    ],
    treatmentStepsTe: [
      'ఎకరానికి 8-10 లింగాకర్షక బుట్టలు అమర్చి పురుగుల ఉధృతిని గమనించండి.',
      'పురుగు తీవ్రత ఎక్కువగా ఉంటే ఎమామెక్టిన్ బెంజోయేట్ 5% SG (0.5 గ్రా/లీ) పిచికారీ చేయండి.',
      'గాలి, వెలుతురు ధారాళంగా ప్రసరించేలా మొక్కల మధ్య తగిన దూరం పాటించండి.'
    ],
    treatmentStepsHi: [
      'गुलाबी सुंडी की निगरानी हेतु प्रति एकड़ 8-10 फेरोमोन ट्रैप लगाएं।',
      'कीट अधिक होने पर एमामेक्टिन बेंजोएट 5% SG (0.5 ग्राम/लीटर) का छिड़काव करें।',
      'पौधों के बीच पर्याप्त दूरी रखें ताकि धूप और हवा ठीक से लगे।'
    ]
  },
  {
    id: 'sample-tomato',
    cropName: 'Tomato (టమాట / टमाटर)',
    cropNameTe: 'టమాట (Tomato)',
    cropNameHi: 'टमाटर (Tomato)',
    diseaseName: 'Early Blight & Leaf Spot (Alternaria solani)',
    diseaseNameTe: 'టమాట ముందస్తు మాడు తెగులు (Early Blight)',
    diseaseNameHi: 'टमाटर की अगेती झुलसा बीमारी (Early Blight)',
    scientificName: 'Alternaria solani',
    confidence: 98.9,
    severity: 'Moderate',
    severityTe: 'మధ్యస్థం (Moderate)',
    severityHi: 'मध्यम (Moderate)',
    imagePlaceholder: '🍅',
    symptoms: [
      'Target-like concentric brown rings on lower leaves with yellow halo',
      'Sunken brown stem lesions and premature leaf defoliation',
      'Dark leathery spots near tomato stem fruit attachment'
    ],
    symptomsTe: [
      'దిగువ ఆకులపై గుండ్రటి వలయాల వంటి గోధుమ రంగు మచ్చలు, చుట్టూ పసుపు రంగు అంచు',
      'మొక్క కాండంపై నల్లని మచ్చలు మరియు ఆకులు రాలిపోవడం',
      'కాయల తొడిమల వద్ద నల్లని మచ్చలు'
    ],
    symptomsHi: [
      'निचली पत्तियों पर छल्लों जैसे गोल भूरे धब्बे और चारों ओर पीलापन',
      'तने पर काले घाव और पत्तियों का समय से पहले गिरना',
      'टमाटर के फल के डंठल के पास काले धब्बे'
    ],
    recommendedAction: 'Spray Mancozeb 75% WP @ 2.5g/L or Chlorothalonil @ 2g/L before rain triggers.',
    recommendedActionTe: 'మాంకోజెబ్ 75% WP (2.5 గ్రాములు లీటరు నీటికి) లేదా క్లోరోథలోనిల్ (2 గ్రా/లీ) పిచికారీ చేయండి.',
    recommendedActionHi: 'मैंकोजेब 75% WP (2.5 ग्राम प्रति लीटर) या क्लोरोथैलोनिल (2 ग्राम/लीटर) का छिड़काव करें।',
    treatmentSteps: [
      'Remove bottom 15cm foliage touching soil to eliminate splash transmission.',
      'Use drip irrigation instead of sprinkler watering to keep foliage completely dry.',
      'Spray copper fungicide on clear mornings with 8-day repetition.'
    ],
    treatmentStepsTe: [
      'నేలను తాకుతున్న కింద ఆకులను కత్తిరించి తీసివేయండి (నేల నుండి తెగులు వ్యాపించదు).',
      'ఆకులపై నీరు పడకుండా డ్రిప్ సేద్యం ద్వారా మాత్రమే నీరు అందించండి.',
      'స్పష్టమైన ఉదయం వేళ కాపర్ మందును పిచికారీ చేసి 8 రోజుల తర్వాత మళ్లీ పిచికారీ చేయండి.'
    ],
    treatmentStepsHi: [
      'जमीन को छूने वाली निचली पत्तियों को काट कर हटा दें ताकि संक्रमण न फैले।',
      'फव्वारे के बजाय ड्रिप सिंचाई का उपयोग करें ताकि पत्तियां सूखी रहें।',
      'साफ मौसम वाली सुबह कॉपर फफूंदनाशी का छिड़काव करें।'
    ]
  }
];
