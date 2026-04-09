const express = require('express');
const router = express.Router();
const { callGemini } = require('../utils/ai');
const { FOOD_DATABASE, EXERCISE_DATABASE } = require('../utils/fallback_data');

/**
 * DIET GENERATION
 */
router.post('/generate-diet', async (req, res) => {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ error: "Profile required" });
    
    const { weight, height, age, gender, preference, allergies } = profile;

    // Logic for BMR and targets
    const s = gender === 'male' ? 5 : -161;
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + s;
    const proteinRatio = preference === 'veg' ? 1.4 : 1.6;
    const proteinTarget = weight * proteinRatio;

    const prompt = `Generate a 1-day meal plan for a ${age}yo ${gender}.
    Target: ${Math.round(bmr)} calories and ${Math.round(proteinTarget)}g protein.
    Preference: ${preference}.
    Strictly Avoid Allergies: ${allergies ? allergies.join(', ') : 'none'}.
    
    Return ONLY valid JSON in this format:
    {
      "meals": [{ "name": "string", "calories": number, "protein": number, "carbs": number, "fats": number, "mealType": "breakfast|lunch|dinner|snack", "isVeg": boolean }],
      "totals": { "calories": number, "protein": number, "carbs": number, "fats": number }
    }`;

    try {
        const aiPlan = await callGemini(prompt);
        res.json({ ...aiPlan, bmr, proteinTarget, isAI: true });
    } catch (error) {
        console.warn("AI Diet Gen failed, using local fallback");
        const safePool = FOOD_DATABASE.filter(food => {
            const allergenSafe = !food.allergens.some(a => allergies?.includes(a));
            const preferenceSafe = preference === 'veg' ? food.isVeg : true;
            return allergenSafe && preferenceSafe;
        });

        const meals = ['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
            const pool = safePool.filter(f => f.mealType === type);
            const food = pool[Math.floor(Math.random() * pool.length)] || FOOD_DATABASE[0];
            return { ...food };
        });

        const totals = meals.reduce((acc, curr) => ({
            calories: acc.calories + curr.calories,
            protein: acc.protein + curr.protein,
            carbs: acc.carbs + curr.carbs,
            fats: acc.fats + curr.fats
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

        res.json({ meals, totals, bmr, proteinTarget, isAI: false, note: "Fallback plan applied." });
    }
});

/**
 * WORKOUT GENERATION
 */
router.post('/generate-workout', async (req, res) => {
    const { profile, goal } = req.body;
    if (!profile) return res.status(400).json({ error: "Profile required" });

    const prompt = `Generate a custom workout plan for a ${profile.age}yo ${profile.gender} with the goal: ${goal || 'general fitness'}.
    Include 4 exercises.
    Return ONLY valid JSON in this format:
    {
      "exercises": [{ "name": "string", "type": "string", "duration": number, "calories_burned": number, "intensity": "low|moderate|high" }],
      "total_duration": number,
      "total_calories": number,
      "summary": "string"
    }`;

    try {
        const aiWorkout = await callGemini(prompt);
        res.json({ ...aiWorkout, isAI: true });
    } catch (error) {
        console.warn("AI Workout Gen failed, using local fallback");
        const workout = EXERCISE_DATABASE.slice(0, 4).map(e => ({ ...e, calories_burned: e.calories }));
        const total_duration = workout.reduce((sum, e) => sum + e.duration, 0);
        const total_calories = workout.reduce((sum, e) => sum + e.calories_burned, 0);
        
        res.json({
            exercises: workout,
            total_duration,
            total_calories,
            summary: "Standard fitness routine (Fallback)",
            isAI: false
        });
    }
});

/**
 * SMART FOOD ANALYSIS
 */
router.post('/analyze-food', async (req, res) => {
    const { foodName, portion } = req.body;
    const prompt = `Analyze the nutritional content of "${portion || '1 serving'} of ${foodName}". 
    Return ONLY valid JSON:
    { "calories": number, "protein": number, "carbs": number, "fats": number, "insights": "string" }`;

    try {
        const analysis = await callGemini(prompt);
        res.json({ ...analysis, success: true });
    } catch (error) {
        res.json({ 
            calories: 100, protein: 0, carbs: 0, fats: 0, 
            insights: "Nutritional data estimated (Fallback)", 
            success: true 
        });
    }
});

/**
 * SMART EXERCISE ANALYSIS
 */
router.post('/analyze-exercise', async (req, res) => {
    const { name, duration, intensity } = req.body;
    const prompt = `Analyze the calories burned for "${duration} minutes of ${name} at ${intensity} intensity". 
    Return ONLY valid JSON:
    { "calories_burned": number, "type": "cardio|strength|hiit|flexibility|sports|yoga", "insights": "string" }`;

    try {
        const analysis = await callGemini(prompt);
        res.json({ ...analysis, success: true });
    } catch (error) {
        res.json({ 
            calories_burned: duration * 5, 
            type: "cardio",
            insights: "Estimated calories burned (Fallback)", 
            success: true 
        });
    }
});

/**
 * SMART HEALTH TIPS
 */
router.post('/generate-tip', async (req, res) => {
    const { profile } = req.body;
    const prompt = `Based on a ${profile.age}yo ${profile.gender} who wants to ${profile.goal || 'stay healthy'}, give 3 highly specific and science-backed health tips. 
    Return ONLY valid JSON:
    { "tips": ["string", "string", "string"], "insights": "string" }`;

    try {
        const data = await callGemini(prompt);
        res.json({ ...data, success: true });
    } catch (error) {
        res.json({ 
            tips: ["Drink more water", "Stay consistent", "Get enough sleep"], 
            success: true 
        });
    }
});

module.exports = router;
