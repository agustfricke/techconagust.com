package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"techconagust.com/handlers"
)

func main() {

    engine := html.New("./templates", ".html")

	app := fiber.New(fiber.Config{
		Views: engine, 
        ViewsLayout: "layout/main", 
	})

    app.Static("/", "./public")

	app.Get("/", handlers.HomePage)
	app.Get("/fiber-crud", handlers.FiberCrud)

	app.Listen(":3000")
}
