import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generatePlanFromGoal = async (title, numberOfDays, hoursPerDay, ytLink) => {
  const prompt = `
I want to achieve the goal: "${title}" in ${numberOfDays} days.
I can spend ${hoursPerDay} hours daily.
${ytLink ? `I want to use this YouTube playlist: ${ytLink}` : ''}

Please generate a daily study plan to help me achieve this goal. Format the response as follows:

For each day, use this exact format:
**Day X:**
**Section Title:**
* Main Task 1: Subtask 1 • Subtask 2 • Subtask 3
* Main Task 2: Subtask 1 • Subtask 2
* Main Task 3

Example format:
**Day 1:**
**Introduction:**
* What are data structures?: Definition • Types • Importance
* Basic concepts: Time complexity • Space complexity • Big O notation

**Setup:**
* Development environment: Install IDE • Configure settings • Test setup
* Practice problems: String manipulation • Basic math • Simple logic

**Day 2:**
**Arrays:**
* Array concepts: Indexing • Inserting • Deleting
* Dynamic arrays: Implementation • Time complexity • Space complexity

Make sure to:
1. Use exactly two asterisks (**) for section headers
2. Use exactly one asterisk (*) for main tasks
3. Use bullet points (•) for subtasks
4. Separate main tasks and subtasks with a colon (:)
5. Keep each day's content under its own Day X header
6. Include practical tasks and exercises for each day
7. Progress from basic to advanced concepts
8. Include both theoretical and practical components
9. Generate exactly ${numberOfDays} days of content
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = await response.text();

    // Parse the response into structured data
    const days = [];
    let currentDay = null;
    let currentSection = null;

    const lines = text.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for Day marker
      const dayMatch = trimmedLine.match(/\*\*Day\s+(\d+):\*\*/);
      if (dayMatch) {
        if (currentDay) {
          days.push(currentDay);
        }
        currentDay = {
          day: parseInt(dayMatch[1]),
          task: ''
        };
        continue;
      }

      // Check for Section marker
      const sectionMatch = trimmedLine.match(/\*\*([^*]+)\*\*/);
      if (sectionMatch) {
        if (currentDay) {
          currentDay.task += `\n**${sectionMatch[1]}**\n`;
        }
        continue;
      }

      // Check for Task marker
      if (trimmedLine.startsWith('*')) {
        if (currentDay) {
          currentDay.task += `${trimmedLine}\n`;
        }
      }
    }

    // Add the last day if exists
    if (currentDay) {
      days.push(currentDay);
    }

    console.log("Parsed Plan:", days);
    return days;
  } catch (err) {
    console.error('Gemini API Error:', err);
    return [{ day: 1, task: 'Error generating plan' }];
  }
};