
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { character, history, action } = await req.json();

    if (!character || !history || !action) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const storyPrompt = `
      You are a master storyteller, acting as a Dungeon Master in a text-based RPG.
      The user is playing as a character with the following details:
      - Name: ${character.name}
      - Class: ${character.class}
      - Backstory: ${character.backstory}

      Here is the story so far:
      ${history.map((entry: any) => `${entry.type === 'user' ? 'You' : 'Story'}: ${entry.text}`).join('\n')}

      The user's next action is: "${action}"

      Your task is to continue the story. Describe what happens next in a compelling and creative way.
      Keep the story moving forward and introduce new challenges, characters, or plot twists.

      After the story part, you MUST provide a vivid and detailed image prompt for the scene,
      enclosed in a <image> tag. This prompt will be used to generate an image that captures the moment.
      The image prompt should be descriptive and focus on the visual elements of the scene.

      Example response format:
      The story continues here...

      <image>A detailed description of the scene for the image generation model.</image>
    `;

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_T1FiFzWERQisv8',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'user',
            content: storyPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LLM API Error:", errorText);
      return NextResponse.json({ error: 'Failed to get response from LLM' }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const imagePromptMatch = content.match(/<image>(.*?)<\/image>/);
    const imagePrompt = imagePromptMatch ? imagePromptMatch[1].trim() : 'A fantasy scene';
    const storyText = content.replace(/<image>.*?<\/image>/, '').trim();

    return NextResponse.json({ story: storyText, imagePrompt });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
