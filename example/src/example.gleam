import lustre
import lustre/attribute
import lustre/element
import lustre/element/html
import phosphor

pub fn main() {
  let app =
    lustre.element(
      html.div([], [
        html.h1([], [element.text("Hello, world!")]),
        phosphor.heart_bold([
          attribute.attribute("width", "2em"),
          attribute.attribute("width", "5em"),
        ]),
        phosphor.lightning_fill([attribute.attribute("width", "4em")]),
      ]),
    )
  let assert Ok(_) = lustre.start(app, "#app", Nil)

  Nil
}
