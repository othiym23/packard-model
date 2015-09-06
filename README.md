[![Build Status](https://travis-ci.org/othiym23/packard-models.svg)](https://travis-ci.org/othiym23/packard-models) [![Coverage Status](https://coveralls.io/repos/othiym23/packard-models/badge.svg?branch=master)](https://coveralls.io/r/othiym23/packard-models?branch=master)

# @packard/models
The models used by the packard audio file management suite. Model objects are for properties and business logic only; persistence logic lives in the DAOs, and workflows live in e.g. the packard scanner, cache, and CLI. These should stay pretty simple.

## File
`File` is meant to be used as a base for anything that lives on the file system and has filesystem metadata associated with it.

Core properties:
- `path`: Where the file is located.
- `stats`: The results of a call to `fs.stat()`, or something that has enough of that info with the correct names to be useful. Currently, the only thing File itself needs is `size`.
- `ext`: To simplify creating new files, or to do type discrimination on files that already exist. Defaults at creation time to `path.extname()` called on `path`.
- `name`: The base name of the file, unless the `ext` passed to the constructor differs from the extension on `path`.

### new File(path, stats[, extension])
- `path`: Where the file is located.
- `stats`: The results of a call to `fs.stat()`, or something that has enough of that info with the correct names to be useful. Currently, the only thing File itself needs is `size`.
- `extension`: To simplify creating new files, or to do type discrimination on files that already exist.

### file.fullName()
`override` A file's `path`.

### file.safeName()
Scrubs characters that aren't filesystem-safe from `name`. This list is probably more stringent than it needs to be for modern HFS+, NTFS, or ext[234], but FAT32 is pretty common for audio players, so err on the side of caution.

### file.getSize(blockSize)
The size of the file.
- `blockSize`: Since the ultimate purpose of packard is to figure out how to get the most audio files onto a storage medium, it's helpful for it to be able to get the size of files in terms of the integer number of blocks the file will occupy on that particular medium. For the same reason, it rounds up.

## Archive
`Archive`s include one or more audio files and other associated assets. They also typically have metadata (tables of contents, internal block sizes, stream types) extracted from the files by e.g. compressed stream readers.

### new Archive(path, stats[, info])
Same as new File(), except an optional object literal containing metadata specific to `Archive` instead of the extension.

## Cuesheet
A `Cuesheet` should eventually be able to produce a `MultitrackAlbum` from its own metadata, but for now, it's just a type of file ("type" being the key word, as the type of `Cuesheet` objects is used by the packard scanner).

### new Cuesheet(path, stats)
Same as `new File()`, except the extension is _always_ deduced from the filename.
