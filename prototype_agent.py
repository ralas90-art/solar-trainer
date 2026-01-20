import time
import json

# --- MOCK DATABASE ---
STATE_KNOWLEDGE_BASE = {
    "CA": {
        "name": "California",
        "metering": "NEM 3.0",
        "incentives": ["SGIP (Battery Rebate)", "30% Federal ITC"],
        "critical_keywords": ["battery", "storage", "evening usage", "nem 3.0"],
        "pitch_focus": "Self-consumption. Don't sell to grid, store it."
    },
    "NY": {
        "name": "New York",
        "metering": "Net Metering / VDER",
        "incentives": ["25% NY State Tax Credit", "MW Block Grant"],
        "critical_keywords": ["tax credit", "one-to-one", "value stack"],
        "pitch_focus": "Tax liability offset and grid credits."
    }
}

TENANT_CONFIGS = {
    "1": {
        "id": "solar_bros_inc",
        "name": "Solar Bros Inc",
        "allowed_states": ["CA"],
        "brand_tone": "Aggressive, high-energy"
    },
    "2": {
        "id": "green_future_solutions",
        "name": "Green Future Solutions",
        "allowed_states": ["NY", "CA"],
        "brand_tone": "Consultative, educational"
    }
}

class SolarSalesTrainer:
    def __init__(self):
        self.current_state = None
        self.current_tenant = None
        self.user_profile = {
            "experience_years": 0,
            "has_sold_solar": False,
            "skill_level": "Beginner" # Beginner, Intermediate, Advanced
        }
        
    def authenticate_tenant(self):
        print("\n--- WHITE-LABEL LOGIN ---")
        print("Available Tenants:")
        for k, v in TENANT_CONFIGS.items():
            print(f"{k}. {v['name']}")
            
        choice = input("Select Tenant ID: ")
        if choice in TENANT_CONFIGS:
            self.current_tenant = TENANT_CONFIGS[choice]
            print(f"Logged in as: {self.current_tenant['name']}")
            print(f"Brand Tone: {self.current_tenant['brand_tone']}")
        else:
            print("Invalid tenant. Defaulting to Solar Bros.")
            self.current_tenant = TENANT_CONFIGS["1"]

    def select_state(self):
        print("\n--- TERRITORY SELECTION ---")
        available = self.current_tenant['allowed_states']
        print(f"Authorized States: {', '.join(available)}")
        
        choice = input("Enter State Code (e.g., CA): ").upper()
        if choice in available:
            self.current_state = STATE_KNOWLEDGE_BASE[choice]
            print(f"Loaded Logic for: {self.current_state['name']}")
        else:
            print("Invalid state. Defaulting to first available.")
            self.current_state = STATE_KNOWLEDGE_BASE[available[0]]

    def assess_skill_level(self):
        print("\n--- SKILL ASSESSMENT ---")
        try:
            years = float(input("How many years of sales experience do you have? (0-10+): "))
            solar_exp = input("Have you sold solar before? (y/n): ").lower().startswith('y')
            
            if years < 1:
                self.user_profile["skill_level"] = "Beginner"
            elif years >= 5:
                self.user_profile["skill_level"] = "Advanced"
            else:
                self.user_profile["skill_level"] = "Intermediate"
                
            self.user_profile["experience_years"] = years
            self.user_profile["has_sold_solar"] = solar_exp
            
            print(f"Assessed Level: {self.user_profile['skill_level']}")
            
        except ValueError:
            print("Invalid input. Defaulting to Beginner.")
            self.user_profile["skill_level"] = "Beginner"

    def determine_curriculum(self):
        level = self.user_profile["skill_level"]
        print(f"\n--- RECOMMENDED CURRICULUM ({level}) ---")
        
        if level == "Beginner":
            print("1. [LOCKED] Module 0: Foundations (Mindset & Habits)")
            print("   * Must complete 'The No-Counter' exercise first.")
            return "0"
        elif level == "Intermediate":
            print("1. Module 1: Door-to-Door Mastery")
            print("2. Module 2: Phone Sales")
            return "1"
        elif level == "Advanced":
            print("1. Module 4: Advanced Objection Handling (Fast-Track)")
            print("2. Test-Out of all modules")
            return "4"
        return "1"

    def start_session(self):
        print("Welcome to the Multi-Tenant Solar Sales Trainer (Prototype v0.3)")
        self.authenticate_tenant()
        self.select_state()
        self.assess_skill_level()
        
        module_choice = self.determine_curriculum()
        
        if module_choice == "0":
            self.run_foundations_module()
        elif module_choice in ["1", "4"]:
            self.run_roleplay_menu()

    def run_foundations_module(self):
        print("\n--- MODULE 0: FOUNDATIONS ---")
        print("Objective: Build Resilience.")
        print("TASK: A homeowner slams the door. What do you do?")
        print("A) Curse under your breath.")
        print("B) Knock on the next door immediately.")
        print("C) Go sit in your car for 10 minutes.")
        
        ans = input("Your Choice (A/B/C): ").upper()
        if ans == "B":
             print("CORRECT! Resilience is key. Unlocking Module 1...")
             self.run_roleplay_menu()
        else:
             print("INCORRECT. Activity cures anxiety. Try again.")
             self.run_foundations_module()

    def run_roleplay_menu(self):
        print("\n--- SALES FLOOR SIMULATION ---")
        print("1. Door-to-Door (The 'Not Interested' Objection)")
        choice = input("Enter 1: ")
        
        if choice == "1":
            self.run_scenario_d2d()

    def run_scenario_d2d(self):
        scene_name = "The Penny Pincher"
        opening_line = "Solar is too expensive. I'll pass."
        
        print(f"\n--- SCENARIO: {scene_name} ---")
        print(f"Location: {self.current_state['name']}")
        print(f"CUSTOMER: '{opening_line}'")
        
        user_response = input("YOU (Reply): ")
        
        # Dynamic Evaluation based on State
        score = 0
        feedback = []
        
        # Check for state-specific keywords
        found_keywords = [kw for kw in self.current_state['critical_keywords'] if kw in user_response.lower()]
        
        if found_keywords:
            score += 1
            feedback.append(f"Good use of local terms: {', '.join(found_keywords)}")
        else:
            feedback.append(f"Missed Policy Terms! In {self.current_state['name']}, you MUST mention: {', '.join(self.current_state['critical_keywords'])}")
            
        if score > 0:
            print("\nVERDICT: PASS")
        else:
            print("\nVERDICT: RETRY NEEDED")
            
        print("FEEDBACK:")
        for item in feedback:
            print(f"- {item}")

if __name__ == "__main__":
    agent = SolarSalesTrainer()
    agent.start_session()
