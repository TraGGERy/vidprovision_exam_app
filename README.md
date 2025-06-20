# Driving License Quiz App with AI Tutor

A modern, interactive quiz application to help users prepare for their driving license exam. The app features an AI-powered tutor that provides personalized feedback and explanations.

## Features

- Multiple quiz modes: Random, By Test, Practice, and Exam
- Configurable number of questions and time limits
- Interactive UI with immediate feedback
- Image support for visual driving scenarios
- AI Tutor powered by OpenAI for personalized explanations
- Game-like elements: XP, levels, streaks, and character interactions

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API key (for AI Tutor functionality)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Set up your environment variables by editing the `.env.local` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Running the Application

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## AI Tutor Feature

The AI Tutor provides personalized explanations and feedback based on user answers. It can operate in two modes:

1. **Standard Mode**: Simple explanations and feedback
2. **Game Mode**: Includes character interactions, XP, levels, and streaks

### Tutor Characters

- **Professor Drive** 🧠: Academic approach with formal explanations
- **Captain Roadwise** 🚗: Enthusiastic and motivational
- **Safety Sally** 🛡️: Focuses on safety and defensive driving
- **Mechanic Mike** 🔧: Technical explanations with vehicle operation details

## Adding More Questions

Questions are stored in the `questions.json` file. Each question follows this format:

```json
{
  "question_id": "unique_id",
  "question_text": "The question text goes here?",
  "image_url": "optional_image_path.png",
  "options": [
    "Option A",
    "Option B",
    "Option C"
  ],
  "correct_answer": "Option B"
}
```

## License

This project is licensed under the MIT License.
