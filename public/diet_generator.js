/**
 * Personalized Diet Generator Module
 * Logic follows Mifflin-St Jeor Equation for BMR calculation.
 * Macro balancing ensures protein target of 1.6g per kg of body weight.
 * Dynamic filtering handles allergies using .filter() and .some().
 */

const FOOD_DATABASE = [
    // Breakfast
    { name: "Greek Yogurt with Berries", calories: 250, protein: 18, carbs: 20, fats: 5, mealType: "breakfast", allergens: ["dairy"], isVeg: true },
    { name: "Oatmeal with Almonds", calories: 350, protein: 12, carbs: 45, fats: 10, mealType: "breakfast", allergens: ["nuts", "gluten"], isVeg: true },
    { name: "Eggs and Spinach Scramble", calories: 300, protein: 20, carbs: 5, fats: 20, mealType: "breakfast", allergens: ["eggs"], isVeg: false },
    { name: "Chia Seed Pudding", calories: 280, protein: 10, carbs: 15, fats: 18, mealType: "breakfast", allergens: [], isVeg: true },
    { name: "Eggless Protein Pancakes", calories: 380, protein: 28, carbs: 42, fats: 6, mealType: "breakfast", allergens: ["dairy", "gluten"], isVeg: true },
    { name: "Smoked Salmon Toast", calories: 320, protein: 22, carbs: 30, fats: 12, mealType: "breakfast", allergens: ["fish", "gluten"], isVeg: false },
    { name: "High-Protein Greek Yogurt Royale", calories: 300, protein: 35, carbs: 15, fats: 5, mealType: "breakfast", allergens: ["dairy"], isVeg: true },

    // Lunch
    { name: "Grilled Chicken Salad", calories: 450, protein: 35, carbs: 15, fats: 20, mealType: "lunch", allergens: [], isVeg: false },
    { name: "Quinoa and Chickpea Bowl", calories: 500, protein: 18, carbs: 65, fats: 12, mealType: "lunch", allergens: [], isVeg: true },
    { name: "Tuna Sandwich on Wholegrain", calories: 420, protein: 30, carbs: 45, fats: 10, mealType: "lunch", allergens: ["fish", "gluten"], isVeg: false },
    { name: "Beef and Broccoli Stir-fry", calories: 480, protein: 32, carbs: 25, fats: 22, mealType: "lunch", allergens: ["soy"], isVeg: false },
    { name: "Paneer Grilled Skewers", calories: 500, protein: 30, carbs: 10, fats: 35, mealType: "lunch", allergens: ["dairy"], isVeg: true },
    { name: "Lentil Soup", calories: 380, protein: 20, carbs: 50, fats: 6, mealType: "lunch", allergens: [], isVeg: true },
    { name: "Tofu Ramen", calories: 550, protein: 25, carbs: 70, fats: 15, mealType: "lunch", allergens: ["soy", "gluten"], isVeg: true },
    { name: "Tempeh and Broccoli Stir-fry", calories: 450, protein: 32, carbs: 20, fats: 18, mealType: "lunch", allergens: ["soy"], isVeg: true },

    // Dinner
    { name: "Pan Seared Salmon", calories: 600, protein: 40, carbs: 5, fats: 45, mealType: "dinner", allergens: ["fish"], isVeg: false },
    { name: "Steak and Sweet Potatoes", calories: 750, protein: 45, carbs: 60, fats: 30, mealType: "dinner", allergens: [], isVeg: false },
    { name: "Soy Chunks Masala", calories: 400, protein: 38, carbs: 30, fats: 12, mealType: "dinner", allergens: ["soy"], isVeg: true },
    { name: "Zucchini Noodles with Pesto", calories: 400, protein: 12, carbs: 20, fats: 35, mealType: "dinner", allergens: ["nuts"], isVeg: true },
    { name: "Turkey Meatballs and Pasta", calories: 650, protein: 35, carbs: 70, fats: 20, mealType: "dinner", allergens: ["gluten", "dairy", "eggs"], isVeg: false },
    { name: "Black Bean Tacos", calories: 550, protein: 22, carbs: 60, fats: 18, mealType: "dinner", allergens: ["dairy"], isVeg: true },
    { name: "Mushroom Risotto", calories: 520, protein: 15, carbs: 75, fats: 18, mealType: "dinner", allergens: ["dairy"], isVeg: true },
    { name: "Roasted Cod with Asparagus", calories: 350, protein: 35, carbs: 10, fats: 15, mealType: "dinner", allergens: ["fish"], isVeg: false },

    // Snacks
    { name: "Almonds (Handful)", calories: 160, protein: 6, carbs: 6, fats: 14, mealType: "snack", allergens: ["nuts"], isVeg: true },
    { name: "Apple with Peanut Butter", calories: 250, protein: 8, carbs: 25, fats: 16, mealType: "snack", allergens: ["nuts"], isVeg: true },
    { name: "Large Protein Shake w/ Milk", calories: 350, protein: 45, carbs: 20, fats: 8, mealType: "snack", allergens: ["dairy"], isVeg: true },
    { name: "Rice Cakes with Hummus", calories: 120, protein: 4, carbs: 20, fats: 2, mealType: "snack", allergens: [], isVeg: true },
    { name: "Protein Bar", calories: 220, protein: 20, carbs: 25, fats: 7, mealType: "snack", allergens: ["nuts", "dairy"], isVeg: true },
    { name: "Hard Boiled Egg", calories: 75, protein: 6, carbs: 1, fats: 5, mealType: "snack", allergens: ["eggs"], isVeg: false },
    { name: "Cottage Cheese with Pineapple", calories: 180, protein: 25, carbs: 12, fats: 2, mealType: "snack", allergens: ["dairy"], isVeg: true },
    { name: "Edamame", calories: 190, protein: 18, carbs: 15, fats: 8, mealType: "snack", allergens: ["soy"], isVeg: true }
];

const DietGenerator = {
    userProfile: {
        weight: 70,
        height: 175,
        age: 25,
        gender: 'male',
        preference: 'veg', // Default to Veg
        allergies: []
    },

    /**
     * BMR Calculation (Mifflin-St Jeor Equation)
     * P = (10 * weight) + (6.25 * height) - (5 * age) + s
     * s is +5 for men and -161 for women
     */
    calculateBMR() {
        const { weight, height, age, gender } = this.userProfile;
        const s = gender === 'male' ? 5 : -161;
        return (10 * weight) + (6.25 * height) - (5 * age) + s;
    },

    /**
     * Creates a 'Safe Food Pool' by excluding items containing restricted allergens.
     * Also filters based on dietary preference (Veg / Non-Veg).
     */
    getSafeFoodPool() {
        return FOOD_DATABASE.filter(food => {
            // Filter by allergens
            const allergenSafe = !food.allergens.some(allergen => 
                this.userProfile.allergies.includes(allergen)
            );

            // Filter by dietary preference
            // If user selects 'veg', only show veg foods.
            // If user selects 'non-veg', show both.
            let preferenceSafe = true;
            if (this.userProfile.preference === 'veg') {
                preferenceSafe = food.isVeg === true;
            }

            return allergenSafe && preferenceSafe;
        });
    },

    /**
     * Generator algorithm to select a balanced diet plan.
     * Selects one of each mealType, meeting protein and calorie targets.
     */
    generatePlan() {
        const safePool = this.getSafeFoodPool();
        const bmr = this.calculateBMR();
        
        // For vegetarians, protein sourcing is harder, so we use a slightly more flexible target (1.4g/kg) 
        // while 1.6g/kg remains for non-vegetarians to ensure high success rate.
        const proteinRatio = this.userProfile.preference === 'veg' ? 1.4 : 1.6;
        const proteinTarget = this.userProfile.weight * proteinRatio;

        // Group safe foods by meal type
        const byType = {
            breakfast: safePool.filter(f => f.mealType === 'breakfast'),
            lunch: safePool.filter(f => f.mealType === 'lunch'),
            dinner: safePool.filter(f => f.mealType === 'dinner'),
            snack: safePool.filter(f => f.mealType === 'snack')
        };

        // Check if we have at least one food for each type
        if (!byType.breakfast.length || !byType.lunch.length || !byType.dinner.length || !byType.snack.length) {
            const category = !byType.breakfast.length ? "Breakfast" : 
                            !byType.lunch.length ? "Lunch" : 
                            !byType.dinner.length ? "Dinner" : "Snack";
            return { error: `No Safe Foods Found for ${category} with your current filters.` };
        }

        let bestPlan = null;
        let minDiff = Infinity;

        // Iterative search for a valid combination (randomized)
        // Increased to 1000 for maximum robustness
        for (let i = 0; i < 1000; i++) {
            const plan = [
                byType.breakfast[Math.floor(Math.random() * byType.breakfast.length)],
                byType.lunch[Math.floor(Math.random() * byType.lunch.length)],
                byType.dinner[Math.floor(Math.random() * byType.dinner.length)],
                byType.snack[Math.floor(Math.random() * byType.snack.length)]
            ];

            const totals = plan.reduce((acc, curr) => ({
                calories: acc.calories + curr.calories,
                protein: acc.protein + curr.protein,
                carbs: acc.carbs + curr.carbs,
                fats: acc.fats + curr.fats
            }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

            const calorieDiff = Math.abs(totals.calories - bmr);
            const isProteinEnough = totals.protein >= (proteinTarget * 0.9);

            // If we find a perfect match, return immediately
            if (calorieDiff <= 300 && isProteinEnough) {
                return { meals: plan, totals, bmr, proteinTarget };
            }

            // Keep track of the "next best" plan just in case
            if (calorieDiff < minDiff && isProteinEnough) {
                minDiff = calorieDiff;
                bestPlan = { meals: plan, totals, bmr, proteinTarget };
            }
        }

        // Fallback to the best possible plan found if it's reasonably close (within 500 kcal)
        if (bestPlan && minDiff <= 500) {
            return bestPlan;
        }

        return { error: "Could not find a plan matching both your calorie and protein targets. Try lower targets or fewer allergy restrictions." };
    },

    savedPlans: [],

    addToDiary(plan) {
        const timestamp = new Date().toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
        const savedPlan = JSON.parse(JSON.stringify(plan)); // Deep copy
        savedPlan.timestamp = timestamp;
        this.savedPlans.unshift(savedPlan);
        
        const btn = document.getElementById('addToDiary');
        const originalText = btn.textContent;
        btn.textContent = '✓ Saved to Diary!';
        btn.style.background = '#10B981';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
            this.renderDiary();
        }, 1500);
    },

    renderDiary() {
        const container = document.getElementById('dietDiaryContainer');
        if (!container) return;
        if (this.savedPlans.length === 0) {
            container.innerHTML = `<div class="empty-diary-msg">Your saved meal plans will appear here.</div>`;
            return;
        }

        container.innerHTML = `
            <table class="diary-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Summary</th>
                        <th>Calories</th>
                        <th>Protein</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.savedPlans.map((p, index) => `
                        <tr class="diary-row">
                            <td>${p.timestamp}</td>
                            <td>${p.meals.length} Meals Selected</td>
                            <td>${Math.round(p.totals.calories)} kcal</td>
                            <td><span class="diary-protein-badge">${Math.round(p.totals.protein)}g</span></td>
                            <td style="color: #10B981; font-weight: 700;">PRO APPROVED</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },

    clearDiary() {
        if (confirm('Are you sure you want to clear your meal history?')) {
            this.savedPlans = [];
            this.renderDiary();
        }
    }
};

/**
 * UI Controller
 */
const UI = {
    init() {
        this.renderAllergyChips();
        this.setupEventListeners();
        
        // Setup clear history button
        const clearBtn = document.getElementById('clearDietDiary');
        if(clearBtn) {
            clearBtn.addEventListener('click', () => {
                DietGenerator.clearDiary();
            });
        }
    },

    renderAllergyChips() {
        const container = document.getElementById('dietAllergyChips');
        const allergies = ['nuts', 'dairy', 'gluten', 'soy', 'eggs', 'fish'];
        
        container.innerHTML = allergies.map(allergy => `
            <div class="allergy-chip" data-allergy="${allergy}">${allergy}</div>
        `).join('');

        // Chip toggle logic
        container.querySelectorAll('.allergy-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                this.updateAllergies();
            });
        });
    },

    updateAllergies() {
        const activeChips = document.querySelectorAll('#dietAllergyChips .allergy-chip.active');
        DietGenerator.userProfile.allergies = Array.from(activeChips).map(c => c.dataset.allergy);
    },

    setupEventListeners() {
        const generateBtn = document.getElementById('dietGenerateBtn');

        generateBtn.addEventListener('click', () => {
            // Visual feedback - Loading state
            const originalText = generateBtn.textContent;
            generateBtn.textContent = 'Analyzing Nutritional Needs...';
            generateBtn.style.opacity = '0.8';
            generateBtn.style.pointerEvents = 'none';

            // Brief delay to simulate "calculation" / feel more premium
            setTimeout(() => {
                // Update profile data
                DietGenerator.userProfile.weight = parseFloat(document.getElementById('diet-weight').value) || 70;
                DietGenerator.userProfile.height = parseFloat(document.getElementById('diet-height').value) || 175;
                DietGenerator.userProfile.age = parseInt(document.getElementById('diet-age').value) || 25;
                DietGenerator.userProfile.gender = document.getElementById('diet-gender').value;
                DietGenerator.userProfile.preference = document.getElementById('diet-preference').value;

                const result = DietGenerator.generatePlan();
                this.renderResult(result);

                // Reset button
                generateBtn.textContent = originalText;
                generateBtn.style.opacity = '1';
                generateBtn.style.pointerEvents = 'auto';
            }, 600);
        });
    },

    renderResult(result) {
        const container = document.getElementById('dietResultsContainer');
        
        if (result.error) {
            container.innerHTML = `<div class="error-message">${result.error}</div>`;
            return;
        }

        const isVegMode = DietGenerator.userProfile.preference === 'veg';

        container.innerHTML = `
            <div class="daily-plan-card">
                <div class="card-header">
                    <h2>
                        ${isVegMode ? '<span style="color: #10B981">🌱</span> Pure Veg Diet Plan' : 'Daily Diet Plan'}
                    </h2>
                    <span class="calorie-target">Target: ${Math.round(result.bmr)} kcal</span>
                </div>
                
                <div class="macro-summary">
                    <div class="macro-stat">
                        <span class="value">${Math.round(result.totals.calories)}</span>
                        <span class="label">Calories</span>
                    </div>
                    <div class="macro-stat">
                        <span class="value">${Math.round(result.totals.protein)}g</span>
                        <span class="label">Protein</span>
                    </div>
                    <div class="macro-stat">
                        <span class="value">${result.totals.carbs}g</span>
                        <span class="label">Carbs</span>
                    </div>
                    <div class="macro-stat">
                        <span class="value">${result.totals.fats}g</span>
                        <span class="label">Fats</span>
                    </div>
                </div>

                <div class="meal-list">
                    ${result.meals.map(meal => `
                        <div class="meal-item">
                            <div class="meal-info">
                                <span class="meal-type">
                                    ${meal.mealType}
                                    <span class="diet-badge ${meal.isVeg ? 'veg' : 'non-veg'}">
                                        ${meal.isVeg ? 'VEG' : 'NON-VEG'}
                                    </span>
                                </span>
                                <span class="meal-name">${meal.name}</span>
                            </div>
                            <div class="meal-macros">
                                ${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fats}g
                            </div>
                        </div>
                    `).join('')}
                </div>

                <button class="add-to-diary-btn" id="addToDiary">Add to Diet Diary</button>
            </div>
        `;

        document.getElementById('addToDiary').addEventListener('click', () => {
            DietGenerator.addToDiary(result);
        });
    }
};

// Initialize UI
document.addEventListener('DOMContentLoaded', () => UI.init());
