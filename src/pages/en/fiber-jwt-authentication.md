---
title: Fiber JWT authentication
description: Fiber JWT authentication
layout: ../../layouts/docs.astro
lang: en
---

## Getting Started

In this extensive guide, you will gain insights on the process of incorporating
JWT (JSON Web Token) authentication into a Golang application,
leveraging GORM alongside the Fiber web framework. Powering the REST API will be a
robust Fiber HTTP server, delivering specialized endpoints for secure user authentication and data
persistence in a PostgreSQL database.

## Setup

To begin, lets create a folder with the name fiber-jwt-auth and get inside.

```bash
mkdir ~/fiber-jwt-auth
cd ~/fiber-jwt-auth
```

Once inside the folder, let's create a new module with Go.
Modules are used to manage a project's dependencies and
enable effective organization of dependencies, making it
easier to collaborate on projects and ensure code reproducibility
across different environments.

To create a new module with Go, we need to use the **go mod init module-name** command,
where the **module-name** is typically the URL of a remote repository.

#### ~/fiber-jwt-auth

```bash
go mod init github.com/agustfricke/fiber-jwt-auth
```

Once the module is created, we'll install the [**fiber**](https://docs.gofiber.io/)
p[**godotenv**](https://github.com/joho/godotenv), [**gorm**](https://gorm.io/docs/) ackage.

#### ~/fiber-jwt-auth

```bash
go get github.com/joho/godotenv
go get github.com/gofiber/fiber/v2
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

## Configuring Postgres with Docker and Go

Let's create a new Postgres database using Docker with the following command:

```bash
sudo docker run --name postgres_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=super_db -p 5432:5432 -d postgres
```

Once the database is created, we can generate a new file called **.env** in the root of our project, which will contain the database credentials.

#### ~/fiber-jwt-auth/.env

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=super_db
```

Now, let's create a function to read the credentials from the **.env** file. To do this, create a folder called **config**, and within the **config** folder, create a file named **config.go**.

```bash
mkdir ~/fiber-jwt-auth/config
touch ~/fiber-jwt-auth/config/config.go
```

#### ~/fiber-jwt-auth/config/config.go

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

This function takes a key as a parameter and returns the associated value. For example, if we pass **DB_HOST** as the key, it will return **localhost**.

Now, let's create a folder called **models**, and within the **models** folder, create a file named **task.go**. We do this to define the structure of the entity called **Task**, which we will use to interact with the database.

```bash
mkdir ~/fiber-jwt-auth/models
touch ~/fiber-jwt-auth/models/user.go
```

#### ~/fiber-jwt-auth/models/user.go

```go
package models

import "gorm.io/gorm"

type User struct {
  gorm.Model
	Name      string     `gorm:"type:varchar(100);not null"`
	Email     string     `gorm:"type:varchar(100);uniqueIndex;not null"`
	Password  string     `gorm:"type:varchar(100);not null"`
}

type SignUpInput struct {
	Name            string `json:"name" validate:"required"`
	Email           string `json:"email" validate:"required"`
	Password        string `json:"password" validate:"required,min=8"`
}

type SignInInput struct {
	Email    string `json:"email"  validate:"required"`
	Password string `json:"password"  validate:"required"`
}
```

Here, we define the **User** structure, which includes **gorm.Model**.
This provides additional fields such as **ID, CreatedAt, UpdatedAt, and DeletedAt**.
We then specify that each task will have a **Name** field of type string.
Then we have 2 more structs, SignInInput for the login and then SignUpInput for the register.

Now, let's create a folder called **database**. Inside the **database** folder, create two files: **database.go** and **connect.go**.

```bash
mkdir ~/fiber-jwt-auth/database
touch ~/fiber-jwt-auth/database/database.go
touch ~/fiber-jwt-auth/database/connect.go
```

In **database.go**, we will declare a global variable named **DB**, which will be a pointer to a gorm.DB object. We will use this variable to maintain a database instance and perform database operations throughout the application.

#### ~/fiber-jwt-auth/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

We will use the **connect.go** file to establish a connection to the database.

#### ~/fiber-jwt-auth/database/connect.go

```go
package database

import (
	"fmt"
	"strconv"

	"github.com/agustfricke/fiber-jwt-auth/config"
	"github.com/agustfricke/fiber-jwt-auth/models"
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

In the **ConnectDB** function, we connect to the database using the dsn variable, obtaining the credentials through the **Config** function, and then perform migrations with the **Task model**.

Now, let's create the **main.go** file, which will be the entry point where all our code will run. We'll connect to the database by calling the **ConnectDB()** function, set up static files, and create a server on **port 8000** using the **net/http** package.

```bash
touch ~/fiber-jwt-auth/main.go
```

#### ~/fiber-jwt-auth/main.go

```go
package main

import (
	"log"

	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
  database.ConnectDB()

  app := fiber.New()

  app.Use(cors.New(cors.Config{
      AllowOrigins: "http://localhost:5173",
      AllowMethods: "GET, POST",
      AllowCredentials: true,
      AllowHeaders: "Origin, Content-Type, Accept",
  }))

  log.Fatal(app.Listen(":8000"))
}
```

Now, you can run your Go code with the following command:

```bash
go run ~/fiber-jwt-auth/main.go
```
