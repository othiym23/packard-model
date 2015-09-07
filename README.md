[![Build Status](https://travis-ci.org/othiym23/packard-models.svg)](https://travis-ci.org/othiym23/packard-models) [![Coverage Status](https://coveralls.io/repos/othiym23/packard-models/badge.svg?branch=master)](https://coveralls.io/r/othiym23/packard-models?branch=master)

# @packard/models
The models used by the packard audio file management suite. Model objects are for properties and business logic only; persistence logic lives in the DAOs, and workflows live in e.g. the packard scanner, cache, and CLI. These should stay pretty simple.

## File
`File` is meant to be used as a base for anything that lives on the file system and has filesystem metadata associated with it.

Properties:
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

## File > Cover
A `Cover` is a picture associated with an album.

Additional properties:
- `format`: How the image is encoded. Right now, extracted at creation time from the file's extension.

### new Cover(path, stats)
Same as `File`, except without the `extension`, which Cover always calculates from the extension, and uses to set `format`.

## File > Archive
`Archive`s are `File`s that contain one or more audio files and other associated assets. They also typically have metadata (tables of contents, internal block sizes, stream types) extracted from the files by e.g. compressed stream readers.

Additional properties:
- `info`: Additional archive-related metadata.

### new Archive(path, stats[, info])
Same as new File(), except an optional object literal containing metadata specific to `Archive` instead of the extension.

## File > Cuesheet
A `Cuesheet` should eventually be able to produce a `MultitrackAlbum` from its own metadata, but for now, it's just a type of file ("type" being the key word, as the type of `Cuesheet` objects is used by the packard scanner).

### new Cuesheet(path, stats)
Same as `new File()`, except the extension is _always_ deduced from the filename.

## Album
`Album` is meant to be used as an abstract basis for the two kinds of albums that can be found on a file system: collections of tracks, and single-track albums (for more on those, read on).

Properties:
- `name`: The name of the album.
- `artist`: An object representing the album artist. For now, the only property of the artist that the Album cares about is its `name`.
- `path`: The directory or file containing the album. Defaults to the empty string.
- `date`: The album's release date. Defaults to `null`.
- `pictures`: Any images associated with the album (probably `Cover`s).

### new Album(name, artist[, optional])
- `name`: The name of the album.
- `artist`: An object representing the album artist. For now, the only property of the artist that the Album cares about is its `name`.
- `optional.path`: The directory or file containing the album.
- `optional.date`: The album's release date.
- `optional.pictures`: Any images associated with the album.

### album.getSize()
Always returns 0. Abstract albums take up no space.

### album.getDate()
Returns `date`. Used by `album.toSafePath()`, so override this when subclassing `Album` if there's a different way to figure out the album date (for an example, see `MultitrackAlbum`).

### album.toSafePath()
Return a filesystem-safe full path (including the artist name) for the album, including the date (if it's set).

## Album > SingletrackAlbum
A `SingletrackAlbum` is probably a continuous DJ mix or full-album rip of some kind. It may have associated cover art, and it may also have either an associated or embedded cue sheet with metadata about the set of tracks contained within the single file. It's meant to be tied to an `AudioFile`.

Additional properties:
- `file`: The physical `AudioFile` associated with this logical album.
- `cuesheet`: A `Cuesheet`.

### new SingletrackAlbum(name, artist[, optional])
Same as `new Album()`, but with these additional properties:
- `optional.file`: An object representing the underlying file.
- `optional.path` and `optional.stats`: The elements necessary for the constructor to create the `AudioFile` for you. If you want to use this, both must be included.
- `optional.cuesheet`: A `Cuesheet`.

### singletrack.dump()
Produce a human-readable representation of the metadata associated with the album.

### SingletrackAlbum.fromTrack(track)
A filesystem scanner will find and read data from a single-track album (potentially even parsing out its cuesheet). This is a utility method to turn that `Track` into a `SingletrackAlbum`, reusing the same underlying `AudioFile`. Because filesystem scanners presume an `Artist/Album/Track.type` hierarchy, the tracks representing single-track albums typically end up with the artist name in the album name's slot, so `.fromTrack()` fixes that up.

## Album > MultitrackAlbum
A `MultitrackAlbum` bundles a set of `Track`s into a single logical album, with associated cover art, and potentially source and destination paths for the archive from which the associated tracks were extracted.

Additional properties:
- `tracks`: A list of `Track`s, sorted by index and name.
- `sourceArchive`: The original location of the archive from which the `Tracks` comprising the album were extracted.
- `destArchive`: The location to which the archive should be moved.

### new MultitrackAlbum(name, artist[, optional])
Same as `new Album()`, but with these additional properties:
- `optional.tracks`: An array of `Track`s.

### multitrack.getSize(bs)
Return the total size, in blocks (with block size specified by `bs`), of all of the tracks and pictures associated with the album.

### multitrack.getDate()
Builds a set from all of the dates found on `Tracks` for this release. Warns if more than one date is found, and then chooses one of them arbitrarily.

### multitrack.dump()
Produce a human-readable representation of the metadata associated with the album.

## Artist
An `Artist` is mostly a convenient container from which to hang a collection of albums and miscellaneous tracks, mostly useful for calculating the amount of space used by that `Artist`'s material.

Properties:
- `name`: The name of the artist.
- `albums`: Albums associated with this artist.
- `otherTracks`: Loose tracks associated with this artist.

### new Artist(name[, optional])
- `name`: The name of the artist.
- `optional.albums`: Albums associated with this artist. Associating albums sets their artist to this artist.
- `optional.otherTracks`: Loose tracks associated with this artist. Associating tracks sets their artist to this artist.

### artist.addOtherTracks(tracks)
Concatenate a list of tracks with the existing list of other tracks, ensuring that their artists are set to this artist.

### artist.getSize(bs)
Return the total size, in blocks (with block size specified by `bs`), of all the albums and tracks assocated with the artist.
