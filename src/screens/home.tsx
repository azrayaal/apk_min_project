import React from "react";
import { StyledText, StyledTouchableOpacity, StyledView } from "../../App";
import { NavigationProp } from "@react-navigation/native";

export interface Props {
  navigation: NavigationProp<any>; // Tipe untuk prop navigation
}
export default function Home({ navigation }: Props) {
  // Tambahkan navigation prop
  return (
    <StyledView className="flex-1 justify-center items-center bg-white p-4">
      {/* Card 1 */}
      <StyledTouchableOpacity
        className="w-72 h-28 text-center rounded-lg p-4 my-2 bg-orange-500 shadow-lg"
        onPress={() => navigation.navigate("Pelanggan")} // Navigasi ke layar Pelanggan
      >
        <StyledText className="text-lg font-bold text-white">
          Pelanggan
        </StyledText>
      </StyledTouchableOpacity>

      {/* Card 2 */}
      <StyledTouchableOpacity
        className="w-72 h-28 rounded-lg p-4 my-2 bg-blue-500 shadow-lg"
        onPress={() => navigation.navigate("Barang")} // Navigasi ke layar Barang
      >
        <StyledText className="text-lg font-bold text-white">Barang</StyledText>
      </StyledTouchableOpacity>

      {/* Card 3 */}
      <StyledTouchableOpacity
        className="w-72 h-28 rounded-lg p-4 my-2 bg-green-500 shadow-lg"
        onPress={() => navigation.navigate("Penjualan")} // Navigasi ke layar Penjualan
      >
        <StyledText className="text-lg font-bold text-white">
          Penjualan
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
}
