# Economics 2nd Paper (Bangladesh Economy - 112203) NU Exam App

জাতীয় বিশ্ববিদ্যালয় বিএসএস ডিগ্রি (পাস) ১ম বর্ষ পরীক্ষা — **অর্থনীতি দ্বিতীয় পত্র (বাংলাদেশের অর্থনীতি, বিষয় কোড: ১১২২০৩)** এর পূর্ণাঙ্গ বিগত বছরের প্রশ্ন বিশ্লেষণ, ৯৯% প্রায়োরিটি মাস্টার সাজেশন এবং পরীক্ষার প্রস্তুতি পোর্টাল।

---

## 📱 প্রজেক্ট পরিচিতি (Project Overview)

এই প্রজেক্টটি একটি ফুল-স্ট্যাক ও রিয়েল অ্যান্ড্রয়েড হাইব্রিড প্ল্যাটফর্ম:
1. **ওয়েব পোর্টাল ও ইন্টারঅ্যাক্টিভ সাজেশন ইঞ্জিন:** React 19 + Tailwind CSS + TypeScript চালিত, যেখানে ২২ পৃষ্ঠার সম্পূর্ণ ব্যতিক্রম সাজেশনের ১২৬+ অতি সংক্ষিপ্ত, ৬৮টি সংক্ষিপ্ত এবং ৪৯টি রচনামূলক প্রশ্ন উত্তরসহ সাজানো রয়েছে। এর সাথে পিডিএফ ও ওয়ার্ড (.docx) প্রিন্ট/ডাউনলোড সুবিধা যুক্ত।
2. **রিয়েল অ্যান্ড্রয়েড অ্যাপ্লিকেশন (Kotlin + Jetpack Compose + Material 3):** সম্পূর্ণ নেটিভ অ্যান্ড্রয়েড কোডবেস যা অফলাইনে যেকোনো অ্যান্ড্রয়েড ডিভাইসে পড়াশোনা ও অনুশীলন করার উপযোগী।
3. **স্বয়ংক্রিয় গিটহাব বিল্ড পাইপলাইন (GitHub Actions CI/CD):** কোনো ফেক বা ডামি এপিকে তৈরি না করে গিটহাব অ্যাকশনের মাধ্যমে অফিশিয়াল উবুন্টু রানারে রিয়েল গ্র্যাডল বিল্ড (`./gradlew assembleDebug`) সম্পন্ন হয় এবং সংগৃহীত এপিকে `APK_DOWNLOAD/app-debug.apk` ডিরেক্টরিতে আপলোড হয়।

---

## 🛠️ প্রযুক্তি ও ফ্রেমওয়ার্ক (Tech Stack)

### অ্যান্ড্রয়েড অ্যাপ:
- **Language:** Kotlin 1.9.22
- **UI Toolkit:** Jetpack Compose + Material Design 3
- **Architecture:** AndroidX, Navigation Compose, Lifecycle Runtime
- **Build System:** Gradle 8.5, Android Gradle Plugin 8.2.2
- **Minimum SDK:** 24 (Android 7.0 Nougat)
- **Target / Compile SDK:** 34 (Android 14)

### ওয়েব ইন্টারফেস:
- **Framework:** React 19, TypeScript, Tailwind CSS
- **Icons & Motion:** Lucide React, Motion
- **Export Engine:** Native Browser Print/PDF Formatter & Word (.doc/docx) Exporter

---

## 🚀 লোকাল অ্যান্ড্রয়েড স্টুডিও সেটআপ ও বিল্ড নির্দেশিকা

### পূর্বশর্ত:
1. **JDK 17** (Java Development Kit 17 বা তদূর্ধ্ব)
2. **Android Studio** (Hedgehog / Iguana / Jellyfish বা নতুন সংস্করণ)
3. **Android SDK 34** এবং Build-Tools ইনস্টল থাকতে হবে।

### ধাপসমূহ:

1. রিপোজিটরি ক্লোন করুন:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_FOLDER>
   ```

2. অ্যান্ড্রয়েড স্টুডিওতে প্রজেক্ট ওপেন করুন (`File > Open > Select Root Folder`).

3. টার্মিনাল থেকে গ্র্যাডল বিল্ড রান করুন:
   ```bash
   # লিনাক্স বা ম্যাক ওএসে:
   chmod +x gradlew
   ./gradlew assembleDebug

   # উইন্ডোজ ওএসে:
   gradlew.bat assembleDebug
   ```

4. তৈরি হওয়া রিয়েল এপিকে ফাইল লোকেশন:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 🤖 গিটহাব অ্যাকশনস ও অটোমেটেড বিল্ড (.github/workflows/android-build.yml)

গিটহাবে কোড পুশ করার সাথে সাথে অটোমেটিক ওয়ার্কফ্লো চালু হয়:
1. **Java 17 & Android SDK সেটআপ:** `actions/setup-java@v4` ও `android-actions/setup-android@v3` রান হয়।
2. **রিয়েল গ্র্যাডল বিল্ড:** `./gradlew assembleDebug` কমান্ডের মাধ্যমে আসল `app-debug.apk` তৈরি হয়।
3. **কঠোর এপিকে ভ্যালিডেশন:**
   - ফাইল সাইজ যাচাই (`stat -c%s`)
   - এপিকে জিপ স্ট্রাকচার অখণ্ডতা যাচাই (`unzip -t`)
   - হ্যাশ যাচাইকরণ (`sha256sum`)
4. **আর্টফ্যাক্ট ও কোড ব্রাউজার সংরক্ষণ:**
   - গিটহাব আর্টফ্যাক্ট: `app-debug-apk`
   - গিটহাব ফাইল পাথ: `APK_DOWNLOAD/app-debug.apk`
   - ব্যাকআপ পাথ: `.build-outputs/app-debug.apk`

---

## 📁 রিপোজিটরি ডিরেক্টরি কাঠামো

```text
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/nubd/economics2ndpaper/
│   │   │   ├── MainActivity.kt
│   │   │   ├── data/
│   │   │   │   ├── QuestionModels.kt
│   │   │   │   └── QuestionDatabase.kt
│   │   │   └── ui/theme/
│   │   │       ├── Color.kt
│   │   │       ├── Theme.kt
│   │   │       └── Type.kt
│   │   └── res/
│   │       ├── values/
│   │       └── drawable/
│   └── build.gradle.kts
│
├── .github/
│   └── workflows/
│       └── android-build.yml
│
├── APK_DOWNLOAD/
│   └── (Generated real app-debug.apk from GitHub Actions)
│
├── .build-outputs/
│   └── (Backup real app-debug.apk)
│
├── src/                # Web Interface & Interactive Report Portal
├── gradlew
├── gradlew.bat
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
└── README.md
```

---

## ⚠️ ট্রাবলশুটিং (Troubleshooting)

| সমস্যা | সম্ভাব্য কারণ | সমাধান |
|---|---|---|
| `JAVA_HOME is not set` | মেশিনে জাভা এনভায়রনমেন্ট পাথ নেই | JDK 17 ইনস্টল করে `export JAVA_HOME=/path/to/jdk-17` সেট করুন। |
| `Permission denied: ./gradlew` | গ্র্যাডল স্ক্রিপ্টে এক্সেকিউটেবল অনুমতি নেই | `chmod +x gradlew` রান করুন। |
| `Execution failed for task ':app:compileDebugKotlin'` | ইনকম্প্যাটিবল জাভা সংস্করণ | প্রজেক্ট সেটিংসে JDK 17 নির্বাচন করুন। |

---

## 📜 স্বত্ব ও লাইসেন্স
জাতীয় বিশ্ববিদ্যালয় শিক্ষার্থীদের পরীক্ষা প্রস্তুতি সহায়ক মুক্ত প্রজেক্ট।
