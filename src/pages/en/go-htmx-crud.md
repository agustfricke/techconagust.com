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

En una nueva terminal vamos a crear un nuevo directorio llamado **go-htmx-crud**
con el comando **mkdir** y nos vamos a meter dentro de el
con el comando **cd**

```bash
mkdir ~/go-htmx-crud
cd ~/go-htmx-crud
```

Una vez dentro de la carpeta vamos a crear un nuevo módulo con Go,
los módulos se utilizan para administrar las dependencias de un proyecto y
permiten organizar y versionar las dependencias de manera efectiva, lo que facilita la
colaboración en proyectos y garantiza que el código sea reproducible en diferentes entornos.

Para crear un nuevo modulo con Go debemos poner el comando **go mod init nombre-de-modulo**,
donde esta **nombre-del-modulo** por lo general se le pone la url de un repositorio remoto.

#### ~/go-htmx-crud

```bash
go mod init github.com/agustfricke/go-htmx-crud
```

## Instalar las dependecias

Una vez creado el módulo, vamos a instalar las dependecias, que van a ser [**godotenv**](https://github.com/joho/godotenv),
[**GORM**](https://gorm.io/docs/) y el driver de [**Postgres**](https://gorm.io/docs/connecting_to_the_database.html#PostgreSQL),
asi que vamos a poner los siguientes comandos en nuestra shell:

```bash
go get github.com/joho/godotenv
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

## Setup Postgres con Docker y Go

Creemos una nueva base de datos Postgres con Docker con el comando

```bash
sudo docker run --name postgres_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=super_db -p 5432:5432 -d postgres
```

Una vez creada la base de datos podemos crear un nuevo archivo llamado .env en la raiz de nuestro proyecto, este archivo
va a tener las credenciales de la base de datos.

#### ~/go-htmx-crud/.env

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=super_db
```

Ahora creemos vamos a crear una funcion para leer las credenciales del archivo .env, vamos a crear una carpeta llamada config
y dentro de config vamos a crear un archivo llamado config.go

```bash
mkdir ~/go-htmx-crud/config
touch ~/go-htmx-crud/config/config.go
```

#### ~/go-htmx-crud/config/config.go

```go
// Declaramos el paquete config
package config

// Importamos las dependecias
import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config es una función que carga las variables de entorno desde un archivo .env
// y devuelve el valor correspondiente a la clave proporcionada.
func Config(key string) string {
	// Intenta cargar las variables de entorno desde el archivo .env
	err := godotenv.Load(".env")
	if err != nil {
		// Si se produce un error al cargar el archivo .env, imprime un mensaje de error.
		fmt.Print("Error loading .env file")
	}
	// Devuelve el valor de la variable de entorno correspondiente a la clave proporcionada.
	// Si la clave no existe en las variables de entorno, esta función devolverá una cadena vacía.
	return os.Getenv(key)
}
```

Perfecto, ahora vamos a crear una carpeta llamada models y dentro de models vamos a crear un archivo llamado task.go,
Hacemos esto para definir la estructura de llamada Task, que vamos a utilizar para interactuar con la base de datos.

```bash
mkdir ~/go-htmx-crud/models
touch ~/go-htmx-crud/models/task.go
```

#### ~/go-htmx-crud/models/task.go

```go
// Definimos el packete models
package models

// Importamos GROM.
import "gorm.io/gorm"

// Definimos el struct Task.
type Task struct {
    // Le agregamos gorm.Model, este nos va a dar campos extra como ID, CreatedAt, UpdatedAt, y DeletedAt.
	gorm.Model
    // Ponemos el campo Name que va a ser de tipo string.
	Name    string
}
```

Perfecto, ahora vamos a crear una carpeta llamada database y dentro de database vamos a crear 2 archivos, uno database.go
y el otro connect.go

```bash
mkdir ~/go-htmx-crud/database
touch ~/go-htmx-crud/database/database.go
touch ~/go-htmx-crud/database/connect.go
```

En database.go vamos a declarar una variable global llamada DB que es un puntero a un objeto gorm.DB,
que vamos a estar utilizando para mantener una instancia de la base de datos y nos va a permitir realizar
operaciones de base de datos en toda la aplicación

#### ~/go-htmx-crud/database/database.go

```go
// Definimos el packete database
package database

// importamos GORM
import "gorm.io/gorm"

// Creamos la variable DB
var DB *gorm.DB
```

El archivo connect.go lo vamos a utilizar para conectarnos a la base de datos

#### ~/go-htmx-crud/database/connect.go

```go
// declaramos que este archivo pertenece al paquete database
package database

import (
	"fmt" // Se utiliza para imprimir mensajes en la consola.
	"strconv" // Se usa para convertir una cadena en un número.

	"github.com/agustfricke/go-htmx-crud/config" // Packete config creado anteriormente
	"github.com/agustfricke/go-htmx-crud/models" // Packete models creado anteriormente
	"gorm.io/driver/postgres" //  Proporciona el driver de PostgreSQL para GORM.
	"gorm.io/gorm" // GROM
)

// Definimos la funcion para conectarmos a la base de datos
func ConnectDB() {
    // Se declara una variable err para manejar errores en el código.
	var err error
    // Se obtiene el número de puerto de la base de datos desde la configuración utilizando el paquete config.
	p := config.Config("DB_PORT")
    // Luego, se convierte el puerto de cadena a un número entero sin signo de 32 bits.
	port, err := strconv.ParseUint(p, 10, 32)
    // Se verifica si hubo un error al analizar el puerto. Si ocurrió un error, se muestra un mensaje de error y la aplicación se cierra (pánico).
	if err != nil {
		panic("failed to parse database port")
	}
    // Se construye la cadena de conexión (dsn) necesaria para conectarse a la base de datos PostgreSQL utilizando los valores obtenidos de la configuración.
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
	config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"),
	config.Config("DB_NAME"))
    // Se utiliza GORM para abrir una conexión a la base de datos PostgreSQL utilizando la cadena de conexión dsn y una configuración predeterminada de GORM.
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

    // Se verifica si hubo un error al intentar conectar la base de datos. Si ocurrió un error, se muestra un mensaje de error y la aplicación se cierra (pánico).
	if err != nil {
		panic("failed to connect database")
	}
    // Se imprime un mensaje para indicar que la conexión a la base de datos se ha abierto con éxito.
	fmt.Println("Connection Opened to Database")
    // Se utiliza GORM para realizar la migración automática de modelos de datos. Esto significa que GORM crea las tablas correspondientes en la base de datos si aún no existen. En este caso, se está migrando el modelo Task definido en el paquete models.
	DB.AutoMigrate(&models.Task{})
    // Se imprime un mensaje para indicar que la base de datos se ha migrado con éxito.
	fmt.Println("Database Migrated")
}

```

Ahora vamos a crear el arhivo main.go, que es el punto de entrada donde todo nuestro codigo se va a ejecutar

```bash
touch ~/go-htmx-crud/main.go
```

#### ~/go-htmx-crud/main.go

```go
// Declaramos el packete main
package main

import (
	"fmt" // se utiliza para imprimir mensajes en la consola.
	"log" //  se usa para registrar mensajes y errores.
	"net/http" // proporciona funcionalidades para crear un servidor web HTTP.

	"github.com/agustfricke/go-htmx-crud/database" // Importamos nuestro paquete database
)

// Declaramos la funciona main
func main() {
    // Nos conectamos a la base de datos
    database.ConnectDB()
    // Estas líneas se utilizan para servir archivos estáticos, como archivos CSS, JavaScript y otros recursos, desde el directorio "public". http.FileServer crea un servidor de archivos estáticos y http.Handle registra el servidor de archivos para manejar las solicitudes que coincidan con la URL "/public/". La función http.StripPrefix se utiliza para eliminar el prefijo "/public/" de las rutas de archivo solicitadas.
    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

    // Se imprime un mensaje en la consola indicando que la aplicación se está ejecutando en el puerto 8000.
	fmt.Println("Runnning in port 8000")
    // Esta línea inicia el servidor web HTTP y lo hace escuchar en el puerto 8000. La función http.ListenAndServe toma como argumento el puerto en el que el servidor debe escuchar y un manejador HTTP (nil en este caso, lo que significa que se utilizará el manejador predeterminado). Si ocurre algún error al iniciar el servidor, se registrará como un error fatal y la aplicación se cerrará.
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

Ahora podemos ejecutar nuestro codigo con go con el comando:

```bash
go run ~/go-htmx-crud/main.go
```

Deberias ver el siguiente output:

```bash
Database Migrated
Connection Opened to Database
Runnning in port 8000
```

## Arhchivos estaticos(html, css y javascript)

Ahora vamos a crear las capretas para manejar los archivos esaticos(html, css y javascript)
Los archios html van a estar dentro de una carpeta llamada templates, javasript y css van a estar dentro de public

```bash
mkdir ~/go-htmx-crud/templates
mkdir ~/go-htmx-crud/public
```

Dentro de public vamos a descargar el codigo de htmx y vamos a crear un archivo para el css.

```bash
wget https://unpkg.com/htmx.org@1.9.5/dist/htmx.min.js -P ~/go-htmx-crud/public/
touch ~/go-htmx-crud/public/main.css
```

Dentro de main.css vamos a poner lo siguiente:

#### ~/go-htmx-crud/public/main.css

```css
body {
    background-color: black;
    color: slategray;
}
.button {
    background-color: slategray;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 10px 20px;
    cursor: pointer;
}

.button:hover {
    background-color: #6b7a8b;
}

.spinner {
    display: none;
}
.htmx-request .spinner {
    display: inline;
}
.htmx-request.spinner {
    display: inline;
}
```

Dentro de templates vamos a crear 3 archivos html.

```bash
touch ~/go-htmx-crud/templates/index.html
touch ~/go-htmx-crud/templates/item.html
touch ~/go-htmx-crud/templates/edit.html
```

#### ~/go-htmx-crud/templates/index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="public/htmx.min.js"></script>
        <link rel="stylesheet" href="public/main.css" />
        <title>HTMX & Go</title>
    </head>
    <body>
        <form>
            <div>
                <input required type="text" placeholder="Name" />
                <button>
                    <span>Create</span>
                    <span class="spinner">Loading...</span>
                </button>
            </div>
        </form>
        <div>
            <ul>
                <li>Task name</li>
            </ul>
            <button>Edit</button>
            <button>
                <span>Delete</span>
                <span class="spinner">Loading...</span>
            </button>
        </div>
    </body>
</html>
```

#### ~/go-htmx-crud/templates/item.html

```html
<div>
    <ul>
        <li>Task name</li>
    </ul>
    <button>Edit</button>
    <button>
        <span>Delete</span>
        <span class="spinner">Loading...</span>
    </button>
</div>
```

#### ~/go-htmx-crud/templates/edit.html

```html
<form>
    <div>
        <input required type="text" placeholder="Name" />
        <button>
            <span>edit</span>
            <span class="spinner">Loading...</span>
        </button>
    </div>
</form>
```
