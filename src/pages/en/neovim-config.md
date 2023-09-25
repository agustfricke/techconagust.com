---
title: Neovim config
description: Aprender a configurar Neovim como un IDE
layout: ../../layouts/docs.astro
lang: es
---

## Empezando

En este tutorial vamos a estar configurando neovim desde 0, lo primero que vamos a hacer
es descargar [**Neovim**](https://github.com/neovim/neovim/releases).
En mi caso me voy a descargar la [**version 0.9.2**](https://github.com/neovim/neovim/releases/download/v0.9.2/nvim-linux64.tar.gz)

Luego lo tenemos que descomprimr y mover a la carpeta de binario de linux

```bash
tar -xf nvim-linux64.tar.gz
sudo cp -r ~/nvim-linux64 /usr/local/bin/nvim
```

## Creando la carpeta nvim

Dentro de la carpeta **~/.config/** vamos a crear una nueva carpeta llamada **nvim**

```bash
mkdir ~/.config/nvim
```

Ahora vamos a crear un nuevo archivo llamado init.lua dentro de este directorio

```bash
touch ~/.config/nvim/init.lua
```

Dentro de este archivo vamos a poner:

#### ~/.config/nvim/init.lua

```lua
print("Hello")
```

Luego vamos a crear una nueva carpeta llamada **lua**

```bash
mkdir ~/.config/nvim/lua
```

Dentro de **lua** vamos a crear un nuevo archivo llamado **agust**, por lo general le pongo el nombre
de mi usuario, te recomiendo que hagas los mismo.

```bash
mkdir ~/.config/nvim/lua/agust
```

Ahora creemos dentro de agust un archivo llamado **init.lua** y pongamos el sigiuiente contenido.

```bash
mkdir ~/.config/nvim/lua/agust/init.lua
```

#### ~/.config/nvim/lua/agust/init.lua

```lua
print("Hello from agust")
```

Y ahora podemos poner un required en el init.lua

#### ~/.config/nvim/init.lua

```lua
require("agust")
print("Hello")
```

Ahora podemos salir de neovim y volver a entrar y deberiamos ver **Hello from agust** y **Hello**

Perfecto ya tenemos algo armado para hacer la configuracion de neovim.

## Primer remap

Para que la configuracion de Neovim sea mas facil lo primero que vamos a hacer es crear un nuevo archivo
para comenzar a a hacer los ramaps.

Vamos a crear un nuevo archivo llamado **remap.lua**

```bash
touch ~/.config/nvim/lua/agust/remap.lua
```

Y dentro vamos a poner el siguiente contendio

#### ~/.config/nvim/lua/agust/remap.lua

```lua
vim.g.mapleader = " "
vim.keymap.set("n", "<leader>e", vim.cmd.Ex)
```

Ahora cuando estemos en neovim podemos presionar las letras **espacio** **e** para volver al menu de
navegacion.

Ahora podemos hacer un require en init.lua

#### ~/.config/nvim/lua/agust/init.lua

```lua
require("agust.remap")
print("Hello from agust")
```

Ahora podes cerrar neovim y cuando entres a un archivo podemos poner la combinacion de letras **espacio** **e**
para volver al menu **Netrw Directory Listing**

## Plugin manager

Ahora vamos a crear un plugin manager, en nuestro caso vamos a utilizar [**packer**](https://github.com/wbthomason/packer.nvim)
Asi que lo vamos a instalar con el comando:

```bash
git clone --depth 1 https://github.com/wbthomason/packer.nvim\
 ~/.local/share/nvim/site/pack/packer/start/packer.nvim
```

Ahora configuremos packer

```bash
touch ~/.config/nvim/lua/agust/packer.lua
```

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'
end)
```

Ahora podemos cerrar nvim y hacer un source de este archivo.

```bash
source ~/.config/nvim/lua/agust/packer.lua
```

Perfecto, ya tenemos instaldo packer!
Ahora podemos hacer un **PackerSync** dentro de nvim para hacer un test.

```bash
:PackerSync
```

## Fuzzy finder

Ahora instalemos un [**fuzzy finder**](https://github.com/nvim-telescope/telescope.nvim)
para movernos entre archivos rapido.

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  -- nuevo!
  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  	requires = { {'nvim-lua/plenary.nvim'} }
    }
  -- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora configuremos fuzzy finder

```bash
mkdir ~/.config/nvim/after
touch ~/.config/nvim/after/telescope.lua
```

#### ~/.config/nvim/after/telescope.lua

```lua
local builtin = require('telescope.builtin')
vim.keymap.set('n', '<leader>f', builtin.find_files, {})
vim.keymap.set('n', '<C-p>f', builtin.git_files, {})
```

Ahora hagamos un source de este arhchivo

```bash
source ~/.config/nvim/after/telescope.lua
```

Ahora podemos abrir el fuzzy finder con **espacio** **f**, **Ctrl** **p** **f** para
buscar en archivos de git.

Perfecto!

## Color scheme

Para el color vamos a estar utilizando [**Rose Pine**](https://github.com/rose-pine/neovim)

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  	requires = { {'nvim-lua/plenary.nvim'} }
    }

  -- nuevo!
    use({ 'rose-pine/neovim', as = 'rose-pine' })
    use 'prettier/vim-prettier'

    vim.cmd('colorscheme rose-pine')
  -- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora configuremos rose pine para que se vea mejor

#### ~/.config/nvim/after/colors.lua

```lua
require('rose-pine').setup({
    disable_background = true,
})
vim.cmd('colorscheme rose-pine')
```

Ahora hagamos un source de este arhchivo

```bash
source ~/.config/nvim/after/colors.lua
```

Perfecto!

## Treesitter

Okey comenzemos con la instalacion de [**treesitter**](https://github.com/nvim-treesitter/nvim-treesitter)

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  	requires = { {'nvim-lua/plenary.nvim'} }
    }

    use({ 'rose-pine/neovim', as = 'rose-pine' })
    use 'prettier/vim-prettier'

    vim.cmd('colorscheme rose-pine')

  -- nuevo!
  use {
    'nvim-treesitter/nvim-treesitter',
    run = function()
        local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
        ts_update()
    end,}
-- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora creemos un nuevo archivo para treesitter

```bash
touch ~/.config/nvim/lua/after/plugin/treesitter.lua
```

#### ~/.config/nvim/lua/after/plugin/treesitter.lua

```lua
require'nvim-treesitter.configs'.setup {
  ensure_installed = { "javascript", "typescript", "c", "lua", "rust", "go", "python" },

  sync_install = false,

  auto_install = true,

  highlight = {
    enable = true,

    additional_vim_regex_highlighting = false,
  },
}
```

Hagamos un source de este archivo

```bash
source ~/.config/nvim/lua/after/plugin/treesitter.lua
```

## Harpoon

Ahora instalemos harpoon para saltar entre archivos super rapido.

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  	requires = { {'nvim-lua/plenary.nvim'} }
    }

    use({ 'rose-pine/neovim', as = 'rose-pine' })
    use 'prettier/vim-prettier'

    vim.cmd('colorscheme rose-pine')

  use {
    'nvim-treesitter/nvim-treesitter',
    run = function()
        local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
        ts_update()
    end,}

    -- nuevo!
	use("theprimeagen/harpoon")
    -- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora creemos un nuevo achivo para configurarlo

```bash
touch ~/.config/nvim/lua/after/plugin/harpoon
```

#### ~/.config/nvim/lua/after/plugin/harpoon

```lua
local mark = require("harpoon.mark")
local ui = require("harpoon.ui")

vim.keymap.set("n", "<leader>a", mark.add_file)
vim.keymap.set("n", "<leader>q", ui.toggle_quick_menu)

vim.keymap.set("n", "<leader>1", function() ui.nav_file(1) end)
vim.keymap.set("n", "<leader>2", function() ui.nav_file(2) end)
vim.keymap.set("n", "<leader>3", function() ui.nav_file(3) end)
vim.keymap.set("n", "<leader>4", function() ui.nav_file(4) end)
```

## Prettier

Instalemos prettier para que al guardar achivos se formate solo.

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

  use {
    'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  	requires = { {'nvim-lua/plenary.nvim'} }
    }

    use({ 'rose-pine/neovim', as = 'rose-pine' })

    vim.cmd('colorscheme rose-pine')

  use {
    'nvim-treesitter/nvim-treesitter',
    run = function()
        local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
        ts_update()
    end,}

	use("theprimeagen/harpoon")

    -- nuevo!
    use 'prettier/vim-prettier'
    -- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora configuremos prettier.

```bash
touch  ~/.config/nvim/lua/after/plugin/prettier.lua
:PackerSync
```

```lua
vim.api.nvim_exec([[
  augroup PrettierAutoFormat
    autocmd!
    autocmd BufWritePost *.js,*.jsx,*.json,*.ts,*.tsx,*.css,*.scss,*.md,*.html :PrettierAsync
  augroup END
]], false)
```

Ahora hagamos un source de este achivo

```bash
source ~/.config/nvim/lua/after/plugin/prettier.lua
```

## LSP

Instalemos un lsp como ultima configuracion

#### ~/.config/nvim/lua/agust/packer.lua

```lua
vim.cmd [[packadd packer.nvim]]

return require('packer').startup(function(use)
  use 'wbthomason/packer.nvim'

	use {
  		'nvim-telescope/telescope.nvim', tag = '0.1.2',
	-- or                            , branch = '0.1.x',
  		requires = { {'nvim-lua/plenary.nvim'} }
	}

    	use({ 'rose-pine/neovim', as = 'rose-pine' })
      use 'prettier/vim-prettier'

    	vim.cmd('colorscheme rose-pine')

	use {
        	'nvim-treesitter/nvim-treesitter',
        run = function()
            local ts_update = require('nvim-treesitter.install').update({ with_sync = true })
            ts_update()
        end,}

    -- Nuevo!
	use("theprimeagen/harpoon")

	        use {
            'VonHeikemen/lsp-zero.nvim',
            branch = 'v2.x',
            requires = {
                -- LSP Support
                {'neovim/nvim-lspconfig'},             -- Required
                {                                      -- Optional
                'williamboman/mason.nvim',
                run = function()
                    pcall(vim.cmd, 'MasonUpdate')
                end,
            },
            {'williamboman/mason-lspconfig.nvim'}, -- Optional

            -- Autocompletion
            {'hrsh7th/nvim-cmp'},     -- Required
            {'hrsh7th/cmp-nvim-lsp'}, -- Required
            {'L3MON4D3/LuaSnip'},     -- Required
        }
    }
    -- fin nuevo!
end)
```

Ahora podemos hacer un source y PakcerSync para instalarlo con packer!

```bash
source ~/.config/nvim/lua/agust/packer.lua
:PackerSync
```

Ahora configuremos el lsp.

```bash
touch  ~/.config/nvim/lua/after/plugin/lsp.lua
```

#### ~/.config/nvim/lua/after/plugin/prettier.lua

```lua
local lsp = require("lsp-zero")

lsp.preset("recommended")

lsp.ensure_installed({
  'tsserver',
  'gopls',
})

-- Fix Undefined global 'vim'
lsp.nvim_workspace()


local cmp = require('cmp')
local cmp_select = {behavior = cmp.SelectBehavior.Select}
local cmp_mappings = lsp.defaults.cmp_mappings({
  ['<C-p>'] = cmp.mapping.select_prev_item(cmp_select),
  ['<C-n>'] = cmp.mapping.select_next_item(cmp_select),
  ['<C-y>'] = cmp.mapping.confirm({ select = true }),
  ["<C-Space>"] = cmp.mapping.complete(),
})

cmp_mappings['<Tab>'] = nil
cmp_mappings['<S-Tab>'] = nil

lsp.setup_nvim_cmp({
  mapping = cmp_mappings
})

lsp.set_preferences({
    suggest_lsp_servers = false,
    sign_icons = {
        error = 'E',
        warn = 'W',
        hint = 'H',
        info = 'I'
    }
})

lsp.on_attach(function(client, bufnr)
  local opts = {buffer = bufnr, remap = false}
  vim.keymap.set("n", "<leader>vd", function() vim.diagnostic.open_float() end, opts)
end)

lsp.setup()

vim.diagnostic.config({
    virtual_text = true
})
```

Perfecto ahora podemos hacer un source de este achivo

```bash
source ~/.config/nvim/lua/after/plugin/lsp.lua
```

Ahora en nvim podemos poner **:Mason** para instalar nuevos lsp para difrentes lenguajes de programacion.

## Set.lua

Ahora creemos algunas configuraciones basicas para nvim

```bash
touch  ~/.config/nvim/agust/set.lua
```

#### ~/.config/nvim/agust/set.lua

```lua
vim.opt.guicursor = ""

vim.opt.nu = true
vim.opt.relativenumber = true

vim.opt.tabstop = 4
vim.opt.softtabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.clipboard = "unnamedplus"

vim.opt.smartindent = true

vim.opt.wrap = false

vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.undodir = os.getenv("HOME") .. "/.vim/undodir"
vim.opt.undofile = true

vim.opt.hlsearch = false
vim.opt.incsearch = true

vim.opt.termguicolors = true

vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.isfname:append("@-@")

vim.opt.updatetime = 50
```

Y podemos hacer un source de este archivo

```bash
source ~/.config/nvim/agust/set.lua
```

Y ahora podemos llamar a set.lua dentro de init.lua

#### ~/.config/nvim/agust/init.lua

```lua
require("agust.remap")
require("agust.set")
```

Perfecto ya tienes configuado neovim!
