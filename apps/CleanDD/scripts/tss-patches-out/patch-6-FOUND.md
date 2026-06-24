# Patch 6 (FOUND)

## OLD
```
const [showDropdown, setShowDropdown]= useState(true)  // Default: dropdown visible
```

## NEW
```
const [showDropdown, setShowDropdown]= useState(true)  // Default: dropdown visible
const [showTempleList, setShowTempleList] = useState(false);
```
