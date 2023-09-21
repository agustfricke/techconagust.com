---
title: GO HTMX CRUD
description: CRUD app con HTMX y Go!
layout: ../../layouts/docs.astro
lang: en
---

## Our Tools

In this tutorial, we will be creating an app using [**Go**](https://go.dev/), [**htmx**](https://go.dev/), and [**Postgres**](https://www.postgresql.org/) along with [**Docker**](https://www.docker.com/) to build a simple CRUD (Create, Read, Update, Delete) application.

## Project Setup

In a new terminal, we will create a new directory called **go-htmx-crud** using the **mkdir** command and navigate into it using the **cd** command.

```bash
mkdir ~/go-htmx-crud
cd ~/go-htmx-crud
```

Once inside the folder, we will create a new module with Go. Modules are used to manage project dependencies and allow for effective organization of dependencies, making it easier to collaborate on projects and ensuring code reproducibility in different environments.

To create a new module with Go, you should use the command **go mod init module-name**, where **module-name** typically takes the URL of a remote repository.

#### ~/go-htmx-crud

```bash
go mod init github.com/agustfricke/go-htmx-crud
```

## Installing Dependencies

Once the module is created, we will install the dependencies, which will be [**godotenv**](https://github.com/joho/godotenv), [**GORM**](https://gorm.io/docs/), and the [**Postgres**](https://gorm.io/docs/connecting_to_the_database.html#PostgreSQL) driver. To do this, execute the following commands in your shell:

#### ~/go-htmx-crud

```bash
go get github.com/joho/godotenv
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

## Setting Up Postgres with Docker and Go

Let's create a new Postgres database with Docker using the following command:

```bash
sudo docker run --name postgres_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=super_db -p 5432:5432 -d postgres
```

Once the database is created, we can generate a new file called **.env** in the root of our project, which will contain the database credentials.

#### ~/go-htmx-crud/.env

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=super_db
```

Now, let's create a function to read the credentials from the **.env** file. To do this, we will create a folder called **config**, and inside the **config** folder, we'll create a file called **config.go**.

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

This function takes a key as a parameter and returns the associated value for that key. For example, if we pass **DB_HOST** as the key, it will return **localhost**.

Great, now let's create a folder called **models**, and inside the **models** folder, we'll create a file called **task.go**. We do this to define the structure of the entity called **Task**, which we will use to interact with the database.

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
	Name string
}
```

Here, we define the **Task** structure, which includes **gorm.Model**. This provides us with additional fields such as **ID, CreatedAt, UpdatedAt, and DeletedAt**. Then, we specify that each task will have a **Name** field of type string.

Perfect, now let's create a folder called **database**. Inside the **database** folder, we'll create two files: **database.go** and **connect.go**.

```bash
mkdir ~/go-htmx-crud/database
touch ~/go-htmx-crud/database/database.go
touch ~/go-htmx-crud/database/connect.go
```

In **database.go**, we will declare a global variable named **DB**, which will be a pointer to a gorm.DB object. We will use this variable to maintain a database instance throughout the application, allowing us to perform database operations throughout the application.

#### ~/go-htmx-crud/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

We will use the **connect.go** file to establish a connection to the database.

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

In the **ConnectDB** function, we connect to the database using the **dsn** variable, obtaining the credentials through the **Config** function, and then perform migrations with the **Task model**.

Now, let's create the **main.go** file, which will be the entry point where all our code will run. We will connect to the database by calling the **ConnectDB()** function, set up static files, and create a server on **port 8000** using the **net/http** package.

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

	fmt.Println("Running on port 8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
```

Now, you can run your Go code with the following command:

```bash
go run ~/go-htmx-crud/main.go
```

You should see the following output:

```bash
Database Migrated
Connection Opened to Database
Running on port 8000
```

Your application is now running on port 8000.

## Static Files

Now, let's create the **public** folder. This folder will contain static files (JavaScript and CSS).

```bash
mkdir ~/go-htmx-crud/public
touch ~/go-htmx-crud/public/htmx.min.js
touch ~/go-htmx-crud/public/main.js
touch ~/go-htmx-crud/public/styles.css
```

With this new directory, we are going to install **htmx**.

```bash
wget https://unpkg.com/htmx.org@1.9.5/dist/htmx.min.js -P ~/go-htmx-crud/public/
```

Now, let's set up the CSS for our app.

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

Now, open a new shell and enter the following command:

## Home Page

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

This is the HTML template for the home page of your Go HTMX CRUD application.

## Get All Tasks

To handle HTTP requests, we will create a new file called **task.go** located within the **handlers** directory.

```bash
mkdir ~/go-htmx-crud/handlers/task.go
```

We import the **html/template** and **net/http** packages to work with HTTP and HTML. Additionally, we import the previously created packages (**database** and **models**).

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
        http.Error(w, "Error getting tasks from the database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/home.html"))
    if err := tmpl.Execute(w, tasks); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

Basically, what we are doing here is creating the **GetTasks** function that takes **w http.ResponseWriter** and **r http.Request** as parameters to handle HTTP requests. Then, we create an instance of the database named **db** and define the **tasks** variable as type **[]models.Task**. After that, we check for any errors when querying the database, and finally, we specify that we will render the **home.html** file located in the templates directory. We pass the **tasks** variable to this file containing all the tasks. Finally, we check for any errors in rendering the template; if there is an error, we return an **Internal Server Error**.

Now, we can create the route to get the home.html file at the root path.

#### ~/go-htmx-crud/main.go

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/agustfricke/go-htmx-crud/database"
	"github.com/agustfricke/go-htmx-crud/handlers" // New!
)


func main() {

    database.ConnectDB()

    fs := http.FileServer(http.Dir("public"))
    http.Handle("/public/", http.StripPrefix("/public/", fs))

    http.HandleFunc("/", handlers.GetTasks) // New!

	fmt.Println("Running on port 8000")
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

Now, you can run the code with the following command:

```bash
go run ~/go-htmx-crud/main.go
```

If you still don't see any tasks, that's okay, we haven't created any yet.

## Create Tasks

#### ~/go-htmx-crud/main.go

```go
package handlers

import (
	"html/template"
	"net/http"
	"time" // New!

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
        http.Error(w, "Error creating task in the database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/item.html"))
    if err := tmpl.Execute(w, task); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

Now, let's add the route in **main.go**.

#### ~/go-htmx-crud/main.go

```go
http.HandleFunc("/add/", handlers.CreateTask)
```

In this function, we introduce a 2-second delay to observe the loading state in action using **time.Sleep()**. Next, we capture the name value from the form and check if it's empty. If it's empty, we respond with a **Bad Request**. Then, we create an instance of the database and generate a new task **(models.Task)** using the provided name. Afterward, we attempt to create the task in the database, and if any error occurs, we respond with an Internal Server Error. Finally, we execute a new template called **item.html**, passing it the newly created task. If there's any error with the template, we also respond with an Internal Server Error.

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
    <!-- Rest of the content -->
</ul>
```

As we can see in the above code, we are configuring various htmx attributes. Let's examine them one by one:

-   **hx-post="/add/"**: We make a POST request to the "/add/" route.
-   **hx-target="#task-list"**: We replace the response from the function (item.html) with the element that has the id "task-list".
-   **hx-swap="beforeend"**: We insert the response as the last child of the target.
-   **hx-indicator="#spinner"**: When the request is in progress, we display the element with the id "spinner".

## Edit Tasks

Now let's create the logic for editing tasks. First, go to **handlers.go** and declare two functions:

**FormEditTask** will be the HTML template for editing the task, and then **EditTask** will be for sending the PUT request and editing the task in the database.

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
        http.Error(w, "Error saving task in the database", http.StatusInternalServerError)
        return
    }

    tmpl := template.Must(template.ParseFiles("templates/item.html"))
    if err := tmpl.Execute(w, task); err != nil {
        http.Error(w, "Render error", http.StatusInternalServerError)
        return
    }
}
```

-   The **FormEditTask** function processes an HTTP request to display an editing form for tasks. It extracts the **name** and **ID** values from the request's URL, verifies that both are not empty, and then loads an HTML template named **edit.html**, populates it with the data, and sends it as a response to the client. If there are errors in the process, appropriate HTTP responses with status codes and error messages are returned.

-   The **EditTask** function processes an HTTP request to edit a task. It introduces a 2-second delay, extracts the **name** and **ID** values, verifies their existence, looks up the task in the database, updates its name, and saves it. Then, it loads and displays an HTML template named **item.html** with the modified task. In case of errors, it responds with appropriate status codes and error messages.

Now let's add the routes in **main.go**.

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

We make a **GET** request to the **"/edit"** route to return the **edit.html** file, specifying a target as **"item-{{ .ID }}"** to replace the **<li>** element with the form.

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

We send a **PUT** request with the **ID** and **Name**, and assign the value **{{ .Name }}** to display the data that was previously loaded.

## Delete Tasks

Let's go to **handlers/task.go** to define the function.

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

The **DeleteTask** function processes an HTTP request to delete a task. It introduces a 2-second delay, extracts the **ID** value, verifies its existence, looks up the task in the database, and deletes it. If the task is not found, it responds with a **Not Found** status code. If there are errors during the deletion process, it responds with an **Internal Server Error** status code.

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

As we can see in the code above, we are sending a **DELETE** request to the "delete" route along with an **ID** to know which task we are deleting. Then, we use an **hx-swap** attribute to delete the element when making the request, and **hx-target** to delete the entire **<li>** that contains the task. Afterward, we assign an **hx-indicator** of **"spinner-delete-{{ .ID }}"** and give a unique ID to the spinner, as otherwise, we would have the spinner working on each of the tasks.

The only thing left to do is to edit the **templates/item.html** file with the new functionalities for deleting and editing tasks.

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

## End

Okay, great! Thank you for reading this far. Don't forget that you have the complete code on [**GitHub**](https://github.com/agustfricke/go-htmx-crud). Don't forget to give it a star.