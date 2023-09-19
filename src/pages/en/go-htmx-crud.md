---
title: Go htmx CRUD
description: How to build a CRUD app with Go and HTMX
layout: ../../layouts/docs.astro
lang: en
---

## Nuestras herramientas

En este tutorial vamos a estar creando una app con [**Go**](https://go.dev/), [**htmx**](https://go.dev/)
[**Tailwind CSS**](https://tailwindcss.com/) y [**Postgres**](https://www.postgresql.org/) junto con
[**Docker**](https://www.docker.com/) para hacer un simple CRUD (crear, leer, actualizar y destruir).

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
permiten organizar las dependencias de manera efectiva, lo que facilita la
colaboración en proyectos y garantiza que el código sea reproducible en
diferentes entornos.

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

## Configurar Postgres con Docker y Go

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

Ahora vamos a crear una funcion para leer las credenciales del archivo .env, para ello vamos a crear una carpeta llamada config
y dentro de config vamos a crear un archivo llamado config.go

```bash
mkdir ~/go-htmx-crud/config
touch ~/go-htmx-crud/config/config.go
```

#### ~/go-htmx-crud/config/config.go

```go
package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func Config(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}
	return os.Getenv(key)
}
```

Esta funcion recibe como paramentro un key y retornar el valor de ese key,
como por ejemplo si pasamos **DB_HOST** como key este nos devolvera **localhost**.

Perfecto, ahora vamos a crear una carpeta llamada models y dentro de models vamos a crear un archivo llamado task.go,
Hacemos esto para definir la estructura de llamada Task, que vamos a utilizar para interactuar con la base de datos.

```bash
mkdir ~/go-htmx-crud/models
touch ~/go-htmx-crud/models/task.go
```

#### ~/go-htmx-crud/models/task.go

```go
package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	Name    string
}
```

Aqui definimos el struct Task que tiene gorm.Model este nos va a dar campos extra como ID, CreatedAt, UpdatedAt, y DeletedAt,
y luego le ponemos que cada tarea tenga un Name de type string

Perfecto, ahora vamos a crear una carpeta llamada database y dentro de database vamos a crear 2 archivos, uno database.go
y el otro connect.go

```bash
mkdir ~/go-htmx-crud/database
touch ~/go-htmx-crud/database/database.go
touch ~/go-htmx-crud/database/connect.go
```

En database.go vamos a declarar una variable global llamada DB que es un puntero a un objeto gorm.DB,
que vamos a estar utilizando para mantener una instancia de la base de datos y nos va a permitir realizar
operaciones de base de datos en toda la aplicación.

#### ~/go-htmx-crud/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

El archivo connect.go lo vamos a utilizar para conectarnos a la base de datos.

#### ~/go-htmx-crud/database/connect.go

```go
package database

import (
	"fmt"
	"strconv"

	"github.com/agustfricke/go-htmx-crud/config"
	"github.com/agustfricke/go-htmx-crud/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectDB() {
	var err error
	p := config.Config("DB_PORT")
	port, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		panic("failed to parse database port")
	}
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
	config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"),
	config.Config("DB_NAME"))
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Connection Opened to Database")
	DB.AutoMigrate(&models.Task{})
	fmt.Println("Database Migrated")
}
```

En la funcion **ConnectDB** nos estamos conectado a la base de datos usando la variable **dsn**, obteniendo las credenciales
gracias a la funcion **Config()** y luego la migramos con el modelo Task.

Ahora vamos a crear el arhivo main.go, que es el punto de entrada donde todo nuestro codigo se va a ejecutar,
Vamos a conectarnos a la base de datos llamando a la funcion **ConnectDB()**, configuramos los archivos estaticos y
creamos un servidor en el puerto 8000 con el paquete **net/http**

```bash
touch ~/go-htmx-crud/main.go
```

#### ~/go-htmx-crud/main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
)

func main() {
    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

	fmt.Println("Runnning in port 8000")
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

### Archivos estaticos

Ahora vamos a crear la carpeta **public**, esta va a mantener los archivos estatics (JavaScript y CSS)

```bash
mkdir ~/go-htmx-crud/public
```

Una vez con este nuevo directorio vamos a instalar **htmx**

```bash
wget https://unpkg.com/htmx.org@1.9.5/dist/htmx.min.js -P ~/go-htmx-crud/public/
```

Perfecto, ahora configuremos **Tailwind CSS**

```bash
npm install -D tailwindcss
npx tailwindcss init
```

#### ~/go-htmx-crud/tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/*.html"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

Creemos el archivo input.css dentro de public

```bash
touch input.css
```

#### ~/go-htmx-crud/public/input.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Ahora abre una nueva shell y pon el siguiente comando:

```bash
npx tailwindcss -i ./public/input.css -o ./public/output.css --watch
```

### Home page

Creemos el home page.

```bash
mkdir ~/go-htmx-crud/templates/index.html
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
        <link rel="stylesheet" href="public/output.css" />

        <title>HTMX & Go</title>
    </head>

    <body class="container mx-auto px-[300px]">
        <form class="mt-11">
            <div class="flex justify-between gap-2">
                <input
                    type="text"
                    class="rounded-lg focus:border-gray-700 focus:outline-none text-slate-200 w-full p-2.5 bg-gray-700"
                    placeholder="Name"
                />
                <button
                    class="rounded-lg bg-gray-700 flex justify-between hover:bg-gray-900 py-4 px-8 text-sm capitalize text-white shadow"
                >
                    <span> Create </span>
                    <div role="status" class="spinner text-white">
                        <svg
                            aria-hidden="true"
                            class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                </button>
            </div>
        </form>

        <div class="mt-2">
            <div class="text-slate-200">
                <div class="flex justify-center">
                    <div
                        class="w-[300px] mb-2 border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700"
                    >
                        <div class="flex flex-col items-center py-2">
                            <span
                                class="font-poppis text-gray-500 dark:text-gray-400"
                            >
                                Task name
                            </span>
                            <div class="flex jusitfy-between mt-2">
                                <button
                                    class="mr-2 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                >
                                    Edit
                                </button>

                                <div class="flex justify-between">
                                    <button
                                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                    >
                                        Delete

                                        <div role="status" class="spinner">
                                            <svg
                                                aria-hidden="true"
                                                class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
```

## Crear tareas

Para crear nuevas tareas debemos crear el archivo **handlers.go**.

```bash
mkdir ~/go-htmx-crud/handlers
touch ~/go-htmx-crud/handlers/handlers.go
```

Aqui vamos a definir el paquete handlers, la funcion CreateTask va a tener un **time.Sleep** que va a relentizar
la peticion 3 segundos, para poder ver el spinner, despues agarramos el valor **name** desde el formulario, creamos la tarea si
el campo name es diferente a un string vacio, si es exitosio vamos a retornar **item.html** con la tarea recien creada, si el string esta vacio
vamos a retornar error.html para indicar que no se puede crear una tarea sin nombre.

#### ~/go-htmx-crud/handlers/handler.go

```go
package handlers

import (
	"fmt"
	"html/template"
	"net/http"
	"time"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/models"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
	time.Sleep(3 * time.Second)
	name := r.PostFormValue("name")

    var task models.Task
    if name != "" {
        db := database.DB
        task = models.Task{Name: name}
        db.Create(&task)

	    tmpl := template.Must(template.ParseFiles("templates/item.html"))
	    err :=  tmpl.Execute(w, task)
	    if err != nil {
		    http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
	    }
    } else {
	    tmpl := template.Must(template.ParseFiles("templates/error.html"))
        error := "No se puede crear una tarea vacia"
	    err :=  tmpl.Execute(w, error)
	    if err != nil {
		    http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
	    }
    }
}
```

## Obtener tareas

Ahora creemos la funcion para obtener todas las tareas, y pasando la variable tasks con todas las tareas
a el archivo index.html

#### ~/go-htmx-crud/handlers/handler.go

```go
func GetTasks(w http.ResponseWriter, r *http.Request) {
    db := database.DB
	var tasks []models.Task
	db.Find(&tasks)

	tmpl := template.Must(template.ParseFiles("templates/index.html"))

	err := tmpl.Execute(w, tasks)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	    return
	}
}
```

## Routes

Creemos las rutas para crear y obtener las tareas.

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/handlers" // Aqui!
)


func main() {

    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/add/", handlers.CreateTask) // Aqui!
    http.HandleFunc("/", handlers.GetTasks) // Aqui!

	fmt.Println("Runnning in port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

## Templates para el post request

Creemos el archivo item.html y error.html para crear nuevas tareas

```bash
touch ~/go-htmx-crud/templates/item.html
touch ~/go-htmx-crud/templates/error.html
```

#### ~/go-htmx-crud/templates/item.html

```html
<div class="text-slate-200" id="item-{{ .ID }}">
    <div class="flex justify-center">
        <div
            class="w-[300px] mb-2 border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700"
        >
            <div class="flex flex-col items-center py-2">
                <span class="font-poppis text-gray-500 dark:text-gray-400">
                    {{ .Name }} - {{ .ID }}
                </span>
                <div class="flex jusitfy-between mt-2">
                    <button
                        hx-get="/edit/form?name={{ .Name }}&ID={{ .ID }}"
                        hx-target="#item-{{ .ID }}"
                        class="mr-2 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                        Edit
                    </button>

                    <div class="flex justify-between">
                        <button
                            hx-delete="/delete/{{ .ID }}"
                            hx-swap="delete"
                            hx-target="#item-{{ .ID }}"
                            hx-indicator="#spinner-delete-{{ .ID }}"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                        >
                            Delete

                            <div
                                role="status"
                                id="spinner-delete-{{ .ID }}"
                                class="spinner"
                            >
                                <svg
                                    aria-hidden="true"
                                    class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

```html
<div
    id="alert"
    class="flex items-center mb-4 rounded-lg bg-gray-800 text-red-400"
    role="alert"
>
    <svg
        class="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
    </svg>
    <span class="sr-only">Info</span>
    <div class="ml-3 text-sm font-medium">{{ .error }}</div>
    <button
        hx-get=""
        hx-swap="delete"
        hx-target="#alert"
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
        data-dismiss-target="#alert-2"
        aria-label="Close"
    >
        <span class="sr-only">Close</span>
        <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
        </svg>
    </button>
</div>
```

Ahora hagamos unos ajustes en index.html para que todo funcione correctamente, vamos a agregar atributros de **htmx**,
al formulario y botones para poder hacer las peticiones http, vamos a poner un name al input, un id donde se
mapean todas las tareas para poder hacer un swap al hacer la peticion post, luego donde van las tareas vamos a
poner un **{{ .range }}** para mapear todas las tareas y por ultimo vamos a agregar unos estilos
para ocultar los spinner si no se esta haciendo ninguna peticion.

#### ~/go-htmx-crud/templates/index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="public/htmx.js"></script>
        <link rel="stylesheet" href="public/output.css" />

        <title>HTMX & Go</title>
    </head>

    <style>
        .spinner {
            display: none;
        }
        .htmx-request .spinner {
            display: inline;
        }
        .htmx-request.spinner {
            display: inline;
        }
    </style>

    <body class="container mx-auto px-[300px]">
        <form
            id="task-form"
            hx-post="/add/"
            hx-target="#task-list"
            hx-swap="beforeend"
            hx-indicator="#spinner"
            class="mt-11"
        >
            <div class="flex justify-between gap-2">
                <input
                    type="text"
                    name="name"
                    id="name"
                    class="rounded-lg focus:border-gray-700 focus:outline-none text-slate-200 w-full p-2.5 bg-gray-700"
                    placeholder="Name"
                />
                <button
                    class="rounded-lg bg-gray-700 flex justify-between hover:bg-gray-900 py-4 px-8 text-sm capitalize text-white shadow"
                >
                    <span> Create </span>
                    <div role="status" id="spinner" class="spinner text-white">
                        <svg
                            aria-hidden="true"
                            class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                    </div>
                </button>
            </div>
        </form>

        <div id="task-list" class="mt-2">
            {{ range . }}
            <div class="text-slate-200" id="item-{{ .ID }}">
                <div class="flex justify-center">
                    <div
                        class="w-[300px] mb-2 border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700"
                    >
                        <div class="flex flex-col items-center py-2">
                            <span
                                class="font-poppis text-gray-500 dark:text-gray-400"
                            >
                                {{ .Name }} - {{ .ID }}
                            </span>
                            <div class="flex jusitfy-between mt-2">
                                <button
                                    hx-get="/edit/form?name={{ .Name }}&ID={{ .ID }}"
                                    hx-target="#item-{{ .ID }}"
                                    class="mr-2 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                >
                                    Edit
                                </button>

                                <div class="flex justify-between">
                                    <button
                                        hx-delete="/delete/{{ .ID }}"
                                        hx-swap="delete"
                                        hx-target="#item-{{ .ID }}"
                                        hx-indicator="#spinner-delete-{{ .ID }}"
                                        class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                    >
                                        Delete

                                        <div
                                            role="status"
                                            id="spinner-delete-{{ .ID }}"
                                            class="spinner"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {{ end }}
        </div>
    </body>
</html>
```

Okey perfecto podemos volver a compilar el codigo e ir a **http://127.0.0.1:8000**

```bash
go run ~/go-htmx-crud/main.go
```

## Editar tareas

Creemos 2 nuevas funciones, la primera para obtener el formulario y la segunda para hacer el put request en si.

```go
func FormEditTask(w http.ResponseWriter, r *http.Request) {
        name := r.URL.Query().Get("name")
        ID := r.URL.Query().Get("ID")
	    data := struct {ID string; Name string}{ID: ID, Name: name}

	    tmpl := template.Must(template.ParseFiles("templates/edit.html"))
	    err :=  tmpl.Execute(w, data)
	    if err != nil {
		    http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
	    }
    }

func EditTask(w http.ResponseWriter, r *http.Request) {
		time.Sleep(1 * time.Second)

        name := r.PostFormValue("name")
        ID := r.PostFormValue("ID")
        db := database.DB

        var task models.Task

        if err := db.First(&task, ID).Error; err != nil {
	        tmpl := template.Must(template.ParseFiles("templates/error.html"))
	        err :=  tmpl.Execute(w, err)
	        if err != nil {
		        http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
        }

        task.Name = name

        if err := db.Save(&task).Error; err != nil {
	        tmpl := template.Must(template.ParseFiles("templates/error.html"))
	        err :=  tmpl.Execute(w, err)
	        if err != nil {
		        http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
        }

	    data := struct {Task models.Task}{Task: task}

	    tmpl := template.Must(template.ParseFiles("templates/item.html"))
	    err :=  tmpl.Execute(w, data)
	    if err != nil {
		    http.Error(w, err.Error(), http.StatusInternalServerError)
		    return
	    }
	}
```

Perfecto ahora creemos las routas.

#### ~/go-htmx-crud/main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/handlers"
)


func main() {

    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/add/", handlers.CreateTask)
	http.HandleFunc("/edit/form/", handlers.FormEditTask) // Aqui!
	http.HandleFunc("/put", handlers.EditTask) // Aqui!
    http.HandleFunc("/", handlers.GetTasks)

	fmt.Println("Runnning in port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

Ahora creemos el archivos edit.html que es el formuilario para editar las tareas.

```bash
touch ~/go-htmx-crud/templates/edit.html
```

#### ~/go-htmx-crud/templates/edit.htmlgo

```html
<form hx-put="/put" hx-indicator="#spinner-{{ .ID }}">
    <ul class="" id="task-list">
        <li class="text-slate-200">
            <div class="flex justify-center">
                <div
                    class="w-[300px] mb-2 border border-gray-200 rounded-lg shadow bg-gray-800 border-gray-700"
                >
                    <div class="flex flex-col items-center py-2">
                        <span
                            class="flex m-1 justify-between font-poppis text-gray-500 dark:text-gray-400"
                        >
                            <input
                                required
                                value="{{ .Name }}"
                                type="text"
                                name="name"
                                class="rounded-lg block text-slate-200 w-full p-2.5 bg-gray-700"
                                placeholder="Name"
                            />
                            <input
                                type="text"
                                hidden
                                name="ID"
                                value="{{ .ID }}"
                            />
                            <button
                                type="submit"
                                class="ml-2 inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                            >
                                Save

                                <div
                                    role="status"
                                    class="spinner ml-2 text-white"
                                    id="spinner-{{ .ID }}"
                                >
                                    <svg
                                        aria-hidden="true"
                                        class="w-5 h-5 ml-2 text-black animate-spin fill-slate-200"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                </div>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </li>
    </ul>
</form>
```

Okey perfecto ahora podemos volver a compilar el codigo

```bash
go run ~/go-htmx-crud/main.go
```

## Eliminar tareas

Ahora para eliminar tareas debemos crear una nueva funcion en handler.go, podemos hacer un check de si el id
viene en la url, si no es asi podemos retornar un status de bad request.

```go
func DeleteTask(w http.ResponseWriter, r *http.Request) {
    time.Sleep(1 * time.Second)

    parts := strings.Split(r.URL.Path, "/")
    if len(parts) != 3 {
        http.Error(w, "Invalid URL", http.StatusBadRequest)
        return
    }
    ID := parts[2]

    db := database.DB

    var task models.Task
    db.First(&task, ID)
    db.Delete(&task)
}
```

Ahora como siempre, creemos la ruta para manejar al solicitud.

#### ~/go-htmx-crud/main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/handlers"
)


func main() {

    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

	http.HandleFunc("/add/", handlers.CreateTask)
	http.HandleFunc("/delete/", handlers.DeleteTask) // Aqui!
	http.HandleFunc("/edit/form/", handlers.FormEditTask)
	http.HandleFunc("/put", handlers.EditTask)
    http.HandleFunc("/", handlers.GetTasks)

	fmt.Println("Runnning in port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

Okey perfecto ahora podemos volver a compilar el codigo

```bash
go run ~/go-htmx-crud/main.go
```

Eso fue todo por este tutorial, recuerda que tienes el [**GitHub Repo**](https://github.com/agustfricke/go-htmx-crud/)
