export const analysisJsonSchema = {
    type: "object",
    additionalProperties: false,

    properties: {
        score: {
            type: "number",
            minimum: 0,
            maximum: 100,
        },

        resumeSummary: {
            type: "string",
        },

        matchingSkills: {
            type: "array",
            items: {
                type: "string",
            },
        },

        missingSkills: {
            type: "array",
            items: {
                type: "string",
            },
        },

        strengths: {
            type: "array",
            items: {
                type: "string",
            },
        },

        weaknesses: {
            type: "array",
            items: {
                type: "string",
            },
        },

        recommendation: {
            type: "string",
            enum: [
                "Highly Recommended",
                "Recommended",
                "Consider",
                "Not Recommended",
            ],
        },

        reasoning: {
            type: "string",
        },
    },

    required: [
        "score",
        "resumeSummary",
        "matchingSkills",
        "missingSkills",
        "strengths",
        "weaknesses",
        "recommendation",
        "reasoning",
    ],
} as const;