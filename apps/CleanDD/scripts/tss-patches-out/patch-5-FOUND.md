# Patch 5 (FOUND)

## OLD
```
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
```

## NEW
```
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
  filterChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flex: 1,
    marginRight: 10,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#002244',
    flexShrink: 1,
  },
  changeFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#002244',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e5b765',
  },
```
