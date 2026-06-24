# Patch 10 (FOUND)

## OLD
```
import { LanguageContext } from "./LanguageContext";
import firestore from "@react-native-firebase/firestore";
```

## NEW
```
import { LanguageContext } from "./LanguageContext";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
```
