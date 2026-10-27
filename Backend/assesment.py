from flask import Blueprint, jsonify, request

assessment_bp = Blueprint("assessment", __name__)

PHQ_COUNT = 9
GAD_COUNT = 7
TOTAL_QUESTIONS = PHQ_COUNT + GAD_COUNT  # 16
SELF_HARM_INDEX = 8  # PHQ-9 item 9
DEFAULT_LANGUAGE = "en"

TEXT = {
    "en": {
        "phq": {
            "minimal": "Minimal depressive symptoms",
            "mild": "Mild depressive symptoms",
            "moderate": "Moderate depressive symptoms",
            "moderately_severe": "Moderately severe depressive symptoms",
            "severe": "Severe depressive symptoms",
        },
        "gad": {
            "minimal": "Minimal anxiety symptoms",
            "mild": "Mild anxiety symptoms",
            "moderate": "Moderate anxiety symptoms",
            "severe": "Severe anxiety symptoms",
        },
        "support_notice": (
            "Your answer suggests you may need extra support. Please contact a trusted person "
            "or qualified mental-health professional promptly. If you may act on these thoughts "
            "or are in immediate danger, contact local emergency services (112 in India) or "
            "go to the nearest emergency department. You can also call Tele-MANAS, India's free "
            "24/7 mental-health helpline, at 14416."
        ),
        "disclaimer": (
            "These scores are screening results, not a diagnosis. A qualified professional "
            "can help interpret them in context."
        ),
        "next_step": (
            "Consider speaking with a qualified mental-health professional if symptoms persist "
            "or affect daily life."
        ),
        "err_count": "Please provide answers to all 16 questions.",
        "err_value": "Each answer must be an integer from 0 to 3.",
    },
    "hi": {
        "phq": {
            "minimal": "न्यूनतम अवसाद लक्षण",
            "mild": "हल्के अवसाद लक्षण",
            "moderate": "मध्यम अवसाद लक्षण",
            "moderately_severe": "मध्यम से गंभीर अवसाद लक्षण",
            "severe": "गंभीर अवसाद लक्षण",
        },
        "gad": {
            "minimal": "न्यूनतम चिंता के लक्षण",
            "mild": "हल्के चिंता के लक्षण",
            "moderate": "मध्यम चिंता के लक्षण",
            "severe": "गंभीर चिंता के लक्षण",
        },
        "support_notice": (
            "आपके जवाब से लगता है कि आपको अतिरिक्त सहारे की ज़रूरत हो सकती है। कृपया जल्द से जल्द "
            "किसी भरोसेमंद व्यक्ति या योग्य मानसिक स्वास्थ्य विशेषज्ञ से संपर्क करें। अगर आप इन विचारों पर "
            "अमल कर सकते हैं या तुरंत खतरे में हैं, तो स्थानीय आपातकालीन सेवाओं (भारत में 112) को कॉल करें "
            "या नज़दीकी आपातकालीन विभाग में जाएँ। आप Tele-MANAS की निःशुल्क 24/7 मानसिक स्वास्थ्य "
            "हेल्पलाइन 14416 पर भी कॉल कर सकते हैं।"
        ),
        "disclaimer": (
            "ये स्कोर केवल स्क्रीनिंग के परिणाम हैं, निदान नहीं। कोई योग्य विशेषज्ञ इन्हें आपकी स्थिति "
            "के संदर्भ में समझने में मदद कर सकता है।"
        ),
        "next_step": (
            "अगर लक्षण बने रहें या रोज़मर्रा की ज़िंदगी को प्रभावित करें, तो किसी योग्य मानसिक स्वास्थ्य "
            "विशेषज्ञ से बात करने पर विचार करें।"
        ),
        "err_count": "कृपया सभी 16 सवालों के जवाब दें।",
        "err_value": "हर जवाब 0 से 3 के बीच का पूर्णांक होना चाहिए।",
    },
    "es": {
        "phq": {
            "minimal": "Síntomas depresivos mínimos",
            "mild": "Síntomas depresivos leves",
            "moderate": "Síntomas depresivos moderados",
            "moderately_severe": "Síntomas depresivos moderadamente graves",
            "severe": "Síntomas depresivos graves",
        },
        "gad": {
            "minimal": "Síntomas de ansiedad mínimos",
            "mild": "Síntomas de ansiedad leves",
            "moderate": "Síntomas de ansiedad moderados",
            "severe": "Síntomas de ansiedad graves",
        },
        "support_notice": (
            "Tu respuesta sugiere que podrías necesitar apoyo adicional. Comunícate pronto con una "
            "persona de confianza o con un profesional de salud mental. Si podrías actuar según estos "
            "pensamientos o estás en peligro inmediato, llama a los servicios de emergencia locales "
            "(112 en India) o acude al servicio de urgencias más cercano. También puedes llamar a "
            "Tele-MANAS, la línea gratuita de salud mental de India disponible 24/7, al 14416."
        ),
        "disclaimer": (
            "Estas puntuaciones son resultados de detección, no un diagnóstico. Un profesional "
            "calificado puede ayudarte a interpretarlas en contexto."
        ),
        "next_step": (
            "Considera hablar con un profesional de salud mental si los síntomas persisten o "
            "afectan tu vida diaria."
        ),
        "err_count": "Responde las 16 preguntas.",
        "err_value": "Cada respuesta debe ser un número entero de 0 a 3.",
    },
}


def classify_phq(score):
    if score <= 4:
        return "minimal"
    if score <= 9:
        return "mild"
    if score <= 14:
        return "moderate"
    if score <= 19:
        return "moderately_severe"
    return "severe"


def classify_gad(score):
    if score <= 4:
        return "minimal"
    if score <= 9:
        return "mild"
    if score <= 14:
        return "moderate"
    return "severe"


def is_valid_answer(a):
    # bool is a subclass of int in Python, so reject it explicitly
    return isinstance(a, int) and not isinstance(a, bool) and 0 <= a <= 3


@assessment_bp.post("/api/assessment/score")
def score_assessment():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        data = {}

    language = data.get("language")
    text = TEXT.get(language if isinstance(language, str) else DEFAULT_LANGUAGE, TEXT[DEFAULT_LANGUAGE])

    answers = data.get("answers")
    if not isinstance(answers, list) or len(answers) != TOTAL_QUESTIONS:
        return jsonify({"error": text["err_count"]}), 400
    if not all(is_valid_answer(a) for a in answers):
        return jsonify({"error": text["err_value"]}), 400

    phq_score = sum(answers[:PHQ_COUNT])
    gad_score = sum(answers[PHQ_COUNT:])
    phq_level = classify_phq(phq_score)
    gad_level = classify_gad(gad_score)
    self_harm_flag = answers[SELF_HARM_INDEX] > 0

    return jsonify({
        "phq9": {"score": phq_score, "max_score": PHQ_COUNT * 3, "severity": phq_level, "label": text["phq"][phq_level]},
        "gad7": {"score": gad_score, "max_score": GAD_COUNT * 3, "severity": gad_level, "label": text["gad"][gad_level]},
        "self_harm_flag": self_harm_flag,
        "support_notice": text["support_notice"] if self_harm_flag else None,
        "disclaimer": text["disclaimer"],
        "next_step": text["next_step"],
    }), 200
