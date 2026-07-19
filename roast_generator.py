import os
import random
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=API_KEY) if API_KEY else None


MOCK_ROASTS = [
    "I confidently announced I'd finish '{goal}', then immediately opened YouTube. Peak productivity.",
    "Reminder: I treat deadlines like optional side quests. '{goal}' is still untouched.",
    "Breaking news: '{goal}' is losing a fight against my attention span.",
    "I told everyone I was grinding. Turns out I meant grinding ranked games instead of '{goal}'.",
    "Today's achievement: successfully procrastinated on '{goal}' for absolutely no reason.",
    "My Wi-Fi has worked harder than I have on '{goal}'.",
    "I keep saying 'I'll start tomorrow.' Tomorrow has filed a restraining order.",
    "Fun fact: '{goal}' has become a decorative item on my to-do list.",
    "Xuppu says I'm built different. Mostly built to procrastinate.",
    "If avoiding '{goal}' were an Olympic sport I'd already have gold."
]


def generate_mock_roast(goal_name):
    roast = random.choice(MOCK_ROASTS)
    return roast.format(goal=goal_name)


def generate_roast_tweet(goal_name, progress, difficulty, days_overdue):

    # -------- MOCK MODE --------
    if client is None:
        return generate_mock_roast(goal_name)

    # -------- REAL OPENAI MODE --------
    prompt = f"""
You are Xuppu, the Kwami of Derision from Miraculous Ladybug.

Your personality:
- sarcastic
- chaotic
- playful
- funny
- never genuinely mean
- maximum 280 characters

Goal: {goal_name}
Progress: {progress}%
Difficulty: {difficulty}
Days overdue: {days_overdue}

Generate one embarrassing tweet that the user would hate to have posted publicly.
Return ONLY the tweet.
"""

    response = client.responses.create(
        model="gpt-4.1-mini",
        input=prompt
    )

    return response.output_text.strip()