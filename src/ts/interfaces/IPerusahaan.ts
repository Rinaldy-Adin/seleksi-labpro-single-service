export interface IPerusahaanDTO {
    id?: string;
    nama: string;
    alamat: string;
    no_telp: string;
    kode: string;
}

export interface IPerusahaan {
    id?: string;
    name: string;
    address: string;
    phone: string;
    code: string;
}

export interface IPerusahaanWithId {
    id: string;
    name: string;
    address: string;
    phone: string;
    code: string;
}
