# Patch 19 (MISSING)

## OLD
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

## NEW
```
              onChangeText={(q) => {
                setSearchQuery(q);
                const term = q.trim().toLowerCase();
                if (term.length >= 2) {
                  // Match only against the displayed name (t.name) so what the
                  // user types always visibly matches the suggestion text shown
                  const nameMatches = temples.filter((t) =>
                    (t.name || '').toLowerCase().includes(term)
                  );
                  setSuggestions(nameMatches.slice(0, 15));
                } else {
                  setSuggestions([]);
                }
              }}
```
