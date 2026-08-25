#!/usr/bin/env python3
"""Monta o protótipo em dois formatos a partir de src/head.html + src/body.html.

  index.html          documento completo, assets por caminho relativo (edição local)
  onkai-prototipo.html  arquivo único com tudo embutido em data URI (envio / Artifact)
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
ASSETS = ROOT / "assets"

TOKEN = re.compile(r"\{\{(IMG|FONT):([^}]+)\}\}")

MIME = {".otf": "font/otf", ".jpg": "image/jpeg", ".png": "image/png"}


def data_uri(name: str) -> str:
    path = ASSETS / name
    mime = MIME.get(path.suffix.lower()) or mimetypes.guess_type(name)[0]
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def render(text: str, inline: bool) -> str:
    def sub(m):
        name = m.group(2)
        return data_uri(name) if inline else f"assets/{name}"

    return TOKEN.sub(sub, text)


head = (SRC / "head.html").read_text(encoding="utf-8")
body = (SRC / "body.html").read_text(encoding="utf-8")

standalone = (
    "<!doctype html>\n"
    '<html lang="pt-BR">\n<head>\n'
    '<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
    '<meta name="description" content="onkai.films — audiovisual estrategico para marcas que querem ser lembradas.">\n'
    f"{render(head, inline=False)}\n</head>\n<body>\n"
    f"{render(body, inline=False)}\n</body>\n</html>\n"
)
(ROOT / "index.html").write_text(standalone, encoding="utf-8")

single = render(head, inline=True) + "\n" + render(body, inline=True)
(ROOT / "onkai-prototipo.html").write_text(single, encoding="utf-8")

for f in ("index.html", "onkai-prototipo.html"):
    kb = (ROOT / f).stat().st_size / 1024
    print(f"{f:24} {kb:8.0f} KB")
