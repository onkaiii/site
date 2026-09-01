#!/usr/bin/env python3
"""Monta cada versao do prototipo a partir de src/<versao>/{head,body}.html.

Para cada versao saem dois arquivos:

  <local>   documento completo, assets por caminho relativo (edicao local)
  <single>  arquivo unico com tudo embutido em data URI (envio / Artifact)

v1 mantem os nomes originais porque ja esta publicada num Artifact — trocar o
caminho do arquivo criaria um artifact novo em vez de atualizar o existente.
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
ASSETS = ROOT / "assets"

VERSIONS = {
    "v1": ("index.html", "onkai-prototipo.html"),
    "v2": ("index-v2.html", "onkai-prototipo-v2.html"),
}

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


for version, (local_name, single_name) in VERSIONS.items():
    src = ROOT / "src" / version
    head = (src / "head.html").read_text(encoding="utf-8")
    body = (src / "body.html").read_text(encoding="utf-8")

    standalone = (
        "<!doctype html>\n"
        '<html lang="pt-BR">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<meta name="description" content="onkai.films — audiovisual estrategico para marcas que querem ser lembradas.">\n'
        f"{render(head, inline=False)}\n</head>\n<body>\n"
        f"{render(body, inline=False)}\n</body>\n</html>\n"
    )
    (ROOT / local_name).write_text(standalone, encoding="utf-8")

    single = render(head, inline=True) + "\n" + render(body, inline=True)
    (ROOT / single_name).write_text(single, encoding="utf-8")

    for name in (local_name, single_name):
        kb = (ROOT / name).stat().st_size / 1024
        print(f"{version}  {name:26} {kb:8.0f} KB")
