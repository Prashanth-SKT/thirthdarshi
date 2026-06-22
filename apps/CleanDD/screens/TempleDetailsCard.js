import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import LanguageText from './LanguageText';
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

const TempleDetailsCard = ({ templeId, lang = "en", t, onClose }) => {
  const { lang: currentLang } = useContext(LanguageContext);
  const normalizedLang = typeof lang === "string" ? lang.toLowerCase() : "en";
  const { width } = useWindowDimensions();

  const fontFamily = currentLang === 'te' 
    ? 'Gidugu_400Regular' 
    : 'Gidugu_400Regular';

  const systemFonts = [fontFamily]; // Register your custom font

  const [showModal, setShowModal] = useState(true);
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [extraDetailsHtml, setExtraDetailsHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMainDescription = async () => {
      try {
        setDescriptionLoading(true);
        const doc = await firestore()
          .collection("temples")
          .doc(templeId)
          .get();
        if (doc.exists) {
          const data = doc.data();
          const descHtml = data?.[normalizedLang]?.description || "";
          setDescriptionHtml(descHtml);
        } else {
          setDescriptionHtml("<p>No description found.</p>");
        }
      } catch (e) {
        console.error("Error fetching main description:", e);
        setDescriptionHtml("<p>Failed to load description.</p>");
      } finally {
        setDescriptionLoading(false);
        setLoading(false);
      }
    };
    if (showModal) fetchMainDescription();
  }, [showModal, templeId, normalizedLang]);

  const fetchAndShowDetails = async () => {
    setShowExtraDetails(true);
    setDetailsLoading(true);
    try {
      const doc = await firestore()
        .collection("temple_details")
        .doc(templeId)
        .get();
      if (doc.exists) {
        const data = doc.data();
        const detailsHtml =
          (data[normalizedLang] && data[normalizedLang].details) ||
          (data.en && data.en.details) ||
          "";
        if (detailsHtml && detailsHtml.trim() !== "") {
          setExtraDetailsHtml(detailsHtml.replace(/^"+|"+$/g, ""));
        } else {
          setExtraDetailsHtml("<p>No additional details in selected language.</p>");
        }
      } else {
        setExtraDetailsHtml("<p>No additional details found.</p>");
      }
    } catch (e) {
      console.error("Error fetching temple details:", e);
      setExtraDetailsHtml("<p>Failed to load additional details.</p>");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setDescriptionHtml("");
    setExtraDetailsHtml("");
    setShowExtraDetails(false);
    if (onClose) onClose();
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#333" />;
  }

  return (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalContent}>
          <LanguageText style={styles.modalTitle}>
            {t?.templeDescription || "Temple Description"}
          </LanguageText>
          {descriptionLoading ? (
            <ActivityIndicator size="large" color="#555" />
          ) : (
            <ScrollView style={styles.scrollArea}>
             <RenderHtml
  contentWidth={width}
  source={{ html: descriptionHtml || "<p>No description found.</p>" }}
  tagsStyles={{
    body: { fontFamily, includeFontPadding: false },
    p: { fontFamily },
    div: { fontFamily },
    span: { fontFamily },
    strong: { fontFamily },
    b: { fontFamily },
    em: { fontFamily },
    li: { fontFamily },
    h1: { fontFamily },
    h2: { fontFamily },
    h3: { fontFamily },
  }}
  defaultTextProps={{ style: { fontFamily } }}
/>

              {showExtraDetails ? (
                detailsLoading ? (
                  <ActivityIndicator size="large" color="#666" style={{ marginTop: 20 }} />
                ) : (
                  <View style={{ marginTop: 16 }}>
                    <RenderHtml
  contentWidth={width}
  source={{ html: extraDetailsHtml || "<p>No additional details found.</p>" }}
  systemFonts={systemFonts}
  tagsStyles={{
    body: { fontFamily, fontWeight: 'normal' },
    p: { fontFamily, fontWeight: 'normal' },
    div: { fontFamily, fontWeight: 'normal' },
    span: { fontFamily, fontWeight: 'normal' },
    strong: { fontFamily, fontWeight: 'normal' },
    b: { fontFamily, fontWeight: 'normal' },
    em: { fontFamily, fontWeight: 'normal' },
    li: { fontFamily, fontWeight: 'normal' },
    h1: { fontFamily, fontWeight: 'normal' },
    h2: { fontFamily, fontWeight: 'normal' },
    h3: { fontFamily, fontWeight: 'normal' },
  }}
  defaultTextProps={{ style: { fontFamily, fontWeight: 'normal' } }}
/>

                  </View>
                )
              ) : (
                <TouchableOpacity
                  style={styles.showMoreBtn}
                  onPress={fetchAndShowDetails}
                >
                  <LanguageText style={styles.showMoreText}>
                    {t?.showMore || "Show More"}
                  </LanguageText>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <LanguageText style={styles.closeText}>{t?.close || "Close"}</LanguageText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TempleDetailsCard;




const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    margin: 10,
  },
  line: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  showMoreBtn: {
    marginTop: 18,
    marginBottom: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  showMoreText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeText: {
    color: "#d00",
    fontWeight: "bold",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scrollArea: {
    marginBottom: 10,
  },
  closeBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f8d7da",
    alignSelf: "flex-end",
  },
});
