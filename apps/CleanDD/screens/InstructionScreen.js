import React, { useState,useEffect } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FlatList, Dimensions } from "react-native";
import { useRef } from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppQuickLinks from '../components/AppQuickLinks';

const { width } = Dimensions.get("window");

const instructionImages = {
  english: [
    require("../assets/instructions/english/english-1-mh.png"),
    require("../assets/instructions/english/english-2-mh.png"),
    
    require("../assets/instructions/english/english-3-mh.png"),
    require("../assets/instructions/english/english-4.png"),
  ],
  telugu: [
    require("../assets/instructions/telugu/telugu-1-mh.png"),
    require("../assets/instructions/telugu/telugu-2-mh.png"),
    require("../assets/instructions/telugu/telugu-3-mh.png"),
    require("../assets/instructions/telugu/telugu-4.png"),
    
  ],
};


export default function InstructionScreen({ navigation, route }) {
  
  const { language } = route.params;
  const images = instructionImages[language] || instructionImages.english;
  
const [currentIndex, setCurrentIndex] = useState(0);
const flatListRef = useRef(null);
// ✅ ADD THIS
const tooltipText = language === "telugu" ? "స్లైడ్ చేయండి" : "Slide to continue";

  const goNext = () => {
  if (currentIndex < images.length - 1) {
    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  }
};

// ✅ ADD THIS
const [showTooltip, setShowTooltip] = useState(true);

// ✅ ADD THIS EFFECT (auto-hide after 5 seconds)
useEffect(() => {
  if (showTooltip && currentIndex === 0) {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }
}, [showTooltip, currentIndex]);

   

  const startApp = () => {
    navigation.replace('TempleFilter');
  };
// ✅ IN onScroll function, add this
const onScroll = (event) => {
  const contentOffsetX = event.nativeEvent.contentOffset.x;
  const currentIdx = Math.round(contentOffsetX / width);
  setCurrentIndex(currentIdx);
  
  // ✅ Hide tooltip when user scrolls
  if (currentIdx > 0) {
    setShowTooltip(false);
  }
};

const isLastImage = currentIndex === images.length - 1;


  const startLabel = language === "telugu" ? "ప్రారంభించండి" : "Start";
  const quickLinksLang = language === "telugu" ? "te" : "en";

  return (
   <View style={styles.fill}>
  {/* Carousel */}
  <FlatList
    ref={flatListRef}
    data={images}
    renderItem={({ item }) => (
      <View style={[styles.slide, { width }]}>
        <Image source={item} style={styles.image} resizeMode="cover" />
      </View>
    )}
    keyExtractor={(_, index) => index.toString()}
    horizontal
    pagingEnabled
    scrollEventThrottle={16}
    onScroll={onScroll}
    showsHorizontalScrollIndicator={false}
  />

  {/* ✅ TOOLTIP - Only on first slide */}
{showTooltip && currentIndex === 0 && (
  <View style={styles.tooltipContainer}>
    <Text style={styles.tooltipText}>👆 {tooltipText}</Text>
  </View>
)}

{isLastImage && (
  <View style={styles.dotsWrapper}>
    {images.map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.dot,
          idx === currentIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
)}



{isLastImage && (
  <View style={styles.bottomBar}>
    <TouchableOpacity onPress={startApp} style={styles.startButton}>
      <Text style={styles.startButtonText}>{startLabel}</Text>
    </TouchableOpacity>
    <AppQuickLinks lang={quickLinksLang} style={{ marginTop: 12 }} />
  </View>
)}



</View>

  );
}

const styles = StyleSheet.create({
  fill: {
  flex: 1,
  backgroundColor: '#faeed1',
  alignItems: 'stretch',        // ✅ Change from 'center'
  justifyContent: 'flex-start',  // ✅ Change from 'center'
  paddingHorizontal: 0,          // ✅ Change from 5
},

imageBox: {
  width: '130%',
  height: '100%',                // ✅ Change from '65%'
  backgroundColor: 'transparent', // ✅ Change from '#fffbe9'
  borderRadius: 0,               // ✅ Change from 16
  marginTop: 0,                  // ✅ Change from 40
  marginBottom: 0,               // ✅ Change from 18
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 0,                  // ✅ Remove shadow
},

  image: {
  width: '101%',                 // ✅ Change from '90%'
  height: '92%',
  borderRadius: 0,               // ✅ Change from 12
},

  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '84%',
    marginTop: 30,
    gap: 15,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#faeed1',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5b765',
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
  },
  navButtonDisabled: {
    opacity: 0.5,
    borderColor: '#e0e0e0',
  },
  navText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#002244',
  },
  textDisabled: {
    color: "#aaa",
  },
  startButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#e2963d', // orange
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5b765',
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
  },
 slide: {
  alignItems: 'center',
  justifyContent: 'center',
  width: width,                  // ✅ Add this
  height: '100%',                // ✅ Add this
  paddingTop: 0,                 // ✅ Change from 40
},


dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
},
dotActive: {
  backgroundColor: '#e2963d',
  width: 10,
},
dotInactive: {
  backgroundColor: '#ccc',
},
bottomBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 80,
  backgroundColor: "#faeed1",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 16,
  paddingBottom: 16,
  borderTopWidth: 1,
  borderTopColor: "#e5b765",
  zIndex: 10,
},
// ✅ ADD THIS
tooltipContainer: {
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  alignItems: "center",
  zIndex: 20,
},

tooltipText: {
  backgroundColor: "#002244",
  color: "#fff",
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 12,
  fontSize: 16,
  fontWeight: "600",
  textAlign: "center",
  elevation: 5,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},

dotsWrapper: {
  position: "absolute",
  bottom: 100,
  left: 0,
  right: 0,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
  zIndex: 5,
},


backButton: {
  padding: 8,
  borderRadius: 8,
  backgroundColor: "#f0f0f0",
  alignItems: "center",
  justifyContent: "center",
},

startButtonTop: {
  paddingVertical: 10,
  paddingHorizontal: 16,
 
  backgroundColor: "#e2963d",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
},

  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "#faeed1",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5b765",
    alignItems: "center",
    minWidth: 100,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#002244",
  },
});
