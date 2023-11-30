---
title: Autenticacion con Fiber JWT
description: Fiber JWT autenticacion
layout: ../../layouts/docs.astro
lang: es
---

## Empezando

En esta guía extensa, obtendrás información sobre el proceso de incorporación de la autenticación JWT (JSON Web Token) en una aplicación Go, utilizando GORM junto con el framework web Fiber. La API REST estará impulsada por un robusto servidor HTTP Fiber, que proporcionará puntos finales especializados para la autenticación segura de usuarios y la persistencia de datos en una base de datos PostgreSQL.

## Configuración

Para empezar, creemos una carpeta con el nombre `fiber-jwt-auth` y entremos en ella.

```bash
mkdir ~/fiber-jwt-auth
cd ~/fiber-jwt-auth
```

Una vez dentro de la carpeta, creemos un nuevo módulo con Go. Los módulos se utilizan para gestionar las dependencias de un proyecto y facilitar la organización de las mismas, lo que hace más sencillo colaborar en proyectos y garantizar la reproducibilidad del código en diferentes entornos.

Para crear un nuevo módulo con Go, necesitamos usar el comando **go mod init nombre-del-módulo**, donde **nombre-del-módulo** suele ser la URL de un repositorio remoto.

#### ~/fiber-jwt-auth

```bash
go mod init github.com/agustfricke/fiber-jwt-auth
```

Una vez creado el módulo, instalaremos los paquetes [**fiber**](https://docs.gofiber.io/), [**godotenv**](https://github.com/joho/godotenv) y [**gorm**](https://gorm.io/docs/).

#### ~/fiber-jwt-auth

```bash
go get github.com/joho/godotenv
go get github.com/gofiber/fiber/v2
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

## Configuración de Postgres con Docker y Go

Creemos una nueva base de datos Postgres utilizando Docker con el siguiente comando:

```bash
sudo docker run --name postgres_db -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=super_db -p 5432:5432 -d postgres
```

Una vez creada la base de datos, podemos generar un nuevo archivo llamado **.env** en la raíz de nuestro proyecto, que contendrá las credenciales de la base de datos.

#### ~/fiber-jwt-auth/.env

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_NAME=super_db
```

Ahora, creemos una función para leer las credenciales del archivo **.env**. Para hacerlo, creemos una carpeta llamada **config**, y dentro de la carpeta **config**, creemos un archivo llamado **config.go**.

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

func Config(clave string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Print("Error al cargar el archivo .env")
	}
	return os.Getenv(clave)
}
```

Esta función toma una clave como parámetro y devuelve el valor asociado. Por ejemplo, si pasamos **DB_HOST** como clave, devolverá **localhost**.

Ahora, creemos una carpeta llamada **models**, y dentro de la carpeta **models**, creemos un archivo llamado **user.go**. Esto lo hacemos para definir la estructura de la entidad llamada **User**, que utilizaremos para interactuar con la base de datos.

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

Aquí definimos la estructura **User**, que incluye **gorm.Model**.
Esto proporciona campos adicionales como **ID, CreatedAt, UpdatedAt y DeletedAt**.
Luego especificamos que cada usuario tendrá un campo **Name** de tipo string.
Luego tenemos 2 estructuras más, **SignInInput** para el inicio de sesión y **SignUpInput** para el registro.

Ahora, creemos una carpeta llamada **database**. Dentro de la carpeta **database**, creemos dos archivos: **database.go** y **connect.go**.

```bash
mkdir ~/fiber-jwt-auth/database
touch ~/fiber-jwt-auth/database/database.go
touch ~/fiber-jwt-auth/database/connect.go
```

En **database.go**, declararemos una variable global llamada **DB**, que será un puntero a un objeto gorm.DB. Usaremos esta variable para mantener una instancia de la base de datos y realizar operaciones en la base de datos en toda la aplicación.

#### ~/fiber-jwt-auth/database/database.go

```go
package database

import "gorm.io/gorm"

var DB *gorm.DB
```

Usaremos el archivo **connect.go** para establecer una conexión con la base de datos.

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
        panic("Error al analizar el puerto de la base de datos")
    }
    dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
    config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"),
    config.Config("DB_NAME"))
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

    if err != nil {
        panic("Error al conectar la base de datos")
    }
    fmt.Println("Conexión ab

ierta a la base de datos")
    DB.AutoMigrate(&models.User{})
    fmt.Println("Base de datos migrada")
}
```

En la función **ConnectDB**, nos conectamos a la base de datos utilizando la variable **dsn**, obteniendo las credenciales a través de la función **Config**, y luego realizamos migraciones con el modelo **User**.

Ahora, creemos el archivo **main.go**, que será el punto de entrada donde se ejecutará todo nuestro código.
Nos conectaremos a la base de datos llamando a la función **ConnectDB()**, configuraremos **cors** y crearemos un servidor en el puerto **8000** utilizando **fiber**.

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

Ahora puedes ejecutar tu código de Go con el siguiente comando:

```bash
go run ~/fiber-jwt-auth/main.go
```

## Registro

Ahora creemos una nueva carpeta llamada "handlers" y dentro de ella, creemos un nuevo archivo llamado "auth.go".

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
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"status": "fail", "message": "Usuario con ese correo electrónico ya existe"})
	} else if result.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "error", "message": "Algo salió mal"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "data": fiber.Map{"usuario": &newUser}})
}
```

Ahora creemos una nueva ruta para esta función creando una nueva carpeta con un nuevo archivo dentro.

```bash
mkdir ~/fiber-jwt-auth/router
touch ~/fiber-jwt-auth/router/router.go
```

Dentro de este archivo, coloquemos el siguiente código:

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/registro", handlers.SignUp)
}
```

Ahora podemos actualizar el **main.go**.

#### ~/fiber-jwt-auth/main.go

```go
package main

import (
	"log"

	"github.com/agustfricke/fiber-jwt-auth/database"
	"github.com/agustfricke/fiber-jwt-auth/router" // ¡Nuevo!
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

	router.SetupRoutes(app) // ¡Nuevo!

	log.Fatal(app.Listen(":8000"))
}
```

Probemos si podemos crear un nuevo usuario.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/registro/
```

Tu código parece estar listo para probar ahora.

## Inicio de sesión

Ahora creemos una función para iniciar sesión de un nuevo usuario.

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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": "Correo electrónico o contraseña no válidos"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": "Correo electrónico o contraseña no válidos"})
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

La función **SignIn** maneja la autenticación de usuarios en una aplicación web utilizando el framework Fiber para Go.
Realiza las siguientes tareas:

-   Analiza el cuerpo de la solicitud HTTP para obtener un objeto de carga útil con información de inicio de sesión.
-   Busca un usuario en la base de datos por su dirección de correo electrónico.
-   Compara la contraseña proporcionada en la carga útil con la contraseña almacenada en la base de datos utilizando bcrypt.
-   Si la autenticación es exitosa, genera un **Token Web JSON (JWT)** que contiene la información del usuario y una fecha de vencimiento.
-   Almacena el token JWT en una **cookie de respuesta HTTP**.
-   Devuelve una respuesta HTTP con el token JWT si la autenticación es exitosa o un mensaje de error si falla.

Ahora creemos la ruta para este endpoint.

#### ~/fiber-jwt-auth/router

/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/registro", handlers.SignUp)
	app.Post("/inicio-sesion", handlers.SignIn) // ¡Nuevo!
}
```

Ahora podemos probar este endpoint; asegúrate de tener un token válido.

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "johndoe@example.com",
  "password": "secretpassword"
}' http://127.0.0.1:8000/inicio-sesion/
```

Esto debería devolver un token JWT. Guárdalo.

## Cierre de sesión

Ahora creemos un nuevo endpoint para cerrar sesión de nuestros usuarios.

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

Este código en Go define una función llamada **Logout** que maneja el cierre de sesión de un usuario en una aplicación web con el framework Fiber.
Expira la cookie de autenticación del usuario, la establece en un valor vacío y envía una respuesta JSON indicando un cierre de sesión exitoso.
El tiempo de expiración de la cookie se establece en 24 horas en el pasado para invalidarla efectivamente.

Creemos la ruta.

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/registro", handlers.SignUp)
	app.Post("/inicio-sesion", handlers.SignIn)
	app.Get("/cerrar-sesion", handlers.Logout) // ¡Nuevo!
}
```

Probemos este endpoint; recuerda que necesitas reconstruir el código para aplicar los cambios.

```bash
curl -X GET -H "Authorization: Bearer TU_TOKEN_JWT" http://127.0.0.1:8000/cerrar-sesion
```

## Middleware

Ahora creemos un middleware.

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
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "No has iniciado sesión"})
	}

	tokenByte, err := jwt.Parse(tokenString, func(jwtToken *jwt.Token) (interface{}, error) {
		if _, ok := jwtToken.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %s", jwtToken.Header["alg"])
		}

		return []byte(config.Config("SECRET_KEY")), nil
	})

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": fmt.Sprintf("token inválido: %v", err)})
	}

	claims, ok := tokenByte.Claims.(jwt.MapClaims)
	if !ok || !tokenByte.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "reclamo de token inválido"})
	}

	var user models.User
	db := database.DB
	db.First(&user, "id = ?", fmt.Sprint(claims["sub"]))

	if float64(user.ID) != claims["sub"] {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"status": "fail", "message": "el usuario al que pertenece este token ya no existe"})
	}

	c.Locals("user", &user)

	return c.Next()
}
```

Este código define una función de middleware llamada **DeserializeUser** en una aplicación Go utilizando el framework Fiber.
Este middleware es responsable de decodificar y validar tokens JWT (JSON Web Token) de las solicitudes entrantes.
Extrae el token de la cabecera de autorización de la solicitud o de las cookies, lo valida y, si es válido, recupera la información del usuario correspondiente desde una base de datos y la almacena en las variables locales del contexto de Fiber. Si el token no es válido o ha expirado, devuelve una respuesta de error adecuada.

## Mi usuario

Ahora creemos un nuevo endpoint para mostrar nuestro usuario autenticado.

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

Esta función recupera el objeto de usuario almacenado en las variables locales del contexto de Fiber y responde con una representación JSON del usuario junto con un código de estado de éxito (200 OK).

Ahora creemos la ruta para este endpoint.

#### ~/fiber-jwt-auth/router/router.go

```go
package router

import (
	"github.com/agustfricke/fiber-jwt-auth/handlers"
	"github.com/agustfricke/fiber-jwt-auth/middleware" // ¡Nuevo!
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/registro", handlers.SignUp)
	app.Post("/inicio-sesion", handlers.SignIn)
	app.Get("/cerrar-sesion", handlers.Logout)
	app.Get("/yo",  middleware.DeserializeUser ,handlers.GetMe) // ¡Nuevo!
}
```

Este es una solicitud GET a la ruta "/yo"; Fiber primero ejecutará el middleware DeserializeUser para validar el token JWT del usuario y almacenar la información del usuario en el contexto. Luego, ejecutará la función de controlador GetMe para responder con los datos del usuario

si el token es válido.

Probemos este endpoint; asegúrate de tener un token válido.

```bash
curl -X GET -H "Authorization: Bearer TU_TOKEN_JWT" http://127.0.0.1:8000/yo
```
