# Patch 7 (MISSING)

## OLD
```
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
```

## NEW
```
        {/* Search bar + Browse list button — only for state filter */}
        {selectedFilterType === 'state' && selectedState ? (
          <View style={[styles.row, { marginTop: 8 }]}>
            <FontAwesome name="search" size={13} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { flex: 1 }]}
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
            <TouchableOpacity
              style={styles.browseListBtn}
              onPress={() => { setShowTempleList(true); setSearchQuery(''); setSuggestions([]); }}
            >
              <FontAwesome name="list" size={13} color="#fff" />
              <Text style={styles.browseListBtnText}>
                {lang === 'te' ? 'జాబితా' : lang === 'ta' ? 'பட்டியல்' : lang === 'hi' ? 'सूची' : 'List'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
```
