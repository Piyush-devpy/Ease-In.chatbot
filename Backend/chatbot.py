from flask import Blueprint, jsonify, request

chatbot_bp = Blueprint("chatbot", __name__)

PHQ_COUNT = 9
GAD_COUNT = 7
TOTAL_QUESTIONS = PHQ_COUNT + GAD_COUNT  # 16
DEFAULT_LANGUAGE = "en"

# Starter translations for the interface. For clinical or research use,
# replace these with authorized, validated translations of PHQ-9 and GAD-7.
LANGUAGES = {
    "en": {
        "name": "English",
        "intro": "Hi, I'm your Ease-In Brain buddy. I'll ask 16 questions about the last 2 weeks. Choose the answer that fits best. This is a screening tool, not a diagnosis.",
        "section_phq": "Mood and interest (PHQ-9)",
        "section_gad": "Worry and anxiety (GAD-7)",
        "frequency": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
        "questions": [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling or staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself, or that you have let yourself or your family down",
            "Trouble concentrating on things, such as reading or watching television",
            "Moving or speaking so slowly that other people could have noticed, or being unusually fidgety or restless",
            "Thoughts that you would be better off dead, or of hurting yourself in some way",
            "Feeling nervous, anxious, or on edge",
            "Not being able to stop or control worrying",
            "Worrying too much about different things",
            "Trouble relaxing",
            "Being so restless that it is hard to sit still",
            "Becoming easily annoyed or irritable",
            "Feeling afraid, as if something awful might happen"
        ],
        "help_text": "Over the last 2 weeks, how often have you been bothered by the following problems?",
        "notice": "Screening only, not a diagnosis. These starter translations may not be validated versions."
    },
    "hi": {
        "name": "हिन्दी",
        "intro": "नमस्ते! मैं आपका Ease-In Brain साथी हूँ। पिछले 2 हफ्तों के बारे में 16 सवाल पूछूँगा। सबसे उपयुक्त जवाब चुनें। यह स्क्रीनिंग है, निदान नहीं।",
        "section_phq": "मूड और रुचि (PHQ-9)",
        "section_gad": "चिंता और बेचैनी (GAD-7)",
        "frequency": ["बिल्कुल नहीं", "कुछ दिन", "आधे से ज़्यादा दिन", "लगभग हर दिन"],
        "questions": [
            "काम करने या चीज़ों में रुचि या आनंद महसूस न होना",
            "उदास, निराश या हताश महसूस करना",
            "नींद आने या सोते रहने में परेशानी, या बहुत ज़्यादा सोना",
            "थकान महसूस करना या ऊर्जा कम होना",
            "भूख कम लगना या ज़रूरत से ज़्यादा खाना",
            "अपने बारे में बुरा महसूस करना या खुद को असफल समझना",
            "पढ़ने या टीवी देखने जैसी चीज़ों पर ध्यान लगाने में परेशानी",
            "इतना धीरे चलना या बोलना कि दूसरों ने ध्यान दिया हो, या बहुत बेचैन रहना",
            "यह विचार आना कि आप मर जाएँ तो बेहतर होगा, या खुद को नुकसान पहुँचाने के विचार",
            "घबराहट, चिंता या बेचैनी महसूस करना",
            "चिंता को रोकने या नियंत्रित करने में परेशानी",
            "अलग-अलग बातों को लेकर बहुत ज़्यादा चिंता करना",
            "आराम करने में परेशानी",
            "इतनी बेचैनी होना कि स्थिर बैठना मुश्किल हो",
            "आसानी से चिढ़ जाना या गुस्सा आना",
            "ऐसा डर लगना जैसे कुछ बुरा होने वाला हो"
        ],
        "help_text": "पिछले 2 हफ्तों में ये परेशानियाँ आपको कितनी बार हुईं?",
        "notice": "केवल स्क्रीनिंग, निदान नहीं। ये शुरुआती अनुवाद प्रमाणित संस्करण नहीं हो सकते हैं।"
    },
    "es": {
        "name": "Español",
        "intro": "Hola, soy tu compañero Ease-In Brain. Te haré 16 preguntas sobre las últimas 2 semanas. Elige la respuesta que mejor te describa. Es una herramienta de detección, no un diagnóstico.",
        "section_phq": "Estado de ánimo e interés (PHQ-9)",
        "section_gad": "Preocupación y ansiedad (GAD-7)",
        "frequency": ["Nunca", "Varios días", "Más de la mitad de los días", "Casi todos los días"],
        "questions": [
            "Poco interés o placer en hacer cosas",
            "Sentirte decaído/a, deprimido/a o sin esperanza",
            "Dificultad para dormir o dormir demasiado",
            "Sentirte cansado/a o con poca energía",
            "Poco apetito o comer en exceso",
            "Sentirte mal contigo mismo/a, o sentir que le has fallado a tu familia o a ti mismo/a",
            "Dificultad para concentrarte, por ejemplo al leer o ver televisión",
            "Moverte o hablar tan lentamente que otras personas pudieran notarlo, o estar inusualmente inquieto/a",
            "Pensamientos de que sería mejor estar muerto/a o de hacerte daño",
            "Sentirte nervioso/a, ansioso/a o al límite",
            "No poder detener o controlar la preocupación",
            "Preocuparte demasiado por distintas cosas",
            "Dificultad para relajarte",
            "Estar tan inquieto/a que cuesta permanecer sentado/a",
            "Irritarte con facilidad",
            "Sentir miedo como si algo terrible pudiera suceder"
        ],
        "help_text": "Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado estos problemas?",
        "notice": "Solo detección, no un diagnóstico. Estas traducciones iniciales podrían no ser versiones validadas."
    }
}

# Fail fast at startup if a translation is incomplete, instead of serving a
# questionnaire the scorer will later reject.
for _code, _content in LANGUAGES.items():
    assert len(_content["questions"]) == TOTAL_QUESTIONS, f"{_code}: expected {TOTAL_QUESTIONS} questions"
    assert len(_content["frequency"]) == 4, f"{_code}: expected 4 frequency options"


def normalize_language(raw):
    # Accept "EN", "en-US", "hi_IN", etc.
    code = (raw or DEFAULT_LANGUAGE).strip().lower()
    return code.replace("_", "-").split("-")[0] or DEFAULT_LANGUAGE


@chatbot_bp.get("/api/chatbot/questions")
def get_questions():
    language = normalize_language(request.args.get("language"))
    if language not in LANGUAGES:
        return jsonify({"error": "Unsupported language", "supported_languages": list(LANGUAGES)}), 400

    content = LANGUAGES[language]
    questions = [
        {"id": i + 1, "scale": "PHQ-9" if i < PHQ_COUNT else "GAD-7", "text": text}
        for i, text in enumerate(content["questions"])
    ]
    return jsonify({
        "language": language,
        "language_name": content["name"],
        "intro": content["intro"],
        "help_text": content["help_text"],
        "sections": {"PHQ-9": content["section_phq"], "GAD-7": content["section_gad"]},
        "frequency_options": [{"value": i, "label": label} for i, label in enumerate(content["frequency"])],
        "questions": questions,
        "notice": content["notice"],
    })
