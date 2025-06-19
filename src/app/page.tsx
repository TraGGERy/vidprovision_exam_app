'use client';

import { useState, useEffect, useMemo } from "react";
import QuestionImage from "../components/QuestionImage";
import { Question, getAllQuestions, getQuestionsByTest, getAllTestIds, shuffle, getAnswerIndex } from "../utils/questionUtils";

// Legacy interface for backward compatibility
interface LegacyQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  image?: string;
  image_url?: string;
  explanation?: string;
}

// Legacy questions array (keeping for reference)
const legacyDrivingQuestions: LegacyQuestion[] = [
  // Traffic Lights and Signs
  {
    id: 1,
    question: "What does a red traffic light mean?",
    options: ["Go", "Stop", "Yield", "Caution"],
    answer: 1,
    explanation: "A red traffic light means you must come to a complete stop."
  },
  {
    id: 2,
    question: "What should you do at a stop sign?",
    options: ["Slow down", "Stop completely", "Honk horn", "Speed up"],
    answer: 1,
    explanation: "You must come to a complete stop at a stop sign, even if no other traffic is visible."
  },
  {
    id: 3,
    question: "What does a yellow traffic light mean?",
    options: ["Speed up", "Stop if safe to do so", "Go faster", "Turn left"],
    answer: 1,
    explanation: "A yellow light means caution - stop if you can do so safely, otherwise proceed with caution."
  },
  {
    id: 4,
    question: "What does a flashing red light mean?",
    options: ["Caution", "Stop, then proceed when safe", "Yield", "Go"],
    answer: 1,
    explanation: "A flashing red light means stop completely, then proceed when safe (same as a stop sign)."
  },
  {
    id: 5,
    question: "What does a flashing yellow light mean?",
    options: ["Stop", "Proceed with caution", "Speed up", "Turn only"],
    answer: 1,
    explanation: "A flashing yellow light means proceed with caution and be prepared to yield."
  },
  {
    id: 6,
    question: "What does a green arrow traffic light mean?",
    options: ["Yield to oncoming traffic", "Protected turn", "Stop", "Caution"],
    answer: 1,
    explanation: "A green arrow means you have a protected turn and oncoming traffic has a red light."
  },
  {
    id: 7,
    question: "What does an octagonal red sign mean?",
    options: ["Yield", "Stop", "No entry", "Speed limit"],
    answer: 1,
    explanation: "An octagonal (8-sided) red sign is always a stop sign."
  },
  {
    id: 8,
    question: "What does a triangular sign with a red border mean?",
    options: ["Stop", "Yield", "No entry", "Warning"],
    answer: 1,
    explanation: "A triangular sign with a red border is a yield sign."
  },
  {
    id: 9,
    question: "What does a diamond-shaped road sign indicate?",
    options: ["Warning", "Regulatory", "Guide", "Construction"],
    answer: 0,
    explanation: "Diamond-shaped signs are warning signs that alert drivers to potential hazards ahead."
  },
  {
    id: 10,
    question: "What does a circular sign with a red border and diagonal line mean?",
    options: ["Warning", "Prohibition/Not allowed", "Mandatory", "Information"],
    answer: 1,
    explanation: "A circular sign with red border and diagonal line indicates something is prohibited or not allowed."
  },
  
  // Speed Limits and Following Distance
  {
    id: 11,
    question: "What is the speed limit in most residential areas?",
    options: ["25 mph", "35 mph", "45 mph", "55 mph"],
    answer: 0,
    explanation: "Most residential areas have a speed limit of 25 mph unless otherwise posted."
  },
  {
    id: 12,
    question: "What is the speed limit in school zones when children are present?",
    options: ["15 mph", "20 mph", "25 mph", "30 mph"],
    answer: 1,
    explanation: "School zones typically have a 20 mph speed limit when children are present."
  },
  {
    id: 13,
    question: "How far should you follow behind another vehicle?",
    options: ["1 second", "2 seconds", "3 seconds", "5 seconds"],
    answer: 2,
    explanation: "The 3-second rule is a safe following distance under normal conditions."
  },
  {
    id: 14,
    question: "What is the minimum safe following distance in poor weather?",
    options: ["3 seconds", "4 seconds", "6 seconds", "8 seconds"],
    answer: 2,
    explanation: "In poor weather conditions, increase following distance to at least 6 seconds."
  },
  {
    id: 15,
    question: "At what speed should you drive in heavy fog?",
    options: ["Normal speed", "Slightly slower", "Much slower with hazards on", "As fast as possible"],
    answer: 2,
    explanation: "In heavy fog, drive much slower and use hazard lights for visibility."
  },
  
  // Right of Way and Yielding
  {
    id: 16,
    question: "When must you yield the right of way?",
    options: ["Never", "To pedestrians in crosswalks", "Only to emergency vehicles", "Only at stop signs"],
    answer: 1,
    explanation: "You must always yield to pedestrians in crosswalks, among other situations."
  },
  {
    id: 17,
    question: "At a four-way stop, who has the right of way?",
    options: ["The largest vehicle", "The vehicle that arrived first", "The vehicle on the right", "The vehicle going straight"],
    answer: 1,
    explanation: "At a four-way stop, the vehicle that arrived first has the right of way."
  },
  {
    id: 18,
    question: "When turning left at an intersection, you must yield to:",
    options: ["No one", "Oncoming traffic", "Traffic from the right only", "Pedestrians only"],
    answer: 1,
    explanation: "When turning left, you must yield to oncoming traffic and pedestrians."
  },
  {
    id: 19,
    question: "Who has the right of way at a roundabout?",
    options: ["Entering traffic", "Traffic already in the roundabout", "The largest vehicle", "Traffic from the left"],
    answer: 1,
    explanation: "Traffic already in the roundabout has the right of way over entering traffic."
  },
  {
    id: 20,
    question: "When must you yield to emergency vehicles?",
    options: ["Only if they're behind you", "Only at intersections", "Always when they have lights/sirens on", "Never"],
    answer: 2,
    explanation: "You must always yield to emergency vehicles with lights and/or sirens activated."
  },
  
  // Turning and Lane Changes
  {
    id: 21,
    question: "When should you use your turn signals?",
    options: ["Only when turning left", "Only when changing lanes", "Before any turn or lane change", "Only at intersections"],
    answer: 2,
    explanation: "Turn signals should be used before any turn or lane change to communicate your intentions to other drivers."
  },
  {
    id: 22,
    question: "How far in advance should you signal before turning?",
    options: ["50 feet", "100 feet", "200 feet", "500 feet"],
    answer: 1,
    explanation: "You should signal at least 100 feet before turning in urban areas."
  },
  {
    id: 23,
    question: "When should you check your blind spots?",
    options: ["Only when parking", "Before changing lanes", "Only when turning", "Never"],
    answer: 1,
    explanation: "Always check blind spots before changing lanes or merging."
  },
  {
    id: 24,
    question: "What should you do before changing lanes?",
    options: ["Just signal", "Check mirrors only", "Signal, check mirrors and blind spots", "Change quickly"],
    answer: 2,
    explanation: "Before changing lanes, signal, check mirrors, and check blind spots."
  },
  {
    id: 25,
    question: "When is it illegal to change lanes?",
    options: ["Never", "On solid yellow lines", "At intersections", "Both B and C"],
    answer: 3,
    explanation: "It's illegal to change lanes on solid lines and at intersections."
  },
  
  // Parking and Stopping
  {
    id: 26,
    question: "When parking on a hill, which way should you turn your wheels?",
    options: ["Always toward the curb", "Always away from the curb", "Toward curb going downhill, away going uphill", "It doesn't matter"],
    answer: 2,
    explanation: "Turn wheels toward the curb when facing downhill, away from curb when facing uphill."
  },
  {
    id: 27,
    question: "When should you use your parking brake?",
    options: ["Only on hills", "Only when parking", "Every time you park", "Only in emergencies"],
    answer: 2,
    explanation: "Use your parking brake every time you park to prevent the vehicle from rolling."
  },
  {
    id: 28,
    question: "How far from a fire hydrant must you park?",
    options: ["5 feet", "10 feet", "15 feet", "20 feet"],
    answer: 2,
    explanation: "You must park at least 15 feet away from a fire hydrant."
  },
  {
    id: 29,
    question: "How far from a crosswalk must you park?",
    options: ["10 feet", "15 feet", "20 feet", "25 feet"],
    answer: 2,
    explanation: "You must park at least 20 feet from a crosswalk."
  },
  {
    id: 30,
    question: "Where is it illegal to park?",
    options: ["Near fire hydrants", "In front of driveways", "On sidewalks", "All of the above"],
    answer: 3,
    explanation: "It's illegal to park near fire hydrants, in front of driveways, and on sidewalks."
  },
  
  // School Buses and Special Vehicles
  {
    id: 31,
    question: "What should you do when approaching a school bus with flashing red lights?",
    options: ["Slow down", "Stop completely", "Change lanes", "Honk horn"],
    answer: 1,
    explanation: "You must stop when a school bus has flashing red lights, as children may be crossing."
  },
  {
    id: 32,
    question: "When can you pass a school bus?",
    options: ["Never", "When lights are off and bus is moving", "Only on the left", "When children aren't visible"],
    answer: 1,
    explanation: "You can only pass a school bus when its lights are off and it's moving."
  },
  {
    id: 33,
    question: "What should you do when you see a pedestrian with a white cane?",
    options: ["Honk to alert them", "Give them extra space and time", "Drive around quickly", "Flash your lights"],
    answer: 1,
    explanation: "A white cane indicates a visually impaired pedestrian. Give them extra space and time to cross safely."
  },
  {
    id: 34,
    question: "What does a white cane with a red tip indicate?",
    options: ["Blind person", "Deaf and blind person", "Elderly person", "Disabled person"],
    answer: 1,
    explanation: "A white cane with a red tip indicates a person who is both deaf and blind."
  },
  {
    id: 35,
    question: "When should you yield to a guide dog?",
    options: ["Never", "Always", "Only at crosswalks", "Only when the owner signals"],
    answer: 1,
    explanation: "Always yield to guide dogs and their handlers."
  },
  
  // Passing and Overtaking
  {
    id: 36,
    question: "When is it legal to pass another vehicle?",
    options: ["Anytime", "Only on the left", "When safe and legal", "Only on highways"],
    answer: 2,
    explanation: "You may only pass when it is safe and legal to do so, with clear visibility and no oncoming traffic."
  },
  {
    id: 37,
    question: "Where is passing prohibited?",
    options: ["On hills", "At curves", "Near intersections", "All of the above"],
    answer: 3,
    explanation: "Passing is prohibited on hills, curves, near intersections, and other areas with limited visibility."
  },
  {
    id: 38,
    question: "What does a solid yellow line mean?",
    options: ["Passing allowed", "No passing", "Caution", "Lane change allowed"],
    answer: 1,
    explanation: "A solid yellow line means no passing is allowed."
  },
  {
    id: 39,
    question: "What do double solid yellow lines mean?",
    options: ["Passing allowed both ways", "No passing either direction", "One-way street", "Parking allowed"],
    answer: 1,
    explanation: "Double solid yellow lines mean no passing is allowed in either direction."
  },
  {
    id: 40,
    question: "When can you cross a solid yellow line?",
    options: ["Never", "To turn left into a driveway", "To pass", "Anytime"],
    answer: 1,
    explanation: "You can cross a solid yellow line only to turn left into a driveway or side street."
  },
  
  // Headlights and Visibility
  {
    id: 41,
    question: "When is it required to use headlights?",
    options: ["Only at night", "30 minutes before sunset to 30 minutes after sunrise", "Only in rain", "Only in fog"],
    answer: 1,
    explanation: "Headlights are required from 30 minutes before sunset to 30 minutes after sunrise, and during poor visibility."
  },
  {
    id: 42,
    question: "When should you dim your high beam headlights?",
    options: ["Never", "Within 500 feet of oncoming traffic", "Only in the city", "When it's raining"],
    answer: 1,
    explanation: "Dim high beams within 500 feet of oncoming traffic and 300 feet when following another vehicle."
  },
  {
    id: 43,
    question: "When must you use headlights during the day?",
    options: ["Never", "In rain, fog, or snow", "Only on highways", "Only in construction zones"],
    answer: 1,
    explanation: "Use headlights during the day in rain, fog, snow, or other conditions that reduce visibility."
  },
  {
    id: 44,
    question: "How far should you dim your high beams when following another vehicle?",
    options: ["200 feet", "300 feet", "400 feet", "500 feet"],
    answer: 1,
    explanation: "Dim high beams within 300 feet when following another vehicle."
  },
  {
    id: 45,
    question: "When should you use hazard lights?",
    options: ["When parking illegally", "When your vehicle is disabled", "When driving slowly", "When it's raining"],
    answer: 1,
    explanation: "Use hazard lights when your vehicle is disabled or creating a hazard for other drivers."
  },
  
  // Highway Driving and Merging
  {
    id: 46,
    question: "When merging onto a highway, you should:",
    options: ["Stop and wait for an opening", "Match the speed of traffic", "Drive slowly", "Use hazard lights"],
    answer: 1,
    explanation: "When merging, accelerate to match the speed of highway traffic for safe entry."
  },
  {
    id: 47,
    question: "What should you do if you miss your exit on a highway?",
    options: ["Back up", "Make a U-turn", "Continue to next exit", "Stop and ask for directions"],
    answer: 2,
    explanation: "If you miss your exit, continue to the next exit. Never back up or make U-turns on highways."
  },
  {
    id: 48,
    question: "What is the left lane on a highway primarily for?",
    options: ["Slow traffic", "Passing", "Trucks", "Emergency vehicles only"],
    answer: 1,
    explanation: "The left lane is primarily for passing slower traffic."
  },
  {
    id: 49,
    question: "When should you use the acceleration lane?",
    options: ["To slow down", "To speed up to highway speed", "To park", "To turn around"],
    answer: 1,
    explanation: "Use the acceleration lane to speed up to match highway traffic speed before merging."
  },
  {
    id: 50,
    question: "What should you do when exiting a highway?",
    options: ["Slow down before the exit ramp", "Slow down on the exit ramp", "Maintain highway speed", "Speed up"],
    answer: 1,
    explanation: "Slow down on the exit ramp, not before it, to avoid affecting highway traffic."
  },
  
  // Intersections and Traffic Control
  {
    id: 51,
    question: "What should you do when approaching an intersection with a non-functioning traffic light?",
    options: ["Go through quickly", "Treat it as a four-way stop", "Yield to traffic from the right", "Honk your horn"],
    answer: 1,
    explanation: "Treat a non-functioning traffic light as a four-way stop sign."
  },
  {
    id: 52,
    question: "At an intersection with no signs or signals, who has the right of way?",
    options: ["The larger vehicle", "Traffic from the right", "Traffic going straight", "The first to arrive"],
    answer: 1,
    explanation: "At an uncontrolled intersection, yield to traffic approaching from the right."
  },
  {
    id: 53,
    question: "When can you turn right on red?",
    options: ["Never", "After stopping and when safe", "Anytime", "Only with a green arrow"],
    answer: 1,
    explanation: "You can turn right on red after coming to a complete stop and when it's safe, unless prohibited by signs."
  },
  {
    id: 54,
    question: "When can you turn left on red?",
    options: ["Never", "From a one-way street to another one-way street", "Anytime", "Only with permission"],
    answer: 1,
    explanation: "You can turn left on red only from a one-way street to another one-way street, after stopping."
  },
  {
    id: 55,
    question: "What does a green light mean?",
    options: ["Go immediately", "Proceed when safe", "Speed up", "Turn only"],
    answer: 1,
    explanation: "A green light means proceed when safe, but you must still yield to pedestrians and vehicles in the intersection."
  },
  
  // Vehicle Safety and Maintenance
  {
    id: 56,
    question: "What is the proper hand position on the steering wheel?",
    options: ["12 and 6 o'clock", "10 and 2 o'clock", "9 and 3 o'clock", "11 and 1 o'clock"],
    answer: 2,
    explanation: "The safest hand position is 9 and 3 o'clock for better control and airbag safety."
  },
  {
    id: 57,
    question: "What should you do if your brakes fail?",
    options: ["Pump the brakes", "Use parking brake gradually", "Turn off engine", "All of the above"],
    answer: 3,
    explanation: "If brakes fail, pump them, use parking brake gradually, and turn off the engine while steering to safety."
  },
  {
    id: 58,
    question: "How should you handle a tire blowout?",
    options: ["Brake hard immediately", "Grip wheel firmly and slow down gradually", "Turn sharply", "Speed up"],
    answer: 1,
    explanation: "Grip the wheel firmly, ease off the gas, and slow down gradually. Don't brake hard or turn sharply."
  },
  {
    id: 59,
    question: "What is the purpose of anti-lock brakes (ABS)?",
    options: ["Stop faster", "Prevent wheel lockup", "Reduce brake wear", "Save fuel"],
    answer: 1,
    explanation: "ABS prevents wheels from locking up during hard braking, maintaining steering control."
  },
  {
    id: 60,
    question: "When should you check your mirrors?",
    options: ["Only when changing lanes", "Every 5-8 seconds", "Only when parking", "Once per trip"],
    answer: 1,
    explanation: "Check your mirrors every 5-8 seconds to maintain awareness of your surroundings."
  },
  
  // Alcohol and Impaired Driving
  {
    id: 61,
    question: "What is the legal blood alcohol limit for drivers 21 and over?",
    options: ["0.05%", "0.08%", "0.10%", "0.12%"],
    answer: 1,
    explanation: "The legal blood alcohol limit is 0.08% for drivers 21 and over in most jurisdictions."
  },
  {
    id: 62,
    question: "What is the legal blood alcohol limit for drivers under 21?",
    options: ["0.00%", "0.02%", "0.05%", "0.08%"],
    answer: 1,
    explanation: "Most states have a 0.02% limit for drivers under 21 (zero tolerance laws)."
  },
  {
    id: 63,
    question: "What is the legal blood alcohol limit for commercial drivers?",
    options: ["0.02%", "0.04%", "0.06%", "0.08%"],
    answer: 1,
    explanation: "Commercial drivers have a lower limit of 0.04% blood alcohol content."
  },
  {
    id: 64,
    question: "How long does it take for one drink to leave your system?",
    options: ["30 minutes", "1 hour", "2 hours", "3 hours"],
    answer: 1,
    explanation: "It takes approximately one hour for your body to process one standard drink."
  },
  {
    id: 65,
    question: "What affects blood alcohol content?",
    options: ["Body weight", "Food consumption", "Time between drinks", "All of the above"],
    answer: 3,
    explanation: "Body weight, food consumption, time between drinks, and other factors all affect BAC."
  },
  
  // Cell Phones and Distractions
  {
    id: 66,
    question: "When is it safe to use a cell phone while driving?",
    options: ["At red lights", "On highways only", "When using hands-free device", "Never"],
    answer: 2,
    explanation: "Only use hands-free devices when driving. Hand-held phone use while driving is dangerous and often illegal."
  },
  {
    id: 67,
    question: "What is the safest way to use a GPS while driving?",
    options: ["Hold it while driving", "Set destination before driving", "Have passenger operate it", "Both B and C"],
    answer: 3,
    explanation: "Set your GPS destination before driving and have a passenger operate it if changes are needed."
  },
  {
    id: 68,
    question: "What should you do if you need to make an urgent phone call while driving?",
    options: ["Make the call while driving", "Pull over safely first", "Use speaker phone", "Text instead"],
    answer: 1,
    explanation: "Always pull over safely before making phone calls while driving."
  },
  {
    id: 69,
    question: "Which is the most dangerous driving distraction?",
    options: ["Eating", "Texting", "Talking to passengers", "Adjusting radio"],
    answer: 1,
    explanation: "Texting is considered the most dangerous driving distraction as it involves visual, manual, and cognitive attention."
  },
  {
    id: 70,
    question: "How long does it take to send a text message?",
    options: ["2 seconds", "5 seconds", "10 seconds", "15 seconds"],
    answer: 1,
    explanation: "Sending a text takes about 5 seconds, during which you're essentially driving blind."
  },
  
  // Weather and Road Conditions
  {
    id: 71,
    question: "How should you drive in heavy rain?",
    options: ["Normal speed", "Slower with headlights on", "Faster to get through it", "Pull over immediately"],
    answer: 1,
    explanation: "Drive slower in heavy rain and use headlights for better visibility."
  },
  {
    id: 72,
    question: "What is hydroplaning?",
    options: ["Flying over water", "Tires losing contact with road due to water", "Driving through puddles", "Water in the engine"],
    answer: 1,
    explanation: "Hydroplaning occurs when tires lose contact with the road surface due to water."
  },
  {
    id: 73,
    question: "What should you do if your vehicle starts to hydroplane?",
    options: ["Brake hard", "Ease off gas and steer straight", "Turn sharply", "Accelerate"],
    answer: 1,
    explanation: "If hydroplaning, ease off the gas and keep the steering wheel straight until you regain control."
  },
  {
    id: 74,
    question: "How should you drive on icy roads?",
    options: ["Normal speed", "Very slowly and smoothly", "With chains only", "Avoid driving"],
    answer: 1,
    explanation: "Drive very slowly and smoothly on icy roads, avoiding sudden movements."
  },
  {
    id: 75,
    question: "What should you do if you start to skid on ice?",
    options: ["Brake hard", "Steer in direction of skid", "Steer opposite to skid", "Accelerate"],
    answer: 1,
    explanation: "Steer in the direction you want to go (direction of the skid) and ease off the gas."
  },
  
  // Construction Zones and Work Areas
  {
    id: 76,
    question: "What should you do in a construction zone?",
    options: ["Maintain normal speed", "Slow down and follow signs", "Speed up to get through quickly", "Change lanes frequently"],
    answer: 1,
    explanation: "Slow down and carefully follow all posted signs and flaggers in construction zones."
  },
  {
    id: 77,
    question: "What do orange signs typically indicate?",
    options: ["School zones", "Construction or work zones", "Hospital zones", "Park areas"],
    answer: 1,
    explanation: "Orange signs typically indicate construction or work zones."
  },
  {
    id: 78,
    question: "When should you merge in a construction zone?",
    options: ["At the last moment", "As soon as you see signs", "When traffic allows", "Never"],
    answer: 1,
    explanation: "Merge as soon as you see construction zone signs, not at the last moment."
  },
  {
    id: 79,
    question: "What is the penalty for speeding in a work zone?",
    options: ["Same as normal", "Double the fine", "Triple the fine", "No penalty"],
    answer: 1,
    explanation: "Fines are typically doubled in work zones to protect workers."
  },
  {
    id: 80,
    question: "How should you treat flaggers in work zones?",
    options: ["Ignore them", "Obey their signals like traffic lights", "Go around them", "Honk at them"],
    answer: 1,
    explanation: "Treat flagger signals like traffic lights and obey them completely."
  },
  
  // Motorcycles and Bicycles
  {
    id: 81,
    question: "How much space should you give a motorcycle?",
    options: ["Same as a car", "Less space", "More space", "No specific space"],
    answer: 2,
    explanation: "Give motorcycles more space than cars as they can stop more quickly and are less visible."
  },
  {
    id: 82,
    question: "Where are motorcycles most likely to be in your blind spot?",
    options: ["Behind you", "To your sides", "In front", "Nowhere"],
    answer: 1,
    explanation: "Motorcycles are most likely to be in your side blind spots due to their smaller size."
  },
  {
    id: 83,
    question: "How should you pass a bicycle?",
    options: ["Quickly and close", "Slowly with plenty of space", "Honk first", "Don't pass"],
    answer: 1,
    explanation: "Pass bicycles slowly and give them plenty of space (at least 3 feet)."
  },
  {
    id: 84,
    question: "Where should bicycles ride on the road?",
    options: ["On sidewalks", "As far right as practical", "In the center", "Anywhere"],
    answer: 1,
    explanation: "Bicycles should ride as far right as practical and safe."
  },
  {
    id: 85,
    question: "Do bicycles have the same rights as cars?",
    options: ["No", "Yes", "Only sometimes", "Only on bike paths"],
    answer: 1,
    explanation: "Bicycles have the same rights and responsibilities as motor vehicles on the road."
  },
  
  // Pedestrians and Crosswalks
  {
    id: 86,
    question: "When must you stop for pedestrians?",
    options: ["Never", "Only at crosswalks", "When they're in your lane", "When they're in crosswalk or about to enter"],
    answer: 3,
    explanation: "Stop for pedestrians when they're in the crosswalk or about to enter your side."
  },
  {
    id: 87,
    question: "Who has the right of way at an unmarked crosswalk?",
    options: ["Drivers", "Pedestrians", "Whoever gets there first", "No one"],
    answer: 1,
    explanation: "Pedestrians have the right of way at both marked and unmarked crosswalks."
  },
  {
    id: 88,
    question: "What should you do when a pedestrian is crossing illegally?",
    options: ["Hit them", "Honk and proceed", "Stop and let them cross safely", "Speed up"],
    answer: 2,
    explanation: "Even when pedestrians cross illegally, you must stop and let them cross safely."
  },
  {
    id: 89,
    question: "How far from a crosswalk should you stop?",
    options: ["At the crosswalk line", "Before the crosswalk", "In the crosswalk", "Past the crosswalk"],
    answer: 1,
    explanation: "Stop before the crosswalk line to leave space for pedestrians."
  },
  {
    id: 90,
    question: "When should you yield to pedestrians at intersections?",
    options: ["Never", "Always", "Only when they have a walk signal", "Only during the day"],
    answer: 1,
    explanation: "Always yield to pedestrians at intersections, regardless of signals."
  },
  
  // Additional Safety and Rules
  {
    id: 91,
    question: "What does a solid white line mean?",
    options: ["Lane changes encouraged", "Lane changes discouraged", "No lane changes", "Passing zone"],
    answer: 1,
    explanation: "A solid white line means lane changes are discouraged but not prohibited."
  },
  {
    id: 92,
    question: "What does a broken white line mean?",
    options: ["No lane changes", "Lane changes allowed", "Passing zone", "Caution"],
    answer: 1,
    explanation: "A broken white line means lane changes are allowed when safe."
  },
  {
    id: 93,
    question: "How often should you check your vehicle's tires?",
    options: ["Monthly", "Weekly", "Daily", "Yearly"],
    answer: 0,
    explanation: "Check tire pressure and condition at least monthly."
  },
  {
    id: 94,
    question: "What is the minimum tread depth for tires?",
    options: ["1/16 inch", "1/8 inch", "1/4 inch", "1/2 inch"],
    answer: 0,
    explanation: "The minimum legal tread depth is 1/16 inch, but 1/8 inch is safer."
  },
  {
    id: 95,
    question: "When should you replace windshield wipers?",
    options: ["When they streak", "Every year", "When they're noisy", "All of the above"],
    answer: 3,
    explanation: "Replace wipers when they streak, are noisy, or at least annually."
  },
  {
    id: 96,
    question: "What should you do if an oncoming vehicle has its high beams on?",
    options: ["Flash your high beams", "Look at the right edge of the road", "Stare at their lights", "Speed up"],
    answer: 1,
    explanation: "Look at the right edge of the road to avoid being blinded by oncoming high beams."
  },
  {
    id: 97,
    question: "What is road rage?",
    options: ["Normal driving", "Aggressive driving behavior", "Slow driving", "Defensive driving"],
    answer: 1,
    explanation: "Road rage is aggressive driving behavior that endangers others."
  },
  {
    id: 98,
    question: "How should you respond to an aggressive driver?",
    options: ["Respond aggressively", "Stay calm and avoid eye contact", "Speed up", "Honk back"],
    answer: 1,
    explanation: "Stay calm, avoid eye contact, and don't engage with aggressive drivers."
  },
  {
    id: 99,
    question: "What should you do if you feel drowsy while driving?",
    options: ["Drink coffee", "Open windows", "Pull over and rest", "Turn up music"],
    answer: 2,
    explanation: "If drowsy, pull over safely and rest. Coffee and other methods are temporary fixes."
  },
  {
    id: 100,
    question: "How many hours of sleep should you get before driving?",
    options: ["4 hours", "6 hours", "7-8 hours", "10 hours"],
    answer: 2,
    explanation: "Get 7-8 hours of sleep before driving to ensure you're alert."
  }
];

// Quiz modes
type QuizMode = 'random' | 'by-test' | 'practice' | 'exam';

interface QuizConfig {
  mode: QuizMode;
  testId?: string;
  questionCount: number;
  timeLimit: number; // in seconds
}

export default function DrivingQuizApp() {
  // Quiz configuration
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    mode: 'random',
    questionCount: 20,
    timeLimit: 30
  });
  
  const [stage, setStage] = useState<'start' | 'quiz' | 'result'>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  
  // Available tests
  const testIds = useMemo(() => getAllTestIds(), []);
  
  // Get all questions for the selected test or all questions
  const availableQuestions = useMemo(() => {
    if (quizConfig.mode === 'by-test' && quizConfig.testId) {
      return getQuestionsByTest(quizConfig.testId);
    }
    return getAllQuestions();
  }, [quizConfig.mode, quizConfig.testId]);

  // Timer effect
  useEffect(() => {
    if (stage === 'quiz' && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp();
    }
  }, [timeLeft, stage, showExplanation]);

  const startQuiz = (config: QuizConfig = quizConfig) => {
    // Get questions based on configuration
    let selectedQuestions: Question[] = [];
    
    if (config.mode === 'by-test' && config.testId) {
      // Get questions from specific test
      const testQuestions = getQuestionsByTest(config.testId);
      selectedQuestions = shuffle(testQuestions).slice(0, config.questionCount);
    } else {
      // Get random questions from all tests
      selectedQuestions = shuffle(availableQuestions).slice(0, config.questionCount);
    }
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeLeft(config.timeLimit);
    setQuizStartTime(new Date());
    setStage('quiz');
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(option);
    setShowExplanation(true);
    
    const newUserAnswers = [...userAnswers, option];
    setUserAnswers(newUserAnswers);
    
    if (option === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(''); // Indicate no answer selected
      setUserAnswers([...userAnswers, '']);
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(quizConfig.timeLimit);
    } else {
      setStage('result');
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent! You\'re ready to drive safely!';
    if (percentage >= 80) return 'Great job! You have a good understanding of driving rules.';
    if (percentage >= 70) return 'Good work! Review the areas you missed.';
    if (percentage >= 60) return 'You\'re getting there! More study needed.';
    return 'Keep studying! Practice makes perfect.';
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-black py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">🚗 Driving License Quiz</h1>
          <p className="text-sm sm:text-base text-gray-300">Test your knowledge of driving rules and regulations</p>
        </div>

        {/* Start Screen */}
        {stage === 'start' && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
            <div className="mb-6 text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">🚦</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Test Your Driving Knowledge?</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-6">Configure your quiz below and test your driving knowledge!</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Mode</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.mode}
                  onChange={(e) => setQuizConfig({...quizConfig, mode: e.target.value as QuizMode})}
                >
                  <option value="random">Random Questions</option>
                  <option value="by-test">Specific Test</option>
                  <option value="practice">Practice Mode</option>
                  <option value="exam">Exam Mode</option>
                </select>
              </div>
              
              {quizConfig.mode === 'by-test' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Test</label>
                  <select 
                    className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quizConfig.testId || ''}
                    onChange={(e) => setQuizConfig({...quizConfig, testId: e.target.value})}
                  >
                    <option value="">Choose a test...</option>
                    {testIds.map(id => (
                      <option key={id} value={id}>Test {id}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.questionCount}
                  onChange={(e) => setQuizConfig({...quizConfig, questionCount: parseInt(e.target.value)})}
                >
                  <option value={10}>10 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={30}>30 Questions</option>
                  <option value={50}>50 Questions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Per Question</label>
                <select 
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quizConfig.timeLimit}
                  onChange={(e) => setQuizConfig({...quizConfig, timeLimit: parseInt(e.target.value)})}
                >
                  <option value={15}>15 Seconds</option>
                  <option value={30}>30 Seconds</option>
                  <option value={45}>45 Seconds</option>
                  <option value={60}>60 Seconds</option>
                </select>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation border border-blue-500"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Screen */}
        {stage === 'quiz' && currentQuestion && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-800">
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  Score: {score}/{currentQuestionIndex + (showExplanation ? 1 : 0)}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Timer */}
            <div className="mb-4 sm:mb-6 text-center">
              <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="mr-2">⏱️</span>
                Time: {timeLeft}s
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 leading-relaxed">
                {currentQuestion.question_text}
              </h3>

              {/* Question Image */}
              {currentQuestion.image_url && (
                <QuestionImage 
                  imageUrl={currentQuestion.image_url} 
                  alt={`Question ${currentQuestionIndex + 1} illustration`}
                />
              )}

              {/* Answer Options */}
              <div className="space-y-2 sm:space-y-3">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass = "w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all duration-200 touch-manipulation text-sm sm:text-base ";
                  
                  if (showExplanation) {
                    if (option === currentQuestion.correct_answer) {
                      buttonClass += "border-green-500 bg-green-900 text-green-100";
                    } else if (option === selectedAnswer && selectedAnswer !== currentQuestion.correct_answer) {
                      buttonClass += "border-red-500 bg-red-900 text-red-100";
                    } else {
                      buttonClass += "border-gray-700 bg-gray-800 text-gray-400";
                    }
                  } else {
                    if (selectedAnswer === option) {
                      buttonClass += "border-blue-500 bg-blue-900 text-blue-100";
                    } else {
                      buttonClass += "border-gray-700 bg-gray-800 text-white hover:border-blue-500 hover:bg-gray-700 active:bg-gray-600";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <span className="font-medium mr-2 sm:mr-3">{String.fromCharCode(65 + index)}.</span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-900 border border-blue-700 rounded-lg">
                <h4 className="font-semibold text-blue-100 mb-2 text-sm sm:text-base">Correct Answer:</h4>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                  The correct answer is: <strong>{currentQuestion.correct_answer}</strong>
                </p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <div className="text-center">
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 touch-manipulation text-sm sm:text-base border border-blue-500"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {stage === 'result' && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center border border-gray-800">
            <div className="mb-6">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">
                {score >= questions.length * 0.8 ? '🎉' : score >= questions.length * 0.7 ? '👍' : '📚'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
              <div className={`text-3xl sm:text-4xl font-bold mb-4 ${getScoreColor(score, questions.length)}`}>
                {score} / {questions.length}
              </div>
              <div className={`text-lg sm:text-xl mb-4 ${getScoreColor(score, questions.length)}`}>
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed px-2">
                {getScoreMessage(score, questions.length)}
              </p>
            </div>

            {/* Performance Breakdown */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Performance Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{score}</div>
                  <div className="text-gray-300">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-400">{questions.length - score}</div>
                  <div className="text-gray-300">Incorrect</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => startQuiz()}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-md hover:shadow-lg touch-manipulation w-full sm:w-auto border border-blue-500"
              >
                Take Another Quiz
              </button>
              <div>
                <button
                  onClick={() => setStage('start')}
                  className="text-blue-400 hover:text-blue-300 active:text-blue-200 font-medium transition-colors duration-200 touch-manipulation text-sm sm:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm px-4">
          <p>© 2024 Driving License Quiz App • Study Safe, Drive Safe</p>
        </div>
      </div>
    </div>
  );
}
