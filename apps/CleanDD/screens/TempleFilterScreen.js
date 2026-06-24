import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import { fetchTemples } from '../../CleanDD/packages/api-client/firestoreClient';
import { LanguageContext } from './LanguageContext';
import AppQuickLinks from '../components/AppQuickLinks';

const LABELS = {
  en: {
    title: 'Find Temples',
    subtitle: 'Choose how you want to explore',
    byState: 'By State',
    nearby: 'Nearby',
    selectState: 'Select a State',
    searchButton: 'Search Temples',
    loadingStates: 'Loading states...',
    selectStateFirst: 'Please select a state to continue',
  },
  te: {
    title: 'ఆలయాలు వెతకండి',
    subtitle: 'మీరు ఎలా అన్వేషించాలనుకుంటున్నారో ఎంచుకోండి',
    byState: 'రాష్ట్రం వారీగా',
    nearby: 'సమీపంలో',
    selectState: 'రాష్ట్రం ఎంచుకోండి',
    searchButton: 'ఆలయాలు వెతకండి',
    loadingStates: 'రాష్ట్రాలు లోడ్ అవుతున్నాయి...',
    selectStateFirst: 'కొనసాగడానికి రాష్ట్రం ఎంచుకోండి',
  },
  ta: {
    title: 'கோவில்களை தேடுங்கள்',
    subtitle: 'எவ்வாறு ஆராய விரும்புகிறீர்கள் என்பதை தேர்ந்தெடுக்கவும்',
    byState: 'மாநிலம் வாரியாக',
    nearby: 'அருகில்',
    selectState: 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    searchButton: 'கோவில்களை தேடுங்கள்',
    loadingStates: 'மாநிலங்கள் ஏற்றப்படுகின்றன...',
    selectStateFirst: 'தொடர மாநிலத்தை தேர்ந்தெடுக்கவும்',
  },
  hi: {
    title: 'मंदिर खोजें',
    subtitle: 'कैसे खोजना चाहते हैं चुनें',
    byState: 'राज्य के अनुसार',
    nearby: 'पास में',
    selectState: 'राज्य चुनें',
    searchButton: 'मंदिर खोजें',
    loadingStates: 'राज्य लोड हो रहे हैं...',
    selectStateFirst: 'जारी रखने के लिए राज्य चुनें',
  },
};

const TempleFilterScreen = ({ navigation }) => {
  const { lang } = useContext(LanguageContext);
  const labels = LABELS[lang] || LABELS.en;

  const [filterType, setFilterType] = useState('state');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await fetchTemples();
        const statesSet = new Set();
        all.forEach((tItem) => {
          const langData = tItem[lang] || tItem.en || tItem.te || tItem.ta || tItem.hi || {};
          if (langData?.state) statesSet.add(langData.state.trim());
        });
        setStates(Array.from(statesSet).sort((a, b) => a.localeCompare(b)));
      } catch (e) {
        console.error('Error loading states for filter screen:', e);
      } finally {
        setLoadingStates(false);
      }
    })();
  }, [lang]);

  const canSearch = filterType === 'nearby' || (filterType === 'state' && selectedState !== '');

  const handleSearch = () => {
    navigation.navigate('TempleSearch', {
      filterType,
      selectedState: filterType === 'state' ? selectedState : '',
    });
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('LanguageSelection')}
          activeOpacity={0.8}
        >
          <FontAwesome name="arrow-left" size={14} color="#002244" />
          <Text style={styles.navBtnText}>
            {lang === 'te' ? 'వెనక్కి' : lang === 'ta' ? 'பின்செல்' : lang === 'hi' ? 'वापस' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.logoutBtn]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <FontAwesome name="sign-out" size={14} color="#dc2626" />
          <Text style={[styles.navBtnText, styles.logoutBtnText]}>
            {lang === 'te' ? 'లాగ్ అవుట్' : lang === 'ta' ? 'வெளியேறு' : lang === 'hi' ? 'लॉगआउट' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>
      </View>

      {/* Filter type buttons */}
      <View style={styles.filterTypeRow}>
        <TouchableOpacity
          style={[styles.filterTypeBtn, filterType === 'state' && styles.filterTypeBtnActive]}
          onPress={() => { setFilterType('state'); setSelectedState(''); }}
        >
          <FontAwesome
            name="map-marker"
            size={20}
            color={filterType === 'state' ? '#fff' : '#002244'}
          />
          <Text style={[styles.filterTypeBtnText, filterType === 'state' && styles.filterTypeBtnTextActive]}>
            {labels.byState}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTypeBtn, filterType === 'nearby' && styles.filterTypeBtnActive]}
          onPress={() => { setFilterType('nearby'); setSelectedState(''); }}
        >
          <FontAwesome
            name="location-arrow"
            size={20}
            color={filterType === 'nearby' ? '#fff' : '#002244'}
          />
          <Text style={[styles.filterTypeBtnText, filterType === 'nearby' && styles.filterTypeBtnTextActive]}>
            {labels.nearby}
          </Text>
        </TouchableOpacity>
      </View>

      {/* State dropdown */}
      {filterType === 'state' && (
        <View style={styles.dropdownSection}>
          {loadingStates ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#002244" />
              <Text style={styles.loadingText}>{labels.loadingStates}</Text>
            </View>
          ) : (
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownList}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#FEF3C7"
              dropdownPosition="auto"
              maxHeight={320}
              data={states.map(s => ({ label: s, value: s }))}
              labelField="label"
              valueField="value"
              placeholder={labels.selectState}
              value={selectedState}
              onChange={(item) => setSelectedState(item.value)}
              renderRightIcon={() => (
                <FontAwesome name="chevron-down" size={14} color="#6B7280" />
              )}
            />
          )}
        </View>
      )}

      {/* Hint text when state not yet picked */}
      {filterType === 'state' && !selectedState && !loadingStates && (
        <Text style={styles.hintText}>{labels.selectStateFirst}</Text>
      )}

      {/* Search button */}
      <TouchableOpacity
        style={[styles.searchBtn, !canSearch && styles.searchBtnDisabled]}
        onPress={handleSearch}
        disabled={!canSearch}
        activeOpacity={0.85}
      >
        <FontAwesome
          name="search"
          size={18}
          color={canSearch ? '#fff' : '#aaa'}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.searchBtnText, !canSearch && styles.searchBtnTextDisabled]}>
          {labels.searchButton}
        </Text>
      </TouchableOpacity>

      <AppQuickLinks lang={lang} />
    </View>
  );
};

export default TempleFilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5b765',
    paddingHorizontal: 24,
    paddingTop: 52,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#002244',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#002244',
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#dc2626',
  },
  logoutBtnText: {
    color: '#dc2626',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#002244',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#44475a',
    textAlign: 'center',
  },
  filterTypeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  filterTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: '#FAEED1',
    borderWidth: 2,
    borderColor: '#002244',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  filterTypeBtnActive: {
    backgroundColor: '#002244',
    borderColor: '#e5b765',
  },
  filterTypeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#002244',
  },
  filterTypeBtnTextActive: {
    color: '#e5b765',
  },
  dropdownSection: {
    marginBottom: 20,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  loadingText: {
    fontSize: 14,
    color: '#002244',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#002244',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  dropdownList: {
    borderRadius: 12,
    borderColor: '#E5E7EB',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  dropdownSelected: {
    fontSize: 15,
    color: '#002244',
    fontWeight: '600',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemContainer: {
    paddingVertical: 4,
  },
  hintText: {
    textAlign: 'center',
    color: '#44475a',
    fontSize: 13,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#002244',
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  searchBtnDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
  searchBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e5b765',
    letterSpacing: 0.5,
  },
  searchBtnTextDisabled: {
    color: '#888',
  },
});
