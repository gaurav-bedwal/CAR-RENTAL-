/**
 * RentLux Intelligence Engine
 * This controller simulates an AI assistant by processing natural language 
 * and matching it against a structured knowledge base of business rules.
 */

const knowledgeBase = [
    {
        keywords: ["price", "cost", "how much", "rate", "money"],
        answer: "Our rates are split into Daily and Hourly options. Standard daily rates start from economical segments to high-end luxury. For short trips, you can book for 6, 8, or 12 hours!"
    },
    {
        keywords: ["hour", "6 hours", "6hrs", "minimum", "short time", "hourly"],
        answer: "Yes! We offer flexible hourly bookings. You can book a car for a minimum of 6 hours. We also have 8-hour and 12-hour packages for your convenience."
    },
    {
        keywords: ["360", "view", "rotate", "look around", "inside"],
        answer: "We offer a premium 360° interactive view for many of our vehicles! Just click the '360° View' button on the car details page to explore the vehicle from every angle."
    },
    {
        keywords: ["book", "reserve", "order", "rent", "how to"],
        answer: "To book, simply select your pickup/return dates and times on the home page or a car's details page. If you're booking for the same day, make sure to select the 'Hourly' option!"
    },
    {
        keywords: ["location", "where", "city", "place", "pickup"],
        answer: "We are currently operating in major hubs including New York, Los Angeles, Chicago, and Houston. You can select your preferred location during the booking process."
    },
    {
        keywords: ["security", "safe", "login", "session"],
        answer: "RentLux uses enterprise-grade security. Every session is unique, and for your safety, we automatically log you out if you refresh the page or open a new tab."
    },
    {
        keywords: ["hello", "hi", "hey", "greetings"],
        answer: "Hello! I am Luxie, your RentLux digital assistant. How can I help you find your dream car today?"
    }
];

export const processChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.json({ success: false, message: "No message provided" });

        // If User adds API Key, use Real AI
        if (process.env.GEMINI_API_KEY) {
            const systemPrompt = `You are Luxie, an exclusive digital concierge for RentLux Car Rentals. 
            Keep your responses concise, luxurious, and highly helpful. 
            We offer daily and hourly rentals (6, 8, 12 hours minimum). 
            We have a 360-degree car view feature. 
            Customer says: "${message}"`;

            try {
                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt }] }]
                    })
                });
                
                const aiData = await aiResponse.json();
                if (aiData.candidates && aiData.candidates[0]) {
                    const reply = aiData.candidates[0].content.parts[0].text;
                    return res.json({ success: true, reply: reply.replace(/\*/g, '') }); // Stripping markdown stars for cleaner UI
                }
            } catch (err) {
                console.log("Gemini API Error, falling back to scripted...", err.message);
            }
        }

        // Fallback: Keyword Matching Engine 
        const lowerMessage = message.toLowerCase();
        const match = knowledgeBase.find(item => 
            item.keywords.some(keyword => lowerMessage.includes(keyword))
        );

        const response = match 
            ? match.answer 
            : "I'm not sure about that specific detail, but I can tell you about our hourly bookings, 360° views, or current fleet. Would you like to know more about those?";

        setTimeout(() => {
            res.json({ success: true, reply: response });
        }, 800);

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Assistant is temporarily resting. Please try again later." });
    }
};
