import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, View, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StyledText } from "../../../App";
import { baseUrl } from "../../hooks";

// Definisikan tipe untuk parameter yang diterima oleh setiap screen
type RootStackParamList = {
  Pelanggan: undefined;
  AddPelanggan: undefined;
  EditPelanggan: { id: number };
};

// Tentukan tipe props yang digunakan oleh EditPelanggan
type Props = StackScreenProps<RootStackParamList, "EditPelanggan">;

export default function EditPelanggan({ route, navigation }: Props) {
  // Ambil id dari route params
  const { id } = route.params;

  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    nama: "",
    domisili: "",
    jenis_kelamin: "",
  });

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value, // Perbarui nilai dari input yang sesuai
    });
  };

  // Fungsi untuk mengambil data pelanggan berdasarkan id
  const fetchPelanggan = async () => {
    try {
      // const response = await fetch(`${Config.API_URL}/pelanggan/${id}`);
      const response = await fetch(`${baseUrl}/pelanggan/${id}`);
      const json = await response.json();

      if (response.ok) {
        setFormData({
          nama: json.nama,
          domisili: json.domisili,
          jenis_kelamin: json.jenis_kelamin,
        });
      } else {
        Alert.alert("Error", "Gagal mendapatkan data pelanggan!");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam mengambil data!");
      console.error("Error:", error);
    }
  };

  // Panggil fetchPelanggan saat komponen pertama kali di-mount
  useEffect(() => {
    fetchPelanggan();
  }, []);

  // Fungsi untuk mengupdate data pelanggan
  const handleSubmit = async () => {
    try {
      // const response = await fetch(`${Config.API_URL}/pelanggan/${id}`, {
      const response = await fetch(`${baseUrl}/pelanggan/${id}`, {
        method: "PUT", // Menggunakan metode PUT untuk update data
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          domisili: formData.domisili,
          jenis_kelamin: formData.jenis_kelamin,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Data berhasil diupdate!");
        navigation.goBack(); // Kembali ke halaman sebelumnya setelah sukses
      } else {
        Alert.alert("Error", "Gagal mengupdate data!");
        console.log("Error from API:", json);
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam mengupdate data!");
      console.error("Error:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Input untuk NAMA */}
      <StyledText className="py-2 font-bold text-center text-2xl">
        {" "}
        Edit Pelanggan{" "}
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

      {/* Input untuk DOMISILI */}
      <Text>DOMISILI:</Text>
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

      {/* Input untuk JENIS KELAMIN */}
      <Text>JENIS KELAMIN:</Text>
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
      <Button title="Update" onPress={handleSubmit} />
    </View>
  );
}
