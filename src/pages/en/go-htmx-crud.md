---
title: Go htmx CRUD
description: How to build a CRUD app with Go and HTMX
layout: ../../layouts/docs.astro
lang: en
---

<div class="embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/K5Zym6w91Nc" title="The best stack for your next project" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Nuestras herramientas

En este tutorial vamos a estar creando una app con [**Go**](https://go.dev/), [**htmx**](https://go.dev/)
[**Tailwind CSS**](https://tailwindcss.com/) y [**PostgreSQL**](https://www.postgresql.org/) junto con 
[**Docker**](https://www.docker.com/). Vamos a hacer un simple CRUD (crear, leer, actualizar y destruir).

## Configuracion del proyecto

En una nueva terminal vamos a crear un nuevo directorio llamado **go-htmx-crud** con el comando **mkdir** y nos vamos a meter dentro de el
con el comando **cd**

```bash
mkdir ~/go-htmx-crud
cd ~/go-htmx-crud
```

Una vez dentro de la carpeta vamos a crear un nuevo modulo con Go,
los módulos se utilizan para administrar las dependencias de un proyecto y
permiten organizar y versionar las dependencias de manera efectiva, lo que facilita la 
colaboración en proyectos y garantiza que el código sea reproducible en diferentes entornos.

Para crear un nuevo modulo con Go debemos poner el comando **go mod init nombre-de-modulo**,
donde esta **nombre-del-modulo** por lo general se le pone la url de un repositorio remoto.

### ~/go-htmx-crud
```bash
go mod init github.com/agustfricke/go-htmx-crud
```

