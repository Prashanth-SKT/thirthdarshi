# Patch 8 (FOUND)

## OLD
```
    {/* ✅ TOOLTIP #2: Marker Hint (floating overlay, doesn't wrap anything) */}
    {showMarkerHint && displayTemples.length > 0 && (
```

## NEW
```
    {/* ========== BROWSE TEMPLE LIST PANEL ========== */}
    {showTempleList && temples.length > 0 && (
      <View style={styles.templeListPanel}>
        {/* Panel header */}
        <View style={styles.templeListHeader}>
          <View>
            <Text style={styles.templeListTitle}>
              {lang === 'te' ? 'ఆలయాల జాబితా' : lang === 'ta' ? 'கோவில் பட்டியல்' : lang === 'hi' ? 'मंदिर सूची' : 'Temple List'}
            </Text>
            <Text style={styles.templeListCount}>
              {temples.length}{' '}
              {lang === 'te' ? 'ఆలయాలు' : lang === 'ta' ? 'கோவில்கள்' : lang === 'hi' ? 'मंदिर' : 'temples'}
              {selectedState ? ` · ${selectedState}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.templeListCloseBtn}
            onPress={() => setShowTempleList(false)}
          >
            <FontAwesome name="times" size={16} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Scrollable temple list */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {temples.map((t, idx) => (
            <TouchableOpacity
              key={`list-${t.firestoreId || idx}`}
              style={styles.templeListItem}
              onPress={() => {
                setShowTempleList(false);
                navigateToTempleMarker(t, { showOnlySelected: false });
                if (mapRef.current && t.coords) {
                  mapRef.current.animateToRegion({
                    latitude: t.coords.latitude,
                    longitude: t.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }, 800);
                }
              }}
            >
              <View style={styles.templeListItemRank}>
                <Text style={styles.templeListItemRankText}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <LanguageText style={styles.templeListItemName} numberOfLines={1}>
                  {t.name}
                </LanguageText>
                <LanguageText style={styles.templeListItemCity} numberOfLines={1}>
                  {t.city}{t.mainDeity ? ` · ${t.mainDeity}` : ''}
                </LanguageText>
              </View>
              <FontAwesome name="chevron-right" size={12} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}

    {/* ✅ TOOLTIP #2: Marker Hint (floating overlay, doesn't wrap anything) */}
    {showMarkerHint && displayTemples.length > 0 && (
```
