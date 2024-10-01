import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  StyledButton,
  StyledImage,
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from "../../../App";
import { Props } from "../home";
import Config from "react-native-config";

// Definisikan interface untuk data penjualan
interface ItemProps {
  id: number;
  kode_barang: number;
  nama_barang: string;
  qty: number;
  harga_satuan: number;
  total_harga: number;
}

interface PelangganProps {
  kode_pelanggan: number;
  nama: string;
}

interface PenjualanProps {
  id: number;
  nota: string;
  tgl: string;
  pelanggan: PelangganProps;
  items: ItemProps[];
  subtotal: number;
}

export default function Penjualan({ navigation }: Props) {
  const [data, setData] = useState<PenjualanProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/penjualan`); // Ganti localhost jika perlu
      const json: PenjualanProps[] = await response.json();
      setData(json); // Menyimpan data ke state
      setLoading(false); // Menghentikan indikator loading
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${Config.API_URL}/penjualan/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();
      console.log(json);
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  // Mengambil data saat komponen pertama kali di-mount
  useEffect(() => {
    fetchData();
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
  const renderItem = ({ item }: { item: PenjualanProps }) => (
    <StyledTouchableOpacity className="max-w-sm w-full mt-6 lg:max-w-full lg:flex bg-white border border-gray-400 rounded-lg overflow-hidden">
      {/* Card content */}
      <StyledView className="p-4 flex flex-col justify-between leading-normal">
        <StyledView>
          <StyledText className="text-gray-900 font-bold text-xl">
            Nota: {item.nota}
          </StyledText>
          <StyledText className="text-gray-700">Tanggal: {item.tgl}</StyledText>
          <StyledText className="text-gray-700">
            Pelanggan: {item.pelanggan.nama}
          </StyledText>
          <StyledText className="text-gray-700">
            Subtotal: Rp. {item.subtotal}
          </StyledText>
          <StyledText className="text-gray-700 font-bold">Items:</StyledText>
          {item.items.map((subItem) => (
            <StyledText key={subItem.id} className="ml-4 text-gray-600">
              - {subItem.nama_barang} (Qty: {subItem.qty}, Harga: Rp.{" "}
              {subItem.harga_satuan}, Total: Rp. {subItem.total_harga})
            </StyledText>
          ))}
        </StyledView>

        {/* Button section */}
        <StyledView className="flex flex-row mt-4">
          {/* Edit Button */}
          <StyledView className="mr-2">
            <StyledButton
              title="Edit"
              onPress={() => {
                navigation.navigate("EditPenjualan", { id: item.nota });
                console.log(item.nota);
              }}
            />
          </StyledView>

          {/* Delete Button */}
          <StyledView>
            <StyledButton
              title="Delete"
              onPress={() => handleDelete(item.id)} // Panggil fungsi delete
            />
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );

  const renderFooter = () => (
    <StyledView className="py-5">
      <StyledButton
        title="Add"
        className="bg-blue-500 p-4 rounded-lg shadow-lg"
        onPress={() => navigation.navigate("AddPenjualan")} // Pindah ke AddBarang
      />
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-grey-100 ">
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
