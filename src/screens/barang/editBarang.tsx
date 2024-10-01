import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, View, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { StyledText } from "../../../App";
import Config from "react-native-config";

// Definisikan tipe untuk parameter yang diterima oleh setiap screen
type RootStackParamList = {
  Barang: undefined;
  AddBarang: undefined;
  EditBarang: { id: number };
};

// Tentukan tipe props yang digunakan oleh EditBarang
type Props = StackScreenProps<RootStackParamList, "EditBarang">;

export default function EditBarang({ route, navigation }: Props) {
  // Ambil id dari route params
  const { id } = route.params;

  // State untuk menyimpan data input
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga: 0,
  });

  // Fungsi untuk menangani perubahan input
  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value, // Perbarui nilai dari input yang sesuai
    });
  };

  // Fungsi untuk mengambil data barang berdasarkan id
  const fetchBarang = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/barang/${id}`);
      const json = await response.json();

      if (response.ok) {
        setFormData({
          nama: json.nama,
          kategori: json.kategori,
          harga: json.harga,
        });
      } else {
        Alert.alert("Error", "Gagal mendapatkan data barang!");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam mengambil data!");
      console.error("Error:", error);
    }
  };

  // Panggil fetchBarang saat komponen pertama kali di-mount
  useEffect(() => {
    fetchBarang();
  }, []);

  // Fungsi untuk mengupdate data barang
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/barang/${id}`, {
        method: "PUT", // Menggunakan metode PUT untuk update data
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          kategori: formData.kategori,
          harga: formData.harga,
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
        Edit Barang{" "}
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
      <Button title="Update" onPress={handleSubmit} />
    </View>
  );
}
