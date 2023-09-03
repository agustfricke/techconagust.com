package handlers

import (
    "github.com/gofiber/fiber/v2"
)

func HomePage(c *fiber.Ctx) error {
    return c.Render("home", fiber.Map{})
}

func FiberCrud(c *fiber.Ctx) error {
    return c.Render("fiber", fiber.Map{})
}
