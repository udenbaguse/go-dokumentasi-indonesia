# Changelog

Semua perubahan yang signifikan pada project ini akan didokumentasikan dalam file ini.

array[index] dihover muncul popup nilai sesuai value di array(tidak menyimpan data di cache memory supaya ketika value diganti maka popup nilai menampilkan nilai terbaru)


## [0.1.1] - 2026-05-10

### Ditambahkan
- penjelasan rentang interval pada tipe data number.
- `CONTRIBUTING.md` - panduan kontribusi

### Diubah
- icon.png dikonversi menjadi icon.ico untuk ukuran yang lebih kecil dan kompatibilitas yang lebih baik dengan VS Code.
- minify pada kode utama untuk mengurangi ukuran file, meningkatkan performa extension, & keamanan kode.

## [0.1.0] - 2026-05-09

### Ditambahkan
- Extension VS Code untuk dokumentasi Go dalam bahasa Indonesia
- Hover documentation untuk keyword Go seperti `package`, `import`, `func`, `defer`, `go`, `select`, `range`, `struct`, `interface`, dan generics
- Penjelasan built-in function seperti `append`, `make`, `len`, `cap`, `new`, `panic`, `recover`, `min`, `max`, `print`, dan `println`
- Dukungan selector package seperti `fmt.Println`, `fmt.Sprintf`, `os.ReadFile`, `strings.Split`, `http.ListenAndServe`, `json.Marshal`, `slices.Sort`
- Dokumentasi tersimpan dalam format JSON di folder `src/docs/`
  - `builtins.json`: built-in function Go
  - `keywords.json`: keyword bahasa Go
  - `type.json`: tipe dasar, alias, pointer, slice, map, struct, interface, dan error
  - `concurency.json`: goroutine, channel, sync, context, timer, dan concurrency tools
  - `fmt.json`: package `fmt` dan fungsi output/input yang umum
  - `packages.json`: package standar umum seperti `os`, `io`, `strings`, `time`, `net/http`, `encoding/json`, `crypto`
  - `stdlib.json`: fitur standard library modern Go 1.21 sampai Go 1.26
  - `generics.json`: konsep generics Go
  - `features.json`: konsep bahasa dan fitur tambahan
  - `unsafe.json`: unsafe API Go