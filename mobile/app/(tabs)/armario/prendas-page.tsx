import PrendaCard from '@/components/prenda/prenda-card';
import PrendaDetailsModal from '@/components/prenda/prenda-details-modal';
import BotonCamara from '@/components/shared/boton-camara';
import { useArticulos } from '@/hooks/useArticulos';
import { Prenda } from '@/lib/domain/models/prenda';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function PrendasPage() {
  const [selectedPrenda, setSelectedPrenda] = useState<Prenda | undefined>(
    undefined,
  );

  const isLoading = useArticulos((s) => s.isLoading);
  const prendas = useArticulos((s) => s.prendas);

  return (
    <View>
      <BotonCamara />
      <FlatList
        key="prendas"
        data={prendas}
        renderItem={(item) => (
          <PrendaCard data={item.item} onPress={() => {}} />
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              color="#999"
              style={{ marginTop: 30 }}
            />
          ) : (
            <Text className="text-gray-500 text-center mt-10">
              No hay prendas todavía
            </Text>
          )
        }
      />
      <PrendaDetailsModal
        data={selectedPrenda}
        onClose={() => setSelectedPrenda(undefined)}
      />
    </View>
  );
}
