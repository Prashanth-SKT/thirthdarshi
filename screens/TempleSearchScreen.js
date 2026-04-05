import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo
} from 'react';

import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Animated,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Text
} from 'react-native';

import Tooltip from 'react-native-walkthrough-tooltip';



import MapView, { Marker, Polyline, AnimatedRegion, PROVIDER_GOOGLE } from "react-native-maps";
import { fetchTemples } from "../../CleanDD/packages/api-client/firestoreClient";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import polyline from "@mapbox/polyline";
import {
  GOOGLE_API_KEY,
  GoogleAPIEndpoints,
} from "../../CleanDD/packages/google/googleApi";
import { getDistance } from "geolib";
import { LanguageContext } from "./LanguageContext";
import firestore from "@react-native-firebase/firestore";

import { Dropdown } from 'react-native-element-dropdown';
import LocationPermissionHandler from './LocationPermissionHandler';


import LanguageText from './LanguageText';
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';

/** ---- deity icons ---- */
import VishnuMarker from "../assets/vishnu_deity.png";
import RamaIcon from "../assets/rama.png";
import KrishnaIcon from "../assets/krishna.png";
import NarasimhaIcon from "../assets/narasimha.png";
import DurgaIcon from "../assets/durga.png";
import GaneshaIcon from "../assets/ganesha.png";
import SubrahmanyaIcon from "../assets/subrahmanya.png";
import ShivaLingamIcon from "../assets/shiva_lingam.png";

console.log('Dropdown direct =', Dropdown);




/** ---------- UI Translations ---------- */
const UI_TRANSLATIONS = {
  en: {
    selectFilter: "Select Filter",
    city: "City",
     state: "State", 
    nearby: "Nearby",
    all: "All",
    selectCity: "Select City",
     selectState: "Select State",
    searchPlaceholder: "Enter first 3 letters of temple or city name",
    permissionDenied: "Permission Denied",
    locationRequired: "Location permission is required",
    error: "Error",
    fetchError: "Unable to fetch temples. Please try again.",
    templeIdMissing: "Temple ID is missing",
    templeNotFound: "Temple not found",
    fetchDetailsError: "Failed to fetch temple details.",
    info: "Info",
     nearestTemples: "Nearest Temples",
    noNearestTemples: "No nearby temples found",
    templeDistance: "km away",
    noAdditionalDetails: "No additional details available for this temple.",
    loadDetailsError: "Failed to load details",
    routeError: "Route Error",
    selectItemError: "Failed to open the selected item.",
    mapLoading: "Loading map…",
    mainDeity: "Main Deity",
    showMore: "Show More",
    showLess: "Show Less",
    kmAway: "km away",
    noDescription: "No description available",
    noAdditionalInfo: "No additional details available",
    loadingTemples: "Loading temples...",
  },
  te: {
    selectFilter: "ఫిల్టర్ ఎంచుకోండి",
    city: "నగరం",
    state: "రాష్ట్రం",
    nearby: "సమీపంలో",

    all: "అన్నీ",
    nearestTemples: "సమీప ఆలయాలు",
    noNearestTemples: "సమీప ఆలయాలు కనుగొనబడలేదు",
    templeDistance: "కిమీ దూరంలో",
    selectCity: "నగరం ఎంచుకోండి",

     selectState: "రాష్ట్రం ఎంచుకోండి",
    searchPlaceholder: "మీరు వెతుకుతున్న ఆలయం పేరు లేదా నగర పేరు మొదటి 3 అక్షరాలు నమోదు చేయండి",
    permissionDenied: "అనుమతి నిరాకరించబడింది",
    locationRequired: "లొకేషన్ అనుమతి అవసరం",
    error: "లోపం",
    fetchError: "ఆలయాలను పొందడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    templeIdMissing: "ఆలయం ID లేదు",
    templeNotFound: "ఆలయం కనుగొనబడలేదు",
    fetchDetailsError: "ఆలయ వివరాలను పొందడం విఫలమైంది.",
    info: "సమాచారం",
    noAdditionalDetails: "ఈ ఆలయానికి అదనపు వివరాలు అందుబాటులో లేవు.",
    loadDetailsError: "వివరాలను లోడ్ చేయడం విఫలమైంది",
    routeError: "రూట్ లోపం",
    selectItemError: "ఎంచుకున్న అంశాన్ని తెరవడం విఫలమైంది.",
    mapLoading: "మ్యాప్ లోడ్ అవుతోంది…",
    mainDeity: "ప్రధాన దేవత",
    showMore: "మరింత చూపించు",
    showLess: "తక్కువ చూపించు",
    kmAway: "కి.మీ దూరంలో",
    noDescription: "వివరణ అందుబాటులో లేదు",
    noAdditionalInfo: "అదనపు వివరాలు అందుబాటులో లేవు",
    loadingTemples: "ఆలయాలు లోడ్ అవుతున్నాయి...",
  }
};

/** ---------- Deity detection ---------- */
const TOKENS = {
  vishnu: [
    "vishnu","narayana","govinda","venkateswara","srinivasa","balaji",
    "విష్ణు","విష్ణువు","శ్రీ విష్ణు","నారాయణ","వెంకటేశ్వర","శ్రీనివాస","శ్రీనివాసుడు","గోవింద",
    "विष्णु","नारायण","गोविंद","वैंकटेश्वर","श्रीनिवास",
  ],
  rama: [
    "rama","sri rama","shri rama","sriram",
    "రామ","శ్రీరామ","శ్రీ రామ","రాముడు",
    "राम","श्रीराम","श्री राम",
  ],
  krishna: [
    "krishna","sri krishna","shri krishna","gopala","muralidhar","murali",
    "కృష్ణ","శ్రీకృష్ణ","శ్రీ కృష్ణ","గోపాల","గోవింద",
    "कृष्ण","श्रीकृष्ण","गोपाल","गोविंद",
  ],
  narasimha: [
    "narasimha","nrsimha","narsimha","narasimh",
    "నరసింహ","నృసింహ","నరసింహుడు","లక్ష్మీనరసింహ",
    "नरसिंह","नृसिंह","लक्ष्मीनरसिंह",
  ],
  durga: [
    "durga","devi","shakti",
    "దుర్గ","దుర్గమ్మ","దేవి",
    "दुर्गा","देवी","शक्ति",
  ],
  ganesha: [
    "ganesh","ganesha","vinayaka","ganapati","vinayak","pillaiyar",
    "గణేశ","గణపతి","వినాయక",
    "गणेश","गणपति","विनायक",
  ],
  subrahmanya: [
    "subrahmanya","subramanya","subrahmanyam","murugan","karthikeya","skanda","kumara",
    "సుబ్రహ్మణ్య","సుబ్రహ్మణ్యం","మురుగన్","కార్తికేయ","కుమారస్వామి",
    "सुब्रह्मण्य","कार्तिकेय","स्कन्द","मुरुगन",
  ],
  shiva: [
    "shiva","siva","mahadev","mahadeva","shankara","rudra","lingeshwara","lingam","linga",
    "శివ","శివుడు","పరమశివ","లింగేశ్వర","లింగం",
    "शिव","महादेव","शंकर","रुद्र","लिंगेश्वर","लिंगम्",
  ],
};

const matchDeityKey = (txt) => {
  const s = (txt || "").toString().trim().toLowerCase();
  if (!s) return null;
  
  for (const [key, arr] of Object.entries(TOKENS)) {
    for (const tok of arr) {
      if (s === tok.toLowerCase()) return key;
    }
  }
  
  for (const [key, arr] of Object.entries(TOKENS)) {
    if (arr.some((tok) => s.includes(tok.toLowerCase()))) return key;
  }
  
  return null;
};

/** ---------- Cross-language search helper ---------- */
const searchTemplesCrossLanguage = (temples, searchTerm, currentLang) => {
  const term = searchTerm.trim().toLowerCase();
  if (!term || term.length < 3) return [];

  return temples.filter((temple) => {
    const nameMatch = (temple.name || "").toLowerCase().includes(term);
    const cityMatch = (temple.city || "").toLowerCase().includes(term);
    const nameEnMatch = (temple.name_en || "").toLowerCase().includes(term);
    const nameTeMatch = (temple.name_te || "").toLowerCase().includes(term);
    const cityEnMatch = (temple.city_en || "").toLowerCase().includes(term);
    const cityTeMatch = (temple.city_te || "").toLowerCase().includes(term);
    const nameTeRomanMatch = (temple.name_te_roman || "").toLowerCase().includes(term);
    const cityTeRomanMatch = (temple.city_te_roman || "").toLowerCase().includes(term);
    
    return nameMatch || cityMatch || nameEnMatch || nameTeMatch || 
           cityEnMatch || cityTeMatch || nameTeRomanMatch || cityTeRomanMatch;
  });
};
const DeityMarkerPin = ({ tItem, icon, onPress }) => {
  const displayIcon = icon || VishnuMarker;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tracksChanges, setTracksChanges] = useState(true);

  useEffect(() => {
    // Immediately set as loaded (fallback)
    setImageLoaded(true);
    
    // Stop tracking after 3 seconds to optimize performance
    const timer = setTimeout(() => {
      setTracksChanges(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={tItem.coords}
      onPress={() => onPress(tItem)}
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracksChanges}
      title={tItem.name}
      description={tItem.city || ""}
      zIndex={2}
      opacity={1}
    >
      <View
        style={{
          width: 48, 
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.4,
          shadowRadius: 5,
          elevation: 8,
          borderWidth: 2,
          borderColor: '#FFFFFF',
        }}
      >
        <Image
          source={displayIcon}
          style={{ 
            width: 40, 
            height: 40,
          }}
          resizeMode="contain"
          fadeDuration={0}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            console.warn('Failed to load marker image:', tItem.name);
            setImageLoaded(true); // Still show marker even if image fails
          }}
        />
      </View>
    </Marker>
  );
};
const extractBackgroundColor = (htmlContent) => {
  if (!htmlContent || htmlContent.trim() === '') return null;
  
  // Match background-color in body style
  const bodyBgMatch = htmlContent.match(/body\s*{[^}]*background-color:\s*([^;]+);/i);
  if (bodyBgMatch && bodyBgMatch[1]) {
    return bodyBgMatch[1].trim();
  }
  
  // Match any background-color in style tag
  const styleBgMatch = htmlContent.match(/background-color:\s*([^;]+);/i);
  if (styleBgMatch && styleBgMatch[1]) {
    return styleBgMatch[1].trim();
  }
  
  return null;
};


const PulsingUserMarker = ({ coordinate }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Marker
      coordinate={coordinate}  // ✅ FIXED: Use coordinate, not tItem.coords
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={10}
      tracksViewChanges={false}
      flat={false}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 122, 255, 0.3)',
            position: 'absolute',
            transform: [{ scale: pulseAnim }],
          }}
        />
        <View style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#007AFF',
          borderWidth: 3,
          borderColor: '#fff',
        }} />
      </View>
    </Marker>
  );
};
const windowWidth = Dimensions.get('window').width;
const DEFAULT_NEARBY_RADIUS = 50;
// Add this BEFORE const TempleSearchScreen = ({ navigation }) => {
const usePreloadImages = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      const images = [
        VishnuMarker,
        RamaIcon,
        KrishnaIcon,
        NarasimhaIcon,
        DurgaIcon,
        GaneshaIcon,
        SubrahmanyaIcon,
        ShivaLingamIcon,
      ];

      try {
        await Promise.all(
          images.map(image => {
            const uri = Image.resolveAssetSource(image).uri;
            return Image.prefetch(uri);
          })
        );
        console.log('✅ All deity images preloaded');
        setImagesLoaded(true);
      } catch (error) {
        console.error('❌ Error preloading images:', error);
        // Fallback: mark as loaded anyway
        setImagesLoaded(true);
      }
    };

    loadImages();
  }, []);

  return imagesLoaded;
};
const TempleSearchScreen = ({ navigation }) => {
   const imagesLoaded = usePreloadImages();
  const [showFilterHint, setShowFilterHint] = useState(false);
  const [showMarkerHint, setShowMarkerHint] = useState(false);
  const [showDirectionHint, setShowDirectionHint] = useState(false);
  
  // Track UI refs for tooltip placement
  const filterRef = useRef(null);
  const firstMarkerRef = useRef(null);
  const navIconRef = useRef(null);
  
  // Your other map, marker, and card state here
  const [isMapReady, setIsMapReady] = useState(false);
  
  const [miniCardVisible, setMiniCardVisible] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const { lang } = useContext(LanguageContext);
  const ui = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;
  const fontFamily = useMemo(() => {
  return lang === 'te' ? 'Gidugu_400Regular' : 'Arial';
}, [lang]);


const [selectedTempleFromState, setSelectedTempleFromState] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [temples, setTemples] = useState([]);
  const [allTemples, setAllTemples] = useState([]);
  const [nearestTemples, setNearestTemples] = useState([]);
const [showNearestHint, setShowNearestHint] = useState(false);
const nearestHintRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");  // ← ADD THIS
const [filters, setFilters] = useState({ cities: [], states: [] });
const [selectedFilterType, setSelectedFilterType] = useState("state"); // set state as default

  const [selectedTemple, setSelectedTemple] = useState(null);
  const [isLoadingTemples, setIsLoadingTemples] = useState(false);
// Add these three lines to your state section:
const [expandNearestList, setExpandNearestList] = useState(false);
const [showNearestToggle, setShowNearestToggle] = useState(false);
const [showDropdown, setShowDropdown]= useState(true)  // Default: dropdown visible


  const [routeCoords, setRouteCoords] = useState([]);
  const [routeSummary, setRouteSummary] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
const [locationError, setLocationError] = useState(null);
 const [step, setStep] = useState(0);

  // UI references for highlighting
  const mapRef = useRef(null);
  const templeIconRef = useRef(null);
 const searchTimeoutRef = useRef(null);
  // Define steps with target refs and instructional messages
  const steps = [
    {
      target: mapRef,
      message: 'Explore the map below. Tap temple icons to see temple details.',
    },
    {
      target: templeIconRef,
      message: 'Tap a temple icon to view timings and darshan info.',
    },
  ];

  // Advance to next step or finish onboarding
  const nextStep = () => {
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      setStep(-1);
    }
  };
  


  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.length >= 3) {
        const results = searchTemplesCrossLanguage(allTemples, query, lang);
        setTemples(results);
        setSuggestions(results.slice(0, 20));
      } else if (query.length === 0) {
        setTemples(allTemples);
        setSuggestions([]);
      } else {
        setSuggestions([]);
      }
    }, 250);
  }, [allTemples, lang]);

// ✅ NEW: Function to request location permission
const requestLocationPermission = async () => {
  try {
    setLocationPermissionDenied(false);
    setLocationError(null);
    
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    
    const result = await check(permission);
    console.log('📍 Location permission status:', result);
    
    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      console.log('📍 Permission request result:', requestResult);
      
      if (requestResult === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setLocationPermissionDenied(true);
        setLocationError('denied');
      }
    } else if (result === RESULTS.BLOCKED) {
      setLocationPermissionDenied(true);
      setLocationError('blocked');
    }
  } catch (error) {
    console.error('❌ Location permission error:', error);
    setLocationPermissionDenied(true);
    setLocationError('error');
  }
};

// ✅ NEW: Function to get current location
const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log('✅ Got user location:', coords);
      setUserLocation(coords);
      setLocationPermissionDenied(false);
      setLocationError(null);
    },
    (error) => {
      console.error('❌ Geolocation error:', error);
      setLocationPermissionDenied(true);
      setLocationError('gps_disabled');
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    }
  );
};

// ✅ NEW: Request permission on mount
useEffect(() => {
  requestLocationPermission();
}, []);
useEffect(() => {
  if (userLocation && mapRef.current) {
    mapRef.current.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000, // 1 second animation
    );
  }
}, [userLocation]);

  // Load filters and all temples with bilingual data
  useEffect(() => {
    (async () => {
      try {
        const all = await fetchTemples();
        const cities = new Set();
        const states = new Set();
        const formatted = all
          .map((tItem) => {
            const langData = tItem[lang];
            const enData = tItem.en || {};
            const teData = tItem.te || {};
            
            const lat = parseFloat(tItem.latitude ?? tItem.lat);
            const lon = parseFloat(tItem.longitude ?? tItem.long);

            if (isNaN(lat) || isNaN(lon)) return null;

            if (langData?.city) cities.add(langData.city.trim());
            if (langData?.state) states.add(langData.state.trim());
            return {
              firestoreId: tItem.id,
              coords: { latitude: lat, longitude: lon },
              name: langData?.name || enData.name || teData.name || "",
              city: langData?.city || enData.city || teData.city || "",
              state: langData?.state || enData.state || teData.state || "",
              description: langData?.description || enData.description || teData.description || "",
              mainDeity: langData?.mainDeity || enData.mainDeity || teData.mainDeity || "",
              deityType: langData?.deityType || enData.deityType || teData.deityType || "",
              name_en: enData.name || "",
              name_te: teData.name || "",
              city_en: enData.city || "",
              city_te: teData.city || "",
               state_en: enData.state || "",  // ← ADD THIS
            state_te: teData.state || "",
              name_te_roman: tItem.name_te_roman || "",
              city_te_roman: tItem.city_te_roman || "",
            };
          })
          .filter(Boolean);

        setFilters({
          cities: Array.from(cities).sort((a, b) => a.localeCompare(b, lang)),
          states: Array.from(states).sort((a, b) => a.localeCompare(b, lang)),
        });

        setAllTemples(formatted);
        console.log(`Loaded ${formatted.length} temples with bilingual data`);
      } catch (error) {
        console.error('Error loading temples:', error);
      }
    })();
  }, [lang]);

  // Fetch filtered temples
useEffect(() => {
  const fetchFilteredTemples = async () => {
    if (!selectedFilterType || (selectedFilterType === "state" && !selectedState)) {
      setTemples([]);
      setRouteCoords([]);
      setRouteSummary(null);
      setIsLoadingTemples(false);
      return;
    }
    setIsLoadingTemples(true);

    try {
      if (selectedFilterType === "all") {
        setTemples(allTemples);
        setRouteCoords([]);
        setRouteSummary(null);
        setIsLoadingTemples(false);
        return;
      }

      let params = { lang };
      let shouldFetch = false;
      let filterType = null;  // ← ADD THIS to track filter type
      let filterValue = null; // ← ADD THIS to track filter value

      if (selectedFilterType === "city" && selectedCity) {
        params.city = selectedCity;
        shouldFetch = true;
        filterType = "city";    // ← ADD THIS
        filterValue = selectedCity; // ← ADD THIS
      } else if (selectedFilterType === "state" && selectedState) {
        params.state = selectedState;
        shouldFetch = true;
        filterType = "state";   // ← ADD THIS
        filterValue = selectedState; // ← ADD THIS
      } else if (selectedFilterType === "nearby") {
        if (!userLocation) {
          setIsLoadingTemples(false);
          return;
        }
        shouldFetch = true;
      }

      if (!shouldFetch) {
        setTemples([]);
        setRouteCoords([]);
        setRouteSummary(null);
        setIsLoadingTemples(false);
        return;
      }

      let results = await fetchTemples(params);

      if (selectedFilterType === "nearby" && userLocation) {
        results = results
          .map((tItem) => {
            const lat = parseFloat(tItem.latitude ?? tItem.lat);
            const lon = parseFloat(tItem.longitude ?? tItem.long);
            
            if (isNaN(lat) || isNaN(lon)) return null;

            const distance = getDistance(
              userLocation,
              { latitude: lat, longitude: lon }
            ) / 1000;

            return {
              ...tItem,
              distance,
              latitude: lat,
              longitude: lon,
            };
          })
          .filter((tItem) => tItem && tItem.distance <= DEFAULT_NEARBY_RADIUS)
          .sort((a, b) => a.distance - b.distance);
      }

      // ← ADD THIS: Client-side filtering for city and state (fallback if backend doesn't filter)
      if (filterType === "city" && filterValue) {
        results = results.filter((tItem) => {
          const langData = tItem[lang];
          const itemCity = langData?.city || tItem.city || "";
          return itemCity.trim().toLowerCase() === filterValue.trim().toLowerCase();
        });
      } else if (filterType === "state" && filterValue) {
        // ← ADD THIS ENTIRE BLOCK
        results = results.filter((tItem) => {
          const langData = tItem[lang];
          const itemState = langData?.state || tItem.state || "";
          return itemState.trim().toLowerCase() === filterValue.trim().toLowerCase();
        });
      }

      const formatted = results
        .map((tItem) => {
          const langData = tItem[lang];
          const enData = tItem.en || {};
          const teData = tItem.te || {};
          const lat = parseFloat(tItem.latitude ?? tItem.lat);
          const lon = parseFloat(tItem.longitude ?? tItem.long);

          if (!langData || isNaN(lat) || isNaN(lon)) return null;

          return {
            firestoreId: tItem.id,
            coords: { latitude: lat, longitude: lon },
            name: langData.name || tItem.name || "",
            city: langData.city || tItem.city || "",
            state: langData.state || tItem.state || "",  // ← ADD THIS
            description: langData.description || tItem.description || "",
            mainDeity: langData.mainDeity || tItem.mainDeity || "",
            deityType: langData.deityType || tItem.deityType || "",
            distance: tItem.distance,
            name_en: enData.name || "",
            name_te: teData.name || "",
            city_en: enData.city || "",
            city_te: teData.city || "",
            state_en: enData.state || "",  // ← ADD THIS
            state_te: teData.state || "",  // ← ADD THIS
            name_te_roman: tItem.name_te_roman || "",
            city_te_roman: tItem.city_te_roman || "",
          };
        })
        .filter(Boolean);

      setTemples(formatted);
      setRouteCoords([]);
      setRouteSummary(null);

    } catch (err) {
      console.error("Error fetching temples:", err);
      Alert.alert(ui.error, ui.fetchError);
      setTemples([]);
    } finally {
      setIsLoadingTemples(false);
    }
  };

  fetchFilteredTemples();
}, [selectedFilterType, selectedCity, selectedState, userLocation, lang, allTemples]);



  // Reset filters when filter type changes
  useEffect(() => {
    if (selectedFilterType !== "city") setSelectedCity("");
      if (selectedFilterType !== "state") setSelectedState(""); 
    if (selectedFilterType !== "all") {
      setSelectedTemple(null);
      setSearchQuery("");
      setSuggestions([]);
    }
  }, [selectedFilterType]);

  // Handle search query changes
  useEffect(() => {
    if (selectedFilterType === "all") {
      debouncedSearch(searchQuery);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedFilterType, debouncedSearch]);
useEffect(() => {
  if (temples.length > 0) {
    setShowMarkerHint(true);
    // Dismiss automatically after 5 seconds if untouched
    const timeout = setTimeout(() => setShowMarkerHint(false), 5000);
    return () => clearTimeout(timeout);
  }
}, [temples]);
useEffect(() => {
  if (showDirectionHint) {
    const timer = setTimeout(() => {
      setShowDirectionHint(false);
    }, 5000); // Auto-dismiss after 5 seconds
    
    return () => clearTimeout(timer);
  }
}, [showDirectionHint]);
 // Replace your existing useEffect for map fitting (around line 535)
useEffect(() => {
  if (temples.length > 0 && mapRef.current && !isLoadingTemples && isMapReady) {
    const timer = setTimeout(() => {
      const coordinates = temples.slice(0, 100).map(t => t.coords).filter(Boolean);
      
      if (coordinates.length === 1) {
        mapRef.current.animateToRegion({
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }, 800);
      } else if (coordinates.length > 1) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 150, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }
}, [temples, isLoadingTemples, isMapReady]); // ← Add isMapReady dependency
useEffect(() => {
  if (isMapReady) setShowFilterHint(true);
}, [isMapReady]);
const handleFilterSelect = (filter) => {
  // your filter logic here
  setShowFilterHint(false);
  // fetch and render filtered temples logic...
};
useEffect(() => {
  if (miniCardVisible) {
    setShowDirectionHint(true);
  } else {
    setShowDirectionHint(false);
  }
}, [miniCardVisible]);
// ✅ NEW FUNCTION: Just animate to temple, don't open cards
// ✅ UPDATED FUNCTION: Animate to temple AND show marker hint
const navigateToTempleMarker = (temple) => {
  console.log('📍 Navigating to temple marker:', temple.name);
  
  // Close any open cards
  setSelectedTemple(null);
  setShowAllDetails(false);
  setMiniCardVisible(false);
  setShowDropdown(true);
  setShowNearestToggle(false);
  setExpandNearestList(false);
  setRouteCoords([]);
  setRouteSummary(null);
  
  // ✅ Show marker hint to guide user
  setShowMarkerHint(true);
  
  // ✅ Auto-dismiss hint after 5 seconds
  setTimeout(() => {
    setShowMarkerHint(false);
  }, 5000);
  
  // Just animate to the temple location
  if (mapRef.current && temple.coords) {
    mapRef.current.animateToRegion(
      {
        latitude: temple.coords.latitude,
        longitude: temple.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      },
      1000
    );
  }
};
const handleMarkerPress = async (temple) => {
  console.log('🏛️ Marker pressed:', temple.name);
  
  // ✅ ALWAYS close previous temple cards first
  setSelectedTemple(null);
  setShowAllDetails(false);
  setMiniCardVisible(false);
  setShowDropdown(false);
  setShowNearestToggle(false);
  setExpandNearestList(false);
  setNearestTemples([]);
  setRouteCoords([]);
  setRouteSummary(null);
  
  // ✅ Hide marker hint when user clicks
  setShowMarkerHint(false);

  try {
    // Animate to temple location
    if (mapRef.current && temple.coords) {
      mapRef.current.animateToRegion(
        {
          latitude: temple.coords.latitude,
          longitude: temple.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }

    const templeId = temple.firestoreId;
    if (!templeId) {
      Alert.alert(ui.error, ui.templeIdMissing);
      return;
    }

    console.log('🏛️ Loading temple data for:', templeId);
    
    // Fetch temple data from Firestore
    const templeDoc = await firestore().collection('temples').doc(templeId).get();
    
    if (!templeDoc.exists) {
      Alert.alert(ui.error, ui.templeNotFound);
      return;
    }

    const templeData = templeDoc.data();
    if (!templeData) {
      Alert.alert(ui.error, ui.templeNotFound);
      return;
    }

    const langData = templeData[lang] || templeData.en || templeData.te;

    // ✅ Set temple data
    const templeName = langData?.name || temple.name || "Unknown Temple";
    const templeCity = langData?.city || temple.city || "";
    
    console.log('✅ Setting temple name:', templeName);

    setSelectedTemple({
      firestoreId: templeId,
      basic: {
        ...temple,
        name: templeName,
        city: templeCity,
        coords: temple.coords,
        mainDeity: langData?.mainDeity || temple.mainDeity,
        deityType: langData?.deityType || temple.deityType,
        description: langData?.description,
        details: langData?.details,
      },
      detailsLoaded: false,
      extendedDetails: null,
    });

    // ✅ Show bottom mini card AFTER setting temple data
    setMiniCardVisible(true);
    setShowDropdown(false);
    
    console.log('✅ Mini card now visible');
    
    // Calculate nearest temples
    const nearest = calculateNearestTemples(temple, allTemples);
    setNearestTemples(nearest);

    if (nearest.length > 0) {
      setShowNearestToggle(true);
      setExpandNearestList(false);
    }
  } catch (err) {
    console.error('❌ Error in handleMarkerPress:', err);
    Alert.alert(ui.error, ui.fetchDetailsError);
  }
};


const loadExtendedDetails = async () => {
  if (!selectedTemple?.firestoreId) {
    console.warn("NO TEMPLE ID");
    return;
  }

  try {
    const templeId = selectedTemple.firestoreId;
    console.log("🔍 Fetching extended details from temple_details for:", templeId);

    // ✅ Fetch from temple_details collection (NOT temples)
    const detailsDoc = await firestore()
      .collection('temple_details')
      .doc(templeId)
      .get();

    if (!detailsDoc.exists) {
      console.error("❌ No document found in temple_details");
      setSelectedTemple(prev => ({
        ...prev,
        detailsLoaded: true,
        extendedDetails: null,
      }));
      return;
    }
const detailsData = detailsDoc.data();
console.log('📦 temple_details data keys:', Object.keys(detailsData));

let langDetails = detailsData[lang] || detailsData.en || detailsData.te;
console.log('🌐 Language data keys:', Object.keys(langDetails || {}));

if (!langDetails) {
  console.error('No language data found in templedetails');
  setSelectedTemple(prev => ({
    ...prev,
    detailsLoaded: true,
    extendedDetails: null,
  }));
  return;
}

// IMPORTANT: your long HTML is stored in <lang>.description
let detailsHtml = langDetails.description;

if (!detailsHtml || !detailsHtml.trim()) {
  console.error('No extended HTML in templedetails');
  setSelectedTemple(prev => ({
    ...prev,
    detailsLoaded: true,
    extendedDetails: null,
  }));
  return;
}

detailsHtml = detailsHtml.trim();

// Strip wrapping quotes (your sample shows " ... ")
if (
  detailsHtml.length >= 2 &&
  detailsHtml.startsWith('"') &&
  detailsHtml.endsWith('"')
) {
  detailsHtml = detailsHtml.substring(1, detailsHtml.length - 1).trim();
}

console.log('✅ Successfully loaded extended details');
console.log('📏 HTML length:', detailsHtml.length);

setSelectedTemple(prev => ({
  ...prev,
  detailsLoaded: true,
  extendedDetails: { descriptionHtml: detailsHtml },
}));


  } catch (err) {
    console.error("❌ Exception loading extended details:", err);
    setSelectedTemple(prev => ({
      ...prev,
      detailsLoaded: true,
      extendedDetails: null,
    }));
  }
};


  const fetchRouteToTemple = async (coords) => {
    if (!userLocation || !coords) return;
    
    try {
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${coords.latitude},${coords.longitude}`;
      const url = `${GoogleAPIEndpoints.directions}?origin=${origin}&destination=${dest}&mode=driving&key=${GOOGLE_API_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status !== "OK") {
        Alert.alert(ui.routeError, `${json.status}: ${json.error_message || ""}`);
        return;
      }

      const overviewPoints = polyline.decode(json.routes[0].overview_polyline.points);
      const route = overviewPoints.map(([lat, lon]) => ({ latitude: lat, longitude: lon }));
      setRouteCoords(route);

      const leg = json.routes[0].legs[0];
      setRouteSummary({ duration: leg.duration.text, distance: leg.distance.text });

      if (mapRef.current && route.length > 0) {
        mapRef.current.fitToCoordinates(
          [userLocation, coords],
          {
            edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
            animated: true,
          }
        );
      }
    } catch (err) {
      Alert.alert(ui.routeError, err.message);
    }
  };

  const onSelectSuggestion = async (temple) => {
    try {
       console.log('🔍 Suggestion selected:', temple.name);
      setSelectedTemple({ 
        firestoreId: temple.firestoreId, 
        basic: temple 
      });
      
      if (mapRef.current && temple.coords) {
        mapRef.current.animateToRegion({
          latitude: temple.coords.latitude,
          longitude: temple.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }, 1000);
      }
      
      fetchRouteToTemple(temple.coords);
         // ← ADD THIS: Calculate and show nearest temples
    console.log('📍 Calculating nearest temples from:', temple.firestoreId); // ← ADD THIS
    const nearest = calculateNearestTemples(temple, allTemples);
    console.log('🗺️ Found nearest temples:', nearest.length);
   
    setNearestTemples(nearest);
    setShowNearestHint(true);
// ✅ Show toggle button (NOT tooltip)
    if (nearest.length > 0) {
      setShowNearestToggle(true);  // Show toggle button
      setExpandNearestList(false); // Start collapsed
    }

      setSuggestions([]);
      setSearchQuery("");
    } catch (e) {
      console.error("Select suggestion error:", e);
      Alert.alert(ui.error, ui.selectItemError);
    }
  };

  // Memoize deity icon selection
  const getDeityIcon = useMemo(() => {
    return (deityKey) => {
      if (deityKey === "vishnu") return VishnuMarker;
      if (deityKey === "rama") return RamaIcon;
      if (deityKey === "krishna") return KrishnaIcon;
      if (deityKey === "narasimha") return NarasimhaIcon;
      if (deityKey === "durga") return DurgaIcon;
      if (deityKey === "ganesha") return GaneshaIcon;
      if (deityKey === "subrahmanya") return SubrahmanyaIcon;
      if (deityKey === "shiva") return ShivaLingamIcon;
      return null;
    };
  }, []);
// ✅ FIXED - Always include selected temple + filtered temples + nearest temples
const displayTemples = useMemo(() => {
  const combined = [...temples];
  
  // ← ADD THIS: Always include selected temple if it exists
  if (selectedTemple?.basic && selectedTemple.basic.coords) {
    const isAlreadyIncluded = combined.some(
      t => t.firestoreId === selectedTemple.basic.firestoreId
    );
    if (!isAlreadyIncluded) {
      combined.push(selectedTemple.basic);
    }
  }
  
  // Add nearest temples if not already included
  if (nearestTemples && nearestTemples.length > 0) {
    nearestTemples.forEach(nearestTemple => {
      const isAlreadyIncluded = combined.some(t => t.firestoreId === nearestTemple.firestoreId);
      if (!isAlreadyIncluded) {
        combined.push(nearestTemple);
      }
    });
  }
  
  return combined.slice(0, 200);
}, [temples, nearestTemples, selectedTemple]); // ← Add selectedTemple as dependency
console.log('🗺️ DEBUG INFO:');
console.log('- displayTemples count:', displayTemples.length);
console.log('- temples count:', temples.length);
console.log('- selectedState:', selectedState);
console.log('- selectedFilterType:', selectedFilterType);
console.log('- First 3 temples:', displayTemples.slice(0, 3).map(t => ({
  name: t.name,
  coords: t.coords,
  firestoreId: t.firestoreId
})));


// Preprocess HTML to convert pre tags to proper paragraphs
  const preprocessHTML = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Replace <pre> content with proper paragraph structure
    let processed = htmlContent.replace(
      /<pre>([\s\S]*?)<\/pre>/gi,
      (match, content) => {
        // Split by line breaks and wrap each line in a paragraph
        const lines = content
          .split(/\n/)
          .filter(line => line.trim() !== '')
          .map(line => `<p>${line.trim()}</p>`)
          .join('');
        return `<div>${lines}</div>`;
      }
    );
    
    return processed;
  };
// Strip HTML and render as native Text with proper styling
  const renderFormattedText = (htmlContent) => {
    if (!htmlContent || htmlContent.trim() === '') return null;
    
    // Remove HTML tags and decode entities
    let text = htmlContent
      .replace(/<html>|<\/html>|<head>|<\/head>|<body>|<\/body>|<pre>|<\/pre>|<meta[^>]*>/gi, '')
      .replace(/<b>(.*?)<\/b>/gi, '$1')
      .replace(/<strong>(.*?)<\/strong>/gi, '$1')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
    
    // Split by lines and render each line
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return (
      <View style={{ marginTop: 8 }}>
        {lines.map((line, idx) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return null;
          
          // Check if line contains a label (bold text followed by colon)
          const labelMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);
          
          if (labelMatch) {
            const [, label, value] = labelMatch;
            return (
              <View key={idx} style={{ marginBottom: 12 }}>
                <LanguageText style={{ 
                  fontSize: 16, 
                  fontWeight: '700', 
                  color: '#111827',
                  marginBottom: 4,
                }}>
                  {label.trim()}:
                </LanguageText>
                <LanguageText style={{ 
                  fontSize: 15, 
                  color: '#374151',
                  lineHeight: 22,
                }}>
                  {value.trim()}
                </LanguageText>
              </View>
            );
          }
          
          return (
            <LanguageText 
              key={idx} 
              style={{ 
                fontSize: 15, 
                color: '#374151',
                lineHeight: 22,
                marginBottom: 8,
              }}
            >
              {trimmedLine}
            </LanguageText>
          );
        })}
      </View>
    );
  };
const renderHTML = useCallback((htmlContent) => {
  if (!htmlContent || htmlContent.trim() === '') return null;
  
  // ✅ Extract background color BEFORE cleaning HTML
  const bgColor = extractBackgroundColor(htmlContent);
  console.log('Extracted background color:', bgColor);
  
  // Clean up the HTML - remove wrapper tags AND style tags
  let cleanedHTML = htmlContent
    .replace(/<!DOCTYPE html>/gi, '')
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<style>[\s\S]*?<\/style>/gi, '') // Remove style tags
    .trim();
  
  const fontFamily = lang === 'te' ? 'Gidugu_400Regular' : 'Arial';
  
  return (
    <View style={{ 
      backgroundColor: bgColor || '#f5f5f5',  // ✅ Apply extracted background
      padding: 12,
      borderRadius: 8,
      marginTop: 8
    }}>
      <RenderHTML
        contentWidth={windowWidth - 80}
        source={{ html: cleanedHTML }}
        tagsStyles={{
          body: { 
            fontFamily, 
            fontSize: 15, 
            color: '#374151', 
            lineHeight: 22,
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent'
          },
          div: {
            fontFamily,
            color: '#374151',
            fontSize: 15,
            lineHeight: 22,
            backgroundColor: 'transparent',
            marginBottom: 8
          },
          p: { 
            fontFamily, 
            marginTop: 0,
            marginBottom: 8,
            color: '#374151',
            fontSize: 15,
            lineHeight: 22
          },
          h1: {
            fontFamily,
            fontSize: 20,
            fontWeight: '700',
            color: '#111827',
            marginTop: 0,
            marginBottom: 12,
            textAlign: 'center'
          },
          span: {
            fontFamily,
            fontSize: 15,
            color: '#374151',
            lineHeight: 22
          },
        }}
        classesStyles={{
          label: {
            fontWeight: '700',
            color: '#111827',
            fontSize: 15
          },
          row: {
            marginBottom: 10
          }
        }}
        systemFonts={['Gidugu_400Regular', 'Arial']}
        baseStyle={{ 
          fontFamily, 
          margin: 0, 
          padding: 0,
          backgroundColor: 'transparent'
        }}
        enableExperimentalBRCollapsing={true}
        enableExperimentalMarginCollapsing={true}
      />
    </View>
  );
}, [lang, windowWidth]);



  const currentStep = steps[step];



// Calculate nearest temples to selected temple
const calculateNearestTemples = (selectedTemple, allTemplesForCalculation) => {
  if (!selectedTemple || !selectedTemple.coords) {
    console.warn("Selected temple or coords missing", selectedTemple);
    return [];
  }

  if (!allTemplesForCalculation || allTemplesForCalculation.length === 0) {
    console.warn("No temples available for calculation");
    return [];
  }

  try {
    const templesWithDistance = allTemplesForCalculation
      .filter(t => {
        // Filter out the selected temple and temples without coords
        if (!t || !t.coords) return false;
        if (t.firestoreId === selectedTemple.firestoreId) return false;
        return true;
      })
      .map(temple => {
        const distance = getDistance(selectedTemple.coords, temple.coords) / 1000; // Convert to km
        return { ...temple, distanceToSelected: distance };
      })
      .filter(temple => temple.distanceToSelected <= 50) // ✅ ADDED: Only temples within 50km
      .sort((a, b) => a.distanceToSelected - b.distanceToSelected)
      .slice(0, 5); // Get top 5 nearest temples

    console.log('Calculated nearest temples within 50km:', templesWithDistance.length);
    return templesWithDistance;
  } catch (error) {
    console.error('Error calculating nearest temples:', error);
    return [];
  }
};



return (
  
  <View style={styles.container}>
    {/* ALWAYS render MapView directly - NO Tooltip wrapper */}
   <MapView
  ref={mapRef}
  style={styles.map}
   provider={PROVIDER_GOOGLE} 
  initialRegion={{
    latitude: userLocation?.latitude || 17.6868,
    longitude: userLocation?.longitude || 83.2185,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  }}
  onPanDragEnd={() => {
  if (!miniCardVisible) {  // ← SIMPLER: only check card closed
    setShowDropdown(true)
  }
}}

  showsUserLocation={!!userLocation}
  loadingEnabled={true}
  onMapReady={() => {
    setIsMapReady(true);
  }}
>

      {userLocation && <PulsingUserMarker coordinate={userLocation} />}

      {routeCoords.length > 0 && (
        <Polyline
          coordinates={routeCoords}
          strokeColor="#FF9800"
          strokeWidth={4}
        />
      )}

 {imagesLoaded && displayTemples.map((tItem, idx) => {
  if (!tItem.coords) {
    console.log('❌ Temple missing coords:', tItem.name);
    return null;
  }
  
  const deityKey = matchDeityKey(tItem.name) || matchDeityKey(tItem.mainDeity);
  const icon = getDeityIcon(deityKey);
  
  return (
    <DeityMarkerPin
      key={`temple-${tItem.firestoreId || idx}`}
      tItem={tItem}
      icon={icon}
      onPress={handleMarkerPress}
    />
  );
})}
   </MapView>

    {/* ✅ NEW: Location Permission Handler */}
    {locationPermissionDenied && (
      <LocationPermissionHandler
        lang={lang}
        onRetry={() => {
          setLocationPermissionDenied(false);
          requestLocationPermission();
        }}
      />
    )}

    {/* ✅ UPDATED: Loading overlay - Only show when no permission error */}
    {!userLocation && !locationPermissionDenied && (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, fontFamily: 'Arial' }}>
          {ui.mapLoading}
        </Text>
      </View>
    )}

    {/* Loading temples overlay */}
    {isLoadingTemples && (
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#007bff" />
          <LanguageText style={styles.loadingText}>{ui.loadingTemples}</LanguageText>
        </View>
      </View>
    )}

    {/* ✅ TOOLTIP #1: Filter Selection Hint (wraps only the filter bar) */}
    {/* ✅ FIXED: Tooltip wraps reference element only, dropdown renders in separate container */}
    {showDropdown && (
<View pointerEvents="box-none" style={styles.floatTopWrap}>
  <View ref={filterRef} style={styles.floatCard}>
    <View style={styles.row}>
      <Dropdown
  style={styles.ddSm}
  containerStyle={[styles.ddContainer,{fontFamily}]}
  placeholderStyle={[styles.ddPlaceholderSm, { fontFamily }]}
  selectedTextStyle={[styles.ddSelectedSm, { fontFamily }]}
  itemTextStyle={[styles.ddItemTextSm, { fontFamily }]} 
  itemContainerStyle={[styles.ddItemContainer,{fontFamily}]}
  activeColor="#F3F4F6"
  dropdownPosition="auto"
  maxHeight={280}
  data={[
    { label: ui.selectFilter, value: "" },
    // { label: ui.city, value: "city" },  // ← COMMENTED OUT
    { label: ui.state, value: "state" }, 
    { label: ui.nearby, value: "nearby" },
    // { label: ui.all, value: "all" },  // ← COMMENTED OUT
  ]}
  labelField="label"
  valueField="value"
  placeholder={ui.selectFilter}
  value={selectedFilterType}
  onChange={(item) => {
    setSelectedFilterType(item.value);
    setShowFilterHint(false);
  }}
  renderRightIcon={() => (
    <FontAwesome name="chevron-down" size={12} color="#6B7280" />
  )}
  renderItem={(row) => (
    <View style={styles.ddItemContainer}>
      <LanguageText style={styles.ddItemTextSm}>{row.label}</LanguageText>
    </View>
  )}
  renderSelectedItem={(row) =>
    row ? (
      <LanguageText numberOfLines={1} style={styles.ddSelectedSm}>
        {row.label}
      </LanguageText>
    ) : null
  }
/>


      {/* {selectedFilterType === "city" && (
        <Dropdown
          style={[styles.ddSm, { marginLeft: 6 }]}
          containerStyle={styles.ddContainer}
          placeholderStyle={styles.ddPlaceholderSm}
          selectedTextStyle={[styles.ddSelectedSm,{fontFamily}]}
          itemTextStyle={styles.ddItemTextSm}
          itemContainerStyle={styles.ddItemContainer}
          activeColor="#F3F4F6"
          dropdownPosition="auto"  // ✅ Changed from "bottom"
          maxHeight={280}
          data={filters.cities.map((c) => ({ label: c, value: c }))}
          labelField="label"
          valueField="value"
          placeholder={ui.selectCity}
          value={selectedCity}
          onChange={(item) => setSelectedCity(item.value)}
          renderRightIcon={() => (
            <FontAwesome name="chevron-down" size={12} color="#6B7280" />
          )}
          renderItem={(row) => (
            <View style={styles.ddItemContainer}>
              <LanguageText style={styles.ddItemTextSm}>{row.label}</LanguageText>
            </View>
          )}
          renderSelectedItem={(row) =>
            row ? (
              <LanguageText numberOfLines={1} style={styles.ddSelectedSm}>
                {row.label}
              </LanguageText>
            ) : null
          }
          
        />
      )} */}
      {/* State Dropdown - ADD THIS BLOCK */}
  {/* NEW: Temple Selection Dropdown - Shows temples from selected state */}


 {/* State Dropdown - ADD THIS BLOCK */}
{selectedFilterType === "state" && (
  <Dropdown
    style={[styles.ddSm, { marginLeft: 6 }]}
    containerStyle={[styles.ddContainer, { width: '95%', maxHeight: 180 }]}
    placeholderStyle={styles.ddPlaceholderSm}
    selectedTextStyle={[styles.ddSelectedSm, { fontFamily }]}
    itemTextStyle={styles.ddItemTextSm}
    itemContainerStyle={styles.ddItemContainer}
    activeColor="#F3F4F6"
    dropdownPosition="auto"
    maxHeight={180}
    data={filters.states.map((s) => ({ label: s, value: s }))}
    labelField="label"
    valueField="value"
    placeholder={ui.selectState}
    value={selectedState}
    onChange={(item) => {
      setSelectedState(item.value);
      setSelectedTempleFromState(""); // Reset temple selection when state changes
    }}
    renderRightIcon={() => (
      <FontAwesome name="chevron-down" size={12} color="#6B7280" />
    )}
    renderItem={(row) => (
      <View style={styles.ddItemContainer}>
        <LanguageText 
          style={styles.ddItemTextSm}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {row.label}
        </LanguageText>
      </View>
    )}
    renderSelectedItem={(row) =>
      row ? (
        <LanguageText 
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.ddSelectedSm}
        >
          {row.label}
        </LanguageText>
      ) : null
    }
  />
)}

{/* Temple Selection Dropdown - Shows temples from selected state */}
{/* Temple Selection Dropdown - Shows temples from selected state */}
{selectedFilterType === "state" && selectedState && temples.length > 0 && (
  <View style={{ width: '30%',flex: 0, marginLeft: 6 }}>
    <Dropdown
      style={[styles.ddSm, { flex: 1, width: '100%' }]}
      containerStyle={[styles.ddContainer, { width: '100%', maxHeight: 180 }]}
      placeholderStyle={styles.ddPlaceholderSm}
      selectedTextStyle={[styles.ddSelectedSm, { fontFamily }]}
      itemTextStyle={styles.ddItemTextSm}
      itemContainerStyle={styles.ddItemContainer}
      activeColor="#F3F4F6"
      dropdownPosition="auto"
      search
      searchPlaceholder={lang === 'te' ? 'ఆలయం వెతకండి...' : 'Search temple...'}
      data={temples.map((t) => ({ 
        label: t.name, 
        value: t.firestoreId 
      }))}
      labelField="label"
      valueField="value"
      placeholder={lang === 'te' ? 'ఆలయం ఎంచుకోండి' : 'Select Temple'}
      value={selectedTempleFromState}
      onChange={(item) => {
        setSelectedTempleFromState(item.value);
        const temple = temples.find(t => t.firestoreId === item.value);
        if (temple) {
          // ✅ CHANGED: Use navigateToTempleMarker instead of handleMarkerPress
          navigateToTempleMarker(temple);
        }
      }}
      renderRightIcon={() => (
        <FontAwesome name="chevron-down" size={12} color="#6B7280" />
      )}
      renderItem={(row) => (
        <View style={styles.ddItemContainer}>
          <LanguageText 
            style={styles.ddItemTextSm}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {row.label}
          </LanguageText>
        </View>
      )}
      renderSelectedItem={(row) =>
        row ? (
          <LanguageText 
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.ddSelectedSm}
          >
            {row.label}
          </LanguageText>
        ) : null
      }
    />
  </View>
)}

    </View>

    {selectedFilterType === "all" && (
      <View style={[styles.row, { marginTop: 6 }]}>
        <TextInput
          style={styles.searchInput}
          placeholder={ui.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
    )}
  </View>

  {/* ✅ NEW: Show tooltip hint as floating overlay instead of wrapper */}
 {/* ✅ Show tooltip hint with TOP placement */}
{showFilterHint && (
  <View style={styles.filterHintOverlay}>
    <View style={styles.filterHintCard}>
      <Text style={styles.filterHintText}>
        {lang === 'te' 
          ? 'మ్యాప్‌లో ఆలయాలను చూపించడానికి ఫిల్టర్ ఎంచుకోండి' 
          : 'Select a filter to show temples on the map'}
      </Text>
      <TouchableOpacity
        style={styles.hintCloseBtn}
        onPress={() => setShowFilterHint(false)}
      >
        <Text style={styles.hintCloseBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


{/*  
  {selectedFilterType === "all" && suggestions.length > 0 && searchQuery.length >= 3 && (
    <View style={styles.suggestPopover}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
        {suggestions.map((sug, idx) => (
          <TouchableOpacity
            key={`${sug.firestoreId}-${idx}`}
            onPress={() => onSelectSuggestion(sug)}
            style={styles.suggestItem}
          >
            <LanguageText style={styles.suggestTitle}>{sug.name}</LanguageText>
            <LanguageText style={styles.suggestMeta}>{sug.city}</LanguageText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )} */}
</View>
)}


    {/* ✅ TOOLTIP #2: Marker Hint (floating overlay, doesn't wrap anything) */}
    {showMarkerHint && displayTemples.length > 0 && (
      <View style={styles.markerHintOverlay}>
        <View style={styles.markerHintCard}>
          <Text style={styles.markerHintText}>
            {lang === 'te'
              ? 'వివరాలు చూడటానికి ఆలయం చిహ్నాన్ని నొక్కండి'
              : 'Tap on a temple marker to view details'}
          </Text>
          <TouchableOpacity
            style={styles.hintCloseBtn}
            onPress={() => setShowMarkerHint(false)}
          >
            <Text style={styles.hintCloseBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}

{/* ✅ TOGGLE BUTTON FOR NEAREST TEMPLES - At Top of Map */}
{/* {showNearestToggle && nearestTemples.length > 0 && (
  <View style={styles.nearestToggleContainer}>

    <TouchableOpacity
      style={styles.nearestToggleButton}
      onPress={() => setExpandNearestList(!expandNearestList)}
    >
      <View style={styles.toggleButtonContent}>
        <FontAwesome
          name="location-arrow" 
          size={14} 
          color="#fff"
          style={styles.toggleIcon}
        />
        <LanguageText style={styles.toggleButtonText}>
          {lang === 'en' ? 'Nearby' : 'సమీపం'}
        </LanguageText>
        <View style={styles.toggleBadge}>
          <Text style={styles.toggleBadgeText}>{nearestTemples.length}</Text>
        </View>
      </View>
      
      <FontAwesome
        name={expandNearestList ? 'chevron-up' : 'chevron-down'} 
        size={12} 
        color="#fff"
      />
    </TouchableOpacity>

   
    <TouchableOpacity
      style={styles.toggleCloseBtn}
      onPress={() => setShowNearestToggle(false)}
    >
      <FontAwesome name="close" size={14} color="#fff" />
    </TouchableOpacity>
  </View>
)}


{showNearestToggle && expandNearestList && nearestTemples.length > 0 && (
  <View style={styles.expandedNearestList}>
    <ScrollView
      style={styles.nearestListScroll}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      {nearestTemples.map((nearestTemple, idx) => (
        <TouchableOpacity
          key={`nearest-${idx}`}
          style={styles.nearestListItem}
          onPress={() => {
           
            setSelectedTemple(null);
            setShowAllDetails(false);
            setMiniCardVisible(false);
            setShowNearestToggle(false);
            setExpandNearestList(false);
            setNearestTemples([]);
            setRouteCoords([]);
            setRouteSummary(null);
            
           
            if (mapRef.current && nearestTemple.coords) {
              mapRef.current.animateToRegion(
                {
                  latitude: nearestTemple.coords.latitude,
                  longitude: nearestTemple.coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                },
                1000
              );
            }
            
            
          }}
        >
        
          <View style={styles.itemRankCircle}>
            <Text style={styles.itemRankText}>{idx + 1}</Text>
          </View>

       
          <View style={styles.itemInfo}>
            <LanguageText style={styles.itemNameText} numberOfLines={1}>
              {nearestTemple.name}
            </LanguageText>
            <LanguageText style={styles.itemCityText} numberOfLines={1}>
              {nearestTemple.city}
            </LanguageText>
          </View>

       
          <View style={styles.itemDistance}>
            <LanguageText style={styles.itemDistanceText}>
              {nearestTemple.distanceToSelected.toFixed(1)} km
            </LanguageText>
          </View>

          <FontAwesome name="chevron-right" size={12} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)}
 */}



{/* ========== BOTTOM MINI CARD ========== */}
{miniCardVisible && selectedTemple?.basic && (
  <View style={styles.bottomBar}>
    <View style={{ flex: 1 , marginRight: 8}}>
      {/* ✅ Display temple name */}
      <LanguageText numberOfLines={1} style={styles.bottomTitle}>
        {selectedTemple.basic.name}
      </LanguageText>
      
      {/* ✅ Display city (optional - you can remove this if you only want the name) */}
      <LanguageText numberOfLines={1} style={styles.bottomMeta}>
        {selectedTemple.basic.city}
      </LanguageText>
    </View>

    {/* Navigation button with tooltip */}
   {/* Navigation button with custom hint */}
{selectedTemple.basic.coords && (
  <View style={{ position: 'relative' }}>
    {/* Custom hint tooltip */}
    {showDirectionHint && (
      <View style={styles.customTooltip}>
        <Text style={styles.customTooltipText}>
          {lang === 'te'
            ? 'నావిగేషన్ కోసం ఇక్కడ క్లిక్ చేయండి'
            : 'Click here for navigation'}
        </Text>
        <View style={styles.tooltipArrow} />
      </View>
    )}
    
    <TouchableOpacity
      ref={navIconRef}
      style={styles.fab}
      onPress={() => {
        setShowDirectionHint(false);
        navigation.navigate("Navigation", {
          name: selectedTemple.basic.name,
          coords: selectedTemple.basic.coords,
        });
      }}
    >
      <FontAwesome name="location-arrow" size={14} color="#fff" />
    </TouchableOpacity>
  </View>
)}
  </View>
)}



{/* ========== BOTTOM DETAIL CARD (SEPARATE FROM MINI CARD) ========== */}
{selectedTemple && selectedTemple.basic && (
  <View
    style={[
      styles.bottomCardContainer,
      showAllDetails && styles.bottomCardExpanded,
    ]}
  >
    {/* Close button */}
    <TouchableOpacity
      onPress={() => {
        setSelectedTemple(null);
        setShowAllDetails(false);
        setMiniCardVisible(false);
        setShowDropdown(true);
      }}
      style={styles.closeButton}
    >
      <FontAwesome name="close" size={20} color="#333" />
    </TouchableOpacity>

    {showAllDetails ? (
      // EXPANDED VIEW
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedTemple.detailsLoaded && selectedTemple.extendedDetails?.descriptionHtml ? (
          renderHTML(selectedTemple.extendedDetails.descriptionHtml)
        ) : selectedTemple.detailsLoaded && !selectedTemple.extendedDetails?.descriptionHtml ? (
          <LanguageText style={styles.noDescriptionText}>
            No additional details available
          </LanguageText>
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007bff" />
            <LanguageText style={{ marginTop: 10, color: '#6B7280' }}>
              Loading more details...
            </LanguageText>
          </View>
        )}
      </ScrollView>
    ) : (
      // COLLAPSED VIEW
      <View style={styles.collapsedContent}>
        {selectedTemple.basic.details && selectedTemple.basic.details.trim() !== '' ? (
          renderHTML(selectedTemple.basic.details)
        ) : (
          <LanguageText style={styles.noDescriptionText}>
            No description available
          </LanguageText>
        )}
      </View>
    )}

    {/* View Full Details button */}
    <View style={styles.showMoreButtonContainer}>
      <TouchableOpacity
  onPress={async () => {
    try {
      if (!selectedTemple?.detailsLoaded || !selectedTemple?.extendedDetails?.descriptionHtml) {
        console.log('📥 Loading extended details before navigation...');
        
        const templeId = selectedTemple.firestoreId;
        const detailsDoc = await firestore()
          .collection('temple_details')
          .doc(templeId)
          .get();

        if (!detailsDoc.exists) {
          Alert.alert('Error', 'No extended details found for this temple');
          return;
        }

        const detailsData = detailsDoc.data();
        let langDetails = detailsData[lang] || detailsData.en || detailsData.te;

        if (!langDetails || !langDetails.description) {
          Alert.alert('Error', 'No description available for this temple');
          return;
        }

        let detailsHtml = langDetails.description.trim();

        if (detailsHtml.startsWith('"') && detailsHtml.endsWith('"')) {
          detailsHtml = detailsHtml.substring(1, detailsHtml.length - 1).trim();
        }

        console.log('✅ Loaded HTML length:', detailsHtml.length);

        navigation.navigate('TempleDetails', {
          temple: {
            firestoreId: selectedTemple.firestoreId,
            name: selectedTemple.basic.name,
            city: selectedTemple.basic.city,
            state: selectedTemple.basic.state,
            mainDeity: selectedTemple.basic.mainDeity,
            extendedHtml: detailsHtml,
          },
          nearestTemples: nearestTemples,
          // ✅ ADD THIS: Pass callback to navigate to temple marker only
          onNearestTemplePress: navigateToTempleMarker,
        });
      } else {
        const extendedHtml = selectedTemple.extendedDetails.descriptionHtml;
        console.log('➡️ Navigating with cached HTML length:', extendedHtml.length);

        navigation.navigate('TempleDetails', {
          temple: {
            firestoreId: selectedTemple.firestoreId,
            name: selectedTemple.basic.name,
            city: selectedTemple.basic.city,
            state: selectedTemple.basic.state,
            mainDeity: selectedTemple.basic.mainDeity,
            extendedHtml,
          },
          nearestTemples: nearestTemples,
          // ✅ ADD THIS: Pass callback
          onNearestTemplePress: navigateToTempleMarker,
        });
      }
    } catch (error) {
      console.error('❌ Error loading temple details:', error);
      Alert.alert('Error', 'Failed to load temple details. Please try again.');
    }
  }}
  style={styles.showMoreBtn}
>
  <LanguageText style={styles.showMoreText}>{ui.showMore}</LanguageText>
</TouchableOpacity>
    </View>
  </View>
)}


</View>



 
);
}
export default TempleSearchScreen;

// Fix 1: Update the loading styles to be an overlay instead of flex:1

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  map: { flex: 1 },
 loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 5,
  },
  bottomCardContainer: {
  position: "absolute",
  bottom: 135,  // ✅ Increased to 80 to clear navigation card
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -3 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 10,
  paddingBottom: 16,  // ✅ Reduced padding
 minHeight: "20%",  // ✅ Keep minimum height
  maxHeight: "65%",  // ✅ Add max to prevent going too tall
},

bottomCardExpanded: {
  maxHeight: "60%",  // ✅ Reduced for expanded view
  bottom: 80,  // ✅ Keep same bottom position when expanded
},

collapsedContent: {
  paddingHorizontal: 16,
  paddingTop: 12,  // ✅ Reduced padding
  paddingBottom: 8,
 
},

scrollContainer: {
  flex: 1,
  paddingHorizontal: 16,
  paddingTop: 12,  // ✅ Reduced padding
},

scrollContent: {
  paddingBottom: 20,
},

showMoreButtonContainer: {
  paddingHorizontal: 16,
  paddingTop: 12,
  paddingBottom: 8,  // ✅ Reduced padding
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
},

showMoreBtn: {
  backgroundColor: "#007bff",
  paddingVertical: 10,  // ✅ Reduced padding
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: "center",
},

showMoreText: {
  color: "#fff",
  fontSize: 14,
  fontWeight: "600",
},

closeButton: {
  position: "absolute",
  top: 12,  // ✅ Adjusted position
  right: 12,
  zIndex: 10,
  backgroundColor: "#F3F4F6",
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: "center",
  justifyContent: "center",
},
// Your navigation mini card style (find this in your styles)
miniCard: {
  position: "absolute",
  bottom: 10,  // Should be at very bottom
  left: 20,
  right: 20,
  zIndex: 5,  // ✅ Lower z-index than bottom card
  // ... rest of your styles
},

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  
 
  filterHintOverlay: {
    position: 'absolute',
    top: 80,  // Below the filter card
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  filterHintCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 16,
    paddingRight: 40,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  filterHintText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

 
  ddPlaceholderSm: {
    color: "#9CA3AF",
    fontSize: 15,
  },
 
  
 
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
  suggestPopover: {
    width: "96%",
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#eee",
    maxHeight: 240,
    alignSelf: "center",
    zIndex: 999,
  },
  suggestItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  suggestTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  suggestMeta: { fontSize: 13, color: "#666", marginTop: 2 },
  bottomBar: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 16,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
     justifyContent: 'space-between',  // ← ADD THIS
  zIndex: 100,  
  },
  bottomTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: '#111827',
  flex: 1,            // ← ADD THIS
  marginRight: 8, 
  },
  bottomMeta: {
    color: "#6B7280",
    marginTop: 2,
    fontSize: 14,
  },
  fab: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    marginLeft: 6,
      flexShrink: 0,   // ← ADD THIS
  zIndex: 101,
  },

 
 
 

  templeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  templeCity: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 6,
  },
  templeDeity: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
    fontWeight: '500',
  },
  noDescriptionText: {
    fontSize: 15,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },

 
 
   markerHintOverlay: {
    position: 'absolute',
    top: Platform.select({ ios: 110, android: 85 }),  // ✅ Changed from bottom position
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 500,
  },
  
  markerHintCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    padding: 16,
    paddingRight: 40,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  
  markerHintText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  
  hintCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  hintCloseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },



ddContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 15,
    maxHeight: 160, // ← REDUCE from 180
    width: '90%', // ← CHANGE from '100%' to '90%'
    maxWidth: '90%', // ← ADD THIS: Hard constraint
    alignSelf: 'center', // ← Already have this
    zIndex: 1100,
    paddingHorizontal: 4, // ← REDUCE from 8
    paddingLeft: 2, // ← ADD THIS: Shift left
    left: 16, // ← ADD THIS: Position from left edge
    right: 'auto', // ← ADD THIS: Don't extend right
  },

  ddSelectedSm: {
    fontSize: 13, // ← REDUCE from 14
    color: '#111827',
    maxWidth: '85%', // ← REDUCE from '100%'
    paddingRight: 2, // ← REDUCE from 8
    paddingLeft: 2, // ← ADD THIS
    overflow: 'hidden',
    flexWrap: 'nowrap', // ← ADD THIS
  },

  ddItemTextSm: {
    fontSize: 13, // ← REDUCE from 14
    color: '#111827',
    maxWidth: '85%', // ← REDUCE from '100%'
    paddingRight: 2, // ← REDUCE from 8
    paddingLeft: 2, // ← ADD THIS
    overflow: 'hidden',
    flexWrap: 'nowrap', // ← ADD THIS
  },

  ddItemContainer: {
    paddingVertical: 6, // ← REDUCE from 8
    paddingHorizontal: 6, // ← REDUCE from 12
    paddingLeft: 4, // ← ADD THIS
    maxWidth: '95%', // ← ADD THIS
    flexWrap: 'nowrap',
  },

  ddSm: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 42,
    maxWidth: '92%', // ← CHANGE from '90%' to '92%'
    width: '92%', // ← ADD THIS
  },

  floatTopWrap: {
    position: 'absolute',
    top: Platform.select({ ios: 54, android: 18 }),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 500, // ← REDUCE from 1000 - lower than tooltip
    elevation: 500, // ← REDUCE to match zIndex
    pointerEvents: 'box-none', // Allow touches to pass through
  },
  customTooltip: {
  position: 'absolute',
  bottom: 50,  // Position above the FAB button
  right: -10,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  borderRadius: 8,
  padding: 12,
  paddingHorizontal: 16,
  minWidth: 180,
  maxWidth: 220,
  zIndex: 2000,
  elevation: 2000,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
},

customTooltipText: {
  color: '#fff',
  fontSize: 13,
  textAlign: 'center',
  lineHeight: 18,
  fontWeight: '500',
},

tooltipArrow: {
  position: 'absolute',
  bottom: -6,
  right: 15,
  width: 0,
  height: 0,
  borderLeftWidth: 6,
  borderRightWidth: 6,
  borderTopWidth: 6,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: 'rgba(0, 0, 0, 0.85)',
},

tooltipContent: {
  borderRadius: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  padding: 8,
  zIndex: 2000,  // ← ADD THIS
}
,
  floatCard: {
    width: '90%',
    maxWidth: '90%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    padding: 10,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 6,
    pointerEvents: 'auto',
  },



  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // ← ADD THIS: Ensure full width
  },

 

nearestToggleContainer: {
  position: 'absolute',
  top: Platform.select({ ios: 155, android: 130 }),
  left: 16,
  right: 16,
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 1200, // ← INCREASE to be higher than dropdown (1100)
  elevation: 1200,
  pointerEvents: 'auto',
},

  nearestToggleButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    pointerEvents: 'auto', // ← ADD THIS: Ensure touches work
  },
toggleButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

toggleIcon: {
  marginRight: 8,
},

toggleButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
  marginRight: 8,
},

toggleBadge: {
  backgroundColor: '#EF4444',  // Red badge
  borderRadius: 12,
  paddingHorizontal: 7,
  paddingVertical: 3,
  minWidth: 24,
  alignItems: 'center',
  justifyContent: 'center',
},

toggleBadgeText: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '700',
},

toggleCloseBtn: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
},

// ✅ EXPANDED LIST STYLES
expandedNearestList: {
  position: 'absolute',
  top: Platform.select({ ios: 180, android: 155 }),
  left: 16,
  right: 16,
  backgroundColor: '#fff',
  borderRadius: 14,
  maxHeight: 320,
  zIndex: 449,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowOffset: { width: 0, height: 6 },
  shadowRadius: 10,
  elevation: 6,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

nearestListScroll: {
  paddingVertical: 8,
},

nearestListItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#F3F4F6',
},

itemRankCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#3B82F6',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

itemRankText: {
  color: '#fff',
  fontSize: 13,
  fontWeight: '700',
},

itemInfo: {
  flex: 1,
},

itemNameText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 2,
},

itemCityText: {
  fontSize: 12,
  color: '#6B7280',
},

itemDistance: {
  marginRight: 10,
  alignItems: 'flex-end',
},

itemDistanceText: {
  fontSize: 13,
  fontWeight: '600',
  color: '#3B82F6',
},


});