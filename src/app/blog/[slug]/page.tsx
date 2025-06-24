'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  imageUrl: string;
  slug: string;
  category: string;
  content?: string;
}

// Sample blog posts data with full content
const blogPosts: BlogPost[] = [
  {
    id: '6',
    title: 'Night Driving Safety Tips',
    excerpt: 'Driving after dark presents unique challenges. Learn essential techniques for safe night driving on Zimbabwe roads.',
    date: '2024-04-15',
    author: 'Safety Sally',
    imageUrl: '/image_p3_q2.png',
    slug: 'night-driving-safety',
    category: 'safety',
    content: `
      <p>Driving at night presents a unique set of challenges that even experienced drivers find demanding. Reduced visibility, glare from oncoming headlights, and increased fatigue all contribute to making night driving more hazardous than daytime driving. In Zimbabwe, where street lighting may be limited in many areas, mastering night driving skills is particularly important.</p>
      
      <h3>The Challenges of Night Driving</h3>
      
      <p>Understanding the specific challenges of night driving is the first step toward addressing them:</p>
      
      <ul>
        <li><strong>Reduced Visibility:</strong> Human eyes are not naturally adapted for night vision. At night, depth perception, color recognition, and peripheral vision are all compromised.</li>
        <li><strong>Headlight Glare:</strong> The bright lights from oncoming vehicles can temporarily blind drivers, making it difficult to see the road ahead.</li>
        <li><strong>Fatigue:</strong> Most people are naturally programmed to sleep when it's dark, making driver fatigue more common at night.</li>
        <li><strong>Increased Impaired Drivers:</strong> Statistically, there are more impaired drivers on the road at night, particularly on weekends.</li>
      </ul>
      
      <h3>Essential Night Driving Techniques</h3>
      
      <ol>
        <li>
          <strong>Properly Use Your Headlights:</strong>
          <p>Turn on your headlights at dusk and keep them on until dawn. Use high beams when appropriate on dark roads without oncoming traffic, but remember to dim them when approaching other vehicles (both oncoming and when following). In Zimbabwe, it's particularly important to use high beams judiciously on rural roads where wildlife may be present.</p>
        </li>
        
        <li>
          <strong>Combat Glare:</strong>
          <p>When faced with bright oncoming headlights, look slightly down and to the right, using the right edge of the road or lane markings as a guide. Keep your windshield clean both inside and out, as dirt and smudges can amplify glare. If you wear glasses, consider getting anti-reflective coating to reduce glare.</p>
        </li>
        
        <li>
          <strong>Increase Following Distance:</strong>
          <p>At night, increase your following distance to at least 4 seconds (instead of the usual 3 seconds for daytime driving). This gives you more time to react to sudden obstacles or changes in traffic flow that may be harder to see at night.</p>
        </li>
        
        <li>
          <strong>Reduce Speed:</strong>
          <p>Drive at a speed that allows you to stop within the distance illuminated by your headlights. This is often slower than your daytime driving speed, especially on unfamiliar or poorly lit roads.</p>
        </li>
        
        <li>
          <strong>Scan Effectively:</strong>
          <p>Continuously scan the road ahead, looking for reflections from animals' eyes, pedestrians, or unlit vehicles. Pay particular attention to the sides of the road where pedestrians or animals might enter the roadway.</p>
        </li>
      </ol>
      
      <h3>Vehicle Preparation for Night Driving</h3>
      
      <ul>
        <li>
          <strong>Headlight Maintenance:</strong>
          <p>Ensure your headlights are properly aimed and clean. Cloudy or yellowed headlight covers can significantly reduce light output. If your headlights are old or discolored, consider replacing or restoring them.</p>
        </li>
        
        <li>
          <strong>Dashboard Lighting:</strong>
          <p>Dim your dashboard lights to a comfortable level that doesn't interfere with your forward vision. Bright dashboard lights can create reflections on your windshield and reduce your ability to see outside.</p>
        </li>
        
        <li>
          <strong>Clean All Windows and Mirrors:</strong>
          <p>Ensure all windows, mirrors, and reflective surfaces are clean to minimize glare and maximize visibility.</p>
        </li>
        
        <li>
          <strong>Check All Lights Regularly:</strong>
          <p>Regularly check that all exterior lights—headlights, tail lights, brake lights, and turn signals—are functioning properly.</p>
        </li>
      </ul>
      
      <h3>Zimbabwe-Specific Night Driving Considerations</h3>
      
      <ul>
        <li>
          <strong>Wildlife Awareness:</strong>
          <p>Zimbabwe has abundant wildlife, and animals are often more active at dawn, dusk, and night. Be particularly vigilant on rural roads and near national parks or game reserves.</p>
        </li>
        
        <li>
          <strong>Unlit Vehicles and Pedestrians:</strong>
          <p>In some areas, you may encounter vehicles without proper lighting or pedestrians walking along roadways without reflective clothing. Maintain vigilance, especially near populated areas.</p>
        </li>
        
        <li>
          <strong>Power Outages:</strong>
          <p>Be prepared for areas where street lighting may be affected by power outages. Keep a flashlight in your vehicle for emergencies.</p>
        </li>
        
        <li>
          <strong>Security Considerations:</strong>
          <p>In urban areas, be aware of security concerns when driving at night. Keep doors locked, windows up in high-risk areas, and be cautious at intersections, particularly when stopped.</p>
        </li>
      </ul>
      
      <h3>Managing Fatigue</h3>
      
      <p>Driver fatigue is particularly dangerous at night. To combat fatigue:</p>
      
      <ul>
        <li>Ensure you're well-rested before beginning a night journey.</li>
        <li>Take regular breaks—at least every two hours or 100 kilometers.</li>
        <li>If possible, share driving responsibilities with another licensed driver.</li>
        <li>Recognize the signs of fatigue (heavy eyelids, disconnected thoughts, missing exits or road signs) and stop immediately if you notice them.</li>
        <li>Avoid heavy meals before or during your journey, as they can contribute to drowsiness.</li>
        <li>Stay hydrated, but limit caffeine intake to avoid the subsequent "crash."</li>
      </ul>
      
      <p>By applying these night driving techniques and being aware of the specific challenges of driving after dark in Zimbabwe, you can significantly reduce your risk and make your night journeys safer for yourself and others on the road.</p>
    `
  },
  {
    id: '7',
    title: 'Understanding Your Vehicle\'s Dashboard Warning Lights',
    excerpt: 'Those mysterious symbols on your dashboard are trying to tell you something important. Learn what each warning light means.',
    date: '2024-04-10',
    author: 'Mechanic Mike',
    imageUrl: '/image_p4_q1.png',
    slug: 'dashboard-warning-lights',
    category: 'maintenance',
    content: `
      <p>Modern vehicles are equipped with sophisticated computer systems that monitor virtually every aspect of your car's performance. When something isn't working correctly, your vehicle communicates this through dashboard warning lights. Understanding these signals is crucial for maintaining your vehicle's health and ensuring your safety on the road.</p>
      
      <h3>Critical Warning Lights (Red)</h3>
      
      <p>Red warning lights indicate serious issues that require immediate attention. If you see any of these lights while driving, you should safely pull over as soon as possible and address the issue before continuing:</p>
      
      <ul>
        <li>
          <strong>Engine Temperature Warning:</strong>
          <p>This light, often showing a thermometer or wavy lines in liquid, indicates that your engine is overheating. Continuing to drive can cause severe engine damage. Pull over, turn off the engine, and allow it to cool before checking coolant levels (once the engine has cooled).</p>
        </li>
        
        <li>
          <strong>Oil Pressure Warning:</strong>
          <p>This light, typically shaped like an oil can or lamp, indicates low oil pressure, which can cause catastrophic engine damage within minutes. Stop driving immediately and check your oil level. If it's low, adding oil might resolve the issue, but if the light remains on, professional assistance is needed.</p>
        </li>
        
        <li>
          <strong>Battery/Charging System Warning:</strong>
          <p>This light, usually shaped like a battery, indicates a problem with your vehicle's charging system. Your vehicle may soon lose electrical power and stall. Try to reach a service station before this happens.</p>
        </li>
        
        <li>
          <strong>Brake System Warning:</strong>
          <p>This light, often showing an exclamation point within a circle of parentheses, indicates a problem with your braking system. It could mean low brake fluid, a hydraulic pressure problem, or an engaged parking brake. Check that your parking brake is fully released; if the light remains on, professional inspection is necessary.</p>
        </li>
        
        <li>
          <strong>Airbag/SRS Warning:</strong>
          <p>This light, showing an airbag symbol, indicates a problem with your airbag system. While you can continue driving, your airbags may not deploy in an accident, so get this checked as soon as possible.</p>
        </li>
      </ul>
      
      <h3>Amber/Yellow Warning Lights</h3>
      
      <p>Amber or yellow lights typically indicate issues that need attention soon but aren't immediately dangerous:</p>
      
      <ul>
        <li>
          <strong>Check Engine Light:</strong>
          <p>This light, shaped like an engine outline or simply stating "CHECK," can indicate various issues from a loose gas cap to serious engine problems. If it's flashing, the problem is more serious and requires immediate attention. If steady, have it checked soon.</p>
        </li>
        
        <li>
          <strong>ABS Warning:</strong>
          <p>This light, showing "ABS," indicates a problem with the anti-lock braking system. Your regular brakes should still work, but the anti-lock function may be compromised. Have this checked soon.</p>
        </li>
        
        <li>
          <strong>Tire Pressure Warning:</strong>
          <p>This light, showing a tire cross-section with an exclamation point, indicates that one or more tires have pressure significantly different from the recommended level. Check and adjust your tire pressure soon.</p>
        </li>
        
        <li><strong>Traction Control/Stability Control Warning:</strong> This light, often showing a car with skid marks, indicates that the traction control system is either engaged (flashing) or has a malfunction (steady). If steady, have it checked soon.</li>
        
        <li><strong>Fuel Level Warning:</strong> This light, showing a fuel pump or gas tank, indicates that your fuel level is low. Refuel as soon as possible to avoid running out of fuel and potentially damaging your fuel pump.</li>
      </ul>
      
      <h3>Blue/Green Indicator Lights</h3>
      
      <p>These lights are informational rather than warnings:</p>
      
      <ul>
        <li><strong>High Beam Indicator:</strong> This blue light indicates that your high beam headlights are activated.</li>
        
        <li><strong>Turn Signal Indicators:</strong> These green arrows flash to indicate that your turn signals are activated. If one flashes more rapidly than normal, you may have a bulb out.</li>
        
        <li><strong>Cruise Control Indicator:</strong> This light indicates that cruise control is activated.</li>
      </ul>
      
      <h3>Vehicle-Specific Warning Lights</h3>
      
      <p>Modern vehicles often have additional warning lights specific to their make and model. These might include:</p>
      
      <ul>
        <li><strong>Diesel Particulate Filter (DPF) Warning:</strong> Common in diesel vehicles, indicating the filter needs regeneration or cleaning.</li>
        <li><strong>AdBlue/DEF Warning:</strong> In diesel vehicles with selective catalytic reduction systems, indicating low levels of diesel exhaust fluid.</li>
        <li><strong>Lane Departure Warning:</strong> In vehicles with driver assistance systems, indicating the system is active or has detected an issue.</li>
        <li><strong>Adaptive Cruise Control Warning:</strong> Indicating an issue with the adaptive cruise control system.</li>
      </ul>
      
      <h3>What to Do When a Warning Light Appears</h3>
      
      <ol>
        <li><strong>Identify the Light:</strong> Consult your owner's manual to understand what the specific light means for your vehicle.</li>
        
        <li><strong>Assess the Urgency:</strong> Red lights typically require immediate attention, while amber/yellow lights indicate issues that should be addressed soon.</li>
        
        <li><strong>Check for Other Symptoms:</strong> Note any unusual sounds, smells, or performance issues that might help diagnose the problem.</li>
        
        <li><strong>Take Appropriate Action:</strong> For critical warnings, safely pull over and address the issue or call for assistance. For less urgent warnings, schedule a service appointment.</li>
      </ol>
      
      <h3>Zimbabwe-Specific Considerations</h3>
      
      <ul>
        <li><strong>Limited Service Facilities:</strong> In rural areas of Zimbabwe, service facilities may be limited. If traveling in remote areas, it's particularly important to address warning lights before departure.</li>
        
        <li><strong>Fuel Quality Considerations:</strong> Varying fuel quality in some regions may trigger check engine lights. Using reputable fuel stations can help minimize these issues.</li>
        
        <li><strong>Road Conditions:</strong> Rough roads and challenging driving conditions in some areas can put additional stress on vehicle systems. Pay particular attention to suspension and tire warning lights.</li>
      </ul>
      
      <p>Remember that ignoring warning lights can lead to more serious and expensive problems down the road. When in doubt, consult with a qualified mechanic to diagnose and address any issues indicated by your vehicle's warning lights.</p>
    `
  },
  {
    id: '8',
    title: 'How to Drive Safely in Heavy Rain',
    excerpt: 'Zimbabwe\'s rainy season can create hazardous driving conditions. These tips will help you navigate safely when the downpours begin.',
    date: '2024-04-05',
    author: 'Captain Roadwise',
    imageUrl: '/image_p6_q1.png',
    slug: 'driving-in-rain',
    category: 'safety',
    content: `
      <p>Zimbabwe's rainy season, typically running from November to March, can transform familiar roads into challenging and potentially dangerous driving environments. Heavy rainfall reduces visibility, decreases tire traction, and increases stopping distances. By understanding these challenges and adopting appropriate driving techniques, you can significantly reduce your risk of accidents during wet weather.</p>
      
      <h3>Before You Drive in Rain</h3>
      
      <p>Preparation is key to safe rainy weather driving:</p>
      
      <ul>
        <li><strong>Check Your Wipers:</strong> Ensure your windshield wipers are in good condition and functioning properly. Wiper blades should be replaced every 6-12 months, or sooner if they leave streaks or miss areas.</li>
        
        <li><strong>Inspect Your Tires:</strong> Check tire tread depth and pressure. The legal minimum tread depth is 1.6mm, but for rainy conditions, having at least 3mm provides significantly better traction. Proper inflation is also crucial for preventing hydroplaning.</li>
        
        <li><strong>Test Your Lights:</strong> Ensure all exterior lights are working properly. You'll need them for visibility in heavy rain, even during daylight hours.</li>
        
        <li><strong>Clear All Windows:</strong> Make sure your windshield, windows, and mirrors are clean inside and out. Dirt and oil films can severely reduce visibility when wet.</li>
        
        <li><strong>Plan Your Route:</strong> If possible, plan to avoid areas prone to flooding or roads with poor drainage. In Zimbabwe, low-lying bridges and roads near rivers can become particularly hazardous during heavy rains.</li>
      </ul>
      
      <h3>Essential Rainy Weather Driving Techniques</h3>
      
      <ol>
        <li><strong>Reduce Your Speed:</strong> Drive at least 5-10 km/h slower than you would in dry conditions. This gives you more time to react to hazards and reduces the risk of hydroplaning. On highways, consider reducing speed by even more.</li>
        
        <li><strong>Increase Following Distance:</strong> Double your normal following distance from 3 seconds to at least 5-6 seconds. Wet roads significantly increase stopping distances.</li>
        
        <li><strong>Use Headlights:</strong> Turn on your headlights, even during daylight hours. This improves your visibility and makes your vehicle more visible to others.</li>
        
        <li><strong>Avoid Sudden Movements:</strong> Make all steering, accelerating, and braking actions smooth and gradual. Sudden movements can cause your vehicle to skid on wet surfaces.</li>
        
        <li><strong>Drive in the Tracks of the Vehicle Ahead:</strong> When safe to do so, drive in the tire tracks of the vehicle ahead of you. These tracks have already displaced some water, providing slightly better traction.</li>
        
        <li><strong>Avoid Standing Water:</strong> Drive around puddles and standing water when possible. If you must drive through water, do so slowly and test your brakes afterward by gently applying pressure to ensure they're working properly.</li>
        
        <li><strong>Stay in the Center Lanes:</strong> On highways, water tends to pool in outer lanes. When safe, drive in center lanes where there's typically less standing water.</li>
      </ol>
      
      <h3>Handling Hydroplaning</h3>
      
      <p>Hydroplaning occurs when your tires lose contact with the road surface due to a layer of water between the tires and the road. If you experience hydroplaning:</p>
      
      <ol>
        <li><strong>Stay Calm:</strong> Don't panic or make sudden movements.</li>
        <li><strong>Ease Off the Accelerator:</strong> Gradually reduce speed without braking.</li>
        <li><strong>Hold the Steering Wheel Straight:</strong> Maintain a straight course until you regain traction.</li>
        <li><strong>Don't Brake Suddenly:</strong> If you must brake, do so gently with light pumping actions if you don't have ABS.</li>
        <li><strong>Once You Regain Control:</strong> Consider pulling over safely to calm yourself before continuing.</li>
      </ol>
      
      <h3>Navigating Flooded Roads</h3>
      
      <p>During Zimbabwe's rainy season, flash flooding can occur rapidly. When encountering flooded roads:</p>
      
      <ul>
        <li><strong>Assess the Depth:</strong> Never drive through water if you can't determine its depth. As a general rule, avoid water that's more than 15-20 cm deep.</li>
        
        <li><strong>Look for Indicators:</strong> Check for debris, current, or submerged obstacles. Moving water can be particularly dangerous—even 15 cm of moving water can float some vehicles.</li>
        
        <li>
          <strong>If You Must Cross:</strong>
          <p>Drive slowly (about 5 km/h) in first gear (manual) or low gear (automatic). Maintain steady throttle to create a bow wave in front of the vehicle.</p>
        </li>
        
        <li>
          <strong>After Crossing:</strong>
          <p>Test your brakes repeatedly at low speed to dry them out.</p>
        </li>
        
        <li>
          <strong>When in Doubt, Turn Around:</strong>
          <p>Remember the safety mantra: "Turn Around, Don't Drown." No journey is worth risking your life.</p>
        </li>
      </ul>
      
      <h3>Zimbabwe-Specific Rainy Season Considerations</h3>
      
      <ul>
        <li>
          <strong>Unpaved Roads:</strong>
          <p>Many rural roads in Zimbabwe are unpaved and can become extremely slippery or impassable during heavy rains. Consider postponing travel on these roads during the heaviest rainfall periods.</p>
        </li>
        
        <li>
          <strong>Bridge Crossings:</strong>
          <p>Low-water bridges are common in rural areas and can be quickly submerged during flash floods. Never attempt to cross a flooded bridge.</p>
        </li>
        
        <li>
          <strong>Urban Flooding:</strong>
          <p>Even in urban areas like Harare and Bulawayo, drainage systems can be overwhelmed during intense rainfall, leading to street flooding. Be particularly cautious in low-lying urban areas.</p>
        </li>
        
        <li>
          <strong>Lightning:</strong>
          <p>Zimbabwe experiences significant lightning activity during thunderstorms. If caught in a severe thunderstorm with intense lightning, it's safer to pull over in a safe location away from trees until the worst passes.</p>
        </li>
      </ul>
      
      <p>By adopting these rainy weather driving techniques and maintaining your vehicle properly, you can navigate Zimbabwe's rainy season safely. Remember that sometimes the safest decision is to delay your journey until weather conditions improve, particularly for long-distance travel during heavy rainfall.</p>
    `
  },
  {
    id: '9',
    title: 'Essential Car Maintenance Tips for New Drivers',
    excerpt: 'Regular maintenance extends your vehicle\'s life and prevents breakdowns. Learn the basics every driver should know.',
    date: '2024-03-28',
    author: 'Mechanic Mike',
    imageUrl: '/image_p8_q1.png',
    slug: 'car-maintenance-basics',
    category: 'maintenance',
    content: `
      <p>Proper vehicle maintenance is not just about preventing breakdowns—it's about safety, reliability, and protecting your investment. For new drivers, understanding basic maintenance can seem overwhelming, but mastering a few fundamentals can save you money and extend your vehicle's lifespan. This guide covers the essential maintenance tasks every driver should know.</p>
      
      <h3>Regular Checks You Can Do Yourself</h3>
      
      <p>These simple checks should become part of your routine, ideally performed at least once a month and before any long journey:</p>
      
      <ol>
        <li>
          <strong>Tire Pressure and Condition:</strong>
          <p>Check tire pressure when tires are cold, using a reliable pressure gauge. The recommended pressure for your vehicle can be found in the owner's manual or on a sticker inside the driver's door jamb. While checking pressure, examine tires for wear, damage, or embedded objects. Don't forget to check the spare tire too.</p>
        </li>
        
        <li>
          <strong>Oil Level:</strong>
          <p>With the engine off and the car parked on level ground, wait a few minutes for the oil to settle, then pull out the dipstick, wipe it clean, reinsert it fully, and check the level. The oil should be between the minimum and maximum marks and should appear clean, not dark and gritty.</p>
        </li>
        
        <li>
          <strong>Coolant Level:</strong>
          <p>Check the coolant reservoir level when the engine is cold. The level should be between the minimum and maximum marks. Never open the radiator cap when the engine is hot—this can cause serious burns.</p>
        </li>
        
        <li>
          <strong>Windshield Washer Fluid:</strong>
          <p>Keep this topped up, especially during dusty or rainy seasons. In Zimbabwe, where dust can be a significant issue in dry seasons, this is particularly important.</p>
        </li>
        
        <li><strong>Lights and Signals:</strong> Regularly check that all exterior lights are functioning properly. This includes headlights (both high and low beam), brake lights, turn signals, and hazard lights. You may need someone to help you check brake lights.</li>
        
        <li><strong>Windshield Wipers:</strong> Inspect wiper blades for cracks, stiffness, or damage. Replace them if they leave streaks or miss areas when operating.</li>
      </ol>
      
      <h3>Scheduled Maintenance Tasks</h3>
      
      <p>These tasks typically require professional service, though some experienced owners may handle some themselves:</p>
      
      <ul>
        <li><strong>Oil and Filter Changes:</strong> Regular oil changes are crucial for engine health. Follow your vehicle manufacturer's recommendations, but as a general rule, change the oil every 5,000-7,500 kilometers or every 6 months, whichever comes first. In Zimbabwe, where road conditions can be challenging and dusty, more frequent oil changes may be beneficial.</li>
        
        <li><strong>Air Filter Replacement:</strong> A clean air filter improves fuel efficiency and engine performance. Check it every 6 months and replace as needed, or according to your manufacturer's schedule. In dusty conditions common in Zimbabwe, more frequent checks are advisable.</li>
        
        <li><strong>Fuel Filter Replacement:</strong> This helps ensure clean fuel reaches your engine. Replace according to your manufacturer's schedule, typically every 30,000-50,000 kilometers. In Zimbabwe, where fuel quality can vary, more frequent replacement might be necessary.</li>
        
        <li><strong>Brake Inspection:</strong> Have your brakes inspected at least annually or if you notice any issues like squealing, grinding, or reduced braking efficiency. This includes checking brake pads, rotors, and fluid.</li>
        
        <li><strong>Battery Maintenance:</strong> Modern batteries require little maintenance, but terminals should be kept clean and connections tight. In Zimbabwe's hot climate, batteries typically last 2-3 years, so plan for replacement within this timeframe.</li>
        
        <li><strong>Timing Belt Replacement:</strong> This is a critical maintenance item that, if neglected, can cause catastrophic engine damage. Replace according to manufacturer recommendations, typically every 60,000-100,000 kilometers.</li>
      </ul>
      
      <h3>Seasonal Maintenance Considerations</h3>
      
      <p>Zimbabwe's distinct wet and dry seasons require specific maintenance considerations:</p>
      
      <h4>Rainy Season Preparation (November-March)</h4>
      
      <ul>
        <li>Ensure windshield wipers are in excellent condition</li>
        <li>Check that all lights are functioning properly</li>
        <li>Verify tire tread depth for adequate wet traction</li>
        <li>Test the battery, as rainy season starting can be more demanding</li>
        <li>Check that drainage holes in the vehicle body are clear to prevent water accumulation</li>
      </ul>
      
      <h4>Dry Season Preparation (April-October)</h4>
      
      <ul>
        <li>Check cooling system thoroughly to prevent overheating</li>
        <li>Replace cabin air filter to reduce dust infiltration</li>
        <li>Check air conditioning system performance</li>
        <li>Consider more frequent air filter checks due to increased dust</li>
      </ul>
      
      <h3>Understanding Warning Signs</h3>
      
      <p>Learn to recognize these warning signs that indicate your vehicle needs attention:</p>
      
      <ul>
        <li><strong>Warning Lights:</strong> Never ignore dashboard warning lights. Consult your owner's manual to understand what each light means.</li>
        <li><strong>Unusual Noises:</strong> Squealing, grinding, knocking, or any new and unusual sounds should be investigated promptly.</li>
        <li><strong>Fluid Leaks:</strong> Any fluid under your vehicle warrants investigation. Different fluids have different colors and can help identify the source of the leak.</li>
        <li><strong>Vibrations:</strong> Unusual vibrations while driving could indicate tire, wheel, or suspension issues.</li>
        <li><strong>Reduced Performance:</strong> Difficulty starting, rough idling, or reduced power can indicate various issues that should be addressed promptly.</li>
      </ul>
      
      <h3>Finding Reliable Service in Zimbabwe</h3>
      
      <p>Quality vehicle maintenance in Zimbabwe requires finding reliable service providers:</p>
      
      <ul>
        <li><strong>Authorized Dealerships:</strong> While often more expensive, they have specialized knowledge of your vehicle make.</li>
        <li><strong>Reputable Independent Workshops:</strong> Often provide good service at lower costs. Seek recommendations from other drivers.</li>
        <li><strong>Specialist Services:</strong> For specific systems like air conditioning or electrical systems, specialist services might be preferable.</li>
        <li><strong>Build Relationships:</strong> Developing a relationship with a trusted mechanic who knows your vehicle's history can be invaluable.</li>
      </ul>
      
      <h3>Maintenance Record Keeping</h3>
      
      <p>Maintain a detailed record of all maintenance performed on your vehicle, including:</p>
      
      <ul>
        <li>Date and odometer reading for each service</li>
        <li>Details of work performed and parts replaced</li>
        <li>Name and contact information of the service provider</li>
        <li>Receipts for services and parts</li>
      </ul>
      
      <p>This record not only helps you track maintenance but also adds value when selling your vehicle.</p>
      
      <p>Remember that regular maintenance is an investment that pays dividends in vehicle reliability, safety, and resale value. By mastering these basics and developing good maintenance habits early in your driving career, you'll save money and enjoy a more reliable driving experience.</p>
    `
  },
  {
    id: '10',
    title: 'Mastering the Three-Point Turn',
    excerpt: 'The three-point turn is a fundamental driving maneuver. Learn how to execute it perfectly every time.',
    date: '2024-03-20',
    author: 'Professor Drive',
    imageUrl: '/image_p9_q1.png',
    slug: 'three-point-turn',
    category: 'techniques',
    content: `
      <p>The three-point turn (sometimes called a Y-turn or K-turn) is an essential driving maneuver that allows you to reverse your direction of travel in a limited space. Mastering this technique is not only important for your driving test but also for everyday driving situations where you need to turn around safely and efficiently.</p>
      
      <h3>When to Use a Three-Point Turn</h3>
      
      <p>A three-point turn is appropriate when:</p>
      
      <ul>
        <li>You need to reverse direction on a road that's too narrow for a U-turn</li>
        <li>There are no nearby intersections or roundabouts to use for turning around</li>
        <li>You've missed your turn or taken a wrong direction</li>
      </ul>
      
      <p>However, avoid performing a three-point turn:</p>
      
      <ul>
        <li>On busy roads with heavy traffic</li>
        <li>Near the crest of a hill or on a curve where visibility is limited</li>
        <li>Where prohibited by signs or road markings</li>
        <li>When other turning options (like roundabouts or driving around the block) are readily available</li>
      </ul>
      
      <h3>Step-by-Step Guide to the Perfect Three-Point Turn</h3>
      
      <ol>
        <li><strong>Preparation:</strong> Before beginning the maneuver, check thoroughly for traffic in both directions. Signal your intention to pull over to the right side of the road (in countries that drive on the left like Zimbabwe) or to the left (in right-hand driving countries). Come to a complete stop.</li>
        
        <li><strong>Position Your Vehicle:</strong> Position your vehicle as far to the side of the road as safely possible, creating maximum space for the turning maneuver.</li>
        
        <li><strong>Check Surroundings:</strong> Check all mirrors and blind spots. Ensure there is no approaching traffic from either direction and that you have good visibility.</li>
        
        <li><strong>First Movement (Turn):</strong> Signal your intention to turn (left in Zimbabwe). Turn the steering wheel fully to the left and slowly move forward, turning across the road until your vehicle is perpendicular to the road or until your front wheels are near the opposite edge.</li>
        
        <li><strong>Second Movement (Reverse):</strong> Stop the vehicle. Shift into reverse gear. Turn the steering wheel fully to the right while looking over your right shoulder. Slowly reverse in an arc until your vehicle is positioned to drive forward in the opposite direction.</li>
        
        <li><strong>Third Movement (Forward):</strong> Stop again. Shift into first gear or drive. Turn the steering wheel to straighten the wheels if necessary, check for traffic, and proceed forward in your new direction.</li>
      </ol>
      
      <h3>Common Mistakes to Avoid</h3>
      
      <ul>
        <li><strong>Inadequate Observation:</strong> Failing to check thoroughly for traffic before and during the maneuver is dangerous. Always maintain awareness of other road users.</li>
        
        <li><strong>Poor Positioning:</strong> Not positioning your vehicle correctly at the start can make the maneuver more difficult or require additional points to complete.</li>
        
        <li><strong>Rushing the Maneuver:</strong> Moving too quickly increases the risk of errors. Take your time and execute each step with precision.</li>
        
        <li><strong>Incorrect Steering:</strong> Not turning the wheel fully during each phase can result in needing additional movements to complete the turn.</li>
        
        <li><strong>Forgetting to Signal:</strong> Always signal your intentions to other road users, even on quiet roads.</li>
      </ul>
      
      <h3>Variations and Adaptations</h3>
      
      <p>Sometimes, due to road width or other factors, you might need to adapt the standard three-point turn:</p>
      
      <ul>
        <li><strong>Five-Point Turn:</strong> On very narrow roads, you might need additional movements (making it a five-point or even seven-point turn). The principles remain the same—alternate between forward and reverse while gradually changing direction.</li>
        
        <li><strong>Using Driveways:</strong> If available, using a driveway on one side of the road can make the maneuver easier and potentially reduce it to a two-point turn.</li>
      </ul>
      
      <h3>Zimbabwe-Specific Considerations</h3>
      
      <p>In Zimbabwe, keep these specific points in mind:</p>
      
      <ul>
        <li>Remember that Zimbabwe follows left-hand traffic rules, so adapt the turn directions accordingly.</li>
        <li>Be especially cautious on rural roads where visibility might be limited by vegetation or terrain.</li>
        <li>During the rainy season, be aware that unpaved road shoulders might be soft or muddy, affecting your vehicle's traction during the maneuver.</li>
        <li>The Vehicle Inspection Department (VID) driving test in Zimbabwe often includes a three-point turn, so mastering this maneuver is essential for obtaining your license.</li>
      </ul>
      
      <p>With practice, the three-point turn will become second nature. Remember that safety always takes precedence over speed or convenience. If traffic conditions change during your maneuver, be prepared to pause and reassess before continuing. Master this fundamental skill, and you'll have the confidence to navigate effectively in a variety of driving situations.</p>
    `
  },
  {
    id: '1',
    title: 'Essential Road Signs Every Driver Should Know',
    excerpt: 'Understanding road signs is crucial for safe driving. Learn about the most important signs you will encounter on Zimbabwe roads.',
    date: '2024-05-15',
    author: 'Captain Roadwise',
    imageUrl: '/image_p1_q1.png',
    slug: 'essential-road-signs',
    category: 'road-signs',
    content: `
      <p>Road signs are the silent guides that help us navigate safely through our road networks. They provide crucial information about road conditions, potential hazards, and traffic regulations. Understanding these signs is not just important for passing your driving test—it's essential for your safety and the safety of others on the road.</p>
      
      <h3>Regulatory Signs</h3>
      
      <p>Regulatory signs inform drivers of traffic laws and regulations. They are typically circular with a red border and include:</p>
      
      <ul>
        <li><strong>Stop Sign:</strong> The octagonal red sign requires a complete stop at the designated stopping point.</li>
        <li><strong>Yield Sign:</strong> This triangular sign indicates that drivers must give way to traffic on the road being entered or crossed.</li>
        <li><strong>Speed Limit Signs:</strong> These rectangular signs display the maximum legal speed for the road section.</li>
        <li><strong>No Entry Sign:</strong> A circular sign with a red circle and horizontal white bar indicates that vehicles are not permitted to enter.</li>
      </ul>
      
      <h3>Warning Signs</h3>
      
      <p>Warning signs alert drivers to potential hazards or changing road conditions. They are typically triangular with a red border and include:</p>
      
      <ul>
        <li><strong>Sharp Curve:</strong> Indicates a sharp bend in the road ahead.</li>
        <li><strong>Pedestrian Crossing:</strong> Warns of a pedestrian crossing point ahead.</li>
        <li><strong>School Zone:</strong> Indicates the presence of a school and the need for extra caution.</li>
        <li><strong>Slippery Road:</strong> Warns that the road may be slippery, especially in wet conditions.</li>
      </ul>
      
      <h3>Informational Signs</h3>
      
      <p>Informational signs provide guidance and information to help drivers navigate. They are typically rectangular with a blue background and include:</p>
      
      <ul>
        <li><strong>Direction Signs:</strong> Indicate routes to towns, cities, and other destinations.</li>
        <li><strong>Service Signs:</strong> Show the location of services such as fuel stations, rest areas, and hospitals.</li>
        <li><strong>Distance Signs:</strong> Display the distance to upcoming destinations.</li>
      </ul>
      
      <h3>Road Markings</h3>
      
      <p>Road markings work in conjunction with signs to provide guidance and regulation. Important markings include:</p>
      
      <ul>
        <li><strong>Center Lines:</strong> Separate traffic flowing in opposite directions.</li>
        <li><strong>Lane Lines:</strong> Separate lanes of traffic moving in the same direction.</li>
        <li><strong>Stop Lines:</strong> Indicate where vehicles must stop at intersections or pedestrian crossings.</li>
        <li><strong>Zebra Crossings:</strong> Indicate pedestrian crossing points where pedestrians have right of way.</li>
      </ul>
      
      <h3>Zimbabwe-Specific Signs</h3>
      
      <p>While Zimbabwe follows international standards for most road signs, there are some specific signs and regulations to be aware of:</p>
      
      <ul>
        <li><strong>Animal Crossing Signs:</strong> These are particularly important in rural areas where wildlife may cross roads.</li>
        <li><strong>Police Checkpoint Signs:</strong> Indicate upcoming police checkpoints where drivers may be required to stop.</li>
        <li><strong>Toll Gate Signs:</strong> Indicate upcoming toll collection points on highways.</li>
      </ul>
      
      <p>Remember that road signs are not just suggestions—they are legal requirements. Ignoring them can lead to accidents, fines, or even license suspension. Take time to familiarize yourself with all road signs, especially those you encounter regularly on your driving routes.</p>
      
      <p>For a comprehensive guide to all road signs in Zimbabwe, refer to the official Zimbabwe Highway Code, which provides detailed information on all traffic signs and regulations.</p>
    `
  },
  {
    id: '2',
    title: 'Defensive Driving Techniques for New Drivers',
    excerpt: 'Learn how to anticipate hazards and drive defensively to prevent accidents before they happen.',
    date: '2024-05-10',
    author: 'Safety Sally',
    imageUrl: '/image_p2_q1.png',
    slug: 'defensive-driving-techniques',
    category: 'safety',
    content: `
      <p>Defensive driving is a set of skills and practices that help drivers anticipate potential hazards and make safe decisions to avoid accidents. For new drivers, developing these skills early can significantly reduce the risk of collisions and create lifelong safe driving habits.</p>
      
      <h3>The Basics of Defensive Driving</h3>
      
      <p>Defensive driving begins with a mindset: assume that other drivers might make mistakes and be prepared to respond safely. Key principles include:</p>
      
      <ul>
        <li><strong>Stay Alert:</strong> Always be aware of your surroundings and avoid distractions like mobile phones, loud music, or eating while driving.</li>
        <li><strong>Maintain a Safe Following Distance:</strong> Follow the 3-second rule (or 4-seconds in adverse conditions) to ensure you have enough time to react if the vehicle ahead stops suddenly.</li>
        <li><strong>Anticipate Hazards:</strong> Continuously scan the road ahead and around you to identify potential dangers before they become immediate threats.</li>
        <li><strong>Have an Escape Plan:</strong> Always know where you could steer your vehicle if you needed to avoid a sudden obstacle.</li>
      </ul>
      
      <h3>Scanning Techniques</h3>
      
      <p>Effective scanning is crucial for defensive driving:</p>
      
      <ul>
        <li><strong>Look Far Ahead:</strong> Don't just focus on the car directly in front of you. Look 12-15 seconds ahead (about a block in city driving or a quarter-mile on highways).</li>
        <li><strong>Check Mirrors Frequently:</strong> Develop a habit of checking your rearview and side mirrors every 5-8 seconds.</li>
        <li><strong>Check Blind Spots:</strong> Always turn your head to check blind spots before changing lanes or making turns.</li>
        <li><strong>Move Your Eyes:</strong> Don't fixate on any one thing. Keep your eyes moving to maintain awareness of your entire driving environment.</li>
      </ul>
      
      <h3>Anticipating Other Drivers' Actions</h3>
      
      <p>Learning to predict what other road users might do is a valuable defensive driving skill:</p>
      
      <ul>
        <li><strong>Watch for Indicators:</strong> Look for turn signals, brake lights, and vehicle positioning that suggest upcoming maneuvers.</li>
        <li><strong>Be Wary at Intersections:</strong> Even with a green light, check for vehicles that might run red lights or make illegal turns.</li>
        <li><strong>Watch for Driver Head Movements:</strong> You can often tell if a driver is about to change lanes by watching their head movement in their vehicle.</li>
        <li><strong>Be Cautious Around Distracted Drivers:</strong> If you notice a driver looking down (possibly at a phone) or exhibiting erratic behavior, give them extra space.</li>
      </ul>
      
      <h3>Weather and Road Conditions</h3>
      
      <p>Adapting to conditions is a key defensive driving skill:</p>
      
      <ul>
        <li><strong>Reduce Speed in Poor Conditions:</strong> Rain, fog, or darkness all require slower speeds and greater following distances.</li>
        <li><strong>Be Extra Cautious on Unfamiliar Roads:</strong> When driving in areas you don't know well, be prepared for unexpected curves, intersections, or hazards.</li>
        <li><strong>Adjust for Road Surface:</strong> Gravel, wet roads, or roads with potholes require different handling techniques and speeds.</li>
      </ul>
      
      <h3>Managing Emotions</h3>
      
      <p>Emotional control is an often overlooked aspect of defensive driving:</p>
      
      <ul>
        <li><strong>Avoid Road Rage:</strong> Never engage with aggressive drivers. Let them pass and maintain your composure.</li>
        <li><strong>Don't Drive When Upset:</strong> Strong emotions can impair judgment almost as much as alcohol. If you're very angry or upset, wait until you've calmed down before driving.</li>
        <li><strong>Plan Extra Time:</strong> Running late often leads to rushed, unsafe driving decisions. Allow extra time for your journey to reduce stress.</li>
      </ul>
      
      <h3>Practical Exercises for New Drivers</h3>
      
      <p>Practice these exercises to develop your defensive driving skills:</p>
      
      <ul>
        <li><strong>Commentary Driving:</strong> Practice narrating what you see and what actions you're taking while driving. This helps develop awareness and planning.</li>
        <li><strong>Hazard Perception:</strong> While a passenger, practice identifying potential hazards before they become immediate threats.</li>
        <li><strong>Emergency Braking Practice:</strong> In a safe, empty area, practice emergency braking to understand how your vehicle responds.</li>
      </ul>
      
      <p>Remember, defensive driving is not about being overly cautious or slow—it\'s about being prepared, aware, and making smart decisions that keep you and others safe on the road. By developing these skills early in your driving career, you\'ll build habits that can protect you for a lifetime of driving.</p>
    `
  },
  {
    id: '3',
    title: 'Understanding Right of Way Rules at Intersections',
    excerpt: 'Confused about who goes first at intersections? This comprehensive guide explains all the rules you need to know.',
    date: '2024-05-05',
    author: 'Professor Drive',
    imageUrl: '/image_p5_q1.png',
    slug: 'right-of-way-rules',
    category: 'rules',
    content: `
      <p>Intersections are among the most challenging and potentially dangerous areas for drivers to navigate. Understanding right-of-way rules is essential for preventing collisions and ensuring the smooth flow of traffic. This guide will help you understand who should go first in various intersection scenarios.</p>
      
      <h3>Basic Right-of-Way Principles</h3>
      
      <p>The concept of "right of way" determines which vehicle is entitled to proceed first in any given traffic situation. However, it's important to remember that:</p>
      
      <ul>
        <li>Right of way is something you give, not take. Even when you legally have the right of way, you should yield if doing so prevents an accident.</li>
        <li>Never assume other drivers will yield when they should. Always be prepared to stop.</li>
        <li>Pedestrians almost always have the right of way, especially at marked crossings.</li>
      </ul>
      
      <h3>Four-Way Stops</h3>
      
      <p>Four-way stops can be confusing, but the rules are straightforward:</p>
      
      <ul>
        <li><strong>First to Arrive, First to Go:</strong> The vehicle that arrives at the intersection first has the right of way.</li>
        <li><strong>Same Time Arrivals:</strong> If two vehicles arrive simultaneously, the vehicle on the right has the right of way.</li>
        <li><strong>Straight vs. Turn:</strong> If two vehicles arrive simultaneously and are facing each other, the vehicle going straight has right of way over a vehicle turning left.</li>
        <li><strong>Multiple Same-Time Arrivals:</strong> If more than two vehicles arrive simultaneously, yield to the vehicle on your right, and proceed in a counter-clockwise order.</li>
      </ul>
      
      <h3>Uncontrolled Intersections</h3>
      
      <p>Intersections without traffic lights or stop signs require extra caution:</p>
      
      <ul>
        <li><strong>Yield to the Right:</strong> When two vehicles approach an uncontrolled intersection simultaneously, the driver on the left must yield to the driver on the right.</li>
        <li><strong>Major vs. Minor Roads:</strong> Vehicles on minor roads should yield to those on major roads, even at uncontrolled intersections.</li>
        <li><strong>T-Intersections:</strong> Vehicles on the terminating road (the base of the T) must yield to vehicles on the through road.</li>
      </ul>
      
      <h3>Traffic Signals</h3>
      
      <p>At intersections controlled by traffic signals:</p>
      
      <ul>
        <li><strong>Green Light:</strong> Proceed if the intersection is clear. Yield to pedestrians and vehicles still in the intersection.</li>
        <li><strong>Yellow Light:</strong> Prepare to stop if you can do so safely. If you're too close to stop safely, proceed with caution.</li>
        <li><strong>Red Light:</strong> Come to a complete stop. In some jurisdictions, right turns on red are permitted after stopping and yielding to cross traffic and pedestrians.</li>
        <li><strong>Green Arrow:</strong> You may proceed in the direction of the arrow without yielding, but still watch for pedestrians.</li>
      </ul>
      
      <h3>Special Intersection Types</h3>
      
      <p>Some intersections have special rules:</p>
      
      <ul>
        <li><strong>Roundabouts:</strong> Vehicles entering a roundabout must yield to vehicles already in the roundabout. Always travel in a counter-clockwise direction.</li>
        <li><strong>Yield Signs:</strong> If you face a yield sign, you must slow down and yield to all cross traffic and pedestrians before entering the intersection.</li>
        <li><strong>Turning Lanes:</strong> When multiple turning lanes exist, stay in your lane throughout the turn.</li>
      </ul>
      
      <h3>Emergency Vehicles</h3>
      
      <p>Always yield to emergency vehicles with activated sirens and/or lights:</p>
      
      <ul>
        <li>Pull over to the right edge of the road and stop until the emergency vehicle has passed.</li>
        <li>If you're at an intersection when an emergency vehicle approaches, clear the intersection if possible before pulling over.</li>
        <li>Never follow an emergency vehicle or try to take advantage of the gap it creates in traffic.</li>
      </ul>
      
      <h3>Zimbabwe-Specific Considerations</h3>
      
      <p>In Zimbabwe, most right-of-way rules follow international standards, but be aware of these local considerations:</p>
      
      <ul>
        <li>Traffic circles (roundabouts) are common in Zimbabwe's urban areas. Remember to yield to vehicles already in the circle.</li>
        <li>In rural areas, be particularly cautious at uncontrolled intersections where visibility may be limited.</li>
        <li>Be aware that enforcement of right-of-way rules may vary, so always drive defensively regardless of who has the legal right of way.</li>
      </ul>
      
      <p>Remember that right-of-way rules exist to create order and prevent accidents. Even when you have the right of way, always proceed with caution and be prepared to yield if another driver fails to follow the rules. Your primary goal should always be safety, not asserting your right of way.</p>
    `
  },
  {
    id: '4',
    title: 'How to Parallel Park Like a Pro',
    excerpt: 'Master the art of parallel parking with these step-by-step instructions and helpful tips.',
    date: '2024-04-28',
    author: 'Mechanic Mike',
    imageUrl: '/image_p7_q2.png',
    slug: 'parallel-parking-guide',
    category: 'techniques',
    content: `
      <p>Parallel parking is often considered one of the most challenging driving maneuvers, especially for new drivers. However, with the right technique and plenty of practice, you can master this skill and confidently park in even the tightest spaces.</p>
      
      <h3>Before You Begin</h3>
      
      <p>Before attempting to parallel park, ensure you understand your vehicle's dimensions and turning radius. Different vehicles handle differently, so what works in one car might need slight adjustments in another. Also, make sure you have enough space—ideally, the parking space should be at least 1.5 times the length of your vehicle.</p>
      
      <h3>Step-by-Step Parallel Parking Technique</h3>
      
      <ol>
        <li><strong>Find a Suitable Space:</strong> Look for a space that's at least 1.5 times the length of your vehicle. Activate your turn signal to indicate your intention to park.</li>
        
        <li><strong>Position Your Vehicle:</strong> Pull up parallel to the vehicle in front of the empty space. Align your rear bumper with their rear bumper, leaving about 0.5-1 meter (2-3 feet) of space between your vehicles. This positioning is crucial for the next steps.</li>
        
        <li><strong>Check Your Surroundings:</strong> Look over both shoulders and check all mirrors to ensure no vehicles, cyclists, or pedestrians are approaching.</li>
        
        <li><strong>Begin Reversing:</strong> Put your vehicle in reverse and begin backing up slowly while the wheel is straight.</li>
        
        <li><strong>Turn the Wheel Right:</strong> Once your rear wheels are approximately aligned with the rear bumper of the car in front of the space, turn your steering wheel fully to the right (clockwise). Continue reversing slowly.</li>
        
        <li><strong>Start Straightening:</strong> When your vehicle is at approximately a 45-degree angle to the curb, and your rear wheel is about 30 cm (1 foot) from the curb, begin turning your steering wheel left (counter-clockwise) to straighten out.</li>
        
        <li><strong>Adjust Your Position:</strong> Continue reversing until your vehicle is parallel with the curb. Make any necessary adjustments by moving forward or backward slightly to center your vehicle in the space.</li>
        
        <li><strong>Final Positioning:</strong> Ideally, your vehicle should be about 15-30 cm (6-12 inches) from the curb, with equal space in front and behind.</li>
      </ol>
      
      <h3>Common Mistakes and How to Avoid Them</h3>
      
      <ul>
        <li><strong>Starting Too Close or Too Far from the Parked Car:</strong> If you\'re too close, you won\'t have enough room to maneuver. If you\'re too far, you might end up too far from the curb. Practice finding the right distance—about 0.5-1 meter is ideal.</li>
        
        <li><strong>Turning the Wheel Too Early or Too Late:</strong> Timing your steering wheel turns is crucial. If you turn too early, your rear end will swing too wide. If you turn too late, you\'ll end up too far from the curb.</li>
        
        <li><strong>Rushing the Process:</strong> Parallel parking requires patience. Move slowly and make small adjustments as needed.</li>
        
        <li><strong>Not Using Mirrors and Reference Points:</strong> Use all your mirrors and establish reference points in your vehicle to help judge distances.</li>
      </ul>
      
      <h3>Tips for Success</h3>
      
      <ul>
        <li><strong>Practice in an Empty Area:</strong> Before attempting to parallel park on a busy street, practice in an empty parking lot using cones or other markers to simulate parked cars.</li>
        
        <li><strong>Use Your Passenger:</strong> When learning, having a passenger guide you can be helpful. They can tell you how close you are to the curb or other vehicles.</li>
        </li>
        
        <li>
          <strong>Adjust Your Mirrors:</strong>
          <p>Properly adjusted mirrors can give you a better view of the curb and surrounding vehicles.</p>
        </li>
        
        <li>
          <strong>Know When to Start Over:</strong>
          <p>If you realize you're not going to park correctly, it's better to pull out and try again rather than making numerous small adjustments.</p>
        </li>
        
        <li>
          <strong>Use Technology if Available:</strong>
          <p>Many modern vehicles come equipped with parking sensors or cameras. While you shouldn't rely solely on these, they can be helpful aids.</p>
        </li>
      </ul>
      
      <h3>Exiting a Parallel Parking Space</h3>
      
      <p>Exiting a parallel parking space can sometimes be as challenging as entering one, especially in tight spaces:</p>
      
      <ol>
        <li>Check your mirrors and blind spots for approaching traffic.</li>
        <li>Signal your intention to pull out.</li>
        <li>Turn your wheel toward the road and begin moving forward slowly.</li>
        <li>Once your front wheels clear the vehicle in front, turn your wheel sharply toward the road.</li>
        <li>Check for traffic again before fully entering the lane.</li>
      </ol>
      
      <p>Remember, parallel parking is a skill that improves with practice. Don\'t be discouraged if it takes several attempts at first. With time and experience, you\'ll develop the muscle memory and spatial awareness needed to parallel park confidently in various situations.</p>
    `
  },
  {
    id: '5',
    title: 'Common Mistakes to Avoid During Your Driving Test',
    excerpt: 'Don\'t let these common errors cost you your license. Learn what examiners look for and how to avoid critical mistakes.',
    date: '2024-04-20',
    author: 'Captain Roadwise',
    imageUrl: '/image_p10_q2.png',
    slug: 'driving-test-mistakes',
    category: 'test-prep',
    content: `
      <p>Your driving test is the culmination of all your practice and learning. Even skilled drivers can fail their test due to nervousness or overlooking simple requirements. This guide highlights the most common mistakes made during driving tests and provides practical advice on how to avoid them.</p>
      
      <h3>Before the Test Begins</h3>
      
      <ul>
        <li><strong>Vehicle Issues:</strong> Ensure your vehicle is in proper working condition. Check that all lights, signals, horn, and wipers are functioning. A test can be canceled before it even begins if your vehicle doesn\'t meet safety requirements.</li>
        
        <li><strong>Documentation Problems:</strong> Arrive with all required documentation, including your learner's permit, ID, and any necessary appointment confirmations. In Zimbabwe, ensure your vehicle has valid insurance and a current vehicle inspection certificate.</li>
        
        <li><strong>Arriving Late or Unprepared:</strong> Arrive at least 15-20 minutes early to complete paperwork and calm your nerves. Being rushed increases anxiety and the likelihood of mistakes.</li>
      </ul>
      
      <h3>Critical Driving Errors</h3>
      
      <p>The following mistakes often result in immediate test failure:</p>
      
      <ul>
        <li><strong>Ignoring Traffic Signs and Signals:</strong> Running red lights or stop signs, exceeding speed limits, or failing to yield when required are serious violations that will result in automatic failure.</li>
        
        <li><strong>Dangerous Maneuvers:</strong> Any action that requires the examiner to intervene verbally or physically will result in failure. This includes unsafe lane changes, turning from the wrong lane, or creating dangerous situations for other road users.</li>
        
        <li><strong>Lack of Control:</strong> Demonstrating poor vehicle control, such as hitting the curb during parking, excessive rolling on hills, or inability to maintain lane position, suggests you're not ready for independent driving.</li>
        
        <li><strong>Improper Observation:</strong> Failing to check mirrors and blind spots before changing lanes or making turns is a major safety issue that examiners watch closely.</li>
      </ul>
      
      <h3>Minor but Common Mistakes</h3>
      
      <p>While a single minor mistake won't fail you, accumulating several can. Common minor errors include:</p>
      
      <ul>
        <li><strong>Improper Hand Position:</strong> Keep your hands at the 9 and 3 o'clock positions (or 10 and 2 in some jurisdictions). Avoid one-handed driving or resting your hand on the gear shift.</li>
        
        <li><strong>Hesitation:</strong> While safety is paramount, excessive hesitation at intersections or when merging indicates a lack of confidence and can impede traffic flow.</li>
        
        <li><strong>Improper Following Distance:</strong> Maintain at least a 3-second following distance from the vehicle ahead. Following too closely is a common mistake that examiners note.</li>
        
        <li><strong>Incorrect Use of Signals:</strong> Signal too early or too late, failing to signal at all, or forgetting to cancel your signal after completing a maneuver.</li>
        
        <li><strong>Speed Control Issues:</strong> Driving consistently below the speed limit without reason, braking too hard, or accelerating too quickly shows poor vehicle control.</li>
      </ul>
      
      <h3>Test-Specific Maneuvers</h3>
      
      <p>Pay special attention to these commonly tested maneuvers:</p>
      
      <ul>
        <li><strong>Parallel Parking:</strong> Practice until you can consistently park within 30cm of the curb without excessive adjustments. Remember to check mirrors and blind spots throughout.</li>
        
        <li><strong>Three-Point Turn:</strong> Execute this maneuver smoothly, checking for traffic at each stage and using proper signaling.</li>
        
        <li><strong>Hill Starts:</strong> Demonstrate proper use of the handbrake (if applicable) and smooth clutch control to prevent rolling backward.</li>
        
        <li>
          <strong>Emergency Stop:</strong>
          <p>React promptly to the examiner's signal, brake firmly but controlled, and remember to check mirrors before stopping.</p>
        </li>
      </ul>
      
      <h3>Zimbabwe-Specific Test Considerations</h3>
      
      <p>In Zimbabwe, be particularly aware of:</p>
      
      <ul>
        <li>
          <strong>VID Test Requirements:</strong>
          <p>The Vehicle Inspection Department (VID) has specific testing procedures. Familiarize yourself with their exact requirements, which may include the "drum test" for precise vehicle control.</p>
        </li>
        
        <li>
          <strong>Road Markings and Signs:</strong>
          <p>Zimbabwe follows a system similar to the UK. Ensure you understand all local road markings and signs, as these may differ slightly from other countries.</p>
        </li>
        
        <li>
          <strong>Defensive Driving Emphasis:</strong>
          <p>Examiners in Zimbabwe place particular emphasis on defensive driving techniques due to varied road conditions. Demonstrate awareness of potential hazards.</p>
        </li>
      </ul>
      
      <h3>Mental Preparation</h3>
      
      <ul>
        <li>
          <strong>Manage Nervousness:</strong>
          <p>Some nervousness is normal, but excessive anxiety can impair your driving. Practice deep breathing techniques and positive visualization before your test.</p>
        </li>
        
        <li>
          <strong>Listen Carefully to Instructions:</strong>
          <p>If you don't understand an instruction, politely ask for clarification. It's better to ask than to make a mistake.</p>
        </li>
        
        <li>
          <strong>Don't Assume Failure:</strong>
          <p>If you make a mistake, stay calm and continue driving safely. One error rarely causes automatic failure, and becoming flustered can lead to additional mistakes.</p>
        </li>
      </ul>
      
      <p>Remember, driving examiners aren&apos;t trying to trick you—they want to ensure you can drive safely and independently. By avoiding these common mistakes and demonstrating confident, safe driving practices, you&apos;ll maximize your chances of passing your driving test on the first attempt.</p>
    `
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    // Find the current post based on the slug parameter
    const currentSlug = params?.slug as string;
    const foundPost = blogPosts.find(post => post.slug === currentSlug) || null;
    setPost(foundPost);

    // Find related posts (same category, excluding current post)
    if (foundPost) {
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      setRelatedPosts(related);
    }
  }, [params]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-gray-400 mb-6">The article you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/blog" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      <div className="container mx-auto py-24 px-4 sm:px-6 max-w-4xl">
        {/* Back to Blog Link */}
        <div className="mb-4 sm:mb-6">
          <Link href="/blog" className="text-blue-400 hover:text-blue-300 font-medium flex items-center text-sm sm:text-base transition-colors">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center text-blue-400 text-xs sm:text-sm mb-3 sm:mb-4">
            <span className="uppercase font-semibold bg-blue-900/30 px-2 py-1 rounded-md">{post.category.replace('-', ' ')}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.date)}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center text-gray-400 text-xs sm:text-sm">
            <span className="flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
              By {post.author}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw"
              className="object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none overflow-hidden">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content || '' }} 
            className="break-words prose-headings:text-blue-400 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-ul:pl-4 prose-ol:pl-4 prose-ul:space-y-2 prose-ol:space-y-2" 
          />
        </article>

        {/* Author Bio */}
        <div className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="mr-3 sm:mr-4 bg-blue-600 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-bold shadow-md">
              {post.author.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{post.author}</h3>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                <svg className="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
                Driving Instructor
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {post.author === 'Captain Roadwise' && 'Captain Roadwise has over 15 years of experience as a driving instructor and road safety advocate. He specializes in defensive driving techniques and traffic regulations.'}
            {post.author === 'Safety Sally' && 'Safety Sally is a certified road safety expert with a background in accident prevention. She focuses on teaching defensive driving and hazard awareness to new drivers.'}
            {post.author === 'Professor Drive' && 'Professor Drive holds advanced certifications in driver education and has authored several books on driving theory. He specializes in explaining complex driving concepts in simple terms.'}
            {post.author === 'Mechanic Mike' && 'Mechanic Mike is an automotive technician with expertise in vehicle maintenance and safe driving practices. He helps drivers understand how their vehicles work and how to maintain them properly.'}
          </p>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all hover:scale-[1.02] hover:shadow-blue-900/20 hover:border-blue-800/50">
                  <div className="relative h-32 sm:h-36 md:h-40 w-full overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image 
                        src={relatedPost.imageUrl} 
                        alt={relatedPost.title} 
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover transition-transform hover:scale-110 duration-500"
                      />
                    </div>
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 m-2 rounded z-10">
                      {relatedPost.category.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2">{relatedPost.title}</h3>
                    
                    <Link href={`/blog/${relatedPost.slug}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors">
                      Read Article
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm sm:text-base"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
}