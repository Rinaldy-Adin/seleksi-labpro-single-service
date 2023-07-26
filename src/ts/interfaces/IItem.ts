export interface IItemDTO {
    id?: string;
    perusahaan_id: string;
    nama: string;
    harga: number;
    stok: number;
    kode: string;
}

export interface IItem {
    id?: string;
    perusahaan_id: string;
    name: string;
    price: number;
    stock: number;
    code: string;
}

export interface IItemWithId {
    id: string;
    perusahaan_id: string;
    name: string;
    price: number;
    stock: number;
    code: string;
}
