# phosphor_lustre

A package for lustre compatible [phosphor icons](https://phosphoricons.com/).

[![Package Version](https://img.shields.io/hexpm/v/phosphor_lustre)](https://hex.pm/packages/phosphor_lustre)
[![Hex Docs](https://img.shields.io/badge/hex-docs-ffaff3)](https://hexdocs.pm/phosphor_lustre/)

## Quickstart

```gleam
import lustre/element/html
import phosphor

pub fn like_button() {
  html.button([], [phosphor.heart_bold([])])
}
```

## A little adivce

This package has a _lot_ of icons! If you know you're only going to be using a subset of them it may be a good idea to copy paste just the ones you need into your own local icons module.
