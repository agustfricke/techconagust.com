---
title: Sending Emails with Go
description: Sending Emails with Go
layout: ../../layouts/docs.astro
lang: en
---

## Getting Started

In this tutorial, we will send emails using the Go programming language. You'll need to have
Go installed on your system and a code editor.

## Project Setup

In a new terminal, let's create a new directory called **go-send-email**
using the **mkdir** command and navigate into it
using the **cd** command.

```bash
mkdir ~/go-send-email
cd ~/go-send-email
```

Once inside the folder, let's create a new module with Go.
Modules are used to manage a project's dependencies and
enable effective organization of dependencies, making it
easier to collaborate on projects and ensure code reproducibility
across different environments.

To create a new module with Go, we need to use the **go mod init module-name** command,
where the **module-name** is typically the URL of a remote repository.

#### ~/go-send-email

```bash
go mod init github.com/agustfricke/go-send-email
```

## Create a New App in Your Google Account

To create a new app, you can follow the instructions in these images. Make sure not to share your password.
images.

-   Manage your Google Account

<img src="/send-email/1.png"/>

-   Security

<img src="/send-email/2.png"/>

-   2-Step Verification

<img src="/send-email/3.png"/>

-   App Passwords

<img src="/send-email/4.png"/>

-   Give the app a name

<img src="/send-email/5.png"/>

-   Save the password

<img src="/send-email/6.png"/>

## Configure Environment Variables

Now, let's create a new file named .env to securely store our password.

#### ~/go-send-email

```bash
touch .env
```

Paste your Google password into this file as follows.

#### ~/go-send-email/main.go

```go
EMAIL_SECRET_KEY="your-secret-key-here"
```

Once the module is created, we'll install the [**godotenv**](https://github.com/joho/godotenv) package.

#### ~/go-send-email

```bash
go get github.com/joho/godotenv
```

Let's create a new main.go file to send emails and read environment variables.

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

Now, you can run your code to see the password from the .env file.

#### ~/go-send-email

```bash
go run main.go
```

## Sending Emails

Let's create a new main.go file to send emails.

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
		"Subject: Email Subject\r\n" +
		"\r\n" +
		"Email Content"

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

Now, you can try sending an email with the following command:

```bash
go run main.go
```

## Sending an HTML Template

Let's create a new file called email_template.html.

```bash
touch ~/go-send-email/email_template.html
```

#### Now, let's add some content to this file.

```html
<!doctype html>
<html>
    <head>
        <title>Email Template</title>
    </head>
    <body style="background-color: #000; color: #fff">
        <h1>Hello, {{.Name}}!</h1>
        <p>
            This is an example email with a black background and white content.
        </p>
    </body>
</html>
```

Now, we can update our main.go to send this template.

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
		Name: "User",
	}

	var bodyContent bytes.Buffer
	err = tmpl.Execute(&bodyContent, data)
	if err != nil {
		fmt.Println(err)
		return
	}

	content := fmt.Sprintf("To: agustfricke@gmail.com\r\n"+
		"Subject: Email with HTML Template\r\n"+
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
	if err is not nil {
		fmt.Println(err)
	}
}

func main() {
	SendEmail()
}
```

Now, you can try sending an email with the HTML template using the following command:

```bash
go run main.go
```
