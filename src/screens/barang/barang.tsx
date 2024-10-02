import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import {
  StyledButton,
  StyledImage,
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from "../../../App";
import { Props } from "../home";
import { baseUrl } from "../../hooks";

interface BarangItem {
  id: number;
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
  created_at: string;
  updated_at: string;
}

export default function Barang({ navigation }: Props) {
  const [data, setData] = useState<BarangItem[]>([]); // Menyimpan data barang
  const [loading, setLoading] = useState(true); // State untuk indikator loading
  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      // const response = await fetch(`${Config.API_URL}/barang`); // Ganti dengan 10.0.2.2 jika pakai Android emulator
      const response = await fetch(`${baseUrl}/barang`); // Ganti dengan 10.0.2.2 jika pakai Android emulator
      const json: BarangItem[] = await response.json();
      console.log(json);
      setData(json); // Menyimpan data ke state
      setLoading(false); // Menghentikan indikator loading
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus data
  const handleDelete = async (id: number) => {
    try {
      // const response = await fetch(`${Config.API_URL}/barang/${id}`, {
      const response = await fetch(`${baseUrl}/barang/${id}`, {
        method: "DELETE", // Metode DELETE
        headers: {
          "Content-Type": "application/json", // Header untuk JSON
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Data berhasil dihapus!");
        // Hapus item dari state lokal
        setData(data.filter((item) => item.id !== id));
      } else {
        const json = await response.json();
        Alert.alert("Error", `Gagal menghapus data: ${json.message}`);
        console.log("Error from API:", json); // Log error API
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan dalam menghapus data!");
      console.error("Error:", error); // Log error dari catch
    }
  };

  // Mengambil data saat komponen pertama kali di-mount
  useEffect(() => {
    // Set interval untuk memanggil fetchData setiap 5 detik (5000 milidetik)
    const interval = setInterval(() => {
      fetchData();
    }, 2000); // 5000 ms = 5 detik

    // Membersihkan interval saat komponen di-unmount agar tidak terus berjalan
    return () => clearInterval(interval);
  }, []);

  // Menampilkan loading jika data belum selesai diambil
  if (loading) {
    return (
      <StyledView className="flex-1 justify-center items-center bg-white p-4">
        <StyledText className="text-lg font-bold text-black">
          Loading...
        </StyledText>
      </StyledView>
    );
  }

  // Render item untuk FlatList
  const renderItem = ({ item }: { item: BarangItem }) => (
    <StyledTouchableOpacity className="max-w-sm w-full mt-6 lg:max-w-full lg:flex bg-white border border-gray-400 rounded-lg overflow-hidden">
      {/* Image section */}
      <StyledView className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
        <StyledImage
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo-jJDc8GtiRhTTSyxDA2AHOiLnImvofYrdA&s",
          }}
          className="w-full h-full object-cover"
          alt="Card image"
        />
      </StyledView>

      {/* Card content */}
      <StyledView className="p-4 flex flex-col justify-between leading-normal">
        {/* Top section with title and description */}
        <StyledView className="">
          <StyledView className="mb-2 flex flex-row justify-between items-center">
            <StyledText className="text-gray-900 font-bold text-xl">
              {item.nama}
            </StyledText>

            {/* Description */}
            <StyledText className="text-gray-700 text-base">
              {item.kategori}
            </StyledText>
          </StyledView>
          <StyledView className="mb-2 flex flex-row justify-between items-center">
            <StyledText className="text-gray-700 text-base">
              Rp. {item.harga}
            </StyledText>
            <StyledView className="flex flex-row ">
              <StyledView className="mr-2">
                <StyledButton
                  title="Edit"
                  onPress={() =>
                    navigation.navigate("EditBarang", { id: item.id })
                  } // Navigasi ke EditBarang dengan ID
                />
              </StyledView>

              <StyledView>
                <StyledButton
                  title="Delete"
                  onPress={() => handleDelete(item.id)} // Panggil fungsi delete
                />
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );

  // Render footer with Add button
  const renderFooter = () => (
    <StyledView className="py-5">
      <StyledButton
        title="Add"
        className="bg-blue-500 p-4 rounded-lg shadow-lg"
        onPress={() => navigation.navigate("AddBarang")} // Pindah ke AddBarang
      />
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-gray-100 ">
      {/* List Data */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 15 }}
        ListFooterComponent={renderFooter} // Add button as footer
      />
    </StyledView>
  );
}
