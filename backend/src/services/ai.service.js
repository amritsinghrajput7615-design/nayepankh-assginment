const generateTaskEmail = async ({ volunteerName, taskTitle, taskDescription, deadline }) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `Generate a warm professional HTML email for a NayePankh Foundation volunteer who has been assigned a task.
Volunteer name: ${volunteerName}
Task title: ${taskTitle}
Task description: ${taskDescription}
Deadline: ${new Date(deadline).toDateString()}
Rules:
- Inline HTML styles only
- Warm and motivating tone
- Clearly show task title, description, deadline
- Sign off as "NayePankh Foundation Team"
- Return ONLY the HTML, no markdown or explanation`
            }]
        })
    });

    if (!response.ok) throw new Error(`Groq error: ${await response.text()}`);
    const data = await response.json();
    return data.choices[0].message.content;
};

module.exports = { generateTaskEmail };