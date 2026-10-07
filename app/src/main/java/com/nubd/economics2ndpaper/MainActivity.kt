package com.nubd.economics2ndpaper

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nubd.economics2ndpaper.data.*
import com.nubd.economics2ndpaper.ui.theme.Economics2ndPaperTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Economics2ndPaperTheme {
                MainAppScaffold()
            }
        }
    }
}

enum class NavigationTab(val label: String) {
    PRIORITY_MASTER("৯৯% মাস্টার"),
    QUESTION_BANK("প্রশ্ন ব্যাংক"),
    DIAGRAMS("চিত্র ও সূত্র"),
    PLANNER("স্টাডি প্ল্যান"),
    APK_INFO("এপিকে ও রিপোর্ট")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold() {
    var currentTab by remember { mutableStateOf(NavigationTab.PRIORITY_MASTER) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "অর্থনীতি ২য় পত্র : চূড়ান্ত সাজেশন",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "জাতীয় বিশ্ববিদ্যালয় ডিগ্রি পাস ১ম বর্ষ (১১২২০৩)",
                            fontSize = 12.sp,
                            color = Color(0xFFCCFBF1)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F766E)
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentTab == NavigationTab.PRIORITY_MASTER,
                    onClick = { currentTab = NavigationTab.PRIORITY_MASTER },
                    icon = { Icon(Icons.Default.Whatshot, contentDescription = null) },
                    label = { Text("৯৯% মাস্টার", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = currentTab == NavigationTab.QUESTION_BANK,
                    onClick = { currentTab = NavigationTab.QUESTION_BANK },
                    icon = { Icon(Icons.Default.MenuBook, contentDescription = null) },
                    label = { Text("প্রশ্ন ব্যাংক", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = currentTab == NavigationTab.DIAGRAMS,
                    onClick = { currentTab = NavigationTab.DIAGRAMS },
                    icon = { Icon(Icons.Default.AutoGraph, contentDescription = null) },
                    label = { Text("চিত্র ও সূত্র", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = currentTab == NavigationTab.PLANNER,
                    onClick = { currentTab = NavigationTab.PLANNER },
                    icon = { Icon(Icons.Default.Schedule, contentDescription = null) },
                    label = { Text("প্ল্যানার", fontSize = 11.sp) }
                )
                NavigationBarItem(
                    selected = currentTab == NavigationTab.APK_INFO,
                    onClick = { currentTab = NavigationTab.APK_INFO },
                    icon = { Icon(Icons.Default.Download, contentDescription = null) },
                    label = { Text("এপিকে", fontSize = 11.sp) }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF8FAFC))
        ) {
            when (currentTab) {
                NavigationTab.PRIORITY_MASTER -> PriorityMasterScreen()
                NavigationTab.QUESTION_BANK -> QuestionBankScreen()
                NavigationTab.DIAGRAMS -> DiagramsScreen()
                NavigationTab.PLANNER -> StudyPlannerScreen()
                NavigationTab.APK_INFO -> ApkInfoScreen()
            }
        }
    }
}

@Composable
fun PriorityMasterScreen() {
    var selectedSection by remember { mutableStateOf<ExamSection?>(null) }

    val allPriorityQuestions = remember {
        (QuestionDatabase.briefQuestions + QuestionDatabase.shortQuestions + QuestionDatabase.broadQuestions)
            .filter { it.priority == PriorityLevel.PRIORITY_99 || it.priority == PriorityLevel.PRIORITY_95 }
    }

    val filteredList = remember(selectedSection) {
        if (selectedSection == null) allPriorityQuestions
        else allPriorityQuestions.filter { it.section == selectedSection }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "🔥 ৯৯% ও ৯৫% সর্বোচ্চ গুরুত্ব সাজেশন",
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF991B1B),
                        fontSize = 16.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "বিগত পরীক্ষাগুলোতে সর্বাধিকবার পুনরাবৃত্ত প্রশ্নের ভিত্তিতে সংকলিত মাস্টার লিস্ট। কোনো ভিত্তিহীন প্রশ্ন নেই।",
                        fontSize = 13.sp,
                        color = Color(0xFF7F1D1D)
                    )
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = selectedSection == null,
                    onClick = { selectedSection = null },
                    label = { Text("সকল (${allPriorityQuestions.size})") }
                )
                FilterChip(
                    selected = selectedSection == ExamSection.SECTION_KA,
                    onClick = { selectedSection = ExamSection.SECTION_KA },
                    label = { Text("ক-বিভাগ") }
                )
                FilterChip(
                    selected = selectedSection == ExamSection.SECTION_KHA,
                    onClick = { selectedSection = ExamSection.SECTION_KHA },
                    label = { Text("খ-বিভাগ") }
                )
                FilterChip(
                    selected = selectedSection == ExamSection.SECTION_GA,
                    onClick = { selectedSection = ExamSection.SECTION_GA },
                    label = { Text("গ-বিভাগ") }
                )
            }
        }

        items(filteredList) { question ->
            QuestionItemCard(question = question)
        }
    }
}

@Composable
fun QuestionBankScreen() {
    var searchQuery by remember { mutableStateOf("") }
    var selectedSection by remember { mutableStateOf(ExamSection.SECTION_KA) }

    val currentList = when (selectedSection) {
        ExamSection.SECTION_KA -> QuestionDatabase.briefQuestions
        ExamSection.SECTION_KHA -> QuestionDatabase.shortQuestions
        ExamSection.SECTION_GA -> QuestionDatabase.broadQuestions
    }

    val filteredList = remember(searchQuery, currentList) {
        if (searchQuery.isBlank()) currentList
        else currentList.filter {
            it.questionBengali.contains(searchQuery, ignoreCase = true) ||
            it.chapter.contains(searchQuery, ignoreCase = true)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("অধ্যায় বা প্রশ্ন দিয়ে খুঁজুন...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
            singleLine = true
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ExamSection.values().forEach { sec ->
                Button(
                    onClick = { selectedSection = sec },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedSection == sec) Color(0xFF0F766E) else Color(0xFFE2E8F0),
                        contentColor = if (selectedSection == sec) Color.White else Color(0xFF334155)
                    ),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(text = "${sec.code}-বিভাগ", fontSize = 13.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(filteredList) { question ->
                QuestionItemCard(question = question)
            }
        }
    }
}

@Composable
fun QuestionItemCard(question: QuestionItem) {
    var expanded by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { expanded = !expanded },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${question.section.bengaliName} • ${question.chapter}",
                    fontSize = 11.sp,
                    color = Color(0xFF64748B)
                )
                Text(
                    text = "${question.priority.label} (${question.frequency} বার)",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(question.priority.badgeColorHex)
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = question.questionBengali,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF0F172A)
            )

            if (question.yearsAppeared.isNotEmpty()) {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "বোর্ড সাল: " + question.yearsAppeared.joinToString(", "),
                    fontSize = 11.sp,
                    color = Color(0xFF0F766E)
                )
            }

            if (expanded) {
                Spacer(modifier = Modifier.height(10.dp))
                Divider(color = Color(0xFFF1F5F9))
                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "উত্তর সংক্ষেপ / পরীক্ষা উপযোগী কাঠামো:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF334155)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = question.answerSnippet,
                    fontSize = 13.sp,
                    lineHeight = 20.sp,
                    color = Color(0xFF1E293B)
                )

                if (question.keyPoints.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "মূল পয়েন্টসমূহ:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F766E)
                    )
                    question.keyPoints.forEachIndexed { idx, point ->
                        Text(
                            text = "${idx + 1}. $point",
                            fontSize = 12.sp,
                            color = Color(0xFF475569)
                        )
                    }
                }
            } else {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "উত্তর দেখতে ট্যাপ করুন ▼",
                    fontSize = 11.sp,
                    color = Color(0xFF0F766E)
                )
            }
        }
    }
}

@Composable
fun DiagramsScreen() {
    val items = listOf(
        "ম্যালথাসের জনসংখ্যা তত্ত্ব" to "জ্যামিতিক হারে জনসংখ্যা বৃদ্ধি (১, ২, ৪, ৮, ১৬) বনাম গাণিতিক খাদ্য উৎপাদন (১, ২, ৩, ৪, ৫)। ক্রমহ্রাসমান উৎপাদন বিধি ও প্রাকৃতিক নিরোধ।",
        "দারিদ্র্যের দুষ্টচক্র (Ragnar Nurkse)" to "চাহিদা ও যোগান দুটি দিক: স্বল্প আয় → স্বল্প সঞ্চয় → স্বল্প বিনিয়োগ → মূলধন স্বল্পতা → কম উৎপাদনশীলতা → স্বল্প আয়।",
        "ছদ্মবেশী বেকারত্ব ও প্রান্তিক উৎপাদনশীলতা" to "প্রান্তিক উৎপাদনশীলতা শূন্য (MPL = 0)। অতিরিক্ত শ্রমিক অপসারণ করলেও মোট উৎপাদনে কোনো পতন হয় না।",
        "জনসংখ্যার ঘনত্ব ও মাথাপিছু আয় সূত্র" to "ঘনত্ব = মোট জনসংখ্যা / মোট ভৌগোলিক আয়তন। মাথাপিছু আয় = মোট জাতীয় আয় / মোট জনসংখ্যা।",
        "বাণিজ্য ভারসাম্য বনাম লেনদেন ভারসাম্য" to "বাণিজ্য ভারসাম্য = দৃশ্যমান রপ্তানি - দৃশ্যমান আমদানি। লেনদেন ভারসাম্য = দৃশ্যমান ও অদৃশ্যমান মোট বৈদেশিক দেনা-পাওনা।"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "📊 গুরুত্বপূর্ণ চিত্র, রেখাচিত্র ও গাণিতিক সূত্র",
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
                color = Color(0xFF0F172A)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "অর্থনীতি ২য় পত্র পরীক্ষায় ১০ নম্বরের গ-বিভাগে চিত্র ও সঠিক সূত্র উপস্থাপনে পূর্ণ নম্বর পাওয়া যায়।",
                fontSize = 13.sp,
                color = Color(0xFF64748B)
            )
        }

        items(items) { (title, desc) ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF0F766E))
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(text = desc, fontSize = 13.sp, color = Color(0xFF334155), lineHeight = 19.sp)
                }
            }
        }
    }
}

@Composable
fun StudyPlannerScreen() {
    var selectedPlan by remember { mutableStateOf("৩ দিন") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "⏱️ পরীক্ষার পূর্ব প্রস্তুতি রুটিন",
            fontWeight = FontWeight.Bold,
            fontSize = 17.sp,
            color = Color(0xFF0F172A)
        )
        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf("১ দিন", "৩ দিন", "৭ দিন").forEach { plan ->
                Button(
                    onClick = { selectedPlan = plan },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedPlan == plan) Color(0xFF0F766E) else Color(0xFFE2E8F0),
                        contentColor = if (selectedPlan == plan) Color.White else Color(0xFF334155)
                    ),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(text = "$plan রুটিন")
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (selectedPlan == "১ দিন") {
                item {
                    PlannerCard("সকাল (৮টা - ১২টা)", "ক-বিভাগ: ১৬টি ৯৯% প্রশ্ন ও বিগত ৪ বছরের প্রশ্ন মুখস্থ সম্পন্ন।")
                }
                item {
                    PlannerCard("দুপুর (২টা - ৬টা)", "খ-বিভাগ: প্রবৃদ্ধি বনাম উন্নয়ন, অবকাঠামো পার্থক্য, শক্তি সম্পদ, কৃষি ঋণ।")
                }
                item {
                    PlannerCard("রাত (৭টা - ১১টা)", "গ-বিভাগ: বাংলাদেশ ব্যাংক, ম্যালথাস জনসংখ্যা তত্ত্ব, বৈদেশিক ভারসাম্য।")
                }
            } else if (selectedPlan == "৩ দিন") {
                item {
                    PlannerCard("১ম দিন", "অধ্যায় ১ ও ২: অর্থনৈতিক উন্নয়ন, প্রবৃদ্ধি, ভৌত ও সামাজিক অবকাঠামো, শক্তি সম্পদ।")
                }
                item {
                    PlannerCard("২য় দিন", "অধ্যায় ৩, ৪ ও ৫: জনসংখ্যা ও মানবসম্পদ, কৃষি ঋণ, ক্ষুদ্র ও কুটির শিল্প, পোশাক শিল্প।")
                }
                item {
                    PlannerCard("৩য় দিন", "অধ্যায় ৬, ৭ ও ১০: বাংলাদেশ ব্যাংক, লেনদেন ভারসাম্য, আন্তর্জাতিক বাণিজ্য, দারিদ্র্য বিমোচন।")
                }
            } else {
                item {
                    PlannerCard("দিন ১-২", "মৌলিক ধারণা ও ক-বিভাগের ১২৬টি প্রশ্নের পূর্ণাঙ্গ রিভিশন ও মডেল টেস্ট।")
                }
                item {
                    PlannerCard("দিন ৩-৪", "খ-বিভাগের ৪ নম্বরের সকল কাঠামোবদ্ধ প্রশ্ন নোট করা।")
                }
                item {
                    PlannerCard("দিন ৫-৬", "গ-বিভাগের রচনামূলক ১০ নম্বরের চিত্র, সূত্র ও পয়েন্ট ভিত্তিক অনুশীলন।")
                }
                item {
                    PlannerCard("দিন ৭", "বিগত বছরের প্রশ্নপত্র (২০২০, ২০২২, ২০২৪) সমাধান ও সময় ধরে পূর্ণাঙ্গ মক পরীক্ষা।")
                }
            }
        }
    }
}

@Composable
fun PlannerCard(title: String, desc: String) {
    var checked by remember { mutableStateOf(false) }

    Card(
        colors = CardDefaults.cardColors(containerColor = if (checked) Color(0xFFF0FDF4) else Color.White),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(checked = checked, onCheckedChange = { checked = it })
            Spacer(modifier = Modifier.width(8.dp))
            Column {
                Text(text = title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF0F766E))
                Text(text = desc, fontSize = 13.sp, color = Color(0xFF334155))
            }
        }
    }
}

@Composable
fun ApkInfoScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF0FDFA)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "📦 রিয়েল অ্যান্ড্রয়েড প্রজেক্ট ও এপিকে বিল্ড পাইপলাইন",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = Color(0xFF0F766E)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "GitHub Actions অটোমেশন পাইপলাইনের মাধ্যমে রিয়েল Gradle Build দ্বারা APK_DOWNLOAD/app-debug.apk তৈরি ও যাচাই করা হয়। কোনো ভুয়া বা ফেক এপিকে নয়।",
                    fontSize = 13.sp,
                    color = Color(0xFF134E4A),
                    lineHeight = 19.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "বিল্ড ও ডাউনলোড পাথ:",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Color(0xFF0F172A)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "• গিটহাব ফাইল পাথ: APK_DOWNLOAD/app-debug.apk\n• গিটহাব আর্টফ্যাক্ট: app-debug-apk\n• গ্র্যাডল কমান্ড: ./gradlew assembleDebug\n• কোডবেস: Kotlin + Jetpack Compose + Material 3\n• যাচাইকরণ: unzip -t & sha256sum ম্যাচ",
                    fontSize = 13.sp,
                    color = Color(0xFF475569),
                    lineHeight = 22.sp
                )
            }
        }
    }
}
