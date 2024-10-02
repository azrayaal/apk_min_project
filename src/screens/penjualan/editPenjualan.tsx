import React, { useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import { StyledText, StyledView } from "../../../App";
import { baseUrl } from "../../hooks";

// Define types for Penjualan, Item, and Barang
interface Item {
  id: number;
  kode_barang: string;
  nama_barang: string;
  qty: number;
  harga_satuan: number;
  total_harga: number;
}

interface Penjualan {
  nota: string;
  tgl: string;
  pelanggan: {
    kode_pelanggan: string;
    nama: string;
  };
  items: Item[];
  subtotal: number;
}

interface Barang {
  id: number;
  kode: string;
  nama: string;
  harga: number;
}

export default function EditPenjualan() {
  const [penjualan, setPenjualan] = useState<Penjualan>({
    nota: "",
    tgl: "",
    pelanggan: {
      kode_pelanggan: "",
      nama: "",
    },
    items: [],
    subtotal: 0,
  });

  const [availableItems, setAvailableItems] = useState<Barang[]>([]);
  const [barangInput, setBarangInput] = useState({ id: 0, qty: 0 });
  const route = useRoute();
  const { id }: any = route.params; // Get 'id' from route params
  const navigation = useNavigation();

  // Fetch available items (products) from the API
  const getAvailableItems = async () => {
    try {
      const response = await fetch(`${baseUrl}/barang`);
      // const response = await fetch(`${Config.API_URL}/barang`);
      const data = await response.json();
      setAvailableItems(data);
    } catch (error) {
      console.error("Failed to load available items", error);
    }
  };

  // Fetch penjualan data from the API
  const getPenjualan = async () => {
    try {
      const response = await fetch(`${baseUrl}/penjualan/${id}`);
      // const response = await fetch(`${Config.API_URL}/penjualan/${id}`);
      const data = await response.json();
      console.log("data penjualan", data);
      setPenjualan(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memuat data penjualan!");
    }
  };

  useEffect(() => {
    if (id) {
      getPenjualan();
      getAvailableItems();
    }
  }, [id]);

  // Handle delete item
  const handleDeleteItem = async (itemId: any) => {
    try {
      await fetch(`${baseUrl}/item-penjualan/${penjualan.nota}/items`, {
        // await fetch(`${Config.API_URL}/item-penjualan/${penjualan.nota}/items`, {
        method: "DELETE",
      });
      Alert.alert("Success", "Item berhasil dihapus");
      getPenjualan(); // Refresh the data after deletion
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal menghapus item!");
    }
  };

  // Handle input change for barang
  const handleBarangChange = (name: string, value: any) => {
    setBarangInput({
      ...barangInput,
      [name]: name === "qty" ? Number(value) : value, // Ensure qty is treated as a number
    });
  };

  // Add item to penjualan
  const handleAddItem = async () => {
    if (barangInput.id && barangInput.qty > 0) {
      try {
        await fetch(`${baseUrl}/penjualan/${penjualan.nota}/items`, {
          // await fetch(`${Config.API_URL}/penjualan/${penjualan.nota}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kode_barang: barangInput.id,
            qty: barangInput.qty,
          }),
        });
        Alert.alert("Success", "Item berhasil ditambahkan!");
        getPenjualan();
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Gagal menambahkan item!");
      }
    } else {
      Alert.alert("Error", "Lengkapi data barang sebelum menambahkannya");
    }
  };

  // Function to get item name from the available items
  const getItemName = (kode_barang: string) => {
    const item = availableItems.find((barang) => barang.kode === kode_barang);
    return item ? item.nama : "Unknown Item";
  };

  return (
    <StyledView className="p-4 flex-1">
      {/* Header */}
      <StyledView className="flex-row justify-between mb-4">
        <StyledText className="font-bold text-lg">Detail Penjualan</StyledText>
      </StyledView>

      {/* Penjualan Details */}
      <StyledView className="mb-4">
        <StyledText>Nota: {penjualan.nota}</StyledText>
        <StyledText>Tanggal: {penjualan.tgl}</StyledText>
        {/* Guard against undefined pelanggan */}
        <StyledText>
          Pelanggan: {penjualan.pelanggan?.nama || "Unknown"}
        </StyledText>
        <StyledText>Subtotal: {penjualan.subtotal}</StyledText>
      </StyledView>

      {/* List of Items */}
      <FlatList
        data={penjualan.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StyledView className="flex-row justify-between py-2 border-b border-gray-300">
            <StyledText>
              {item.kode_barang} - {getItemName(item.kode_barang)}
            </StyledText>
            <StyledText>Qty: {item.qty}</StyledText>
            <StyledText>Harga: {item.harga_satuan}</StyledText>
            <StyledText>Total: {item.total_harga}</StyledText>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <StyledText className="text-red-600">Hapus</StyledText>
            </TouchableOpacity>
          </StyledView>
        )}
      />

      {/* Add Item Form */}
      <StyledText className="text-lg font-bold mt-4">
        Tambah Item Penjualan
      </StyledText>
      <Picker
        selectedValue={barangInput.id}
        onValueChange={(value: any) => handleBarangChange("id", value)}
      >
        <Picker.Item label="Pilih Barang" value={0} />
        {availableItems.map((barang) => (
          <Picker.Item key={barang.id} label={barang.nama} value={barang.id} />
        ))}
      </Picker>
      <TextInput
        placeholder="Jumlah"
        keyboardType="numeric"
        value={barangInput.qty.toString()}
        onChangeText={(value: any) => handleBarangChange("qty", value)}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
        }}
      />
      <Button title="Tambah Item" onPress={handleAddItem} />
    </StyledView>
  );
}
