# Go Dokumentasi Indonesia

Dokumentasi Go berbahasa Indonesia langsung di VS Code. Arahkan kursor ke keyword, tipe, built-in function, package, atau API standar Go, lalu baca penjelasan singkat beserta contoh pemakaian tanpa perlu pindah tab.

## Kenapa Install?

- Belajar Go jadi lebih cepat karena penjelasan muncul tepat di kode.
- Cocok untuk pemula yang sering lupa arti `defer`, `chan`, `interface`, `make`, `append`, `fmt.Println`, dan API standar lain.
- Membantu membaca project Go tanpa bolak-balik membuka dokumentasi browser.
- Dokumentasi ditulis dalam bahasa Indonesia yang ringkas dan praktis.
- Ringan: aktif hanya untuk file bahasa Go.

## Fitur Utama

- Hover documentation untuk keyword dan konsep Go seperti `package`, `import`, `func`, `defer`, `go`, `select`, `range`, `struct`, `interface`, dan generics.
- Penjelasan built-in function seperti `append`, `make`, `len`, `cap`, `new`, `panic`, `recover`, `min`, `max`, `print`, dan `println`.
- Dukungan selector package seperti `fmt.Println`, `fmt.Sprintf`, `os.ReadFile`, `strings.Split`, `http.ListenAndServe`, `json.Marshal`, `slices.Sort`, dan banyak lagi.
- Lebih dari 300 entry dokumentasi hover yang tersimpan sebagai JSON dan mudah ditambah.
- Contoh sintaks dan contoh kode Go untuk banyak entry.

## Contoh Hover

Saat menulis:

```go
fmt.Println("Halo, Go")
```

Arahkan kursor ke `fmt.Println`, lalu extension menampilkan ringkasan fungsi, syntax, dan contoh penggunaan.

Contoh lain yang sudah didukung:

```go
items = append(items, "baru")
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
data, err := os.ReadFile("config.json")
users := slices.Collect(maps.Values(userMap))
```

## Yang Didukung

Extension ini memuat dokumentasi dari folder `src/docs`, termasuk:

- `builtins.json`: built-in function Go.
- `keywords.json`: keyword bahasa Go.
- `type.json`: tipe dasar, alias, pointer, slice, map, struct, interface, dan error.
- `concurency.json`: goroutine, channel, sync, context, timer, dan concurrency tools.
- `fmt.json`: package `fmt` dan fungsi output/input yang umum.
- `packages.json`: package standar umum seperti `os`, `io`, `strings`, `time`, `net/http`, `encoding/json`, `crypto`, dan lainnya.
- `stdlib.json`: fitur standard library modern Go 1.21 sampai Go 1.26.
- `generics.json`, `features.json`, dan `unsafe.json`: generics, konsep bahasa, embed, cgo, dan unsafe API.


## Kontribusi

Kontribusi sangat terbuka. Kamu bisa membantu menambah entry dokumentasi, memperbaiki contoh kode, memperhalus bahasa Indonesia, atau menambahkan coverage untuk package standar Go yang belum ada.

Jika extension ini membantumu belajar atau membaca kode Go dengan lebih nyaman, beri bintang repository ini dan bagikan ke teman yang sedang belajar Go.
