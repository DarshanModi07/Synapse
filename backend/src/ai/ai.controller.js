import {buildDepartmentPrompt} from "./prompts/department.prompt.js";
import {generateSuggestion} from "./ai.service.js";

export const suggestDepartments = async(req,res)=>{
    try{
        const { projectName, description } = req.body;

        if(!projectName ||!description){
            return res.status(400).json({
                message:"Credentials needed"
            });
        }

        const prompt = buildDepartmentPrompt(
                projectName,
                description
            );

        const response = await generateSuggestion(
                prompt
            );

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

    const parsed = JSON.parse(cleaned);

        // const parsed = JSON.parse(response);

        return res.status(200).json({
            message:"Suggestions generated",
            data:parsed
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: "AI Suggestion Failed"
        });
    }
}