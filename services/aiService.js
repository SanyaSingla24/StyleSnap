import Replicate from "replicate"
import { Client } from "@gradio/client"
import sharp from "sharp"

// Initialize Replicate client
const getReplicateClient = () => {
  const token = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN_1 || process.env.REPLICATE_API_TOKEN_2
  return new Replicate({ auth: token })
}

// Pool of active alternative spaces for robust ZeroGPU failover
const SPACES = [
  { id: "franciszzj/Leffa", type: "leffa", supportedCategories: ["upper_body", "lower_body", "dresses"] },
  { id: "tryitonvirtual/Leffa", type: "leffa", supportedCategories: ["upper_body", "lower_body", "dresses"] },
  { id: "Rudrack/Leffa", type: "leffa", supportedCategories: ["upper_body", "lower_body", "dresses"] },
  { id: "yisol/IDM-VTON", type: "idm_vton", supportedCategories: ["upper_body"] },
  { id: "Sonui/yisol-IDM-VTON", type: "idm_vton", supportedCategories: ["upper_body"] },
  { id: "allAI-tools/IDM-VTON", type: "idm_vton", supportedCategories: ["upper_body"] },
  { id: "00jdk/IDM-VTON", type: "idm_vton", supportedCategories: ["upper_body"] },
  { id: "Saad0KH/IDM-VTON", type: "idm_vton", supportedCategories: ["upper_body"] }
]

// Cache of Gradio client instances by space ID and token combination
const gradioClientsCache = new Map()

// Dynamic parser for all HF_TOKEN configurations in environment variables
function getHFTokens() {
  const tokens = []
  if (process.env.HF_TOKEN) tokens.push(process.env.HF_TOKEN)
  for (let i = 1; i <= 10; i++) {
    const token = process.env[`HF_TOKEN_${i}`]
    if (token) tokens.push(token)
  }
  return tokens
}

async function getGradioClient(spaceId, token) {
  const cacheKey = `${spaceId}_${token || "no-token"}`
  if (!gradioClientsCache.has(cacheKey)) {
    console.log(`Connecting to Hugging Face Space (${spaceId}) using token: ${token ? token.substring(0, 8) + "..." : "none"}...`)
    const client = await Client.connect(spaceId, token ? { token } : {})
    gradioClientsCache.set(cacheKey, client)
    console.log(`Connected successfully to ${spaceId} and cached client.`)
  }
  return gradioClientsCache.get(cacheKey)
}

/**
 * Pre-warm the preferred Gradio space client.
 */
export async function prewarmGradio() {
  try {
    const tokens = getHFTokens()
    await getGradioClient("franciszzj/Leffa", tokens[0] || null)
  } catch (err) {
    console.warn("Could not pre-warm Gradio client on startup (will retry on demand):", err.message)
  }
}

/**
 * Executes AI Try-On using Gradio failovers or Replicate fallbacks.
 */
export async function executeTryOn({ userFile, category, description, outfitFile, outfitUrl, origin }) {
  // 1. Normalize and resize user photo to JPEG
  let userBuffer = userFile.buffer
  let userMimeType = userFile.mimetype
  try {
    userBuffer = await sharp(userFile.buffer)
      .resize({ width: 768, height: 1024, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()
    userMimeType = "image/jpeg"
    console.log("Successfully normalized and resized user image to JPEG (768x1024) using sharp.")
  } catch (err) {
    console.warn("Failed to normalize user image to JPEG:", err.message)
  }

  const userURI = `data:${userMimeType};base64,${userBuffer.toString("base64")}`
  
  let outfitURI
  let outfitBuffer
  let outfitMimeType

  if (outfitFile) {
    outfitBuffer = outfitFile.buffer
    outfitMimeType = outfitFile.mimetype
    try {
      outfitBuffer = await sharp(outfitFile.buffer)
        .resize({ width: 768, height: 1024, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer()
      outfitMimeType = "image/jpeg"
      console.log("Successfully normalized and resized uploaded outfit image to JPEG using sharp.")
    } catch (err) {
      console.warn("Failed to normalize uploaded outfit image to JPEG:", err.message)
    }
    outfitURI = `data:${outfitMimeType};base64,${outfitBuffer.toString("base64")}`
  } else if (outfitUrl) {
    outfitURI = outfitUrl
  } else {
    throw new Error("Either outfit file or outfitUrl is required.")
  }

  let resultImage
  let solved = false

  // Method 1: Hugging Face Gradio Client with failover
  const eligibleSpaces = SPACES.filter(s => s.supportedCategories.includes(category))
  const tokens = getHFTokens()

  console.log(`Eligible spaces for category "${category}":`, eligibleSpaces.map(s => s.id))
  console.log(`Available HF tokens for cycling: ${tokens.length}`)

  for (const space of eligibleSpaces) {
    if (solved) break

    const tokenCount = Math.max(tokens.length, 1)
    for (let t = 0; t < tokenCount; t++) {
      const token = tokens[t] || null
      console.log(`Trying space: ${space.id} (${space.type}) with token index ${t}...`)
      try {
        const humanBlob = new Blob([userBuffer], { type: userMimeType })
        let garmentBlob

        if (outfitBuffer) {
          garmentBlob = new Blob([outfitBuffer], { type: outfitMimeType })
        } else {
          let fetchUrl = outfitURI
          if (!fetchUrl.startsWith("http") && !fetchUrl.startsWith("data:")) {
            let baseOrigin = origin || "http://localhost:5173"
            if (baseOrigin.endsWith('/')) baseOrigin = baseOrigin.slice(0, -1)
            fetchUrl = `${baseOrigin}${fetchUrl.startsWith('/') ? '' : '/'}${fetchUrl}`
          }
          
          if (fetchUrl.startsWith("data:")) {
            const matches = fetchUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            let buf = Buffer.from(matches[2], 'base64')
            try {
              buf = await sharp(buf)
                .resize({ width: 768, height: 1024, fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer()
            } catch (err) {
              console.warn("Failed to normalize fetched base64 outfit to JPEG:", err.message)
            }
            garmentBlob = new Blob([buf], { type: "image/jpeg" })
          } else {
            const fetchRes = await fetch(fetchUrl)
            if (!fetchRes.ok) {
              throw new Error(`Failed to fetch garment image from URL: ${fetchUrl}`)
            }
            const arrayBuffer = await fetchRes.arrayBuffer()
            let buf = Buffer.from(arrayBuffer)
            try {
              buf = await sharp(buf)
                .resize({ width: 768, height: 1024, fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer()
            } catch (err) {
              console.warn("Failed to normalize fetched URL outfit to JPEG:", err.message)
            }
            garmentBlob = new Blob([buf], { type: "image/jpeg" })
          }
        }

        console.log(`Connecting/Re-using client for space: ${space.id}...`)
        const clientApp = await getGradioClient(space.id, token)

        let gradioResult
        if (space.type === "leffa") {
          gradioResult = await clientApp.predict("/leffa_predict_vt", {
            src_image_path: humanBlob,
            ref_image_path: garmentBlob,
            ref_acceleration: true,
            step: 30,
            scale: 2.5,
            seed: 42,
            vt_model_type: "viton_hd",
            vt_garment_type: category,
            vt_repaint: true
          })
        } else {
          gradioResult = await clientApp.predict("/tryon", {
            dict: {
              background: humanBlob,
              layers: [],
              composite: null
            },
            garm_img: garmentBlob,
            garment_des: description,
            is_checked: true,
            is_checked_crop: false,
            denoise_steps: 30,
            seed: 42
          })
        }

        if (gradioResult && gradioResult.data && gradioResult.data[0]) {
          const finalUrl = gradioResult.data[0].url || gradioResult.data[0]
          console.log(`Gradio Virtual Try-On successful on space ${space.id}! Output URL:`, finalUrl)
          resultImage = finalUrl
          solved = true
          break
        } else {
          throw new Error("Gradio client returned invalid response format.")
        }
      } catch (gradioError) {
        console.warn(`Space ${space.id} failed with token index ${t}. Error:`, gradioError.message)
        const cacheKey = `${space.id}_${token || "no-token"}`
        gradioClientsCache.delete(cacheKey)
      }
    }
  }

  // Method 2: Replicate cuuupid/idm-vton (Paid API, fallback)
  if (!solved) {
    if (!process.env.REPLICATE_API_TOKEN && !process.env.REPLICATE_API_TOKEN_1) {
      throw new Error("Free Try-On failed, and Replicate API token is not configured in .env file.")
    }

    console.log(`Starting AI Try-On process using Replicate cuuupid/idm-vton (${category})...`)
    const replicateInstance = getReplicateClient()
    try {
      const output = await replicateInstance.run(
        "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        {
          input: {
            human_img: userURI,
            garm_img: outfitURI,
            category: category,
            garment_des: description,
            crop: true,
            steps: 30
          }
        }
      )
      console.log("Replicate Try-On successful! Output:", output)
      resultImage = Array.isArray(output) ? output[0] : output
      solved = true
    } catch (replicateError) {
      console.error("Replicate Try-On failed. Error:", replicateError.message)
      const errMessage = replicateError.message || ""
      if (errMessage.includes("402") || errMessage.toLowerCase().includes("credit") || errMessage.toLowerCase().includes("payment")) {
        const customErr = new Error("Your Replicate API token has insufficient credits. Please add billing credits at https://replicate.com/account/billing.")
        customErr.statusCode = 402
        throw customErr
      }
      throw replicateError
    }
  }

  return { image: resultImage }
}

/**
 * Executes Outfit Analysis using Groq, Gemini, Replicate LLaVA, or static fallbacks.
 */
export async function executeOutfitAnalysis({ outfitFile }) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY && !process.env.REPLICATE_API_TOKEN && !process.env.REPLICATE_API_TOKEN_1) {
    throw new Error("None of GROQ_API_KEY, GEMINI_API_KEY, or REPLICATE_API_TOKEN is configured in your .env file.")
  }

  const outfitURI = `data:${outfitFile.mimetype};base64,${outfitFile.buffer.toString("base64")}`
  let feedback
  let solved = false

  const prompt = `You are an expert fashion stylist. Analyze the outfit in this image. 
Provide your response strictly as a JSON object matching the following schema. Return only the raw JSON string. Do not include markdown code fences (like \`\`\`json) or any other text.
{
  "score": (a number between 1.0 and 10.0, e.g. 8.5),
  "badge": (a short category badge, e.g. "Streetwear Classic", "Corporate Chic", "Boho Vibe", "Indie Grunge"),
  "tips": [
    (tip 1, about color, fit, or coordination. IF recommending an item, include a markdown link to a shop, e.g., "Consider [brown loafers](https://www.google.com/search?tbm=shop&q=brown+loafers)"),
    (tip 2, suggesting footwear or layering with a markdown shop link),
    (tip 3, suggesting accessories or improvements with a markdown shop link)
  ],
  "pose": (a pose recommendation for photos, e.g. "Try a candid walking pose looking away")
}`

  // Method 1: Groq API
  if (process.env.GROQ_API_KEY) {
    console.log("Starting AI Outfit Analysis using Groq meta-llama/llama-4-scout-17b-16e-instruct...")
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: outfitURI } }
              ]
            }
          ],
          response_format: { type: "json_object" }
        })
      })

      if (!groqRes.ok) {
        const rawErr = await groqRes.text()
        throw new Error(`Groq API returned status ${groqRes.status}: ${rawErr}`)
      }

      const groqData = await groqRes.json()
      const textResponse = groqData.choices[0].message.content
      console.log("Raw Groq JSON response:", textResponse)
      
      feedback = JSON.parse(textResponse.trim())
      solved = true
    } catch (groqError) {
      console.error("Groq analysis failed, falling back to Gemini. Error:", groqError.message)
    }
  }

  // Method 2: Google Gemini
  if (!solved && process.env.GEMINI_API_KEY) {
    console.log("Starting AI Outfit Analysis using Google Gemini 1.5 Flash...")
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: outfitFile.mimetype,
                    data: outfitFile.buffer.toString("base64")
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      })

      if (!geminiRes.ok) {
        const rawErr = await geminiRes.text()
        throw new Error(`Gemini API returned status ${geminiRes.status}: ${rawErr}`)
      }

      const geminiData = await geminiRes.json()
      const textResponse = geminiData.candidates[0].content.parts[0].text
      console.log("Raw Gemini JSON response:", textResponse)
      
      feedback = JSON.parse(textResponse.trim())
      solved = true
    } catch (geminiError) {
      console.error("Gemini analysis failed, falling back to Replicate. Error:", geminiError.message)
    }
  }

  // Method 3: Replicate LLaVA fallback
  if (!solved && (process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_TOKEN_1)) {
    console.log("Starting AI Outfit Analysis using Replicate yorickvp/llava-13b...")
    const replicateInstance = getReplicateClient()
    try {
      const llavaPrompt = `You are an expert fashion stylist. Analyze the outfit in this image. 
Provide your analysis strictly in JSON format with the following keys. Do not include markdown formatting like \`\`\`json or any introductory/conclusion text. Just return raw JSON.
{
  "score": (a number between 1.0 and 10.0, e.g. 8.5),
  "badge": (a short category badge, e.g. "Streetwear Classic", "Corporate Chic", "Boho Vibe", "Indie Grunge"),
  "tips": [
    (tip 1, about color, fit, or coordination. IF recommending an item, include a markdown link to a shop, e.g., "Consider [brown loafers](https://www.google.com/search?tbm=shop&q=brown+loafers)"),
    (tip 2, suggesting footwear or layering with a markdown shop link),
    (tip 3, suggesting accessories or improvements with a markdown shop link)
  ],
  "pose": (a pose recommendation for photos, e.g. "Try a candid walking pose looking away")
}`

      const output = await replicateInstance.run(
        "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
        {
          input: {
            image: outfitURI,
            prompt: llavaPrompt,
            max_tokens: 1024,
            temperature: 0.2,
            top_p: 1
          }
        }
      )

      let rawText = Array.isArray(output) ? output.join("") : output
      rawText = rawText.trim()
      console.log("Raw LLava output received:", rawText)

      let jsonText = rawText
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.substring(7)
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.substring(3)
      }
      if (jsonText.endsWith("```")) {
        jsonText = jsonText.substring(0, jsonText.length - 3)
      }
      jsonText = jsonText.trim()

      feedback = JSON.parse(jsonText)
      solved = true
    } catch (replicateError) {
      console.error("Replicate analysis failed. Error:", replicateError.message)
    }
  }

  // Method 4: Simulation fallback
  if (!solved) {
    console.warn("Using simulated fallback styling review.")
    const scores = ["8.4", "9.1", "8.7", "7.8", "9.3"]
    const badges = ["Streetwear Vibe", "Modern Minimalist", "Indie Grunge Look", "Sleek Corporate", "Bohemian Chic"]
    const tipsList = [
      [
        "🎨 Great choice of neutral colors, very clean and balanced.",
        "👟 Pair this with clean white low-top sneakers to keep it effortlessly casual.",
        "⌚ Consider adding a minimalist silver watch or simple rings to detail the look."
      ],
      [
        "🧥 The layering is well-proportioned, but watch the hemline of your outer jacket.",
        "👞 Classic leather loafers or dark Chelsea boots would elevate this silhouette.",
        "🕶️ Try accessorizing with statement dark sunglasses for an extra modern edge."
      ],
      [
        "🎨 Vibrant colors! Keep your accessories neutral so they do not compete.",
        "👢 Ankle-high leather boots would complement this cut beautifully.",
        "🧣 A simple necklace or accent scarf would complete this layered outfit."
      ]
    ]
    
    const seed = outfitFile.size % 3
    feedback = {
      score: scores[outfitFile.size % scores.length],
      badge: badges[outfitFile.size % badges.length],
      tips: tipsList[seed],
      pose: "Stand angled at 45 degrees with one hand resting casually on your hip or pocket."
    }
  }

  return feedback
}

/**
 * Executes AI Chat responses.
 */
export async function executeStyleChat({ messages, context, styleDNA }) {
  let systemPrompt = `You are an expert AI fashion stylist assisting a user with their outfit. Answer the user's follow-up questions. Whenever you suggest a clothing item or accessory, you MUST include a markdown link directing the user to a shopping search engine (e.g., "You could try [black leather boots](https://www.google.com/search?tbm=shop&q=black+leather+boots)"). Be concise and helpful.`
  
  if (context) {
    systemPrompt += `\n\nContext about the user's outfit you just reviewed:\nScore: ${context.score}/10\nBadge: ${context.badge}\nTips: ${context.tips.join(" ")}\nRecommended Pose: ${context.pose}`
  }

  if (styleDNA) {
    systemPrompt += `\n\nThe user has configured their Style DNA profile:\n- Aesthetic: ${styleDNA.aesthetic}\n- Color Palette: ${styleDNA.paletteName}\n- Silhouette Fit: ${styleDNA.fit}\nPlease customize all styling suggestions, outfit combinations, and fashion advice to align beautifully with this style aesthetic, color harmony, and fit profile.`
  }

  // Method 1: Groq API (llama-3.1-8b-instant)
  if (process.env.GROQ_API_KEY) {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    })
    if (!groqRes.ok) throw new Error("Groq API failed in chat")
    const groqData = await groqRes.json()
    return { response: groqData.choices[0].message.content }
  } 
  
  // Method 2: Google Gemini (gemini-1.5-flash)
  if (process.env.GEMINI_API_KEY) {
    const geminiMessages = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }))
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages
      })
    })
    if (!geminiRes.ok) throw new Error("Gemini API failed in chat")
    const geminiData = await geminiRes.json()
    return { response: geminiData.candidates[0].content.parts[0].text }
  }

  throw new Error("No chat-capable API keys configured (GROQ or GEMINI).")
}
