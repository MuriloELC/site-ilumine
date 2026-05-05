# Ilumine Representações - Site estático

Site institucional estático para validação com cliente, apresentando a Ilumine Representações, suas linhas de produtos e botões de solicitação de orçamento via WhatsApp.

## Estrutura de arquivos

```text
ilumine-site/
  index.html
  catalogo.html
  sobre.html
  contato.html
  README.md
  assets/
    img/
      logo-preta.png
      logo-branca.png
      hero-industrial.jpg
      produtos/
    css/
      style.css
    js/
      main.js
      catalogo.js
    data/
      produtos.json
```

## Como rodar localmente

O catálogo usa `fetch` para carregar `assets/data/produtos.json`, então rode o projeto com um servidor estático.

Com Python:

```powershell
cd C:\Repositorio\site_estatico\ilumine-site
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Como editar o catálogo

Edite o arquivo:

```text
assets/data/produtos.json
```

Cada produto usa este formato:

```json
{
  "id": "hda-003-mp-g4",
  "nome": "HDA 003 MP - G4",
  "categoria": "Iluminação Industrial",
  "descricao": "Descrição curta do produto.",
  "aplicacoes": ["Indústrias", "Centros de distribuição"],
  "destaques": ["IP66", "Até 172 lm/W"],
  "imagem": "assets/img/produtos/hda-003-mp-g4.jpg",
  "fonte": "folder HDA 003 MP - G4",
  "referencias": ["REF-001", "REF-002"]
}
```

Ao adicionar um produto, mantenha:

- `id` único, em letras minúsculas e sem espaços;
- `imagem` apontando para um arquivo dentro de `assets/img/produtos/`;
- `aplicacoes` e `destaques` como listas;
- `referencias` como lista opcional para SKUs, códigos de catálogo ou variações;
- JSON válido, sem vírgula sobrando no último item.

O catálogo atual reúne os produtos HDA do blueprint inicial e famílias/itens comerciais extraídos do `CATÁLOGO 2026 LUMUS DIGITAL`, mantendo as referências pesquisáveis dentro do campo `referencias`.

## Imagens e logos

Os caminhos previstos são:

- Logo preta: `assets/img/logo-preta.png`
- Logo branca: `assets/img/logo-branca.png`
- Imagem principal: `assets/img/hero-industrial.jpg`
- Produtos: `assets/img/produtos/`

Enquanto as imagens oficiais não existirem, o site mostra fallbacks visuais limpos. Para substituir, basta salvar os arquivos reais nos caminhos indicados e manter os nomes usados no JSON.

## WhatsApp

O número está definido em:

```text
assets/js/main.js
```

Procure por:

```js
const whatsappNumber = "5569981111902";
```

A mensagem padrão de produto também está em `assets/js/main.js`:

```js
Olá, tenho interesse no produto: [NOME_DO_PRODUTO]. Gostaria de solicitar um orçamento.
```

Os botões do catálogo montam o link automaticamente com o nome do produto e codificação correta para acentos.

## Publicação

### GitHub Pages

1. Envie a pasta `ilumine-site` para o repositório.
2. Nas configurações do GitHub Pages, publique a branch desejada.
3. Se o repositório publicar a partir da raiz, mantenha os arquivos do site na raiz publicada ou configure a pasta correta.

### Cloudflare Pages

1. Crie um projeto conectado ao repositório.
2. Use `ilumine-site` como diretório de saída/publicação, se o repositório tiver mais arquivos além do site.
3. Não configure comando de build, pois o site é HTML, CSS, JavaScript e JSON puros.

## Validação sugerida

- Abrir `index.html`, `sobre.html`, `catalogo.html` e `contato.html` pelo servidor local.
- Confirmar que o catálogo carrega os 14 produtos.
- Testar busca e filtro de categoria.
- Clicar em "Solicitar orçamento" e conferir se o WhatsApp abre com a mensagem correta.
- Reduzir a largura da janela para validar o layout mobile.
- Inserir uma imagem real de produto e confirmar que ela substitui o fallback automaticamente.
