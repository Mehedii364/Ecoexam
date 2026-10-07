package com.nubd.economics2ndpaper.data

enum class PriorityLevel(val label: String, val badgeColorHex: Long) {
    PRIORITY_99("🔥 ৯৯% প্রায়োরিটি", 0xFFDC2626),
    PRIORITY_95("🔥 ৯৫% প্রায়োরিটি", 0xFFEA580C),
    PRIORITY_90("⭐ ৯০% প্রায়োরিটি", 0xFFD97706),
    HIGH_PRIORITY("⭐ হাই প্রায়োরিটি", 0xFF2563EB),
    SUPPORTING("📚 সহায়ক প্রশ্ন", 0xFF4B5563)
}

enum class ExamSection(val code: String, val bengaliName: String, val marks: Int) {
    SECTION_KA("ক", "ক-বিভাগ (অতি সংক্ষিপ্ত)", 1),
    SECTION_KHA("খ", "খ-বিভাগ (সংক্ষিপ্ত)", 4),
    SECTION_GA("গ", "গ-বিভাগ (রচনামূলক)", 10)
}

data class QuestionItem(
    val id: String,
    val questionBengali: String,
    val englishTranslation: String = "",
    val section: ExamSection,
    val chapter: String,
    val priority: PriorityLevel,
    val yearsAppeared: List<String>,
    val frequency: Int,
    val answerSnippet: String,
    val fullAnswerStructure: String = "",
    val keyPoints: List<String> = emptyList(),
    val hasFormulaOrDiagram: Boolean = false,
    val diagramOrFormulaName: String = ""
)

data class StudyPlanItem(
    val day: String,
    val title: String,
    val tasks: List<String>,
    val targetSections: String
)
