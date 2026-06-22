# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ===============================
# Firebase Core Rules
# ===============================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firebase Attributes
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses

# ===============================
# Firestore Rules
# ===============================
-keep class com.google.firebase.firestore.** { *; }
-keepclassmembers class com.google.firebase.firestore.** { *; }
-dontwarn com.google.firebase.firestore.**

# Keep Firestore model classes - IMPORTANT: Replace with your actual package name
# Example: if your package is com.myapp, use: -keep class com.myapp.models.** { *; }
-keep class com.thirtdarshi.app.models.** { *; }
-keepclassmembers class com.thirtdarshi.app.models.** { *; }

# ===============================
# Firebase Auth Rules
# ===============================
-keep class com.google.firebase.auth.** { *; }
-keepclassmembers class com.google.firebase.auth.** { *; }
-keep class com.google.android.gms.internal.** { *; }
-dontwarn com.google.firebase.auth.**

# ===============================
# React Native Firebase
# ===============================
-keep class io.invertase.firebase.** { *; }
-keepclassmembers class io.invertase.firebase.** { *; }
-dontwarn io.invertase.firebase.**

# ===============================
# React Native Core Rules
# ===============================
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep React Native modules
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.modules.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# ===============================
# Hermes Engine Rules
# ===============================
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# ===============================
# OkHttp Rules (used by React Native)
# ===============================
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# ===============================
# Retrofit Rules (if using)
# ===============================
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# ===============================
# Gson Rules (if using for JSON parsing)
# ===============================
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# ===============================
# Google Play Services Rules
# ===============================
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.common.** { *; }

# ===============================
# JSR 305 Annotations (used by Firebase)
# ===============================
-dontwarn javax.annotation.**

# ===============================
# Keep Application class
# ===============================
-keep public class * extends android.app.Application
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# ===============================
# Android Architecture Components
# ===============================
-keep class * extends androidx.lifecycle.ViewModel { *; }
-keep class * extends androidx.lifecycle.AndroidViewModel { *; }

# ===============================
# Keep Serializable classes
# ===============================
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ===============================
# Keep Parcelable classes
# ===============================
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ===============================
# Remove logging in production (optional but recommended)
# ===============================
# Uncomment these lines to remove all Log statements in production
# -assumenosideeffects class android.util.Log {
#     public static boolean isLoggable(java.lang.String, int);
#     public static int v(...);
#     public static int i(...);
#     public static int w(...);
#     public static int d(...);
#     public static int e(...);
# }

# ===============================
# AsyncStorage Rules (React Native)
# ===============================
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# ===============================
# NetInfo Rules (if using)
# ===============================
-keep class com.reactnativecommunity.netinfo.** { *; }

# ===============================
# Geolocation Rules (if using)
# ===============================
-keep class com.reactnativecommunity.geolocation.** { *; }

# ===============================
# React Native Permissions (if using)
# ===============================
-keep class com.zoontek.rnpermissions.** { *; }

# ===============================
# Keep all your app's custom classes
# IMPORTANT: Replace 'com.thirtdarshi.app' with your actual package name
# ===============================
-keep class com.thirtdarshi.app.** { *; }
-keepclassmembers class com.thirtdarshi.app.** { *; }

# ===============================
# General Android Rules
# ===============================
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Keep custom exceptions
-keep public class * extends java.lang.Exception

# ===============================
# Suppress warnings
# ===============================
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**