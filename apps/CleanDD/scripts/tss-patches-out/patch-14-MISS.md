# Patch 14 (MISSING)

## OLD
```
          {/* Back button */}
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => navigation.navigate('TempleFilter')}
            activeOpacity={0.8}
          >
            <FontAwesome name="arrow-left" size={13} color="#002244" />
          </TouchableOpacity>

          {/* Active filter chip */}
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

          {/* Change filter button */}
          <TouchableOpacity
            style={styles.changeFilterBtn}
            onPress={() => navigation.navigate('TempleFilter')}
          >
            <FontAwesome name="sliders" size={12} color="#002244" />
            <Text style={styles.changeFilterText}>
              {lang === 'te' ? 'మార్చు' : lang === 'ta' ? 'மாற்று' : lang === 'hi' ? 'बदलें' : 'Change'}
            </Text>
          </TouchableOpacity>

          {/* Logout button */}
          <TouchableOpacity
            style={styles.logoutIconBtn}
            onPress={async () => {
              try { await auth().signOut(); } catch (e) { /* ignore */ }
            }}
            activeOpacity={0.8}
          >
            <FontAwesome name="sign-out" size={13} color="#dc2626" />
          </TouchableOpacity>
```

## NEW
```
          {/* Back button */}
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => navigation.navigate('TempleFilter')}
            activeOpacity={0.8}
          >
            <FontAwesome name="arrow-left" size={12} color="#002244" />
            <Text style={styles.navIconBtnText}>
              {lang === 'te' ? 'వెనక్కి' : lang === 'ta' ? 'பின்' : lang === 'hi' ? 'वापस' : 'Back'}
            </Text>
          </TouchableOpacity>

          {/* Active filter chip */}
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

          {/* Change filter button */}
          <TouchableOpacity
            style={styles.changeFilterBtn}
            onPress={() => navigation.navigate('TempleFilter')}
          >
            <FontAwesome name="sliders" size={12} color="#002244" />
            <Text style={styles.changeFilterText}>
              {lang === 'te' ? 'మార్చు' : lang === 'ta' ? 'மாற்று' : lang === 'hi' ? 'बदलें' : 'Change'}
            </Text>
          </TouchableOpacity>

          {/* Logout button */}
          <TouchableOpacity
            style={styles.logoutIconBtn}
            onPress={async () => {
              try { await auth().signOut(); } catch (e) { /* ignore */ }
            }}
            activeOpacity={0.8}
          >
            <FontAwesome name="sign-out" size={12} color="#dc2626" />
            <Text style={styles.logoutIconBtnText}>
              {lang === 'te' ? 'లాగ్అవుట్' : lang === 'ta' ? 'வெளியேறு' : lang === 'hi' ? 'लॉगआउट' : 'Logout'}
            </Text>
          </TouchableOpacity>
```
