

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
    // 1. ADD YOUR KEY HERE
    // No longer needed: Key moved to backend

    userProfile: {
        weight: 70,
        height: 175,
        age: 25,
        gender: 'male',
        preference: 'veg',
        allergies: []
    },

    calculateBMR() {
        const { weight, height, age, gender } = this.userProfile;
        const s = gender === 'male' ? 5 : -161;
        return (10 * weight) + (6.25 * height) - (5 * age) + s;
    },

    /**
     * AI GENERATOR: Corrected Endpoint and Logic
     */
    async generateSmartPlan() {
        try {
            const response = await fetch('/api/ai/generate-diet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile: this.userProfile })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Backend AI call failed, using local backup:", error.message);
            return this.generatePlan();
        }
    },

    /**
     * LOCAL FALLBACK ALGORITHM
     */
    getSafeFoodPool() {
        return FOOD_DATABASE.filter(food => {
            const allergenSafe = !food.allergens.some(a => this.userProfile.allergies.includes(a));
            const preferenceSafe = this.userProfile.preference === 'veg' ? food.isVeg : true;
            return allergenSafe && preferenceSafe;
        });
    },

    generatePlan() {
        const safePool = this.getSafeFoodPool();
        const bmr = this.calculateBMR();
        const proteinRatio = this.userProfile.preference === 'veg' ? 1.4 : 1.6;
        const proteinTarget = this.userProfile.weight * proteinRatio;

        const byType = {
            breakfast: safePool.filter(f => f.mealType === 'breakfast'),
            lunch: safePool.filter(f => f.mealType === 'lunch'),
            dinner: safePool.filter(f => f.mealType === 'dinner'),
            snack: safePool.filter(f => f.mealType === 'snack')
        };

        if (!byType.breakfast.length || !byType.lunch.length || !byType.dinner.length || !byType.snack.length) {
            return { error: "Local database restricted by too many filters." };
        }

        let bestPlan = null;
        let minDiff = Infinity;

        for (let i = 0; i < 500; i++) {
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
            if (calorieDiff < minDiff) {
                minDiff = calorieDiff;
                bestPlan = { meals: plan, totals, bmr, proteinTarget };
            }
        }
        return bestPlan;
    },

    savedPlans: [],

    addToDiary(plan) {
        const timestamp = new Date().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const savedPlan = JSON.parse(JSON.stringify(plan));
        savedPlan.timestamp = timestamp;
        this.savedPlans.unshift(savedPlan);

        const btn = document.getElementById('addToDiary');
        btn.textContent = '✓ Saved!';
        btn.style.background = '#10B981';

        setTimeout(() => {
            btn.textContent = 'Add to Diet Diary';
            btn.style.background = '';
            this.renderDiary();
        }, 1500);
    },

    renderDiary() {
        const container = document.getElementById('dietDiaryContainer');
        if (!container || this.savedPlans.length === 0) return;
        container.innerHTML = `
            <table class="diary-table">
                <thead><tr><th>Date</th><th>Calories</th><th>Protein</th><th>Source</th></tr></thead>
                <tbody>
                    ${this.savedPlans.map(p => `
                        <tr>
                            <td>${p.timestamp}</td>
                            <td>${Math.round(p.totals.calories)} kcal</td>
                            <td>${Math.round(p.totals.protein)}g</td>
                            <td>${p.isAI ? '✨ AI' : '💾 Local'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
    }
};

const UI = {
    init() {
        this.renderAllergyChips();
        this.setupEventListeners();
    },

    renderAllergyChips() {
        const container = document.getElementById('dietAllergyChips');
        const allergies = ['nuts', 'dairy', 'gluten', 'soy', 'eggs', 'fish'];
        container.innerHTML = allergies.map(a => `<div class="allergy-chip" data-allergy="${a}">${a}</div>`).join('');
        container.querySelectorAll('.allergy-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                DietGenerator.userProfile.allergies = Array.from(document.querySelectorAll('.allergy-chip.active')).map(c => c.dataset.allergy);
            });
        });
    },

    setupEventListeners() {
        const generateBtn = document.getElementById('dietGenerateBtn');
        generateBtn.addEventListener('click', async () => {
            generateBtn.textContent = 'AI is crafting your plan...';
            generateBtn.style.pointerEvents = 'none';

            // Sync UI values to Profile
            DietGenerator.userProfile.weight = parseFloat(document.getElementById('diet-weight').value) || 70;
            DietGenerator.userProfile.height = parseFloat(document.getElementById('diet-height').value) || 175;
            DietGenerator.userProfile.age = parseInt(document.getElementById('diet-age').value) || 25;
            DietGenerator.userProfile.gender = document.getElementById('diet-gender').value;
            DietGenerator.userProfile.preference = document.getElementById('diet-preference').value;

            const result = await DietGenerator.generateSmartPlan();
            this.renderResult(result);

            generateBtn.textContent = 'Generate New Diet Plan';
            generateBtn.style.pointerEvents = 'auto';
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
                        ${result.isAI ? '✨ ' : '💾 '}
                        ${isVegMode ? '<span style="color: #10B981">🌱</span> Pure Veg Diet' : 'Daily Diet Plan'}
                    </h2>
                    <span class="calorie-target">Target: ${Math.round(result.bmr)} kcal</span>
                </div>
                
                <div class="macro-summary">
                    <div class="macro-stat"><span class="value">${Math.round(result.totals.calories)}</span><span class="label">Calories</span></div>
                    <div class="macro-stat"><span class="value">${Math.round(result.totals.protein)}g</span><span class="label">Protein</span></div>
                    <div class="macro-stat"><span class="value">${result.totals.carbs}g</span><span class="label">Carbs</span></div>
                    <div class="macro-stat"><span class="value">${result.totals.fats}g</span><span class="label">Fats</span></div>
                </div>

                <div class="meal-list">
                    ${result.meals.map(meal => `
                        <div class="meal-item">
                            <div class="meal-info">
                                <span class="meal-type">${meal.mealType} <span class="diet-badge ${meal.isVeg ? 'veg' : 'non-veg'}">${meal.isVeg ? 'VEG' : 'NON-VEG'}</span></span>
                                <span class="meal-name">${meal.name}</span>
                            </div>
                            <div class="meal-macros">${meal.calories} kcal | P: ${meal.protein}g | C: ${meal.carbs}g | F: ${meal.fats}g</div>
                        </div>`).join('')}
                </div>
                <button class="add-to-diary-btn" id="addToDiary">Add to Diet Diary</button>
            </div>`;

        document.getElementById('addToDiary').addEventListener('click', () => DietGenerator.addToDiary(result));
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());
