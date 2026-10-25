import Extraction from '../models/extraction.model.js';
export const extractContent = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const base64 = req.file.buffer.toString('base64');
        const imgdata = `data:${req.file.mimetype};base64,${base64}`;
        const prompt = 'Analyze this image and extract visible information. If it contains a resume, extract: - Name - Email - Phone - Skills - Education - Experience - Projects If it contains a LinkedIn recruitment post, extract: - Recruiter email, if visible - Recruiter or author name - Company - Job role - Required skills - Post content Return valid JSON. Use null for missing information. Do not invent or guess information. '
        const extractContentWithAI = await extractWithAI(imgdata, prompt);
        let parsedata = null;
        try {
            const jsonmatch = extractContentWithAI.match(/\{[\s\S]*\}/);
            const toParse = jsonmatch ? jsonmatch[0] : extractContentWithAI;
            parsedata = JSON.parse(toParse); 

        } catch (parseError) {
            console.log('Error parsing JSON:', parseError);
            parsedata = { rawContent: extractContentWithAI };
    }
    const savedExtraction = await Extraction.create({ 
        data: parsedata,
        rawContent: extractContentWithAI,
        createdBy: req.user._id 
    });
    
} 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
} 