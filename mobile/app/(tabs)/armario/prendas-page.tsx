import EditDetailsModal from '@/components/armario/edit-details-modal';
import CustomCamera from '@/components/camera/custom-camera';
import PrendaCard from '@/components/prenda/prenda-card';
import PrendaDetailsModal from '@/components/prenda/prenda-details-modal';
import PrendaFilter from '@/components/prenda/prenda-filter';
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
  const [filteredPrendas, setFilteredPrendas] = React.useState(prendas);
  const generateDetails = useArticulos((s) => s.generateDetails);
  const newItem = useArticulos((s) => s.newItem);
  const clearNewItem = useArticulos((s) => s.clearNewItem);
  const addArticulo = useArticulos((s) => s.addArticulo);

  React.useEffect(() => {
    setFilteredPrendas(prendas);
  }, [prendas]);

  if (isLoading)
    return (
      <ActivityIndicator size="large" color="#999" style={{ marginTop: 30 }} />
    );

  return (
    <View>
      <CustomCamera onTakeImage={generateDetails} />
      <PrendaFilter prendas={prendas} onChange={setFilteredPrendas} />
      <FlatList
        key="prendas"
        data={filteredPrendas}
        renderItem={(item) => (
          <PrendaCard data={item.item} onPress={setSelectedPrenda} />
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

      <EditDetailsModal
        data={newItem}
        onClose={clearNewItem}
        onSave={addArticulo}
      />

      <PrendaDetailsModal
        data={selectedPrenda}
        onClose={() => setSelectedPrenda(undefined)}
      />
    </View>
  );
}
