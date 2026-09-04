# Duplicate file checker

This program checks the given directory path recursively for duplicate files,
based on their contents.

Duplicate file paths are written to standard ouput, separated by newlines.
Different groups of duplicates are separated by blank lines. If there are no
duplicates found, nothing is written to standard output.

## Example

```sh
$ bin/cli some/directory
some/directory/foo.txt
some/directory/bar/foo.txt
some/directory/bar/qux/foo.txt

some/directory/bar.txt
some/directory/bar-copy.txt

some/directory/empty-file
some/directory/another-empty-file
```

## Prerequisites

Install [Node.js](https://nodejs.org/).

All commands below assume the project's root is your current working directory.

## Installation

```sh
npm install
```

## Usage

```sh
bin/cli some/directory/to/check
```

## Testing

To run tests once:

```sh
npm test # or npm run test
```

To run tests and re-run them automatically when files change, run:

```sh
npm run test:watch
```

