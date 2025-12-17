import http from '@/lib/data/http';

export interface ItemMaleta {
    id: number;
    nombre: string;
    completado: boolean;
}

export async function getMaleta(planId: number): Promise<ItemMaleta[]> {
    try {
        return await http.get<ItemMaleta[]>(`maleta/${planId}`);
    } catch (e) {
        return [];
    }
}

export async function addItemMaleta(planId: number, nombre: string): Promise<ItemMaleta | null> {
    try {
        return await http.post<ItemMaleta>('maleta/add', {
            body: JSON.stringify({ planId, nombre })
        });
    } catch (e) {
        return null;
    }
}

export async function toggleItemMaleta(itemId: number): Promise<boolean> {
    try {
        await http.post(`maleta/toggle/${itemId}`);
        return true;
    } catch (e) {
        return false;
    }
}

export async function deleteItemMaleta(itemId: number): Promise<boolean> {
    try {
        await http.delete(`maleta/${itemId}`);
        return true;
    } catch (e) {
        return false;
    }
}

export async function generarMaletaAutomatica(planId: number): Promise<ItemMaleta[]> {
    try {
        // Llamamos al endpoint mágico
        return await http.post<ItemMaleta[]>(`maleta/generar/${planId}`);
    } catch (e) {
        console.error(e);
        return [];
    }
}