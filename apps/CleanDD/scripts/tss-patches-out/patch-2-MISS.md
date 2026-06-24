# Patch 2 (MISSING)

## OLD
```
const TempleSearchScreen = ({ navigation }) => {
   const imagesLoaded = usePreloadImages();
```

## NEW
```
const TempleSearchScreen = ({ navigation, route }) => {
   const imagesLoaded = usePreloadImages();
   const routeFilterType = route?.params?.filterType || 'state';
   const routeSelectedState = route?.params?.selectedState || '';
```
