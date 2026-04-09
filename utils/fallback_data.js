const FOOD_DATABASE = [
    { name: "Greek Yogurt with Berries", calories: 250, protein: 18, carbs: 20, fats: 5, mealType: "breakfast", allergens: ["dairy"], isVeg: true },
    { name: "Oatmeal with Almonds", calories: 350, protein: 12, carbs: 45, fats: 10, mealType: "breakfast", allergens: ["nuts", "gluten"], isVeg: true },
    { name: "Eggs and Spinach Scramble", calories: 300, protein: 20, carbs: 5, fats: 20, mealType: "breakfast", allergens: ["eggs"], isVeg: false },
    { name: "Chia Seed Pudding", calories: 280, protein: 10, carbs: 15, fats: 18, mealType: "breakfast", allergens: [], isVeg: true },
    { name: "Eggless Protein Pancakes", calories: 380, protein: 28, carbs: 42, fats: 6, mealType: "breakfast", allergens: ["dairy", "gluten"], isVeg: true },
    { name: "Smoked Salmon Toast", calories: 320, protein: 22, carbs: 30, fats: 12, mealType: "breakfast", allergens: ["fish", "gluten"], isVeg: false },
    { name: "Grilled Chicken Salad", calories: 450, protein: 35, carbs: 15, fats: 20, mealType: "lunch", allergens: [], isVeg: false },
    { name: "Quinoa and Chickpea Bowl", calories: 500, protein: 18, carbs: 65, fats: 12, mealType: "lunch", allergens: [], isVeg: true },
    { name: "Tuna Sandwich on Wholegrain", calories: 420, protein: 30, carbs: 45, fats: 10, mealType: "lunch", allergens: ["fish", "gluten"], isVeg: false },
    { name: "Beef and Broccoli Stir-fry", calories: 480, protein: 32, carbs: 25, fats: 22, mealType: "lunch", allergens: ["soy"], isVeg: false },
    { name: "Paneer Grilled Skewers", calories: 500, protein: 30, carbs: 10, fats: 35, mealType: "lunch", allergens: ["dairy"], isVeg: true },
    { name: "Lentil Soup", calories: 380, protein: 20, carbs: 50, fats: 6, mealType: "lunch", allergens: [], isVeg: true },
    { name: "Pan Seared Salmon", calories: 600, protein: 40, carbs: 5, fats: 45, mealType: "dinner", allergens: ["fish"], isVeg: false },
    { name: "Steak and Sweet Potatoes", calories: 750, protein: 45, carbs: 60, fats: 30, mealType: "dinner", allergens: [], isVeg: false },
    { name: "Soy Chunks Masala", calories: 400, protein: 38, carbs: 30, fats: 12, mealType: "dinner", allergens: ["soy"], isVeg: true },
    { name: "Zucchini Noodles with Pesto", calories: 400, protein: 12, carbs: 20, fats: 35, mealType: "dinner", allergens: ["nuts"], isVeg: true },
    { name: "Almonds (Handful)", calories: 160, protein: 6, carbs: 6, fats: 14, mealType: "snack", allergens: ["nuts"], isVeg: true },
    { name: "Apple with Peanut Butter", calories: 250, protein: 8, carbs: 25, fats: 16, mealType: "snack", allergens: ["nuts"], isVeg: true },
    { name: "Large Protein Shake w/ Milk", calories: 350, protein: 45, carbs: 20, fats: 8, mealType: "snack", allergens: ["dairy"], isVeg: true }
];

const EXERCISE_DATABASE = [
    { name: "Walking", type: "cardio", duration: 30, calories: 150, intensity: "low" },
    { name: "Running", type: "cardio", duration: 30, calories: 350, intensity: "high" },
    { name: "Cycling", type: "cardio", duration: 45, calories: 400, intensity: "moderate" },
    { name: "Bodyweight Squats", type: "strength", duration: 20, calories: 100, intensity: "moderate" },
    { name: "Pushups", type: "strength", duration: 15, calories: 80, intensity: "moderate" },
    { name: "Yoga", type: "flexibility", duration: 60, calories: 180, intensity: "low" },
    { name: "HIIT", type: "cardio", duration: 20, calories: 300, intensity: "high" },
    { name: "Plank", type: "core", duration: 5, calories: 20, intensity: "moderate" }
];

module.exports = { FOOD_DATABASE, EXERCISE_DATABASE };
