# L-Archive-Artisanal
A useful archive of recipes and a test space for those who love to cook and bake. Able to share, download, and interact with recipes.

## Target User
Those who enjoy cooking/ baking, but more so those who enjoy testing new recipes rather than a baker who just wants to store recipes off the internet; although the application will support both, it will provide more features to the first.

## Features

### Must Have
- Recipe Input: Able to upload recipes including: photos, ingredients, directions, time prep, & total prep.
- Organization System: Able to organize the recipes into an archive of sorts for the convience of the user. 
- Recipe Editing: Able to edit the ingredients, steps, and photos of saved recipes.
- Recipe Tweaking Tools: Unit converters, doubling measurements, manually preset substituions (What to use instead).

### Should Have
- Cooking Mode: A distraction-free interface while cooking, Step-by-step view (big text), Tap to check off steps, Built-in timers per step, “Keep screen on” mode.
- Smart Grocery List: Add recipe ingredients to a list in 1 tap, Auto-group duplicates (2 recipes sharing 1 list).

### Could Have
- Version Comparison: Allows you to view a history of the changes made to a recipe.

## Data Model

- **Recipe**: title, ingredients (list), steps (list), prep time, category
- **User**: name, email, saved recipes (list)
- **Ingredients** name, category

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Design
[Figma link will go here]

## Live Demo
[Vercel URL will go here]
