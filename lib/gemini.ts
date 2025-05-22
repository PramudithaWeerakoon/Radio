import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/db';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI('AIzaSyDz6xQM99_8aCcmx7qmbawRIU7uvzB1op4');

// Function to get database information
async function getWebsiteData() {
  try {
    // Fetching relevant data from your database
    const [
      albums,
      events,
      bandMembers,
      blogPosts,
      tracks
    ] = await Promise.all([
      // Get recent albums (limited to 5)
      prisma.album.findMany({ 
        take: 5,
        orderBy: { release_date: 'desc' },
        select: { 
          id: true,
          title: true,
          release_date: true,
          description: true
        }
      }),
      
      // Get Latest Events (limited to 5)
      prisma.event.findMany({
        where: { date: { gte: new Date() } },
        take: 5,
        orderBy: { date: 'asc' },
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          description: true
        }
      }),
      
      // Get band members
      prisma.member.findMany({
        take: 10,
        select: {
          id: true,
          firstName: true, // or possibly 'username', 'displayName', etc.
          role: true
        }
      }),
      
      // Get recent blog posts
      prisma.blog.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          content: true
        }
      }),
      
      // Get featured tracks
      prisma.track.findMany({
        where: { isInPlayer: true },
        take: 5,
        select: {
          id: true,
          title: true,
          artist: true,
          album: {
            select: {
              title: true
            }
          }
        }
      })
    ]);
    
    // Format the data as a context string
    return JSON.stringify({
      albums,
      events,
      bandMembers,
      blogPosts,
      tracks
    }, null, 2);
  } catch (error) {
    console.error("Error fetching website data:", error);
    return "Unable to access website data at the moment.";
  }
}

// Create a function to get responses from Gemini related only to this radio website
export async function getChatResponse(message: string): Promise<string> {
  try {
    // Get website data from database to provide context
    const websiteData = await getWebsiteData();
    
    // Initialize the model - use gemini-1.5-flash which is faster than pro
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Define the system instructions with database context
    const systemInstruction = `You are a helpful assistant for a radio website that provides information about:
    - Music and albums
    - Events and bookings
    - Blog posts and reviews
    - Band members
    - Merchandise
    - Contact information
    
    Only answer questions related to these topics. If asked about something unrelated, 
    politely explain that you can only help with information about this radio website.
    
    Here is the current information from the website's database that you should use for your responses:
    
    ${websiteData}
    
    When answering questions about any of these topics, always refer to the data provided above.
    If the data doesn't contain information to answer a question, you can provide general information about the radio website
    but make it clear you're providing general information rather than specific details.`;
    
    // Start a chat with updated API structure
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Please only respond to queries about this radio website and use the database information provided.' }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I will only provide information related to the radio website and its features, using the database information when available.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.2, // Lower temperature for more factual responses
      },
    });

    // Send the message and get a response
    const result = await chat.sendMessage(systemInstruction + "\n\nUser question: " + message);
    return result.response.text();
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return 'Sorry, I encountered an issue processing your request. Please try again later.';
  }
}