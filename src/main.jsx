import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import { loadDistricts } from 'vardhan-maps/data';
import {
  ArrowDownUp, ArrowRight, Bookmark, Check, ChevronDown, CircleHelp, Compass,
  Crosshair, ExternalLink, LocateFixed, Map as MapIcon, MapPin, Menu, Navigation, Pause,
  Play, Route, Search, SlidersHorizontal, Sparkles, Square, Volume2, X, ZoomIn,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './styles.css';

const places = [
  {name:'Khajuraho Group of Monuments', district:'Chhatarpur', category:'Temple', lat:24.852, lng:79.919, era:'10th century', note:'A UNESCO World Heritage Site celebrated for its sculpted temples.', accent:'ochre', icon:'✳'},
  {name:'Sanchi Stupa', district:'Raisen', category:'Buddhist site', lat:23.479, lng:77.739, era:'3rd century BCE', note:'The Great Stupa and its carved gateways overlook the plains.', accent:'sage', icon:'◉'},
  {name:'Bhimbetka Rock Shelters', district:'Raisen', category:'Cave', lat:22.937, lng:77.612, era:'Prehistoric', note:'Rock shelters preserve some of the earliest known paintings in India.', accent:'clay', icon:'⌁'},
  {name:'Gwalior Fort', district:'Gwalior', category:'Fort', lat:26.229, lng:78.173, era:'8th century', note:'A hilltop fort with palaces, temples, and a striking blue-tile facade.', accent:'blue', icon:'▧'},
  {name:'Orchha Fort Complex', district:'Niwari', category:'Fort', lat:25.352, lng:78.640, era:'16th century', note:'Palaces and cenotaphs framed by the Betwa River.', accent:'clay', icon:'▧'},
  {name:'Mandu — Jahaz Mahal', district:'Dhar', category:'Palace', lat:22.338, lng:75.397, era:'15th century', note:'A lakeside palace set among the historic ruins of Mandu.', accent:'ochre', icon:'⌂'},
  {name:'Udayagiri Caves', district:'Vidisha', category:'Cave', lat:23.526, lng:77.776, era:'5th century', note:'Rock-cut sanctuaries and early Gupta period sculpture.', accent:'sage', icon:'⌁'},
  {name:'Bhojeshwar Temple', district:'Raisen', category:'Temple', lat:23.105, lng:77.579, era:'11th century', note:'An unfinished Shiva temple with a monumental lingam.', accent:'ochre', icon:'✳'},
  {name:'Mahakaleshwar Jyotirlinga', district:'Ujjain', category:'Temple', lat:23.182, lng:75.768, era:'Historic', note:'One of the twelve Jyotirlingas, on the banks of the Shipra.', accent:'ochre', icon:'✳'},
  {name:'Chausath Yogini Temple', district:'Morena', category:'Temple', lat:26.232, lng:78.112, era:'10th century', note:'A hilltop circular shrine with open-air colonnades.', accent:'ochre', icon:'✳'},
  {name:'Bateshwar Temples', district:'Morena', category:'Temple', lat:26.302, lng:78.001, era:'8th–10th century', note:'A restored cluster of sandstone temples in a quiet valley.', accent:'ochre', icon:'✳'},
  {name:'Rani Roopmati Pavilion', district:'Dhar', category:'Palace', lat:22.333, lng:75.399, era:'16th century', note:'A pavilion with expansive views across the Narmada valley.', accent:'clay', icon:'⌂'},
  {name:'Jami Masjid, Mandu', district:'Dhar', category:'Mosque', lat:22.339, lng:75.395, era:'15th century', note:'A grand courtyard mosque inspired by Damascus architecture.', accent:'blue', icon:'▤'},
  {name:'Raisen Fort', district:'Raisen', category:'Fort', lat:23.328, lng:77.786, era:'11th century', note:'Hill fortifications, reservoirs, and temples above the town.', accent:'blue', icon:'▧'},
  {name:'Pachmarhi — Pandav Caves', district:'Narmadapuram', category:'Cave', lat:22.475, lng:78.432, era:'Ancient', note:'Five small rock-cut caves tucked into a hillside.', accent:'sage', icon:'⌁'},
  {name:'Chanderi Fort', district:'Ashoknagar', category:'Fort', lat:24.714, lng:78.138, era:'11th century', note:'A hill fort above a medieval town known for its handloom heritage.', accent:'blue', icon:'▧'},
  {name:'Bawangaja Jain Tirth', district:'Barwani', category:'Jain site', lat:22.253, lng:74.976, era:'Medieval', note:'A colossal rock-cut Adinath figure in the Satpura hills.', accent:'sage', icon:'◉'},
  {name:'Teli Ka Mandir', district:'Gwalior', category:'Temple', lat:26.231, lng:78.169, era:'8th–9th century', note:'A distinctive fusion of north and south Indian temple forms.', accent:'ochre', icon:'✳'},
  {name:'Jahaz Mahal, Chanderi', district:'Ashoknagar', category:'Palace', lat:24.716, lng:78.142, era:'15th century', note:'A palace complex within Chanderi’s historic fortifications.', accent:'clay', icon:'⌂'},
  {name:'Amarkantak — Narmada Udgam', district:'Anuppur', category:'Sacred landscape', lat:22.674, lng:81.760, era:'Sacred site', note:'The source of the Narmada in the Maikal range.', accent:'sage', icon:'≈'},
  {name:'Bandhavgarh Fort', district:'Umaria', category:'Fort', lat:23.701, lng:81.029, era:'Ancient', note:'A forested hill fort within Bandhavgarh Tiger Reserve.', accent:'blue', icon:'▧'},
  {name:'Bhojpur Fort & Temple', district:'Raisen', category:'Temple', lat:23.104, lng:77.574, era:'11th century', note:'Temple ruins and traces of an ambitious medieval dam.', accent:'ochre', icon:'✳'},
  {name:'Rani Durgavati Fort', district:'Jabalpur', category:'Fort', lat:23.130, lng:79.878, era:'16th century', note:'A hilltop site connected with Gond queen Rani Durgavati.', accent:'blue', icon:'▧'},
  {name:'Dhuandhar Falls & Marble Rocks', district:'Jabalpur', category:'Natural heritage', lat:23.132, lng:79.801, era:'Natural landmark', note:'The Narmada narrows through luminous marble cliffs.', accent:'water', icon:'≈'},
  {name:'Tuman Temple Ruins', district:'Katni', category:'Temple', lat:23.931, lng:80.340, era:'Medieval', note:'Stone temple remains in the historic Tripuri region.', accent:'ochre', icon:'✳'},
  {name:'Bharat Bhavan', district:'Bhopal', category:'Museum', lat:23.239, lng:77.399, era:'1982', note:'A multidisciplinary arts centre above Upper Lake.', accent:'plum', icon:'▣'},
  {name:'Tribal Museum, Bhopal', district:'Bhopal', category:'Museum', lat:23.215, lng:77.404, era:'2013', note:'Immersive galleries on the living cultures of MP’s Adivasi communities.', accent:'plum', icon:'▣'},
  {name:'Man Singh Palace', district:'Gwalior', category:'Palace', lat:26.230, lng:78.176, era:'15th century', note:'A Rajput palace with vivid blue and yellow exterior tiles.', accent:'clay', icon:'⌂'},
  {name:'Bhartrihari Caves', district:'Ujjain', category:'Cave', lat:23.191, lng:75.780, era:'Historic', note:'A series of rock-cut caves linked with the poet Bhartrihari.', accent:'sage', icon:'⌁'},
  {name:'Burhanpur Shahi Qila', district:'Burhanpur', category:'Fort', lat:21.310, lng:76.230, era:'16th century', note:'A Mughal-era riverside fort with decorated chambers.', accent:'blue', icon:'▧'},
  {name:'Asirgarh Fort', district:'Burhanpur', category:'Fort', lat:21.470, lng:76.293, era:'Ancient', note:'A strategic hill fort known as the gateway to the Deccan.', accent:'blue', icon:'▧'},
  {name:'Patalpani Waterfall', district:'Indore', category:'Natural heritage', lat:22.505, lng:75.785, era:'Natural landmark', note:'A seasonal cascade in the forested hills southwest of Indore.', accent:'water', icon:'≈'},
  {name:'Madhav Palace, Shivpuri', district:'Shivpuri', category:'Palace', lat:25.437, lng:77.658, era:'20th century', note:'A palace and hunting lodge overlooking Sakhya Sagar.', accent:'clay', icon:'⌂'},
  {name:'Ajaigarh Fort', district:'Panna', category:'Fort', lat:24.907, lng:80.267, era:'10th century', note:'A Bundela hilltop fort above the Ken valley.', accent:'blue', icon:'▧'},
  {name:'Datiya Palace', district:'Datia', category:'Palace', lat:25.667, lng:78.461, era:'17th century', note:'A seven-storey palace built without timber or iron.', accent:'clay', icon:'⌂'},
  {name:'Ramtirth Temple Complex', district:'Mandsaur', category:'Temple', lat:24.072, lng:75.069, era:'Historic', note:'Historic shrines and step structures on the edge of Mandsaur.', accent:'ochre', icon:'✳'},
  {name:'Bundi Gate, Chanderi', district:'Ashoknagar', category:'Heritage town', lat:24.715, lng:78.136, era:'Medieval', note:'An impressive gateway on the old trade route through Chanderi.', accent:'clay', icon:'▧'},
  {name:'Garhi Padavali', district:'Morena', category:'Temple', lat:26.263, lng:78.069, era:'10th century', note:'A richly carved temple enclosed by fort walls.', accent:'ochre', icon:'✳'},
  {name:'Narsinghgarh Fort', district:'Rajgarh', category:'Fort', lat:23.708, lng:77.099, era:'17th century', note:'A hill fort overlooking the historic Narsinghgarh town.', accent:'blue', icon:'▧'},
  {name:'Sas-Bahu Temples', district:'Gwalior', category:'Temple', lat:26.231, lng:78.175, era:'11th century', note:'Two finely carved temples within Gwalior Fort.', accent:'ochre', icon:'✳'},
  {name:'Kandariya Mahadeva Temple', district:'Chhatarpur', category:'Temple', lat:24.853, lng:79.921, era:'11th century', note:'The largest and most elaborate temple at Khajuraho.', accent:'ochre', icon:'✳'},
  {name:'Raneh Falls', district:'Chhatarpur', category:'Natural heritage', lat:24.925, lng:79.621, era:'Natural landmark', note:'A dramatic canyon cut through multicoloured granite.', accent:'water', icon:'≈'},
];

const categories = ['All categories', 'Fort', 'Temple', 'Cave', 'Palace', 'Museum', 'Mosque', 'Natural heritage', 'Sacred landscape'];
const fallbackDistricts = ['Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur','Chhatarpur','Chhindwara','Damoh','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Mandla','Mandsaur','Morena','Narmadapuram','Narsinghpur','Neemuch','Niwari','Panna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna','Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain','Umaria','Vidisha','Maihar','Mauganj','Pandhurna'];

function distanceKm(origin, destination) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const latDelta = radians(destination.lat - origin.latitude);
  const lngDelta = radians(destination.lng - origin.longitude);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(radians(origin.latitude)) * Math.cos(radians(destination.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapsPlaceUrl(place) {
  const query = `${place.name}, ${place.district}, Madhya Pradesh, India`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapsDirectionsUrl(place, origin) {
  const params = new URLSearchParams({ api: '1', destination: `${place.lat},${place.lng}`, travelmode: 'driving' });
  if (origin) params.set('origin', `${origin.latitude},${origin.longitude}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function pinIcon(place, selected = false) {
  return L.divIcon({
    className: 'heritage-marker-wrap',
    html: `<span class="heritage-marker ${place.accent} ${selected ? 'selected' : ''}"><span>${place.icon}</span></span>`,
    iconSize: [30, 36], iconAnchor: [15, 34], popupAnchor: [0, -32],
  });
}

function App() {
  const mapRef = useRef(null);
  const utteranceRef = useRef(null);
  const locationLayerRef = useRef(null);
  const layerRef = useRef(null);
  const markerRef = useRef(null);
  const markerByPlace = useRef(new Map());
  const mapContainer = useRef(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [district, setDistrict] = useState('All districts');
  const [districts, setDistricts] = useState(fallbackDistricts);
  const [geoError, setGeoError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [audioGuide, setAudioGuide] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [locationError, setLocationError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [tourStops, setTourStops] = useState([]);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourActive, setTourActive] = useState(false);
  const [sitePhoto, setSitePhoto] = useState(null);
  const [photoStatus, setPhotoStatus] = useState('idle');
  const [view, setView] = useState('Madhya Pradesh');
  const [saved, setSaved] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobilePanel, setMobilePanel] = useState(false);

  const filtered = useMemo(() => places.filter((place) => {
    const matchesQuery = `${place.name} ${place.district} ${place.category} ${place.note}`.toLowerCase().includes(query.toLowerCase().trim());
    const matchesCategory = category === 'All categories' || place.category === category || (category === 'Temple' && place.category === 'Jain site');
    const matchesDistrict = district === 'All districts' || place.district === district;
    return matchesQuery && matchesCategory && matchesDistrict;
  }), [query, category, district]);

  useEffect(() => {
    const map = L.map(mapContainer.current, { zoomControl: false, scrollWheelZoom: true, preferCanvas: true }).setView([23.55, 78.55], 6.35);
    mapRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    markerRef.current = L.layerGroup().addTo(map);
    locationLayerRef.current = L.layerGroup().addTo(map);

    loadDistricts('Madhya Pradesh', { resolution: 'high' })
      .then((geojson) => {
        const sourceFeatures = Array.isArray(geojson) ? geojson : (geojson.features || []);
        const features = sourceFeatures.map((feature) => ({
          ...feature,
          properties: { ...feature.properties, district: feature.properties.name },
        }));
        const normalizedGeojson = { ...geojson, features };
        const names = [...new Set(features.map((feature) => feature.properties.district).filter(Boolean))];
        if (names.length) setDistricts([...new Set([...names, 'Maihar', 'Mauganj', 'Pandhurna'])].sort((a, b) => a.localeCompare(b)));
        layerRef.current = L.geoJSON(normalizedGeojson, {
          style: () => ({ color: '#596b51', weight: 1.4, opacity: 0.77, fillColor: '#dce6d3', fillOpacity: 0.12 }),
          onEachFeature(feature, layer) {
            const name = feature.properties.district || 'Madhya Pradesh';
            layer.bindTooltip(name, { sticky: true, className: 'district-tooltip', direction: 'center' });
            layer.on('click', () => { setDistrict(name); setOpenMenu(null); });
          },
        }).addTo(map);
        map.fitBounds(layerRef.current.getBounds().pad(0.1), {
          paddingTopLeft: [420, 90],
          paddingBottomRight: [95, 48],
          maxZoom: 7.1,
        });
      })
      .catch(() => setGeoError(true));

    return () => map.remove();
  }, []);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  useEffect(() => {
    if (!selected) {
      setSitePhoto(null);
      setPhotoStatus('idle');
      return undefined;
    }
    const controller = new AbortController();
    setSitePhoto(null);
    setPhotoStatus('loading');
    const ignoredPhotoWords = new Set(['group', 'monuments', 'monument', 'temple', 'temples', 'fort', 'complex', 'caves', 'cave', 'palace', 'museum', 'falls', 'rock', 'shelters', 'the']);
    const photoKeyword = selected.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(/[^\p{L}\p{N}]+/u)
      .find((word) => word.length > 3 && !ignoredPhotoWords.has(word.toLowerCase())) || selected.district;
    const params = new URLSearchParams({
      action: 'query', generator: 'search', gsrnamespace: '6',
      gsrsearch: photoKeyword,
      gsrlimit: '8', prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1400',
      format: 'json', origin: '*',
    });
    fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error('Photo search unavailable'); return response.json(); })
      .then((data) => {
        const pages = Object.values(data.query?.pages || {}).sort((left, right) => (left.index || 0) - (right.index || 0));
        const relevantPages = pages.filter((page) => !/(airport|hotel|railway|logo|map|route|signboard)/i.test(page.title));
        const suitable = relevantPages.find((page) => page.imageinfo?.[0]?.thumburl && true)
          || pages.find((page) => page.imageinfo?.[0]?.thumburl && true);
        if (!suitable) throw new Error('No matching photo found');
        const image = suitable.imageinfo[0];
        const metadata = image.extmetadata || {};
        const decode = (value = '') => new DOMParser().parseFromString(value, 'text/html').body.textContent.trim();
        setSitePhoto({
          url: image.thumburl,
          title: suitable.title.replace(/^File:/, ''),
          page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(suitable.title.replaceAll(' ', '_'))}`,
          artist: decode(metadata.Artist?.value || metadata.Credit?.value || ''),
          license: decode(metadata.LicenseShortName?.value || ''),
        });
        setPhotoStatus('ready');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setSitePhoto(null);
          setPhotoStatus('unavailable');
        }
      });
    return () => controller.abort();
  }, [selected]);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;
    markerRef.current.clearLayers();
    markerByPlace.current.clear();
    filtered.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: pinIcon(place, selected?.name === place.name) });
      marker.on('click', () => setSelected(place));
      markerRef.current.addLayer(marker);
      markerByPlace.current.set(place.name, marker);
    });
  }, [filtered, selected]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (view === 'India') {
      setDistrict('All districts');
      setSelected(null);
      map.flyTo([22.7, 79.4], 4.45, { duration: 0.8 });
      return;
    }
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 10, { duration: 0.75 });
    } else if (district !== 'All districts' && layerRef.current) {
      const match = layerRef.current.getLayers().find((featureLayer) => featureLayer.feature.properties.district === district);
      if (match) map.flyToBounds(match.getBounds().pad(0.9), { duration: 0.7, maxZoom: 9 });
      else {
        const place = places.find((candidate) => candidate.district === district);
        if (place) map.flyTo([place.lat, place.lng], 8, { duration: 0.7 });
      }
    } else if (view === 'Madhya Pradesh' && layerRef.current) {
      map.flyToBounds(layerRef.current.getBounds().pad(0.1), { duration: 0.8, maxZoom: 7.1, paddingTopLeft: [420, 90], paddingBottomRight: [95, 48] });
    } else {
      map.flyTo([23.55, 78.55], 6.35, { duration: 0.8 });
    }
  }, [view, district, selected]);

  const goToPlace = (place) => {
    setSelected(place);
    setView('Madhya Pradesh');
    mapRef.current?.flyTo([place.lat, place.lng], 10, { duration: 0.75 });
    setMobilePanel(false);
  };

  const toggleSave = (name) => setSaved((old) => old.includes(name) ? old.filter((item) => item !== name) : [...old, name]);

  const getNearbyStops = (origin) => places
    .map((place) => ({ ...place, distance: distanceKm(origin, place) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 5);

  const requestLocation = (startTour = false) => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('GPS location is not available in this browser.');
      return;
    }
    setLocationStatus('locating');
    setLocationError('');
    navigator.geolocation.getCurrentPosition((position) => {
      const origin = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy || 0,
      };
      setUserLocation(origin);
      setLocationStatus('ready');
      const stops = getNearbyStops(origin);
      setTourStops(stops);
      setTourIndex(0);
      if (locationLayerRef.current) {
        locationLayerRef.current.clearLayers();
        L.circle([origin.latitude, origin.longitude], {
          radius: Math.max(30, Math.min(origin.accuracy, 2500)),
          color: '#557760', weight: 1, fillColor: '#7fa78b', fillOpacity: 0.12,
        }).addTo(locationLayerRef.current);
        L.circleMarker([origin.latitude, origin.longitude], {
          radius: 8, color: '#fff', weight: 3, fillColor: '#436856', fillOpacity: 1,
        }).bindTooltip('Your location').addTo(locationLayerRef.current);
      }
      if (startTour && stops.length) {
        setTourActive(true);
        setSelected(stops[0]);
        setView('Madhya Pradesh');
        mapRef.current?.flyTo([stops[0].lat, stops[0].lng], 9, { duration: 0.8 });
      }
      if (!startTour) mapRef.current?.flyTo([origin.latitude, origin.longitude], 8, { duration: 0.8 });
    }, (error) => {
      setLocationStatus('error');
      if (error.code === error.PERMISSION_DENIED) setLocationError('Location permission was denied. Allow location for this site in your browser settings to start the tour.');
      else if (error.code === error.TIMEOUT) setLocationError('Could not get a GPS fix in time. Try again where you have a clearer signal.');
      else setLocationError('Your location could not be determined. Check device location and try again.');
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
  };

  const startNearbyTour = () => {
    if (userLocation) {
      const stops = getNearbyStops(userLocation);
      setTourStops(stops);
      setTourIndex(0);
      setTourActive(true);
      if (stops[0]) {
        setSelected(stops[0]);
        mapRef.current?.flyTo([stops[0].lat, stops[0].lng], 9, { duration: 0.8 });
      }
      return;
    }
    requestLocation(true);
  };

  const advanceTour = () => {
    if (tourIndex >= tourStops.length - 1) {
      setTourActive(false);
      setTourIndex(0);
      return;
    }
    const nextIndex = tourIndex + 1;
    setTourIndex(nextIndex);
    setSelected(tourStops[nextIndex]);
    mapRef.current?.flyTo([tourStops[nextIndex].lat, tourStops[nextIndex].lng], 9, { duration: 0.8 });
  };

  const formatDistance = (kilometers) => kilometers < 1
    ? `${Math.round(kilometers * 1000)} m`
    : `${kilometers.toFixed(kilometers < 10 ? 1 : 0)} km`;

  const stopAudioGuide = () => {
    utteranceRef.current = null;
    window.speechSynthesis?.cancel();
    setAudioGuide(null);
  };

  const playAudioGuide = (place) => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setAudioGuide({ place: place.name, status: 'unavailable' });
      return;
    }

    const player = window.speechSynthesis;
    if (audioGuide?.place === place.name && audioGuide.status === 'speaking') {
      player.pause();
      setAudioGuide({ place: place.name, status: 'paused' });
      return;
    }
    if (audioGuide?.place === place.name && audioGuide.status === 'paused') {
      player.resume();
      setAudioGuide({ place: place.name, status: 'speaking' });
      return;
    }

    utteranceRef.current = null;
    player.cancel();
    const narration = new SpeechSynthesisUtterance(
      `${place.name}. ${place.category} in ${place.district} district, Madhya Pradesh. ${place.note} This site is associated with ${place.era}. Before travelling, check current opening and access information.`,
    );
    narration.lang = 'en-IN';
    narration.rate = 0.92;
    const voices = player.getVoices();
    narration.voice = voices.find((voice) => voice.lang.toLowerCase() === 'en-in')
      || voices.find((voice) => voice.lang.toLowerCase().startsWith('en-'))
      || null;
    narration.onstart = () => {
      if (utteranceRef.current === narration) setAudioGuide({ place: place.name, status: 'speaking' });
    };
    narration.onend = () => {
      if (utteranceRef.current === narration) {
        utteranceRef.current = null;
        setAudioGuide(null);
      }
    };
    narration.onerror = () => {
      if (utteranceRef.current === narration) {
        utteranceRef.current = null;
        setAudioGuide({ place: place.name, status: 'error' });
      }
    };
    utteranceRef.current = narration;
    setAudioGuide({ place: place.name, status: 'loading' });
    player.speak(narration);
  };

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Heritage Hope home" onClick={(event) => { event.preventDefault(); setView('Madhya Pradesh'); setDistrict('All districts'); setSelected(null); }}>
        <span className="brand-mark"><MapIcon size={18} strokeWidth={1.7}/><i /></span>
        <span className="brand-copy"><strong>HERITAGE HOPE</strong><span>MADE FOR THE CURIOUS</span></span>
      </a>
      <div className="topbar-center"><span className="live-dot" /> FIELD GUIDE <span className="topbar-divider">/</span> MADHYA PRADESH</div>
      <div className="topbar-actions"><button className="top-link" onClick={() => { setCategory('All categories'); setDistrict('All districts'); setQuery(''); setView('Madhya Pradesh'); }}>Explore</button><button className="icon-button help-button" title="About this map" onClick={() => setOpenMenu(openMenu === 'about' ? null : 'about')}><CircleHelp size={18}/></button><button className="menu-button" aria-label="Open places" onClick={() => setMobilePanel(!mobilePanel)}><Menu size={18}/></button></div>
    </header>

    <section className="map-stage">
      <div ref={mapContainer} className="map-canvas" aria-label="Interactive map of heritage places in India and Madhya Pradesh" />

      <div className="map-heading"><div className="overline"><span>22°58′ N&nbsp; · &nbsp;78°39′ E</span><span className="heading-rule"/><span>HEART OF INDIA</span></div><h1>Stories carved<br/>into <em>the land.</em></h1><p>Explore the living heritage of Madhya Pradesh,<br/>one remarkable place at a time.</p></div>

      <div className="view-switcher" aria-label="Map view">
        <button className={view === 'India' ? 'active' : ''} onClick={() => setView('India')}><span>01</span> INDIA</button>
        <button className={view === 'Madhya Pradesh' ? 'active' : ''} onClick={() => { setView('Madhya Pradesh'); setDistrict('All districts'); }}><span>02</span> MADHYA PRADESH</button>
      </div>

      <aside className={`explorer-panel ${mobilePanel ? 'mobile-open' : ''}`}>
        <div className="panel-topline"><span className="overline">YOUR FIELD GUIDE</span><button className="panel-close" onClick={() => setMobilePanel(false)} aria-label="Close panel"><X size={17}/></button></div>
        <label className="search-box"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a place, story, or district"/><kbd>⌘ K</kbd></label>
        <div className="filter-row">
          <div className="select-wrap"><button className="filter-select" onClick={() => setOpenMenu(openMenu === 'category' ? null : 'category')}><SlidersHorizontal size={14}/><span>{category}</span><ChevronDown size={15}/></button>{openMenu === 'category' && <div className="dropdown">{categories.map((item) => <button key={item} className={item === category ? 'chosen' : ''} onClick={() => { setCategory(item); setOpenMenu(null); }}><span>{item}</span>{item === category && <Check size={14}/>}</button>)}</div>}</div>
          <div className="select-wrap"><button className="filter-select" onClick={() => setOpenMenu(openMenu === 'district' ? null : 'district')}><MapPin size={14}/><span>{district}</span><ChevronDown size={15}/></button>{openMenu === 'district' && <div className="dropdown district-dropdown"><button className={district === 'All districts' ? 'chosen' : ''} onClick={() => { setDistrict('All districts'); setView('Madhya Pradesh'); setOpenMenu(null); }}>All districts <span className="count-pill">MP</span></button>{districts.map((item) => <button key={item} className={item === district ? 'chosen' : ''} onClick={() => { setDistrict(item); setView('Madhya Pradesh'); setOpenMenu(null); }}><span>{item}</span>{item === district && <Check size={14}/>}</button>)}</div>}</div>
        </div>

        <section className={`tour-card ${tourActive ? 'tour-active' : ''}`} aria-label="GPS guided tour">
          <div className="tour-card-top"><span><Route size={14}/> GPS GUIDED TOUR</span>{locationStatus === 'ready' && <span className="gps-ready"><i/> GPS READY</span>}</div>
          {tourActive && tourStops[tourIndex] ? <>
            <div className="tour-progress"><div className="tour-stop-count">STOP {String(tourIndex + 1).padStart(2, '0')} <span>/ {String(tourStops.length).padStart(2, '0')}</span></div><button className="tour-refresh" onClick={() => requestLocation(false)}><LocateFixed size={13}/> Update GPS</button></div>
            <div className="tour-stop-name">{tourStops[tourIndex].name}</div>
            <div className="tour-stop-meta">{tourStops[tourIndex].district} district <b>·</b> {formatDistance(tourStops[tourIndex].distance)} from you</div>
            <div className="tour-actions"><button className="tour-next" onClick={advanceTour}>{tourIndex === tourStops.length - 1 ? 'Finish tour' : 'Next stop'} <ArrowRight size={14}/></button><a className="tour-directions" href={mapsDirectionsUrl(tourStops[tourIndex], userLocation)} target="_blank" rel="noreferrer" title="Opens Google Maps with your location and this stop"><Navigation size={13}/> Directions</a></div>
          </> : locationStatus === 'locating' ? <div className="tour-message">Finding your location to plan nearby stops…</div>
            : locationStatus === 'error' ? <><div className="tour-message tour-error">{locationError}</div><button className="tour-start" onClick={startNearbyTour}><LocateFixed size={14}/> Try GPS again</button></>
              : <><div className="tour-message">Find the nearest heritage sites and follow a five-stop audio tour.</div><button className="tour-start" onClick={startNearbyTour}><LocateFixed size={14}/> Use my location &amp; start</button><div className="tour-privacy">Your location stays here until you choose Google Maps directions.</div></>}
        </section>

        <div className="results-heading"><div><span className="overline">THE LAY OF THE LAND</span><h2>{district === 'All districts' ? 'Places worth the journey' : district}</h2></div><span className="result-count">{filtered.length.toString().padStart(2,'0')} PLACES</span></div>
        <div className="results-list">
          {filtered.length ? filtered.map((place, index) => <button key={place.name} className={`place-card ${selected?.name === place.name ? 'is-selected' : ''}`} onClick={() => goToPlace(place)}>
            <span className={`place-symbol ${place.accent}`}>{place.icon}</span><span className="place-copy"><span className="place-meta">{place.category.toUpperCase()} <b>·</b> {place.district.toUpperCase()}</span><strong>{place.name}</strong><span className="place-era">{place.era}</span></span><span className="card-arrow"><ArrowRight size={16}/></span>
          </button>) : <div className="empty-state"><span>⌕</span><strong>No places found</strong><p>Try another search or clear a filter to discover somewhere new.</p><button onClick={() => { setQuery(''); setCategory('All categories'); setDistrict('All districts'); }}>Reset filters <ArrowRight size={14}/></button></div>}
        </div>
        <div className="panel-footer"><span><Sparkles size={14}/> A LITTLE WONDER, EVERYWHERE</span><span>01 — {filtered.length.toString().padStart(2,'0')}</span></div>
      </aside>

      <div className="map-tools"><div className="zoom-tools"><button aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()}><ZoomIn size={17}/></button><button aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()}><span className="zoom-out">−</span></button></div><button className="locate-button" aria-label="Show Madhya Pradesh" onClick={() => {setView('Madhya Pradesh');setDistrict('All districts')}}><Crosshair size={17}/></button></div>

      {selected && <div className="place-popover"><button className="popover-close" onClick={() => setSelected(null)} aria-label="Close details"><X size={15}/></button><div className="popover-image">{sitePhoto ? <img className="monument-photo" src={sitePhoto.url} alt={"Photo of " + selected.name} onError={() => { setSitePhoto(null); setPhotoStatus('unavailable'); }} /> : <div className="photo-placeholder"><span>{photoStatus === 'loading' ? 'FINDING A PHOTO ON COMMONS' : photoStatus === 'unavailable' ? 'NO PHOTO FOUND' : ''}</span></div>}<div className="popover-coordinate">{selected.lat.toFixed(3)}° N &nbsp; / &nbsp; {selected.lng.toFixed(3)}° E</div><span className={`popover-icon ${selected.accent}`}>{selected.icon}</span><span className="image-label">FIELD NOTE &nbsp; 0{Math.max(1, places.findIndex((place) => place.name === selected.name) + 1)}</span></div><div className="popover-content"><div className="overline">{selected.category.toUpperCase()} &nbsp; · &nbsp; {selected.district.toUpperCase()}</div><h3>{selected.name}</h3><p>{selected.note}</p>{photoStatus === 'loading' && <div className="photo-status">Finding a real site photo…</div>}{photoStatus === 'unavailable' && <a className="photo-status photo-search-link" href={`https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(selected.name + ' ' + selected.district)}&title=Special:MediaSearch&type=image`} target="_blank" rel="noreferrer">No image was found automatically · browse Commons photos <ExternalLink size={11}/></a>}{sitePhoto && <a className="photo-credit" href={sitePhoto.page} target="_blank" rel="noreferrer">PHOTO: {sitePhoto.artist || sitePhoto.title}{sitePhoto.license ? ' · ' + sitePhoto.license : ''} · WIKIMEDIA COMMONS</a>}<a className="google-place-link" href={mapsPlaceUrl(selected)} target="_blank" rel="noreferrer"><MapPin size={14}/> Open place in Google Maps <ExternalLink size={13}/></a>{userLocation && <p className="site-distance">{formatDistance(distanceKm(userLocation, selected))} from your current location</p>}<section className="audio-guide" aria-label={`Audio guide for ${selected.name}`}><div className="audio-guide-heading"><span><Volume2 size={14}/> AUDIO GUIDE</span><span>ENGLISH · INDIA</span></div><div className="audio-guide-controls"><button className="audio-play" onClick={() => playAudioGuide(selected)} aria-label={audioGuide?.place === selected.name && audioGuide.status === 'speaking' ? 'Pause audio guide' : audioGuide?.place === selected.name && audioGuide.status === 'paused' ? 'Resume audio guide' : `Play audio guide for ${selected.name}`}>{audioGuide?.place === selected.name && audioGuide.status === 'speaking' ? <><Pause size={14} fill="currentColor"/> Pause guide</> : audioGuide?.place === selected.name && audioGuide.status === 'paused' ? <><Play size={14} fill="currentColor"/> Resume guide</> : <><Play size={14} fill="currentColor"/> Listen to guide</>}</button>{audioGuide?.place === selected.name && audioGuide.status !== 'unavailable' && <button className="audio-stop" onClick={stopAudioGuide} aria-label="Stop audio guide"><Square size={12} fill="currentColor"/></button>}</div><p className="audio-status" aria-live="polite">{audioGuide?.place === selected.name ? ({ loading: 'Preparing narration…', speaking: 'Now playing', paused: 'Narration paused', error: 'Audio could not be played. Try again.', unavailable: 'Audio guidance is not supported in this browser.' }[audioGuide.status] || 'Spoken site introduction') : 'Short spoken site introduction'}</p></section><div className="popover-bottom"><span><Compass size={14}/> {selected.era}</span><button onClick={() => toggleSave(selected.name)} className={saved.includes(selected.name) ? 'saved' : ''}><Bookmark size={15} fill={saved.includes(selected.name) ? 'currentColor' : 'none'}/>{saved.includes(selected.name) ? 'SAVED' : 'SAVE PLACE'}</button></div></div></div>}

      <div className="map-caption"><span className="caption-mark">✳</span><span>DISCOVER <strong>55 DISTRICTS</strong><br/>AND A THOUSAND STORIES</span><ArrowDownUp size={15}/></div>
      {geoError && <div className="data-note">District boundaries could not be loaded. Check your connection to the public map data source.</div>}
      {openMenu === 'about' && <div className="about-card"><button className="popover-close" onClick={() => setOpenMenu(null)} aria-label="Close"><X size={15}/></button><span className="overline">A NOTE ON THE MAP</span><p>Place locations are curated guide pins. India’s base map and Madhya Pradesh district outlines use OpenStreetMap. Open boundary data is a best-effort reference and can lag newly notified administrative changes; use official Survey of India maps for survey or legal work.</p><span className="about-source">BOUNDARIES: VARDHAN MAPS · OPENSTREETMAP BASEMAP</span></div>}
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
