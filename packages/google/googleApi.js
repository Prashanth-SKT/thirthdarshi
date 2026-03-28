// utils/googleApis.js

const GOOGLE_API_KEY = 'AIzaSyDZ9rGSrXewUkKlX_YVdU2d9_Rs_aRMpGE';

const GoogleAPIEndpoints = {
  directions: 'https://maps.googleapis.com/maps/api/directions/json',
  distanceMatrix: 'https://maps.googleapis.com/maps/api/distancematrix/json',
  placesAutocomplete: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
  reverseGeocode: 'https://maps.googleapis.com/maps/api/geocode/json',
};

export { GOOGLE_API_KEY, GoogleAPIEndpoints };
