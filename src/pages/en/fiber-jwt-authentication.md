---
title: Fiber JWT authentication
description: Fiber JWT authentication
layout: ../../layouts/docs.astro
lang: en
---

## Getting Started

Within this extensive guide, you will gain insights on the process of incorporating
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

#### ~/go-send-email

```bash
go mod init github.com/agustfricke/go-send-email
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
