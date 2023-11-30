---
title: Fiber JWT Authentication
description: Fiber JWT Authentication
layout: ../../layouts/docs.astro
lang: en
---

## Getting Started

In this extensive guide, you will gain insights into the process of incorporating
JWT (JSON Web Token) authentication into a Golang application,
leveraging GORM alongside the Fiber web framework. Powering the REST API will be a
robust Fiber HTTP server, delivering specialized endpoints for secure user authentication and data
persistence in a PostgreSQL database.

## Setup

To begin, let's create a folder with the name fiber-jwt-auth and get inside.

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
[**godotenv**](https://github.com/joho/godotenv), [**gorm**](https://gorm.io/docs/) package.

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

Now, let's create a folder called **models**, and within the **models** folder, create a file named **user.go**. We do this to define the structure of the entity called **User**, which we will use to interact with the database.

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
We then specify that each user will have a **Name** field of type string.
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
	DB.AutoMigrate(&models.User{})
	fmt.Println("Database Migrated")
}
```

In the **ConnectDB** function, we connect to the database using the dsn variable, obtaining the credentials through the **Config**
function, and then perform migrations with the **User model**.

Now, let's create the **main.go** file, which will be the entry point where all our code will run.
We'll connect to the database by calling the **ConnectDB()** function, set up **cors**,
and create a server on **port 8000** using the **fiber**,

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

## Sign up

Now let's create a new folder called handlers, and inside it, create a new file called auth.go.

```bash
mkdir ~/fiber-jwt-auth/handlers
touch ~/fiber-jwt-auth/handlers/auth.go
```

#### ~/fiber-jwt-auth/handlers/auth.go

```go
package handlers

import (
	"strings"

	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/agustfricke/fiber-jwt-auth/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *fiber.Ctx) error {
	var payload *models.SignUpInput
	db := database.DB

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	newUser := models.User{
		Name:     payload.Name,
		Email:    strings.ToLower(payload.Email),
		Password: string(hashedPassword),
	}

	result := db.Create(&newUser)

	if result.Error != nil && strings.Contains(result.Error.Error(), "duplicate key value violates unique") {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"status": "fail", "message": "User with that email already exists"})
	} else if result.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "error", "message": "Something bad happened"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "data": fiber.Map{"user": &newUser}})
}
```

Now let's create a new route for this function by creating a new folder with a new file inside.

```bash
mkdir ~/fiber-jwt-auth/router
touch ~/fiber-jwt-auth/router/router.go
```

Inside this file, let's put the following code:

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/signup", handlers.SignUp)
}
```

Now we can update the **main.go**.

#### ~/fiber-jwt-auth/main.go

```go
package main

import (
	"log"

	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/agustfricke/fiber-jwt-auth/router" // New!
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.ConnectDB()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET, POST, PUT, DELETE",
		AllowCredentials: true,
		AllowHeaders:     "Origin, Content-Type, Accept",
	}))

	router.SetupRoutes(app) // New!

	log.Fatal(app.Listen(":8000"))
}
```

Let's test if we can create a new user.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/signup/
```

Your code appears to be ready for testing now.

## Sign In

Now let's create a function to log in a new user.

#### ~/fiber-jwt-auth/handlers/auth.go

```go
package handlers

import (
	"fmt"
	"strings"
	"time"

	"github.com/agustfricke/fiber-jwt-auth/config"
	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/agustfricke/fiber-jwt-auth/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func SignIn(c *fiber.Ctx) error {
	var payload *models.SignInInput
	db := database.DB

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	var user models.User
	result := db.First(&user, "email = ?", strings.ToLower(payload.Email))
	if result.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": "Invalid email or Password"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": "Invalid email or Password"})
	}

	tokenByte := jwt.New(jwt.SigningMethodHS256)

	now := time.Now().UTC()
	claims := tokenByte.Claims.(jwt.MapClaims)
	expDuration := time.Hour * 24

	claims["sub"] = user.ID
	claims["exp"] = now.Add(expDuration).Unix()
	claims["iat"] = now.Unix()
	claims["nbf"] = now.Unix()

	tokenString, err := tokenByte.SignedString([]byte(config.Config("SECRET_KEY")))

	if err != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": fmt.Sprintf("generating JWT Token failed: %v", err)})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    tokenString,
		Path:     "/",
		MaxAge:   60 * 60,
		Secure:   false,
		HTTPOnly: true,
		Domain:   "localhost",
	})

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "token": tokenString})
}
```

The **SignIn** function handles user authentication in a web application using the Fiber framework for Go.
It performs the following tasks:

-   Parses the **HTTP** request body to obtain a payload object with login information.
-   Searches for a user in the database by their email address.
-   Compares the password provided in the payload with the password stored in the database using bcrypt.
-   If authentication is successful, it generates a **JSON Web Token (JWT)** containing user information and an expiration date.
-   Stores the JWT token in an **HTTP response cookie**.
-   Returns an HTTP response with the JWT token if authentication is successful or an error message if it fails.

Now we can create the route for this endpoint.

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    app.Post("/signup", handlers.SignUp)
    app.Post("/signin", handlers.SignIn) // New!
}
```

Now we can test this endpoint, rebuild the code to apply the changes.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/signin/
```

This should return a JWT token. Save it.

## Logout

Now let's create a new endpoint to log out our users.

#### ~/fiber-jwt-auth/handlers/auth.go

```go
func Logout(c *fiber.Ctx) error {
	expired := time.Now().Add(-time.Hour * 24)
	c.Cookie(&fiber.Cookie{
		Name:    "token",
		Value:   "",
		Expires: expired,
	})
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success"})
}
```

This Go code defines a function called Logout that handles user logout in a Fiber web framework application.
It expires a user's authentication token cookie, sets it to an empty value, and sends a JSON response
indicating a successful logout. The cookie's expiration time is set to 24 hours in the past to effectively invalidate it.

Let's create the route.

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    app.Post("/signup", handlers.SignUp)
    app.Post("/signin", handlers.SignIn)
    app.Get("/logout", handlers.Logout) // New!
}
```

Let's test this endpoint; remember you need to rebuild the code to apply the changes.

```bash
curl -X GET -H "Authorization: Bearer YOUR_JWT_TOKEN" http://127.0.0.1:8000/logout
```

## Middleware

Now let's create a middleware.

```bash
mkdir ~/fiber-jwt-auth/middleware
touch ~/fiber-jwt-auth/middleware/auth.go
```

#### ~/fiber-jwt-auth/middleware/auth.go

```go
package middleware

import (
	"fmt"
	"strings"

	"github.com/agustfricke/fiber-jwt-auth/config"
	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/agustfricke/fiber-jwt-auth/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func DeserializeUser(c *fiber.Ctx) error {
	var tokenString string
	authorization := c.Get("Authorization")

	if strings.HasPrefix(authorization, "Bearer ") {
		tokenString = strings.TrimPrefix(authorization, "Bearer ")
	} else if c.Cookies("token") != "" {
		tokenString = c.Cookies("token")
	}

	if tokenString == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "You are not logged in"})
	}

	tokenByte, err := jwt.Parse(tokenString, func(jwtToken *jwt.Token) (interface{}, error) {
		if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %s", jwtToken.Header["alg"])
		}

    return []byte(config.Config("SECRET_KEY")), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": fmt.Sprintf("invalidate token: %v", err)})
	}

	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "invalid token claim"})

	}

	var user models.User
  db := database.DB
	db.First(&user, "id = ?", fmt.Sprint(claims["sub"]))

	if float64(user.ID) != claims["sub"] {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "the user belonging to this token no longer exists"})
	}

	c.Locals("user", &user)

	return c.Next()
}
```

This code defines a middleware function called DeserializeUser in a Go application using the Fiber framework.
This middleware is responsible for decoding and validating JWT (JSON Web Token) tokens from incoming requests.
It extracts the token from the request's Authorization header or cookies, validates it, and if valid,
it retrieves the corresponding user information from a database and stores it in the Fiber context's locals.
If the token is invalid or expired, it returns an appropriate error response.

## My User

Now let's create a new endpoint to show our authenticated user.

```bash
touch ~/fiber-jwt-auth/handlers/user.go
```

#### ~/fiber-jwt-auth/handlers/user.go

```go
package handlers

import (
	"github.com/agustfricke/fiber-jwt-auth/models"
	"github.com/gofiber/fiber/v2"
)

func GetMe(c *fiber.Ctx) error {
	user := c.Locals("user").(*models.User)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "data": fiber.Map{"user": user}})
}
```

This function retrieves the user object stored in the Fiber context's locals and responds with a JSON
representation of the user along with a success status code (200 OK).

Now let's create the route for this endpoint.

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/agustfricke/fiber-jwt-auth/middleware" // New!
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    app.Post("/signup", handlers.SignUp)
    app.Post("/signin", handlers.SignIn)
    app.Get("/logout", handlers.Logout)
    app.Get("/me",  middleware.DeserializeUser ,handlers.GetMe) // New
}
```

This GET request is made to the "/me" endpoint; Fiber will first run the DeserializeUser middleware to validate
the user's JWT token and store user information in the context. Then, it will execute the GetMe handler function
to respond with the user's data if the token is valid.

Let's test this endpoint; make sure you have a valid token.

```bash
curl -X GET -H "Authorization: Bearer YOUR_JWT_TOKEN" http://127.0.0.1:8000/me
```
