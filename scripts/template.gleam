import gleam/float
import gleam/list
import gleam/option.{type Option, None, Some}
import lustre/attribute.{type Attribute} as attr
import lustre/element.{type Element}
import lustre/element/svg

pub type IconWeight {
  Thin
  Light
  Regular
  Bold
  Fill
  Dutone
}

pub opaque type IconAttributes {
  IconAttributes(size: Float, size_unit: String, class: Option(String))
}

pub opaque type IconVariant(msg) {
  IconVariant(attrs: IconAttributes, src: List(Element(msg)))
}

fn default_attributes() {
  IconAttributes(size: 1.0, size_unit: "em", class: Some("ph-icon"))
}

pub fn with_size(variant: IconVariant(msg), size: Float) {
  let attrs = IconAttributes(..variant.attrs, size:)
  IconVariant(..variant, attrs:)
}

pub fn with_size_unit(variant: IconVariant(msg), size_unit: String) {
  let attrs = IconAttributes(..variant.attrs, size_unit:)
  IconVariant(..variant, attrs:)
}

pub fn with_class(variant: IconVariant(msg), class: String) {
  let attrs = IconAttributes(..variant.attrs, class: Some(class))
  IconVariant(..variant, attrs:)
}

pub fn view(
  variant: IconVariant(msg),
  attrs: List(Attribute(msg)),
) -> Element(msg) {
  let string_size = float.to_string(variant.attrs.size)

  let base_attributes = [
    attr.attribute("xmlns", "http://www.w3.org/2000/svg"),
    attr.attribute("fill", "currentColor"),
    attr.attribute("height", string_size <> variant.attrs.size_unit),
    attr.attribute("width", string_size <> variant.attrs.size_unit),
    attr.attribute("stroke", "currentColor"),
    attr.attribute("stroke-linecap", "round"),
    attr.attribute("viewBox", "0 0 256 256"),
    case variant.attrs.class {
      Some(c) -> attr.class(c)

      None -> attr.none()
    },
  ]

  let combined_attributes = list.concat([base_attributes, attrs])

  svg.svg(combined_attributes, variant.src)
}
