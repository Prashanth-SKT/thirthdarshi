# Patch 4 (MISSING)

## OLD
```
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
      setFocusedTempleOnlyId(null);
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
      autoScroll={false}
      search
      inputSearchStyle={styles.dropdownSearchInput}
      searchPlaceholderTextColor="#6B7280"
      searchPlaceholder={templeSearchPlaceholderByLang[lang] || templeSearchPlaceholderByLang.en}
      data={stateTempleDropdownData}
      labelField="label"
      valueField="value"
      searchField="searchText"
      placeholder={selectTemplePlaceholderByLang[lang] || selectTemplePlaceholderByLang.en}
      value={selectedTempleFromState}
      onChange={(item) => {
        setSelectedTempleFromState(item.value);
        const temple = temples.find(t => t.firestoreId === item.value);
        if (temple) {
          // ✅ CHANGED: Use navigateToTempleMarker instead of handleMarkerPress
          navigateToTempleMarker(temple, { showOnlySelected: true });
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
        {filterHintByLang[lang] || filterHintByLang.en}
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
```

## NEW
```
    {/* ===== COMPACT TOP BAR ===== */}
    <View pointerEvents="box-none" style={styles.floatTopWrap}>
      <View style={styles.floatCard}>

        {/* Filter chip + Change button */}
        <View style={styles.filterChipRow}>
          <View style={styles.filterChip}>
            <FontAwesome
              name={selectedFilterType === 'nearby' ? 'location-arrow' : 'map-marker'}
              size={12}
              color="#002244"
            />
            <LanguageText style={styles.filterChipText} numberOfLines={1}>
              {selectedFilterType === 'nearby'
                ? (ui.nearby || 'Nearby')
                : (selectedState || ui.state || 'By State')}
            </LanguageText>
          </View>
          <TouchableOpacity
            style={styles.changeFilterBtn}
            onPress={() => navigation.navigate('TempleFilter')}
          >
            <FontAwesome name="sliders" size={12} color="#002244" />
            <Text style={styles.changeFilterText}>
              {lang === 'te' ? 'మార్చు' : lang === 'ta' ? 'மாற்று' : lang === 'hi' ? 'बदलें' : 'Change'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search bar — only for state filter where temple list can be large */}
        {selectedFilterType === 'state' && selectedState ? (
          <View style={[styles.row, { marginTop: 8 }]}>
            <FontAwesome name="search" size={13} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={templeSearchPlaceholderByLang[lang] || templeSearchPlaceholderByLang.en}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(q) => {
                setSearchQuery(q);
                if (q.length >= 2) {
                  const results = searchTemplesCrossLanguage(temples, q, lang);
                  setSuggestions(results.slice(0, 15));
                } else {
                  setSuggestions([]);
                }
              }}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => { setSearchQuery(''); setSuggestions([]); }}
                style={{ marginLeft: 6 }}
              >
                <FontAwesome name="times-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {/* Live suggestions popover */}
        {suggestions.length > 0 && searchQuery.length >= 2 && (
          <View style={styles.suggestPopover}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 220 }}>
              {suggestions.map((sug, idx) => (
                <TouchableOpacity
                  key={`${sug.firestoreId}-${idx}`}
                  onPress={() => {
                    onSelectSuggestion(sug);
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  style={styles.suggestItem}
                >
                  <LanguageText style={styles.suggestTitle}>{sug.name}</LanguageText>
                  <LanguageText style={styles.suggestMeta}>{sug.city}</LanguageText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

      </View>
    </View>
```
