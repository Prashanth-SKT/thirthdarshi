# Patch 16 (MISSING)

## OLD
```
              onChangeText={(q) => {
                setSearchQuery(q);
                if (q.length >= 2) {
                  const results = searchTemplesCrossLanguage(temples, q, lang);
                  setSuggestions(results.slice(0, 15));
                } else {
                  setSuggestions([]);
                }
              }}
```

## NEW
```
              onChangeText={(q) => {
                setSearchQuery(q);
                if (q.trim().length >= 2) {
                  const term = q.trim().toLowerCase();
                  // Search by temple name only (not city) so results are name-specific
                  const nameMatches = temples.filter((t) => {
                    return (
                      (t.name || '').toLowerCase().includes(term) ||
                      (t.name_en || '').toLowerCase().includes(term) ||
                      (t.name_te || '').toLowerCase().includes(term) ||
                      (t.name_te_roman || '').toLowerCase().includes(term)
                    );
                  });
                  setSuggestions(nameMatches.slice(0, 15));
                } else {
                  setSuggestions([]);
                }
              }}
```
