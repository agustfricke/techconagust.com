---
title: 2FA Fiber
description: Aprender a usar 2FA with Fiber
layout: ../../layouts/docs.astro
lang: en
---

## Empezando

En este tutorial vamos a estar haciendo una aplicacion de autenticacion con de doble factor
junto con el web framework Fiber.

## Setup

Lo primero que vamos a hacer es crear un nuevo directorio para nuestro proyecto y luego vamos
a meterons dentro.

```bash
mkdir ~/2fa-fiber
cd ~/2fa-fiber
```

## Instalar las dependecias

Una vez dentro de la carpeta vamos a crear un nuevo módulo con Go,
los módulos se utilizan para administrar las dependencias de un proyecto y
permiten organizar las dependencias de manera efectiva, lo que facilita la
colaboración en proyectos y garantiza que el código sea reproducible en
diferentes entornos.

Para crear un nuevo modulo con Go debemos poner el comando **go mod init nombre-de-modulo**,
donde esta **nombre-del-modulo** por lo general se le pone la url de un repositorio remoto.

#### ~/2fa-fiber

```bash
go mod init github.com/agustfricke/2fa-fiber
```

## Instalar las dependencias

Una vez creado el módulo, vamos a instalar las dependecias, que van a ser [**godotenv**](https://github.com/joho/godotenv),
[**GORM**](https://gorm.io/docs/) y el driver de [**Sqlite**](https://gorm.io/docs), [**Fiber**](https://docs.gofiber.io/) y
por ultimo [**otp**](https://github.com/pquerna/otp).
asi que vamos a poner los siguientes comandos en nuestra shell:

#### ~/2fa-fiber

```bash
go get github.com/joho/godotenv
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite
go get github.com/gofiber/fiber/v2
go get github.com/pquerna/otp
```

## Variables de entorno

Lo primero que vamos a hacer crear un archivo llamado **.env** y dentro vamos a poner una **SECRET_KEY**
para la firma de verificacion de nuestro **JWT**.

#### ~/2fa-fiber

```bash
touch ~/2fa-fiber/.env
```

```bash
SECRET_KEY="soyunstringmuylargoysecretoparaprotejernuestrojwt"
```

Ahora creemos una funcion para leer esta variable de entorno.

#### ~/2fa-fiber

```bash
mkdir ~/2fa-fiber/config
touch ~/2fa-fiber/config/config.go
```

#### ~/2fa-fiber/config/config.go

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
    fmt.Println("Error loading .env file")
  }
  return os.Getenv(key)
}
```

## El modelo User

#### ~/2fa-fiber

Ahora, creemos una carpeta llamada **models**, y dentro de la carpeta **models**,
creemos un archivo llamado **user.go**. Esto lo hacemos para definir la estructura de la entidad
llamada **User**, que utilizaremos para interactuar con la base de datos.

```bash
mkdir ~/2fa-fiber/models
touch ~/2fa-fiber/models/user.go
```

#### ~/2fa-fiber/models/user.go

```go
package models

import "gorm.io/gorm"

type User struct {
  gorm.Model
	Name      string     `gorm:"type:varchar(100);not null"`
	Email     string     `gorm:"type:varchar(100);uniqueIndex;not null"`
	Password  string     `gorm:"type:varchar(100);not null"`
	Otp_enabled  bool    `gorm:"default:false;"`
	Otp_verified bool    `gorm:"default:false;"`

	Otp_secret   string
	Otp_auth_url string
}

type SignUpInput struct {
	Name            string `json:"name" validate:"required"`
	Email           string `json:"email" validate:"required"`
	Password        string `json:"password" validate:"required,min=8"`
}

type SignInInput struct {
	Email     string `json:"email"  validate:"required"`
	Password  string `json:"password"  validate:"required"`
  Token     string `json:"token"`
}

type OTPInput struct {
	Token   string `json:"token"`
}
```

## Config la base de datos

Lo primero que vamos a hacer es crear una nueva base de datos sqlite3

#### ~/2fa-fiber

```bash
sqlite3 ~/2fa-fiber/sqlite3.db
```

Ahora podemos conectarnos a ella, para eso vamos a crear una nueva carpeta llamada database y 2 archivos llamados database.go y
connect.go

#### ~/2fa-fiber

```bash
mkdir ~/2fa-fiber/database
touch ~/2fa-fiber/database/database.go
touch  ~/2fa-fiber/database/connect.go
```

En **database.go**, declararemos una variable global llamada **DB**, que será un puntero a un objeto
gorm.DB. Usaremos esta variable para mantener una instancia de la base de datos y realizar
operaciones en la base de datos en toda la aplicación.

#### ~/2fa-fiber/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

Ahora creemos connect.go para poder conectarnos a la base de datos

#### ~/2fa-fiber/database/connect.go

```go
package database

import (
	"fmt"

	"github.com/agustfricke/go-fiber-2fa/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func ConnectDB() {
    var err error

    dbPath := "db.sqlite3"

    DB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})

    if err != nil {
        panic("Failed to connect to the database")
    }

    fmt.Println("Connection opened to the database")
    DB.AutoMigrate(&models.User{})
    fmt.Println("Database migrated")
}
```

## Check health

Ahora configuremos una ruta basica para ver que todo funciona como deberia
Creemos los handlers, router y un server en el archivo main.go

#### ~/2fa-fiber

```bash
mkdir ~/2fa-fiber/handlers
touch ~/2fa-fiber/handlers/user.go
touch ~/2fa-fiber/handlers/auth.go
mkdir ~/2fa-fiber/router
touch ~/2fa-fiber/router/router.go
touch ~/2fa-fiber/main.go
```

#### ~/2fa-fiber/handlers/user.go

```go
package handlers

import "github.com/gofiber/fiber/v2"

func Check(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
    "status": "success",
    "data": "2FA Fiber",
  })
}
```

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
  app.Get("/check", handlers.Check)
}
```

#### ~/2fa-fiber/main.go

```go
package main

import (
	"log"

	"github.com/agustfricke/go-fiber-2fa/database"
	"github.com/agustfricke/go-fiber-2fa/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)


func main() {
    database.ConnectDB()
    app := fiber.New()

    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:5173",
        AllowMethods: "GET, POST"
        AllowCredentials: true,
        AllowHeaders: "Origin, Content-Type, Accept",
    }))

    routes.SetupRoutes(app)

    log.Fatal(app.Listen(":8000"))
}
```

Ahora podemos ver si todo funciona correctamente corriedo el servidor.

#### ~/2fa-fiber

```bash
go run ~/2fa-fiber/main.go
```

## Crear una cuenta

Ahora creemos la logica para crear una nueva cuenta.

#### ~/2fa-fiber/handlers/auth.go

```go
package handlers

import (
	"strings"

	"github.com/agustfricke/go-fiber-2fa/database"
	"github.com/agustfricke/go-fiber-2fa/models"
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

Ahora creemos la ruta.

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
  app.Post("/signup", handlers.SignUp)
  app.Get("/check", handlers.Check)
}
```

Ahora creemos una nueva cuenta.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/signup/
```

## Inciar sesion

Ahora creemos la funcion para iniciar session

#### ~/2fa-fiber/handlers/auth.go

```go
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

  if user.Otp_enabled == true {
    valid := totp.Validate(payload.Token, user.Otp_secret)
    if !valid {
      return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
        "status":  "fail",
        "message": "Token 2FA not valid",
      })
    }

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

Ahora creemos la ruta.

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
  app.Post("/signup", handlers.SignUp)
  app.Post("/signin", handlers.SignIn)
  app.Get("/check", handlers.Check)
}
```

Ahora creemos una nueva cuenta.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/signin/
```

## Cerrar sesion

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

Creemos la ruta

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
  app.Post("/signup", handlers.SignUp)
  app.Post("/signin", handlers.SignIn)
  app.Get("/logout", handlers.Logout)
  app.Get("/check", handlers.Check)
}
```

Probemos este endpoint; recuerda que necesitas reconstruir el código para aplicar los cambios.

```bash
curl -X GET -H "Authorization: Bearer TU_TOKEN_JWT" http://127.0.0.1:8000/logout
```

## Middleware

Ahora creemos un middleware.

```bash
mkdir ~/2fa-fiber/middleware
touch ~/2fa-fiber/middleware/auth.go
```

#### ~/2fa-fiber/middleware/auth.go

```go
package middleware

import (
	"fmt"
	"strings"

	"github.com/agustfricke/go-fiber-2fa/config"
	"github.com/agustfricke/go-fiber-2fa/database"
	"github.com/agustfricke/go-fiber-2fa/models"
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
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "the user belonging to this token no logger exists"})
	}

	c.Locals("user", &user)

	return c.Next()
}
```

## Generar codigo

Este código es una función en Go que genera un OTP (One-Time Password) para un usuario autenticado.
Utiliza la biblioteca "fiber" para manejar solicitudes web. Primero, obtiene el usuario actual y
genera una clave OTP con un tamaño de secreto de 15 caracteres. Luego, busca al usuario en una
base de datos y actualiza su secreto OTP y URL de autenticación. Finalmente, devuelve la clave
OTP y la URL de autenticación como respuesta JSON.

#### ~/2fa-fiber/handlers/auth.go

```go
func GenerateOTP(c *fiber.Ctx) error {
	  tokenUser := c.Locals("user").(*models.User)

    key, err := totp.Generate(totp.GenerateOpts{
        Issuer:      "Tech con Agust",
        AccountName: tokenUser.Email,
        SecretSize:  15,
    })

    if err != nil {
        panic(err)
    }

    var user models.User
    db := database.DB
    result := db.First(&user, "id = ?", tokenUser.ID)
    if result.Error != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "fail",
            "message": "Correo electrónico o contraseña no válidos",
        })
    }

    dataToUpdate := models.User{
        Otp_secret:   key.Secret(),
        Otp_auth_url: key.URL(),
    }

    db.Model(&user).Updates(dataToUpdate)

    otpResponse := fiber.Map{
        "base32":      key.Secret(),
        "otpauth_url": key.URL(),
    }

    return c.JSON(otpResponse)
}
```

Creemos la ruta

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/agustfricke/go-fiber-2fa/middleware"
)

func SetupRoutes(app *fiber.App) {
  app.Get("/check", handlers.Check)
  app.Post("/signup", handlers.SignUp)
  app.Post("/signin", handlers.SignIn)
  app.Get("/logout", handlers.Logout)
  app.Post("/generate", middleware.DeserializeUser, handlers.GenerateOTP)
}
```

Ahora podemos testear este endpoint.

```bash
curl -X POST -H "Authorization: Bearer TU_TOKEN_JWT" http://127.0.0.1:8000/generate
```

Ahora ingresa ese codigo o genera un QR con la url generada.

## Validar codigo

Ahora validemos este codigo, para eso debemos ingesar el codigo de su app de autenticacion junto con el JWT token.

#### ~/2fa-fiber/handlers/auth.go

```go
func VerifyOTP(c *fiber.Ctx) error {
    var payload *models.OTPInput
	  tokenUser := c.Locals("user").(*models.User)

    if err := c.BodyParser(&payload); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "fail",
            "message": err.Error(),
        })
    }

    var user models.User
    db := database.DB
    result := db.First(&user, "id = ?", tokenUser.ID)
    if result.Error != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "fail",
            "message": "El token no es válido o el usuario no existe",
        })
    }

    valid := totp.Validate(payload.Token, user.Otp_secret)
    if !valid {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "fail",
            "message": "El token no es válido o el usuario no existe",
        })
    }

    dataToUpdate := models.User{
        Otp_enabled:  true,
        Otp_verified: true,
    }

    db.Model(&user).Updates(dataToUpdate)

    userResponse := fiber.Map{
        "id":          user.ID,
        "name":        user.Name,
        "email":       user.Email,
        "otp_enabled": user.Otp_enabled,
    }

    return c.JSON(fiber.Map{
        "otp_verified": true,
        "user":         userResponse,
    })
}
```

#### ~/2fa-fiber/router/router.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/agustfricke/go-fiber-2fa/middleware"
)

func SetupRoutes(app *fiber.App) {
  app.Get("/check", handlers.Check)
  app.Post("/signup", handlers.SignUp)
  app.Post("/signin", handlers.SignIn)
  app.Get("/logout", handlers.Logout)
  app.Post("/generate", middleware.DeserializeUser, handlers.GenerateOTP)
  app.Post("/verify", middleware.DeserializeUser, handlers.VerifyOTP)
}
```

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer TU_TOKEN_JWT"  -d '{"token": "token_one_time_password"}' http://127.0.0.1:8000/verify
```

Genial ahora el 2FA esta activo en nuestra cuenta

## Eliminar 2FA

Ahora desactivemos el 2FA.

#### ~/2fa-fiber/handlers/auth.go

```go
func DisableOTP(c *fiber.Ctx) error {
	  tokenUser := c.Locals("user").(*models.User)

    var user models.User
    db := database.DB
    result := db.First(&user, "id = ?", tokenUser.ID)
    if result.Error != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "status":  "fail",
            "message": "El usuario no existe",
        })
    }

    user.Otp_enabled = false
    db.Save(&user)

    userResponse := fiber.Map{
        "id":          user.ID,
        "name":        user.Name,
        "email":       user.Email,
        "otp_enabled": user.Otp_enabled,
    }

    return c.JSON(fiber.Map{
        "otp_disabled": true,
        "user":         userResponse,
    })
}
```

Ahora creemos la ruta.

#### ~/2fa-fiber/routes/routes.go

```go
package routes

import (
	"github.com/agustfricke/go-fiber-2fa/handlers"
	"github.com/agustfricke/go-fiber-2fa/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
  app.Get("/check", handlers.Check)
  app.Post("/signup", handlers.SignUp)
  app.Post("/signin", handlers.SignIn)
  app.Post("/logout", middleware.DeserializeUser, handlers.Logout)
  app.Post("/generate", middleware.DeserializeUser, handlers.GenerateOTP)
  app.Post("/verify", middleware.DeserializeUser, handlers.VerifyOTP)
  app.Post("/disable", middleware.DeserializeUser, handlers.DisableOTP) // Nuevo!
}
```

```bash
curl -X POST -H "Authorization: Bearer TU_TOKEN_JWT" http://127.0.0.1:8000/disable
```

Perfecto, ya tienes una aplicacion de 2FA, no olvides de dejarme una estrella en el respositorio de [**GitHub**](https://github.com/agustfricke/go-fiber-2fa).
