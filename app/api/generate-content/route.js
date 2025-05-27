import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🛡️ PROTECTION: Rate limiting to prevent abuse
const rateLimitMap = new Map();

export async function POST(request) {
  try {
    // 🛡️ PROTECTION: Check rate limit (5 requests per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute
    
    if (recentRequests.length >= 5) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return Response.json({ 
        error: 'Rate limit exceeded. Please wait a minute before generating more content.',
        retryAfter: 60 
      }, { status: 429 });
    }
    
    // Log this request
    rateLimitMap.set(ip, [...recentRequests, now]);
    
    // 🛡️ PROTECTION: Limit content count to prevent huge bills
    const { count: requestedCount = 7, focusArea = null } = await request.json();
    const count = Math.min(requestedCount, 10); // Max 10 posts per request
    
    if (requestedCount > 10) {
      console.log(`Blocked excessive content request: ${requestedCount} posts requested`);
    }

    const contentPillars = [
      {
        pillar: "Educational",
        prompt: "Create a LinkedIn post about business automation tips for small businesses. Include specific, actionable advice that entrepreneurs can implement immediately. Focus on saving time and reducing manual work. Make it helpful and authoritative with a professional tone. Include 1-2 relevant emojis.",
        cta: "Download my automation checklist →",
        hashtags: "#automation #smallbusiness #productivity #tips #efficiency"
      },
      {
        pillar: "Showcase", 
        prompt: "Create a behind-the-scenes LinkedIn post showing off an n8n automation workflow that just completed a task. Mention specific tools used, time saved, and the seamless integration. Build excitement about automation capabilities. Include 1-2 relevant emojis and maintain credibility.",
        cta: "Get your free automation audit →",
        hashtags: "#n8n #automation #behindthescenes #workflow #productivity"
      },
      {
        pillar: "Social Proof",
        prompt: "Create a LinkedIn post about a client success story (keep client anonymous). Focus on specific before/after transformation, quantifiable results achieved, and business impact. Make it credible and inspiring without revealing client identity. Include 1-2 relevant emojis.",
        cta: "Read more success stories →", 
        hashtags: "#clientsuccess #automation #results #transformation #roi"
      },
      {
        pillar: "Tips",
        prompt: "Create a LinkedIn post with a quick automation tip that business owners can implement today. Make it immediately actionable, simple to understand, and focused on solving a common pain point. Use a helpful, expert tone with 1-2 relevant emojis.",
        cta: "Get your automation toolkit →",
        hashtags: "#quickwin #automation #productivity #tips #businesshack"
      },
      {
        pillar: "Industry Insights",
        prompt: "Create a LinkedIn post about current trends in business automation for 2025. Include forward-looking insights, emerging technologies, and practical implications for businesses. Position as a thought leader with industry expertise. Include 1-2 relevant emojis.",
        cta: "Stay ahead with my automation insights →",
        hashtags: "#automation #2025trends #businessinnovation #futureofwork #productivity"
      }
    ];

    const generatedContent = [];

    for (let i = 0; i < count; i++) {
      // Rotate through pillars or use specified focus area
      const pillarIndex = focusArea ? 
        contentPillars.findIndex(p => p.pillar.toLowerCase() === focusArea.toLowerCase()) || 0 :
        i % contentPillars.length;
      
      const selectedPillar = contentPillars[pillarIndex];

      try {
        // Generate unique content with OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // 🛡️ Using cheapest model
          messages: [
            {
              role: "system",
              content: `You are an expert LinkedIn content creator specializing in business automation and n8n workflows. Create engaging posts that:
              
              - Are 150-250 words (under 1300 characters total including spaces)
              - Start with a compelling hook in the first line
              - Provide genuine, actionable value
              - Use a professional but conversational tone
              - Include 1-2 relevant emojis naturally in the text (not excessive)
              - Have clear structure with line breaks for readability
              - End with engagement (question, call-to-action, or thought)
              - Focus on automation, productivity, and business efficiency
              - Sound authentic and personal, not corporate
              
              Do NOT include hashtags in the post content - they will be added separately.
              Return ONLY the post content, no additional commentary or formatting.`
            },
            {
              role: "user", 
              content: selectedPillar.prompt
            }
          ],
          max_tokens: 300, // 🛡️ Reduced from 400 to save costs
          temperature: 0.8,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        });

        const postContent = completion.choices[0].message.content.trim();

        // Generate varied posting schedule
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const times = ['09:00', '11:00', '14:00', '16:00'];
        const scheduledFor = `${days[i % 5]} ${times[i % 4]}`;

        // Create detailed instructions for further processing
        const instructions = `AI-generated LinkedIn post focused on ${selectedPillar.pillar.toLowerCase()} content about business automation. 
        Target audience: Small business owners, entrepreneurs, and decision-makers interested in automation solutions.
        Tone: Professional, helpful, and engaging with practical value.
        Content type: ${selectedPillar.pillar} post designed to build authority and drive engagement.
        Call-to-action: Include "${selectedPillar.cta}" at the end.
        Hashtags: Add "${selectedPillar.hashtags}" after the main content.
        Character limit: Keep total post under 1300 characters including hashtags and CTA.`;

        generatedContent.push({
          postDescription: postContent,
          instructions: instructions,
          pillar: selectedPillar.pillar,
          cta: selectedPillar.cta,
          hashtags: selectedPillar.hashtags,
          scheduledFor: scheduledFor,
          generatedAt: new Date().toISOString(),
          isAIGenerated: true
        });

        // 🛡️ PROTECTION: Longer delay to prevent rapid-fire requests
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Increased from 100ms
        }

      } catch (openaiError) {
        console.error(`OpenAI error for post ${i + 1}:`, openaiError);
        
        // Fallback to a template if OpenAI fails for this specific post
        const fallbackPost = {
          postDescription: `Automation insight ${i + 1}: The key to scaling your business isn't working harder, it's working smarter. Small automations compound into massive time savings. What manual task is eating up your day? 🤔`,
          instructions: `Fallback template post about automation benefits. Educational content focused on time savings and efficiency.`,
          pillar: selectedPillar.pillar,
          cta: selectedPillar.cta,
          hashtags: selectedPillar.hashtags,
          scheduledFor: scheduledFor,
          generatedAt: new Date().toISOString(),
          isAIGenerated: false
        };
        
        generatedContent.push(fallbackPost);
      }
    }

    // 🛡️ PROTECTION: Log usage for monitoring
    console.log(`Generated ${generatedContent.length} posts for IP: ${ip} at ${new Date().toISOString()}`);

    return Response.json({ 
      ideas: generatedContent,
      generated: true,
      aiPowered: true,
      timestamp: new Date().toISOString(),
      totalGenerated: generatedContent.length,
      aiSuccessRate: generatedContent.filter(post => post.isAIGenerated).length / generatedContent.length,
      rateLimitRemaining: Math.max(0, 5 - recentRequests.length - 1)
    });

  } catch (error) {
    console.error('Content generation error:', error);
    
    // Complete fallback to templates if everything fails
    const fallbackTemplates = [
      {
        postDescription: "Automation transforms businesses by eliminating repetitive tasks and reducing human error. The ROI speaks for itself when you see 20+ hours saved weekly. What process would you automate first? 💡",
        instructions: "Educational fallback post about automation benefits and ROI.",
        pillar: "Educational",
        cta: "Get your automation assessment →",
        hashtags: "#automation #productivity #business #efficiency #roi",
        scheduledFor: "Monday 09:00",
        generatedAt: new Date().toISOString(),
        isAIGenerated: false
      },
      {
        postDescription: "Just watched my n8n workflow automatically sync 500+ leads from LinkedIn to our CRM, send personalized follow-ups, and update our tracking sheet. All while I focused on strategic work. This is the power of thoughtful automation. 🚀",
        instructions: "Showcase fallback post demonstrating automation capabilities.",
        pillar: "Showcase", 
        cta: "See my automation services →",
        hashtags: "#n8n #automation #crm #workflow #productivity",
        scheduledFor: "Wednesday 14:00",
        generatedAt: new Date().toISOString(),
        isAIGenerated: false
      }
    ];

    return Response.json({ 
      ideas: fallbackTemplates.slice(0, count || 2),
      generated: false,
      aiPowered: false,
      error: "Fell back to templates due to generation error",
      timestamp: new Date().toISOString()
    });
  }
}