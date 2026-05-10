# Kontribusi

Terima kasih atas minatmu untuk berkontribusi pada project Go Dokumentasi Indonesia!

## Panduan Awal Kontribusi

1. Buka repository ini di GitHub.
2. Buat issues.
3. Tunggu pemilik repo invite kamu untuk menjadi kolaborator & setelah diinvite, kamu bisa accept invite tersebut.

## Cara Berkontribusi

1. Clone repository ini
2. Buat branch baru (`nama-kolaborator`)
3. Lakukan perubahan pada file yang ada di path `src/docs/` untuk menambah atau memperbaiki dokumentasi.
4. Commit (commit message ga harus bahasa inggris yang penting bisa dibaca).
6. Push.
7. Pull Request.

## Menambah Dokumentasi

Dokumentasi disimpan di folder `src/docs/` dalam format JSON. Setiap file memiliki struktur:

```json
{
  "nama": {
    "title": "Judul",
    "description": "Penjelasan singkat",
    "syntax": "Sintaks (opsional)",
    "example": "Contoh kode (opsional)"
  }
}
```

Contoh entry di `builtins.json`:
```json
{
  "append": {
    "title": "append",
    "description": "Menambahkan elemen ke slice...",
    "syntax": "append(slice, nilai...)",
    "example": "nums := []int{1, 2}\nnums = append(nums, 3, 4)"
  }
}
```

## Guidelines Penulisan

- Gunakan bahasa Indonesia yang jelas dan ringkas
- Berikan contoh kode yang relevan dan dapat dijalankan
- Sintaks harus akurat sesuai dokumentasi resmi Go
- Hindari penjelasan yang terlalu panjang (maksimal 2-3 kalimat)