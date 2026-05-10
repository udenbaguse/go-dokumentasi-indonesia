# Kontribusi

Terima kasih untuk minatmu untuk berkontribusi pada Go Dokumentasi Indonesia!

## Cara Berkontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Lakukan perubahan
4. Pastikan `npm run check` berhasil
5. Commit perubahan (`git commit -m 'Menambahkan fitur X'`)
6. Push ke branch (`git push origin fitur/nama-fitur`)
7. Buat Pull Request

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