import Extraction from '../model/extraction.model.js';
import { extractContentWithAI } from '../util/ai.util.js'; 

export const extractContent = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const base64 = req.file.buffer.toString('base64');
        const imgdata = `data:${req.file.mimetype};base64,${base64}`;
        const prompt = 'Analyze this image and extract visible information. If it contains a resume, extract: - Name - Email - Phone - Skills - Education - Experience - Projects If it contains a LinkedIn recruitment post, extract: - Recruiter email, if visible - Recruiter or author name - Company - Job role - Required skills - Post content Return valid JSON. Use null for missing information. Do not invent or guess information. '
        const result = await extractContentWithAI(prompt, imgdata);
        let parsedata = null;
        try {
            const jsonmatch = result.match(/\{[\s\S]*\}/);
            const toParse = jsonmatch ? jsonmatch[0] : result;
            parsedata = JSON.parse(toParse); 

        } catch (parseError) {
            console.log('Error parsing JSON:', parseError);
            parsedata = { rawContent: result };
    }
    const savedExtraction = await Extraction.create({ 
        data: parsedata,
        rawContent: result,
        createdBy: req.user._id 
    });
    return res.status(200).json({
        message: 'Content extracted successfully',
        savedExtraction
    });
    
} 
    catch (error) {
        console.error('Error extracting content:', error);
        return res.status(500).json({ 
        success: false,
        message: 'Failed to extract content',
        error: error.message
        })
    }
} 