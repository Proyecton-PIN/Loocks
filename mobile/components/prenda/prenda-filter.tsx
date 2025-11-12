import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface Props {
  prendas: any[];
  onChange(filtered: any[]): void;
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export default function PrendaFilter({ prendas, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState('');
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tipos = useMemo(() => uniq(prendas.map((p: any) => p.tipo ?? p.tipoPrenda ?? '').filter(Boolean)), [prendas]);
  const marcas = useMemo(() => uniq(prendas.map((p: any) => p.marca ?? '').filter(Boolean)), [prendas]);
  const tags = useMemo(() => uniq(prendas.flatMap((p: any) => (Array.isArray(p.tags) ? p.tags : []))), [prendas]);

  function apply() {
    const qColor = color.trim().toLowerCase();
    const qTipo = tipo.trim().toLowerCase();
    const qMarca = marca.trim().toLowerCase();

    const filtered = prendas.filter((p) => {
      // color match: primary or any secondary includes
      if (qColor) {
        const pri = (p.colorPrimario ?? '').toString().toLowerCase();
        const secs = (p.coloresSecundarios ?? []).map((c: any) => String(c).toLowerCase());
        if (!pri.includes(qColor) && !secs.some((s: string) => s.includes(qColor))) return false;
      }

      if (qTipo) {
        const t = (p.tipo ?? p.tipoPrenda ?? '').toString().toLowerCase();
        if (!t.includes(qTipo)) return false;
      }

      if (qMarca) {
        const m = (p.marca ?? '').toString().toLowerCase();
        if (!m.includes(qMarca)) return false;
      }

      if (selectedTag) {
        if (!Array.isArray(p.tags) || !p.tags.some((tg: any) => String(tg).toLowerCase() === selectedTag)) return false;
      }

      return true;
    });

    onChange(filtered);
    setOpen(false);
  }

  function clear() {
    setColor('');
    setTipo('');
    setMarca('');
    setSelectedTag(null);
    onChange(prendas);
  }

  return (
    <View className="px-4">
      <Pressable onPress={() => setOpen((s) => !s)} className="bg-neutral-900 rounded-xl p-3 mb-3">
        <Text className="text-white font-semibold">Filtros</Text>
        <Text className="text-gray-400 text-sm">Busca por color, tipo, marca o tag</Text>
      </Pressable>

      {open && (
        <View className="bg-neutral-900 rounded-xl p-4 mb-4">
          <Text className="text-white mb-1">Color (hex o nombre)</Text>
          <TextInput value={color} onChangeText={setColor} placeholder="p.ej. #ff0000 o rojo" placeholderTextColor="#888" className="bg-gray-800 p-2 rounded text-white mb-3" />

          <Text className="text-white mb-1">Tipo</Text>
          <View className="flex-row flex-wrap mb-3">
            <TextInput value={tipo} onChangeText={setTipo} placeholder="escribe o selecciona" placeholderTextColor="#888" className="bg-gray-800 p-2 rounded text-white w-full mb-2" />
            {tipos.map((t) => (
              <Pressable key={t} onPress={() => setTipo(t)} className="bg-blue-700 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-white">{t}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-white mb-1">Marca</Text>
          <View className="flex-row flex-wrap mb-3">
            <TextInput value={marca} onChangeText={setMarca} placeholder="marca" placeholderTextColor="#888" className="bg-gray-800 p-2 rounded text-white w-full mb-2" />
            {marcas.map((m) => (
              <Pressable key={m} onPress={() => setMarca(m)} className="bg-neutral-800 px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-white">{m}</Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-white mb-1">Tag</Text>
          <View className="flex-row flex-wrap mb-3">
            {tags.map((tg) => (
              <Pressable
                key={tg}
                onPress={() => setSelectedTag(selectedTag === tg.toString().toLowerCase() ? null : tg.toString().toLowerCase())}
                className={`px-3 py-1 rounded-full mr-2 mb-2 ${selectedTag === tg.toString().toLowerCase() ? 'bg-green-600' : 'bg-neutral-800'}`}
              >
                <Text className="text-white">{tg}</Text>
              </Pressable>
            ))}
          </View>

          <View className="flex-row justify-between">
            <Pressable onPress={clear} className="bg-gray-700 px-4 py-2 rounded-md">
              <Text className="text-white">Limpiar</Text>
            </Pressable>
            <Pressable onPress={apply} className="bg-blue-700 px-4 py-2 rounded-md">
              <Text className="text-white">Aplicar</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
