---
title: GO HTMX CRUD
description: CRUD app con HTMX y Go!
layout: ../../layouts/docs.astro
lang: es
---

## Nuestras herramientas

En este tutorial vamos a estar creando una app con [**Go**](https://go.dev/), [**htmx**](https://go.dev/)
y [**Postgres**](https://www.postgresql.org/) junto con [**Docker**](https://www.docker.com/) para hacer un
simple CRUD (crear, leer, actualizar y destruir).

## Configuracion del proyecto

En una nueva terminal vamos a crear un nuevo directorio llamado **go-htmx-crud**
con el comando **mkdir** y nos vamos a meter dentro de el
con el comando **cd**.

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

## Instalar las dependencias

Una vez creado el módulo, vamos a instalar las dependecias, que van a ser [**godotenv**](https://github.com/joho/godotenv),
[**GORM**](https://gorm.io/docs/) y el driver de [**Postgres**](https://gorm.io/docs/connecting_to_the_database.html#PostgreSQL),
asi que vamos a poner los siguientes comandos en nuestra shell:

#### ~/go-htmx-crud

```bash
go get github.com/joho/godotenv
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

## Configurar Postgres con Docker y Go

Creemos una nueva base de datos Postgres con Docker con el comando:

```bash
sudo docker run --name postgres_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=super_db -p 5432:5432 -d postgres
```

Una vez creada la base de datos, podemos generar un nuevo archivo llamado **.env** en la raíz
de nuestro proyecto, el cual contendrá las credenciales de la base de datos.

#### ~/go-htmx-crud/.env

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=super_db
```

Ahora vamos a crear una función para leer las credenciales del archivo **.env**.
Para ello, crearemos una carpeta llamada **config** y dentro de **config** vamos a crear un archivo llamado **config.go**.

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

Esta función recibe como parámetro una clave y retorna el valor asociado a esa clave.
Por ejemplo, si pasamos **DB_HOST** como clave, nos devolverá **localhost**.

Perfecto, ahora vamos a crear una carpeta llamada **models** y dentro de **models** vamos a crear un archivo
llamado **task.go**. Hacemos esto para definir la estructura de la entidad llamada **Task**, que utilizaremos
para interactuar con la base de datos.

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

Aquí definimos la estructura **Task**, que incluye gorm.Model.
Esto nos proporcionará campos adicionales como **ID, CreatedAt, UpdatedAt y DeletedAt**.
Luego, especificamos que cada tarea tendrá un campo **Name** de tipo string.

Perfecto, ahora vamos a crear una carpeta llamada **database**.
Dentro de **database**, vamos a crear dos archivos: **database.go** y **connect.go**.

```bash
mkdir ~/go-htmx-crud/database
touch ~/go-htmx-crud/database/database.go
touch ~/go-htmx-crud/database/connect.go
```

En **database.go**, declararemos una variable global llamada **DB**, que será un puntero a un objeto gorm.DB.
Utilizaremos esta variable para mantener una instancia de la base de datos y nos permitirá realizar operaciones
de base de datos en toda la aplicación.

#### ~/go-htmx-crud/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

El archivo **connect.go** lo utilizaremos para establecer la conexión con la base de datos.

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

En la función **ConnectDB**, nos conectamos a la base de datos utilizando la variable dsn, obteniendo las
credenciales gracias a la función **Config**, y luego realizamos las migraciones con el **modelo Task**.

Ahora, vamos a crear el archivo **main.go**, que será el punto de entrada donde se ejecutará todo nuestro código.
Nos conectaremos a la base de datos llamando a la función **ConnectDB()**, configuraremos los archivos estáticos y crearemos
un servidor en el **puerto 8000** utilizando el paquete **net/http**.

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

Ahora podemos ejecutar nuestro código en Go con el siguiente comando:

```bash
go run ~/go-htmx-crud/main.go
```

Deberías ver el siguiente resultado

```bash
Database Migrated
Connection Opened to Database
Runnning in port 8000
```

## Archivos estaticos

Ahora vamos a crear la carpeta **public**, esta va a contener los archivos estáticos (JavaScript y CSS).

```bash
mkdir ~/go-htmx-crud/public/htmx.min.js
touch ~/go-htmx-crud/public/main.js
touch ~/go-htmx-crud/public/styles.css
```

Una vez con este nuevo directorio vamos a instalar **htmx**.

```bash
wget https://unpkg.com/htmx.org@1.9.5/dist/htmx.min.js -P ~/go-htmx-crud/public/
```

Ahora pongamos el CSS de nuesta app.

#### ~/go-htmx-crud/public/index.css

```css
body {
    background-color: #1e1e1e;
    color: #ffffff;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

form {
    text-align: center;
    margin-bottom: 20px;
}

input[type="text"] {
    padding: 10px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    background-color: #333333;
    color: #ffffff;
    outline: none;
}

button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    margin: 2px;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    color: #ffffff;
    transition: border-color 0.25s;
}

button:hover {
    border-color: #646cff;
}

button:focus,
button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

Ahora abre una nueva shell y pon el siguiente comando:

## Pagina Home

```bash
mkdir ~/go-htmx-crud/templates/home.html
```

#### ~/go-htmx-crud/templates/home.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="public/index.css" rel="stylesheet" />
        <title>GO HTMX CRUD</title>
    </head>

    <body>
        <form>
            <input type="text" placeholder="Task name" />
            <button type="submit">Submit</button>
        </form>

        <ul>
            <li>
                Task name
                <button type="button">Edit</button>
                <button type="button">Delete</button>
            </li>
        </ul>

        <script src="public/main.js"></script>
        <script src="public/htmx.min.js"></script>
    </body>
</html>
```

## Obtener todas las tareas

Para manejar las peticiones HTTP, vamos a crear un nuevo archivo llamado **task.go** que estará ubicado
dentro del directorio **handlers**

```bash
mkdir ~/go-htmx-crud/handlers/task.go
```

Importamos los paquetes **html/template** y **net/http** para poder trabajar con HTTP y HTML.
Además, importamos los paquetes previamente creados (**database** y **models**).

#### ~/go-htmx-crud/handlers/task.go

```go
package handlers

import (
	"html/template"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/models"
)

func GetTasks(w http.ResponseWriter, r *http.Request) {
    db := database.DB
    var tasks []models.Task

    if err := db.Find(&tasks).Error; err != nil {
        http.Error(w, "Error getting tasks from database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/home.html"))
    if err := tmpl.Execute(w, tasks); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

Básicamente, lo que estamos haciendo aquí es crear la función **GetTasks** que tiene como parámetros **w http.ResponseWriter
y **r http.Request** para poder enviar peticiones **HTTP**. Luego creamos una instancia de la base de datos llamada **db**
y creamos la variable **tasks**, que es de tipo **[]models.Task**. Después, verificamos que no haya ningún error al hacer
la consulta a la base de datos y, por último, definimos que vamos a renderizar el archivo **home.html** que
está dentro del directorio templates. A este archivo le pasamos la variable tasks con todas las tareas.
Por último, verificamos que no tengamos un error al renderizar el template; si hay un error, mandamos un **Internal Server Error\*\*.

Ahora podemos crear la ruta para obtener el archivo home.html en la ruta raiz

#### ~/go-htmx-crud/main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/handlers" // Nuevo !
)


func main() {

    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

    http.HandleFunc("/", handlers.GetTasks) // Nuevo !

	fmt.Println("Runnning in port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

#### ~/go-htmx-crud/templates/home.html

```html
<ul>
    {{ range . }}
    <li>
        {{ .ID }} - {{ .Name }}
        <button type="button">Edit</button>
        <button type="button">Delete</button>
    </li>
    {{ end }}
</ul>
```

Ahora podemos correr el código con el comando:

```bash
go run ~/go-htmx-crud/main.go
```

Si aún no ves ninguna tarea, está bien, aún no hemos creado ninguna.

## Crear tareas

#### ~/go-htmx-crud/main.go

```go
package handlers

import (
	"html/template"
	"net/http"
	"time" // Nuevo !

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/models"
)

func CreateTask(w http.ResponseWriter, r *http.Request) {
    time.Sleep(2 * time.Second)

    name := r.PostFormValue("name")

    if name == "" {
        http.Error(w, "Can't create task without a name", http.StatusBadRequest)
        return
    }

    db := database.DB
    task := models.Task{Name: name}

    if err := db.Create(&task).Error; err != nil {
        http.Error(w, "Error creating task in database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/item.html"))
    if err := tmpl.Execute(w, task); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

Ahora agregemos la ruta en **main.go**.

#### ~/go-htmx-crud/main.go

```go
http.HandleFunc("/add/", handlers.CreateTask)
```

En esta función estamos introduciendo un retraso de 2 segundos para poder observar el estado de carga en acción
mediante el uso de **time.Sleep()**. Luego, estamos capturando el valor del nombre desde el formulario y comprobando
si está vacío. Si es así, respondemos con un **Bad Request**. A continuación, creamos una instancia de la base de datos
y generamos una nueva tarea **(models.Task)** utilizando el nombre proporcionado. Después, intentamos crear
la tarea en la base de datos, y si se produce algún error, respondemos con un error de Internal Server Error.
Finalmente, ejecutamos un nuevo template llamado **item.html**, pasándole la tarea recién creada.
Si ocurre algún error con la plantilla, también respondemos con un error de servidor interno **Internal Server Error**.

#### ~/go-htmx-crud/templates/home.html

```html
<form
    hx-post="/add/"
    hx-target="#task-list"
    hx-swap="beforeend"
    hx-indicator="#spinner"
>
    <input type="text" id="name" name="name" placeholder="Task name" />
    <button type="submit">
        Submit
        <span class="spinner" id="spinner">....</span>
    </button>
</form>
<ul id="task-list">
    <!-- Resto -->
</ul>
```

Como podemos observar en el código de arriba, estamos configurando varios atributos de htmx. Vamos a examinarlos uno por uno:

-   **hx-post="/add/"**: Realizamos una solicitud POST a la ruta "/add/".
-   **hx-target="#task-list"**: Reemplazaremos la respuesta de la función (item.html) con el elemento que tiene el identificador "task-list".
-   **hx-swap="beforeend"**: Insertamos la respuesta como el último hijo del objetivo.
-   **hx-indicator="#spinner"**: Cuando la solicitud esté en proceso, mostraremos el elemento con el identificador "spinner".

## Editar tareas

Ahora creemos la lógica para editar tareas. Para ello, lo primero sería ir a **handlers.go** y declarar 2 funciones:
**FormEditTask** va a ser el template HTML para editar la tarea, luego **EditTask** va a ser
para enviar la petición PUT y editar la tarea en la base de datos.

#### go-htmx-crud/handlers/task.go

```go
func FormEditTask(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    ID := r.URL.Query().Get("ID")

    if ID == "" || name == "" {
        http.Error(w, "ID or Name not found", http.StatusBadRequest)
        return
    }

    data := struct{ ID string; Name string }{ID: ID, Name: name}

    tmpl := template.Must(template.ParseFiles("templates/edit.html"))
    if err := tmpl.Execute(w, data); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}

func EditTask(w http.ResponseWriter, r *http.Request) {
    time.Sleep(2 * time.Second)

    name := r.PostFormValue("name")
    ID := r.URL.Query().Get("ID")

    if ID == "" || name == "" {
        http.Error(w, "ID or Name not found", http.StatusBadRequest)
        return
    }

    db := database.DB

    var task models.Task
    if err := db.First(&task, ID).Error; err != nil {
            http.Error(w, "Task not found", http.StatusNotFound)
            return
    }

    task.Name = name
    if err := db.Save(&task).Error; err != nil {
        http.Error(w, "Error saving task in database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/item.html"))
    if err := tmpl.Execute(w, task); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

-   Esta función **FormEditTask** procesa una solicitud **HTTP** para mostrar un formulario de edición de tareas.
    Extrae los valores **name** e **ID** de la URL de la solicitud, verifica que ambos no estén vacíos y luego carga
    una plantilla HTML llamada **edit.html**, la rellena con los datos y la envía como respuesta al cliente.
    Si hay errores en el proceso, se devuelven respuestas HTTP adecuadas con códigos de estado y mensajes de error.

-   La función **EditTask** procesa una solicitud **HTTP** para editar una tarea. Introduce un retraso de 2 segundos,
    extrae los valores **name** e **ID**, verifica su existencia, busca la tarea en la base de datos,
    actualiza su nombre y la guarda. Luego, carga y muestra una plantilla HTML llamada **item.html** con la tarea modificada.
    En caso de errores, responde con códigos de estado y mensajes de error apropiados.

Ahora agregemos las rutas en **main.go**.

#### ~/go-htmx-crud/main.go

```go
http.HandleFunc("/edit/form/", handlers.FormEditTask)
http.HandleFunc("/put", handlers.EditTask)
```

#### ~/go-htmx-crud/templates/home.html

```html
<li id="item-{{ .ID }}">
    {{ .ID }} - {{ .Name }}
    <button
        hx-target="#item-{{ .ID }}"
        hx-get="/edit/form?name={{ .Name }}&ID={{ .ID }}"
        type="button"
    >
        Edit
    </button>
    <button type="button">Delete</button>
</li>
```

Hacemos una petición **GET** a la ruta **"/edit"** para que nos devuelva el archivo
**edit.html**, especificando un objetivo (target) como **"item-{{ .ID }}"** para reemplazar el elemento **< li >** con
el formulario."

```bash
touch ~/go-htmx-crud/templates/edit.html
```

#### ~/go-htmx-crud/templates/edit.html

```html
<form hx-put="/put?ID={{ .ID }}" hx-indicator="#spinner">
    <input
        type="text"
        value="{{ .Name }}"
        name="name"
        placeholder="Task name"
    />
    <button type="submit">
        Edit
        <span class="spinner" id="spinner">....</span>
    </button>
</form>
```

Mandamos una petición **PUT** con el **ID** y el **Name**, además de asignarle el valor **{{ .Name }}**
para mostrar los datos que ya estaban cargados previamente.

## Eliminar tareas

Vallamos a **handlers/task.go** para definir la función.

#### ~/go-htmx-crud/handlers/task.go

```go
func DeleteTask(w http.ResponseWriter, r *http.Request) {
    time.Sleep(2 * time.Second)

    ID := r.URL.Query().Get("ID")

    if ID == "" {
        http.Error(w, "ID not found", http.StatusBadRequest)
        return
    }

    db := database.DB
    var task models.Task

    if err := db.First(&task, ID).Error; err != nil {
            http.Error(w, "Task not found", http.StatusNotFound)
            return
    }

    if err := db.Delete(&task).Error; err != nil {
        http.Error(w, "Error deleting task from database", http.StatusInternalServerError)
        return
    }
}
```

La función **DeleteTask** procesa una solicitud **HTTP** para eliminar una tarea. Introduce un retraso
de 2 segundos, extrae el valor del **ID**, verifica su existencia, busca la tarea en la base
de datos y la elimina. Si la tarea no se encuentra, responde con un código de estado
**Not Found**. Si hay errores durante el proceso de eliminación, responde con un código
de estado **Internal Server Error**.

#### ~/go-htmx-crud/templates/home.html

```html
<button
    hx-delete="/delete?ID={{ .ID }}"
    hx-swap="delete"
    hx-target="#item-{{ .ID }}"
    hx-indicator="#spinner-delete-{{ .ID }}"
    type="button"
>
    Delete
    <span class="spinner" id="spinner-delete-{{ .ID }}">....</span>
</button>
```

Como vemos en el código de arriba, estamos enviando una petición **DELETE** a la ruta
"delete" junto con un **ID** para saber qué tarea estamos eliminando. Luego, usamos un atributo **hx-swap**
para eliminar el elemento al realizar la petición, y **hx-target** para eliminar todo el **< li >**
que contiene la tarea. Después, le asignamos un **hx-indicator** de **"spinner-delete-{{ .ID }}"** y damos
un ID único al spinner, ya que, de lo contrario, tendríamos el spinner funcionando en cada una de las tareas.

Lo único que nos quedaría por hacer es editar el archivo **templates/item.html** con las nuevas funcionalidades para
eliminar y editar tareas.

#### ~/go-htmx-crud/templates/item.html

```html
<li id="item-{{ .ID }}">
    {{ .ID }} - {{ .Name }}
    <button
        hx-target="#item-{{ .ID }}"
        hx-get="/edit/form?name={{ .Name }}&ID={{ .ID }}"
        type="button"
    >
        Edit
    </button>
    <button
        hx-delete="/delete/{{ .ID }}"
        hx-swap="delete"
        hx-target="#item-{{ .ID }}"
        hx-indicator="#spinner-delete-{{ .ID }}"
        type="button"
    >
        Delete
        <span class="spinner" id="spinner-delete-{{ .ID }}">....</span>
    </button>
</li>
```

## Fin

¡Ok, genial! Gracias por leer hasta aquí. No olvides que tienes el código completo en [**GitHub**](https://github.com/agustfricke/go-htmx-crud). No te olvides de darle una estrella.
