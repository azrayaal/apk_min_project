import React, { useState } from "react";
import { Text, TextInput, Button, View, Alert } from "react-native";
import { StyledText } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "../../hooks";

export default function AddBarang({}) {
  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga: 0,
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
    try {
      // const response = await fetch(`${Config.API_URL}/barang`, {
      const response = await fetch(`${baseUrl}/barang`, {
        method: "POST", // Metode POST
        headers: {
          "Content-Type": "application/json", // Header untuk JSON
        },
        body: JSON.stringify({
          nama: formData.nama,
          kategori: formData.kategori,
          harga: formData.harga,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Data berhasil dikirim!");
        console.log("Response from API:", json); // Log respons API
        navigation.goBack();
      } else {
        Alert.alert("Error", "Gagal mengirim data!");
        console.log("Error from API:", json); // Log error API
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam mengirim data!");
      console.error("Error:", error); // Log error dari catch
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Input untuk NAMA */}
      <StyledText className="py-2 font-bold text-center text-2xl">
        {" "}
        Add Barang{" "}
      </StyledText>
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
      {/* Input untuk KATEGORI */}
      <Text>KATEGORI:</Text>
      <TextInput
        value={formData.kategori}
        onChangeText={(value) => handleInputChange("kategori", value)}
        placeholder="Masukkan kategori"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 5,
        }}
      />
      {/* Input untuk HARGA */}
      <Text>HARGA:</Text>
      <TextInput
        value={formData.harga.toString()}
        onChangeText={(value) => handleInputChange("harga", value)}
        placeholder="Masukkan harga"
        keyboardType="numeric" // Untuk input angka
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
