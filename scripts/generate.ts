import { parse } from "npm:svgson@5.3.1";
import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
import * as ansi from "https://deno.land/std@0.224.0/fmt/colors.ts";
import { snakeCase } from "https://deno.land/x/case@2.2.0/mod.ts";

const ASSETS_PATH = path.join(Deno.cwd(), "./core/assets");
const TEMPLATE_PATH = path.join(Deno.cwd(), "./scripts/template.gleam");
const SRC_PATH = path.join(Deno.cwd(), "./phosphor_lustre/src/phosphor.gleam");
const WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"];

const icons: Record<string, Record<string, string>> = {};

async function main() {
  loadWeights();

  if (!checkFiles) {
    console.error(ansi.red("Error: Missing files for some weights"));
    Deno.exit(1);
  }

  const lustreFunctions = [];
  for (const name of Object.keys(icons)) {
    const iconGroup = icons[name];

    lustreFunctions.push(await generateLustreIcon(name, iconGroup));
  }

  const template = Deno.readTextFileSync(TEMPLATE_PATH);
  const file = template + lustreFunctions.join("\n");
  Deno.writeTextFileSync(SRC_PATH, file);
}

await main();

function readFile(filePath: string, name: string, weight: string) {
  const getName = () => {
    if (weight !== "reglar") {
      const newName = path.basename(name, `_${weight}`);
      return newName;
    } else {
      return name;
    }
  };
  const svgName = getName();

  const file = Deno.readTextFileSync(filePath);
  if (icons[svgName] === undefined) {
    icons[svgName] = {};
  }
  icons[svgName][weight] = file;
}

function loadWeights() {
  const weightsDir = Deno.readDirSync(ASSETS_PATH);

  for (const weight of weightsDir) {
    if (weight.isDirectory) {
      const weightDir = Deno.readDirSync(path.join(ASSETS_PATH, weight.name));

      for (const entry of weightDir) {
        if (entry.isFile) {
          readFile(
            path.join(
              ASSETS_PATH,
              weight.name,
              entry.name,
            ),
            path.basename(entry.name, ".svg").replaceAll(
              "-",
              "_",
            ),
            weight.name,
          );
        }
      }
    }
  }
}

function generateLustreSvg(
  node: Awaited<ReturnType<typeof parse>>,
): string {
  const nodeType = snakeCase(node.name);
  const attributes = Object.keys(node.attributes).map((key) => {
    return `attr.attribute("${key}", "${node.attributes[key]}")`;
  });

  const children = node.children.map(generateLustreSvg);

  const canHaveChildren = () => {
    switch (nodeType) {
      case "svg":
        return true;

      default:
        return false;
    }
  };

  return `svg.${nodeType}([${attributes.join(", ")}]${
    canHaveChildren() ? `, [${children.join(", ")}]` : ""
  })`;
}

function checkFiles(icon: Record<string, string>) {
  const weightsPresent = Object.keys(icon);
  return (
    weightsPresent.length === 6 &&
    weightsPresent.every((w) => WEIGHTS.includes(w))
  );
}

async function generateLustreIcon(
  name: string,
  icons: Record<string, string>,
): Promise<string> {
  const thin = (await parse(icons["thin"])).children.map(generateLustreSvg)
    .join(", ");
  const light = (await parse(icons["light"])).children.map(generateLustreSvg)
    .join(", ");
  const regular = (await parse(icons["regular"])).children.map(
    generateLustreSvg,
  )
    .join(", ");
  const bold = (await parse(icons["bold"])).children.map(generateLustreSvg)
    .join(", ");
  const fill = (await parse(icons["fill"])).children.map(generateLustreSvg)
    .join(", ");
  const dutone = (await parse(icons["duotone"])).children.map(generateLustreSvg)
    .join(", ");

  return `      
pub fn ${name}(weight: IconWeight) -> IconVariant(msg) {
  let elements = case weight {
    Thin -> [${thin}]
    Light -> [${light}]
    Regular -> [${regular}]
    Bold -> [${bold}]
    Fill -> [${fill}]
    Dutone -> [${dutone}]
  }

  IconVariant(attrs: default_attributes(), src: elements)
}
    `;
}
