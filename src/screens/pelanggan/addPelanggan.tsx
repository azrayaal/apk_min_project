import React, { useState } from "react";
import { Text, TextInput, Button, View, Alert } from "react-native";
import { StyledText } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../../hooks";

export default function AddPelanggan() {
  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    nama: "",
    domisili: "",
    jenis_kelamin: "",
  });
  const navigation = useNavigation();
  // Fungsi untuk menangani perubahan input
  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value, // Perbarui nilai dari input yang sesuai
    });
  };

  // Fungsi untuk submit data
  const handleSubmit = async () => {
    if (!formData.nama || !formData.domisili || !formData.jenis_kelamin) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      // const response = await fetch(`${Config.API_URL}/pelanggan`, {
      const response = await fetch(`${baseUrl}/pelanggan`, {
        method: "POST", // Metode POST
        headers: {
          "Content-Type": "application/json", // Header untuk JSON
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();

        if (response.ok) {
          Alert.alert("Success", "Data berhasil dikirim!");
          console.log("Response from API:", json); // Log respons API
          navigation.goBack();
        } else {
          Alert.alert("Error", `Gagal mengirim data: ${json.message}`);
          console.log("Error from API:", json); // Log error API
        }
      } else {
        const text = await response.text();
        Alert.alert("Error", `Unexpected response: ${text}`);
        console.log("Error: Received non-JSON response:", text);
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam mengirim data!");
      console.error("Error:", error); // Log error dari catch
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <StyledText className="py-2 font-bold text-center text-2xl">
        Add Pelanggan
      </StyledText>
      {/* Input untuk NAMA */}
      <Text>NAMA:</Text>
      <TextInput
        value={formData.nama}
        onChangeText={(value) => handleInputChange("nama", value)}
        placeholder="Masukkan nama"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 5,
        }}
      />
      {/* Input untuk Domisili */}
      <Text>Domisili:</Text>
      <TextInput
        value={formData.domisili}
        onChangeText={(value) => handleInputChange("domisili", value)}
        placeholder="Masukkan domisili"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 5,
        }}
      />
      {/* Input untuk Jenis Kelamin */}
      <Text>Jenis Kelamin:</Text>
      <TextInput
        value={formData.jenis_kelamin}
        onChangeText={(value) => handleInputChange("jenis_kelamin", value)}
        placeholder="Masukkan jenis kelamin"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 5,
        }}
      />
      {/* Button untuk submit */}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
