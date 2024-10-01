import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Correct Picker import
import { useNavigation } from "@react-navigation/native"; // For navigation
import Config from "react-native-config";

interface Barang {
  id: number;
  qty: number;
}
export const AddPenjualan = () => {
  const [idNota, setIdNota] = useState<string | null>(null); // Store `idNota` after creating penjualan
  const [dataPelanggan, setDataPelanggan] = useState<any[]>([]); // Store pelanggan data from API
  const [dataBarang, setDataBarang] = useState<any[]>([]); // Store barang data from API
  const [formData, setFormData] = useState({
    kode_pelanggan: "",
    barang: [] as Barang[],
  });
  const [barangInput, setBarangInput] = useState({ id: 0, qty: 0 });

  const navigation = useNavigation();

  // Fetch pelanggan and barang data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pelangganResponse = await fetch(`${Config.API_URL}/pelanggan`);
        const barangResponse = await fetch(`${Config.API_URL}/barang`);
        const pelangganData = await pelangganResponse.json();
        const barangData = await barangResponse.json();
        setDataPelanggan(pelangganData);
        setDataBarang(barangData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Gagal memuat data pelanggan atau barang!");
      }
    };
    fetchData();
  }, []);

  // Handle pelanggan selection
  const handlePelangganChange = (value: string) => {
    setFormData({ ...formData, kode_pelanggan: value });
  };

  // Handle barang selection
  const handleBarangChange = (value: number) => {
    setBarangInput({
      ...barangInput,
      id: value,
    });
  };

  // Handle quantity input change
  const handleQtyChange = (value: string) => {
    setBarangInput({
      ...barangInput,
      qty: Number(value),
    });
  };
  // Add barang to the form state
  const addBarang = () => {
    if (barangInput.id && barangInput.qty > 0) {
      setFormData({
        ...formData,
        barang: [...formData.barang, barangInput],
      });
      setBarangInput({ id: 0, qty: 0 });
    } else {
      Alert.alert("Error", "Lengkapi data barang sebelum menambahkannya");
    }
  };

  // Submit the penjualan
  const handleSubmitPenjualan = async () => {
    if (formData.kode_pelanggan) {
      try {
        const response = await fetch(`${Config.API_URL}/penjualan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kode_pelanggan: formData.kode_pelanggan,
          }),
        });
        const json = await response.json();
        setIdNota(json.id_nota);
        Alert.alert(
          "Success",
          "Penjualan berhasil ditambahkan! Silakan tambahkan barang."
        );
      } catch (error) {
        Alert.alert("Error", "Gagal menambahkan penjualan!");
      }
    } else {
      Alert.alert("Error", "Lengkapi data pelanggan!");
    }
  };
  // Submit the items for the penjualan
  const handleSubmitItem = async () => {
    if (idNota && formData.barang.length > 0) {
      try {
        await Promise.all(
          formData.barang.map(async (item) => {
            await fetch(`${Config.API_URL}/penjualan/${idNota}/items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                kode_barang: item.id,
                qty: item.qty,
              }),
            });
          })
        );
        Alert.alert("Success", "Semua item berhasil ditambahkan ke penjualan!");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", "Gagal menambahkan item ke penjualan!");
      }
    } else {
      Alert.alert(
        "Error",
        "Tambah penjualan terlebih dahulu atau masukkan barang!"
      );
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Form to create Penjualan */}
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Tambah Penjualan
      </Text>
      <Picker
        selectedValue={formData.kode_pelanggan}
        onValueChange={handlePelangganChange}
      >
        <Picker.Item label="Pilih Pelanggan" value="" />
        {dataPelanggan.map((pelanggan) => (
          <Picker.Item
            key={pelanggan.id}
            label={pelanggan.nama}
            value={pelanggan.id}
          />
        ))}
      </Picker>
      <Button title="Buat Penjualan" onPress={handleSubmitPenjualan} />

      {/* After creating penjualan, allow adding items */}
      {idNota && (
        <>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
            Tambahkan Barang
          </Text>
          <Picker
            selectedValue={barangInput.id}
            onValueChange={handleBarangChange}
          >
            <Picker.Item label="Pilih Barang" value={0} />
            {dataBarang.map((barang) => (
              <Picker.Item
                key={barang.id}
                label={barang.nama}
                value={barang.id}
              />
            ))}
          </Picker>
          <TextInput
            placeholder="Jumlah Barang"
            value={barangInput.qty.toString()}
            keyboardType="numeric"
            onChangeText={handleQtyChange}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              marginBottom: 10,
              padding: 8,
              borderRadius: 5,
            }}
          />
          <Button title="Tambah Barang" onPress={addBarang} />

          {/* List of added items */}
          <FlatList
            data={formData.barang}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              const barang = dataBarang.find((b) => b.id === item.id);
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 5,
                  }}
                >
                  <Text>
                    {barang?.nama} - {item.qty}
                  </Text>
                  <Button
                    title="Hapus"
                    onPress={() =>
                      setFormData({
                        ...formData,
                        barang: formData.barang.filter((_, i) => i !== index),
                      })
                    }
                  />
                </View>
              );
            }}
          />
          <Button title="Simpan Semua Item" onPress={handleSubmitItem} />
        </>
      )}
    </View>
  );
};
