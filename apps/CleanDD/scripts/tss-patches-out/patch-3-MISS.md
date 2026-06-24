# Patch 3 (MISSING)

## OLD
```
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");  // ← ADD THIS
const [filters, setFilters] = useState({ cities: [], states: [] });
const [selectedFilterType, setSelectedFilterType] = useState("state"); // set state as default
```

## NEW
```
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState(routeSelectedState);
const [filters, setFilters] = useState({ cities: [], states: [] });
const [selectedFilterType, setSelectedFilterType] = useState(routeFilterType);
```
