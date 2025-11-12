import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

interface Props {
  data?: any; // full articulo object
  visible?: boolean;
  onClose(): void;
  onSave(dto: Partial<any>): void;
}

export default function EditArticuloModal({ data, visible = false, onClose, onSave }: Props) {
  const [nombre, setNombre] = useState<string | undefined>(undefined);
  const [marca, setMarca] = useState<string | undefined>(undefined);
  const [fechaCompra, setFechaCompra] = useState<string | undefined>(undefined);
  const [fechaUltimoUso, setFechaUltimoUso] = useState<string | undefined>(undefined);
  const [colorPrimario, setColorPrimario] = useState<string | undefined>(undefined);
  const [coloresSecundarios, setColoresSecundarios] = useState<string | undefined>(undefined);
  const [estacion, setEstacion] = useState<string | undefined>(undefined);
  const [usos, setUsos] = useState<number | undefined>(undefined);
  const [tipo, setTipo] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!data) return;
    setNombre(data.nombre);
    setMarca(data.marca);
    setFechaCompra(data.fechaCompra);
    setFechaUltimoUso(data.fechaUltimoUso);
    setColorPrimario(data.colorPrimario);
    setColoresSecundarios(
      Array.isArray(data.coloresSecundarios)
        ? data.coloresSecundarios.join(', ')
        : data.coloresSecundarios ?? '',
    );
    setEstacion(data.estacion);
    setUsos(typeof data.usos === 'number' ? data.usos : undefined);
    setTipo(data.tipo ?? data.tipoPrenda);
    setImageUrl(data.imageUrl);
    setTags(Array.isArray(data.tags) ? data.tags.join(', ') : data.tags ?? '');
  }, [data]);

  function buildDto(): Partial<any> {
    const dto: Partial<any> = {};
    if (nombre) dto.nombre = nombre;
    if (marca) dto.marca = marca;
    // Normalize fechaCompra: accept dd/mm/yyyy or yyyy-mm-dd, send ISO date (yyyy-mm-dd) or null if empty
    function normalizeDateInput(input?: string | null) {
      if (!input) return null;
      const v = input.trim();
      if (!v) return null;
      // dd/mm/yyyy
      const dm = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dm) {
        const d = parseInt(dm[1], 10);
        const m = parseInt(dm[2], 10);
        const y = parseInt(dm[3], 10);
        // zero-pad
        const mm = m.toString().padStart(2, '0');
        const dd = d.toString().padStart(2, '0');
        return `${y}-${mm}-${dd}`;
      }
      // yyyy-mm-dd or full ISO
      const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (iso) return iso[0];
      // try Date.parse fallback
      const parsed = Date.parse(v);
      if (!Number.isNaN(parsed)) {
        const d = new Date(parsed);
        const y = d.getFullYear();
        const mm = (d.getMonth() + 1).toString().padStart(2, '0');
        const dd = d.getDate().toString().padStart(2, '0');
        return `${y}-${mm}-${dd}`;
      }
      // cannot parse, return original string to let backend validate
      return v;
    }

    if (fechaCompra !== undefined) dto.fechaCompra = normalizeDateInput(fechaCompra);
  if (fechaUltimoUso !== undefined) dto.fechaUltimoUso = normalizeDateInput(fechaUltimoUso);
    if (colorPrimario) dto.colorPrimario = colorPrimario;
    if (coloresSecundarios)
      dto.coloresSecundarios = coloresSecundarios.split(',').map((s) => s.trim());
    if (estacion) dto.estacion = estacion;
    if (typeof usos === 'number') dto.usos = usos;
    if (tipo) dto.tipo = tipo;
    if (imageUrl) dto.imageUrl = imageUrl;
    if (tags) dto.tagsIds = tags.split(',').map((s) => s.trim());
    return dto;
  }

  if (!visible || !data) return null;

  return (
    <View className="absolute inset-0 bg-black">
      <View className="flex-1 bg-black px-4 py-6">
        <ScrollView>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-72 rounded-xl mb-4"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-72 bg-neutral-900 rounded-xl mb-4 items-center justify-center">
              <Ionicons name="shirt-outline" size={48} color="#555" />
            </View>
          )}

          <View className="px-2 space-y-3">
            <Text className="text-white">Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Marca</Text>
            <TextInput
              value={marca}
              onChangeText={setMarca}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Fecha de compra</Text>
            <TextInput
              value={fechaCompra}
              onChangeText={setFechaCompra}
              className="bg-gray-800 p-2 rounded text-white"
              placeholder="YYYY-MM-DD o DD/MM/YYYY"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Fecha último uso</Text>
            <TextInput
              value={fechaUltimoUso}
              onChangeText={setFechaUltimoUso}
              className="bg-gray-800 p-2 rounded text-white"
              placeholder="YYYY-MM-DD o DD/MM/YYYY"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Color primario (hex o nombre)</Text>
            <TextInput
              value={colorPrimario}
              onChangeText={setColorPrimario}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Colores secundarios (coma separado)</Text>
            <TextInput
              value={coloresSecundarios}
              onChangeText={setColoresSecundarios}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Estación</Text>
            <TextInput
              value={estacion}
              onChangeText={setEstacion}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Usos (número)</Text>
            <TextInput
              value={usos?.toString()}
              onChangeText={(v) => setUsos(v ? parseInt(v, 10) : undefined)}
              keyboardType="numeric"
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Tipo</Text>
            <TextInput
              value={tipo}
              onChangeText={setTipo}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Tags (coma separado)</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />

            <Text className="text-white">Image URL</Text>
            <TextInput
              value={imageUrl}
              onChangeText={setImageUrl}
              className="bg-gray-800 p-2 rounded text-white"
              placeholderTextColor="#cfcfcf"
            />
          </View>
        </ScrollView>

        <View className="flex-row justify-around mt-6">
          <Pressable
            onPress={() => {
              const dto = buildDto();
              onSave(dto);
            }}
            className="bg-blue-700 px-4 py-3 rounded-md"
          >
            <Text className="text-white">Guardar</Text>
          </Pressable>

          <Pressable onPress={onClose} className="bg-gray-700 px-4 py-3 rounded-md">
            <Text className="text-white">Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
