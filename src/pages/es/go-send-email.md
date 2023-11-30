---
title: Mandar correos con Go
description: Mandar correos con Go
layout: ../../layouts/docs.astro
lang: es
---

## Inicio

En este tutorial vamos a enviar emails con el lenguaje de programación Go. Necesitarán tener instalado
Go en su sistema y un editor de código.

## Configuración del proyecto

En una nueva terminal, vamos a crear un nuevo directorio llamado **go-send-email**
con el comando **mkdir** y nos vamos a meter dentro de él
con el comando **cd**.

```bash
mkdir ~/go-send-email
cd ~/go-send-email
```

Una vez dentro de la carpeta, vamos a crear un nuevo módulo con Go.
Los módulos se utilizan para administrar las dependencias de un proyecto y
permiten organizar las dependencias de manera efectiva, lo que facilita la
colaboración en proyectos y garantiza que el código sea reproducible en
diferentes entornos.

Para crear un nuevo módulo con Go, debemos usar el comando **go mod init nombre-del-módulo**,
donde normalmente el **nombre-del-módulo** suele ser la URL de un repositorio remoto.

#### ~/go-send-email

```bash
go mod init github.com/agustfricke/go-send-email
```

## Crear una nueva app en nuestra cuenta de Google

Para crear una nueva app, pueden seguir las instrucciones en estas imágenes. Asegúrate de no compartir la contraseña.
imágenes.

-   Gestiona tu cuenta de Google

<img src="/send-email/1.png"/>

-   Seguridad

<img src="/send-email/2.png"/>

-   Verificación en 2 pasos

<img src="/send-email/3.png"/>

-   Contraseñas de aplicaciones

<img src="/send-email/4.png"/>

-   Dale un nombre a la app

<img src="/send-email/5.png"/>

-   Guarda la contraseña

<img src="/send-email/6.png"/>

## Configurar ambientes de entorno

Ahora vamos a crear un nuevo archivo llamado .env para mantener nuestra contraseña segura.

#### ~/go-send-email

```bash
touch .env
```

Pega la contraseña de Google en este archivo de la siguiente manera.

#### ~/go-send-email/main.go

```go
EMAIL_SECRET_KEY="ihkk dijl xqez djww"
```

Una vez creado el módulo, vamos a instalar el paquete [**godotenv**](https://github.com/joho/godotenv).

#### ~/go-send-email

```bash
go get github.com/joho/godotenv
```

Creemos un nuevo archivo main.go para enviar correos y leer las variables de entorno.

```bash
touch main.go
```

#### ~/go-send-email/main.go

```go
package main

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

func main() {
  secret_password := Config("EMAIL_SECRET_KEY")
  fmt.Print(secret_password)
}
```

Ahora podemos ejecutar nuestro código para ver la contraseña dentro del archivo .env.

#### ~/go-send-email

```bash
go run main.go
```

## Mandar correos

Creemos un nuevo archivo main.go para poder enviar correos.

```bash
touch ~/go-send-email/main.go
```

#### ~/go-send-email/main.go

```go
package main

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
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

func SendEmail() {
	secretPassword := Config("EMAIL_SECRET_KEY")
	auth := smtp.PlainAuth(
		"",
		"agustfricke@gmail.com",
		secretPassword,
		"smtp.gmail.com",
	)

	content := "To: agustfricke@gmail.com\r\n" +
		"Subject: Asunto del correo\r\n" +
		"\r\n" +
		"Contenido del correo"

	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"agustfricke@gmail.com",
		[]string{"agustfricke@gmail.com"},
		[]byte(content),
	)
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	SendEmail()
}
```

Ahora puedes probar enviar un correo con el siguiente comando:

```bash
go run main.go
```

## Mandar una plantilla HTML

Creemos un nuevo archivo llamado email_template.html.

```bash
touch ~/go-send-email/email_template.html
```

#### Ahora pongamos algo de contenido dentro de este archivo.

```html
<!doctype html>
<html>
    <head>
        <title>Plantilla de correo electrónico</title>
    </head>
    <body style="background-color: #000; color: #fff">
        <h1>Hola, {{.Name}}!</h1>
        <p>
            Este es un ejemplo de correo electrónico con fondo negro y contenido
            blanco.
        </p>
    </body>
</html>
```

Ahora podemos actualizar nuestro main.go para enviar este template.

```go
package main

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
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

func SendEmail() {
	secretPassword := Config("EMAIL_SECRET_KEY")
	auth := smtp.PlainAuth(
		"",
		"agustfricke@gmail.com",
		secretPassword,
		"smtp.gmail.com",
	)

	tmpl, err := template.ParseFiles("email_template.html")
	if err != nil {
		fmt.Println(err)
		return
	}

	data := struct {
		Name string
	}{
		Name: "Usuario",
	}

	var bodyContent bytes.Buffer
	err = tmpl.Execute(&bodyContent, data)
	if err != nil {
		fmt.Println(err)
		return
	}

	content := fmt.Sprintf("To: agustfricke@gmail.com\r\n"+
		"Subject: Correo con plantilla HTML\r\n"+
		"Content-Type: text/html; charset=utf-8\r\n"+
		"\r\n"+
		"%s", bodyContent.String())

	err = smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		"agustfricke@gmail.com",
		[]string{"agustfricke@gmail.com"},
		[]byte(content),
	)
	if err != nil {
		fmt.Println(err)
	}
}

func main() {
	SendEmail()
}
```

Ahora puedes probar enviar un correo con la plantilla HTML utilizando el siguiente comando:

```bash
go run main.go
```
