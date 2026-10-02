
export type LessonSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Lesson = {
  title: string;
  subtitle: string;
  objectives: string[];
  sections: LessonSection[];
  activity: {
    prompt: string;
    answer: string;
  };
  references: {
    label: string;
    url: string;
  }[];
};

export const lesson1: Record<"en" | "gu", Lesson> = {
  en: {
    title: "Introduction to Cyber Law",
    subtitle: "Session 1 · Foundations of law in the digital environment",
    objectives: [
      "Explain what Cyber Law means and why it matters.",
      "Identify digital activities that may raise legal questions.",
      "Describe the broad purpose and scope of India's Information Technology Act, 2000.",
      "Recognize that online conduct may engage more than one area of law."
    ],
    sections: [
      {
        heading: "1. What is Cyber Law?",
        paragraphs: [
          "Cyber Law is a commonly used term for legal rules and principles that apply to activities involving computers, digital devices, networks, electronic communications and online services. It is not a single, separate code that answers every internet-related question.",
          "Depending on the facts, a digital incident may involve the Information Technology Act, 2000, data-protection requirements, criminal law, contract law, intellectual-property law or consumer-protection rules. The applicable law depends on the conduct, the parties, the harm and the relevant legal provisions."
        ]
      },
      {
        heading: "2. Why Cyber Law Matters",
        paragraphs: [
          "People use digital systems to communicate, make payments, work, study, store records and access public services. Legal rules help define when electronic records and transactions can be recognized, what conduct is prohibited, and how rights and responsibilities may be enforced.",
          "Cyber Law is relevant not only to hackers or technology companies. It can also matter to an ordinary user who receives a phishing message, a business that stores customer information, or a person who signs an agreement electronically."
        ],
        bullets: [
          "For individuals: awareness of digital rights, responsibilities and complaint options.",
          "For businesses: lawful handling of information, electronic transactions and online services.",
          "For institutions: processes for digital records, security incidents and legal compliance."
        ]
      },
      {
        heading: "3. Scope of Cyber Law",
        paragraphs: [
          "The scope is broad and fact-dependent. Examples include electronic records and signatures, unauthorized access and damage to computer resources, identity theft and online impersonation, publication of unlawful content, intermediary responsibilities, privacy and data handling, and disputes involving online contracts or digital intellectual property.",
          "A single incident can raise several issues. For example, a fraudulent online purchase may involve a contract or consumer dispute, a payment dispute, and potentially a criminal complaint. The label 'cybercrime' alone does not determine the legal remedy."
        ]
      },
      {
        heading: "4. Cyber Law in India: A Starting Point",
        paragraphs: [
          "The Information Technology Act, 2000 (Act No. 21 of 2000) is a central starting point for studying Indian Cyber Law. It was enacted on 9 June 2000 and brought into force on 17 October 2000.",
          "Its long title describes its purpose as giving legal recognition to transactions carried out through electronic data interchange and other electronic communication, facilitating electronic filing with government agencies, and making related amendments to specified laws.",
          "The Act was amended in 2008. Its provisions address subjects including electronic records and signatures, certain computer-related offences, adjudication, and cyber-incident response. The Act is important, but it does not replace every other law that may apply to an online event."
        ]
      },
      {
        heading: "5. A Simple Example",
        paragraphs: [
          "Suppose a person receives a message that appears to come from their bank. The message asks them to click a link and enter their credentials. The page is fake, and the credentials are used to make an unauthorized transaction.",
          "This situation may require the person to contact their bank, preserve messages and transaction records, and consider reporting the incident through the appropriate channels. Depending on the evidence and conduct, legal provisions concerning identity theft, cheating by personation or other offences may be relevant. The precise section and remedy require assessment of the facts."
        ],
        bullets: [
          "Keep the original message, sender details, links and transaction records.",
          "Do not share passwords, PINs or one-time passwords.",
          "Report promptly to the bank and appropriate cybercrime reporting or law-enforcement channel."
        ]
      },
      {
        heading: "6. Key Takeaways",
        paragraphs: [],
        bullets: [
          "Cyber Law concerns legal issues arising from digital activities and technologies.",
          "It is a broad field, not one law covering every situation.",
          "The Information Technology Act, 2000 is a key Indian statute for this subject.",
          "The facts matter: one incident may involve civil, criminal, regulatory or consumer-law issues.",
          "For a real dispute, check the current law and obtain qualified legal advice where needed."
        ]
      }
    ],
    activity: {
      prompt: "A person receives a fake delivery message, clicks its link and enters their payment details. Name two practical steps they should take and explain why the incident may raise a Cyber Law issue.",
      answer: "They should contact their bank or payment provider promptly and preserve the message, link and transaction details. The incident may raise Cyber Law issues because digital impersonation or misuse of credentials may be involved. The exact legal provisions depend on the evidence and facts."
    },
    references: [
      {
        label: "India Code — Information Technology Act, 2000",
        url: "https://www.indiacode.nic.in/indiacode/handle/123456789/1999?locale=en"
      },
      {
        label: "MeitY — Information Technology Act, 2000",
        url: "https://www.meity.gov.in/documents/act-and-policies/information-technology-act-2000-2-YjMwETMtQWa?pageTitle=Information-Technology-Act-2000"
      }
    ]
  },

  gu: {
    title: "સાયબર કાયદાનો પરિચય",
    subtitle: "સત્ર 1 · ડિજિટલ પર્યાવરણમાં કાયદાના પાયા",
    objectives: [
      "સાયબર કાયદાનો અર્થ અને તેનું મહત્વ સમજવું.",
      "કઈ સામાન્ય ડિજિટલ પ્રવૃત્તિઓ કાનૂની પ્રશ્નો ઊભા કરી શકે તે ઓળખવું.",
      "ભારતના માહિતી ટેકનોલોજી અધિનિયમ, 2000નો વ્યાપક હેતુ સમજવો.",
      "ઓનલાઇન વર્તન પર એકથી વધુ કાયદા લાગુ પડી શકે તે સમજવું."
    ],
    sections: [
      {
        heading: "1. સાયબર કાયદો શું છે?",
        paragraphs: [
          "સાયબર કાયદો એ કમ્પ્યુટર, ડિજિટલ ઉપકરણો, નેટવર્ક, ઇલેક્ટ્રોનિક સંચાર અને ઓનલાઇન સેવાઓ સાથે જોડાયેલી પ્રવૃત્તિઓ પર લાગુ પડતા કાનૂની નિયમો અને સિદ્ધાંતો માટે વપરાતો સામાન્ય શબ્દ છે. ઇન્ટરનેટ સંબંધિત દરેક પ્રશ્નનો જવાબ આપતો એક જ અલગ કાયદો નથી.",
          "હકીકતોના આધારે માહિતી ટેકનોલોજી અધિનિયમ, 2000, ડેટા સુરક્ષા સંબંધિત નિયમો, ફોજદારી કાયદો, કરાર કાયદો, બૌદ્ધિક સંપદા કાયદો અથવા ગ્રાહક સુરક્ષા કાયદો લાગુ પડી શકે છે. કયો કાયદો લાગુ પડે તે ઘટનાની વિગતો અને સંબંધિત જોગવાઈઓ પર આધાર રાખે છે."
        ]
      },
      {
        heading: "2. સાયબર કાયદો શા માટે મહત્વનો છે?",
        paragraphs: [
          "લોકો ડિજિટલ માધ્યમથી વાતચીત કરે છે, ચુકવણી કરે છે, કામ કરે છે, અભ્યાસ કરે છે, દસ્તાવેજો સાચવે છે અને સરકારી સેવાઓનો ઉપયોગ કરે છે. કાનૂની નિયમો ઇલેક્ટ્રોનિક રેકોર્ડ અને વ્યવહારોની માન્યતા, પ્રતિબંધિત વર્તન અને અધિકારો તથા જવાબદારીઓની અમલવારી સમજવામાં મદદ કરે છે.",
          "સાયબર કાયદો માત્ર હેકર અથવા ટેકનોલોજી કંપનીઓ માટે નથી. ફિશિંગ સંદેશ મેળવનાર સામાન્ય વપરાશકર્તા, ગ્રાહકોની માહિતી સાચવતો વ્યવસાય અથવા ઇલેક્ટ્રોનિક રીતે કરાર કરનાર વ્યક્તિ માટે પણ તે મહત્વનો છે."
        ],
        bullets: [
          "વ્યક્તિઓ માટે: ડિજિટલ અધિકારો, જવાબદારીઓ અને ફરિયાદના વિકલ્પોની સમજ.",
          "વ્યવસાયો માટે: માહિતીનું કાયદેસર સંચાલન અને ઓનલાઇન વ્યવહારો.",
          "સંસ્થાઓ માટે: ડિજિટલ રેકોર્ડ, સુરક્ષા ઘટના અને કાનૂની પાલન માટેની પ્રક્રિયા."
        ]
      },
      {
        heading: "3. સાયબર કાયદાનો વ્યાપ",
        paragraphs: [
          "તેનો વ્યાપ વિશાળ છે અને હકીકતો પર આધારિત છે. તેમાં ઇલેક્ટ્રોનિક રેકોર્ડ અને સહી, કમ્પ્યુટર સંસાધનમાં અનધિકૃત પ્રવેશ અથવા નુકસાન, ઓળખની ચોરી અને ઓનલાઇન નકલ, ગેરકાયદેસર સામગ્રીનું પ્રકાશન, મધ્યસ્થી સેવાઓની જવાબદારી, ગોપનીયતા અને ડેટા સંચાલન તથા ઓનલાઇન કરાર અથવા ડિજિટલ બૌદ્ધિક સંપદા સંબંધિત વિવાદોનો સમાવેશ થઈ શકે છે.",
          "એક જ ઘટનામાં અનેક કાનૂની મુદ્દા ઊભા થઈ શકે છે. ઉદાહરણ તરીકે, ઓનલાઇન ખરીદીમાં છેતરપિંડી કરાર અથવા ગ્રાહક વિવાદ, ચુકવણી વિવાદ અને સંભવિત ફોજદારી ફરિયાદ ઊભી કરી શકે છે. માત્ર 'સાયબર ગુનો' નામ આપવાથી કયો ઉપાય લાગુ પડશે તે નક્કી થતું નથી."
        ]
      },
      {
        heading: "4. ભારતમાં સાયબર કાયદો: શરૂઆત",
        paragraphs: [
          "ભારતમાં સાયબર કાયદાનો અભ્યાસ કરવા માટે માહિતી ટેકનોલોજી અધિનિયમ, 2000 (અધિનિયમ ક્રમાંક 21, 2000) મહત્વનો પ્રારંભિક કાયદો છે. તે 9 જૂન, 2000ના રોજ ઘડાયો અને 17 ઓક્ટોબર, 2000થી અમલમાં આવ્યો.",
          "આ અધિનિયમનો મુખ્ય હેતુ ઇલેક્ટ્રોનિક ડેટા ઇન્ટરચેન્જ અને અન્ય ઇલેક્ટ્રોનિક સંચાર દ્વારા થતા વ્યવહારોને કાનૂની માન્યતા આપવાનો, સરકારી કચેરીઓમાં ઇલેક્ટ્રોનિક રીતે દસ્તાવેજો દાખલ કરવાની સુવિધા આપવાનો અને સંબંધિત કાયદાઓમાં જરૂરી ફેરફારો કરવાનો છે.",
          "આ અધિનિયમમાં 2008માં સુધારો થયો હતો. તેમાં ઇલેક્ટ્રોનિક રેકોર્ડ અને સહી, કેટલાક કમ્પ્યુટર સંબંધિત ગુનાઓ, ન્યાયનિર્ણય પ્રક્રિયા અને સાયબર ઘટના પ્રતિસાદ જેવા વિષયોનો સમાવેશ થાય છે. પરંતુ ઓનલાઇન ઘટનામાં લાગુ પડી શકે તેવા દરેક કાયદાનું સ્થાન આ અધિનિયમ લેતો નથી."
        ]
      },
      {
        heading: "5. સરળ ઉદાહરણ",
        paragraphs: [
          "ધારો કે કોઈ વ્યક્તિને બેંક તરફથી આવ્યો હોય એવો સંદેશ મળે છે. તેમાં લિંક ખોલીને બેંકની વિગતો દાખલ કરવા કહેવામાં આવે છે. વેબપેજ નકલી હોય છે અને વિગતોનો ઉપયોગ અનધિકૃત વ્યવહાર કરવા થાય છે.",
          "આવી સ્થિતિમાં વ્યક્તિએ તરત બેંકનો સંપર્ક કરવો, સંદેશ અને વ્યવહારના પુરાવા સાચવવા અને યોગ્ય સાયબર ગુના ફરિયાદ માધ્યમ અથવા કાયદા અમલીકરણ સંસ્થા સમક્ષ જાણ કરવાની જરૂર પડી શકે છે. પુરાવા અને હકીકતો પ્રમાણે ઓળખની ચોરી, નકલ કરીને છેતરપિંડી અથવા અન્ય ગુનાની જોગવાઈઓ સંબંધિત હોઈ શકે છે. ચોક્કસ કલમ અને ઉપાય હકીકતોના આધારે નક્કી થાય છે."
        ],
        bullets: [
          "મૂળ સંદેશ, મોકલનારની વિગતો, લિંક અને વ્યવહારના રેકોર્ડ સાચવો.",
          "પાસવર્ડ, PIN અથવા OTP કોઈને આપશો નહીં.",
          "વિલંબ કર્યા વિના બેંક અને યોગ્ય સાયબર ફરિયાદ અથવા પોલીસ માધ્યમનો સંપર્ક કરો."
        ]
      },
      {
        heading: "6. મુખ્ય મુદ્દાઓ",
        paragraphs: [],
        bullets: [
          "સાયબર કાયદો ડિજિટલ પ્રવૃત્તિઓ અને ટેકનોલોજીથી ઊભા થતા કાનૂની મુદ્દાઓ સાથે સંબંધિત છે.",
          "તે વિશાળ ક્ષેત્ર છે; દરેક પરિસ્થિતિ માટે એક જ કાયદો નથી.",
          "માહિતી ટેકનોલોજી અધિનિયમ, 2000 ભારતનો મહત્વનો કાયદો છે.",
          "એક ઘટનામાં નાગરિક, ફોજદારી, નિયમનકારી અથવા ગ્રાહક કાયદાના મુદ્દા હોઈ શકે છે.",
          "વાસ્તવિક વિવાદમાં વર્તમાન કાયદો તપાસવો અને જરૂર પડે ત્યારે યોગ્ય કાનૂની સલાહ લેવી."
        ]
      }
    ],
    activity: {
      prompt: "કોઈ વ્યક્તિને ડિલિવરી કંપનીના નામે નકલી સંદેશ મળે છે. તે લિંક ખોલીને ચુકવણીની વિગતો દાખલ કરે છે. તેણે કયા બે વ્યવહારુ પગલાં લેવા જોઈએ? આ ઘટનામાં સાયબર કાયદાનો પ્રશ્ન શા માટે ઊભો થઈ શકે?",
      answer: "તેણે તરત બેંક અથવા ચુકવણી સેવા પ્રદાતાનો સંપર્ક કરવો અને સંદેશ, લિંક તથા વ્યવહારની વિગતો સાચવવી જોઈએ. ડિજિટલ નકલ અથવા ઓળખની વિગતોના દુરુપયોગની શક્યતા હોવાથી સાયબર કાયદાનો પ્રશ્ન ઊભો થઈ શકે છે. ચોક્કસ કાનૂની જોગવાઈ પુરાવા અને હકીકતો પર આધાર રાખે છે."
    },
    references: [
      {
        label: "India Code — Information Technology Act, 2000",
        url: "https://www.indiacode.nic.in/indiacode/handle/123456789/1999?locale=en"
      },
      {
        label: "MeitY — Information Technology Act, 2000",
        url: "https://www.meity.gov.in/documents/act-and-policies/information-technology-act-2000-2-YjMwETMtQWa?pageTitle=Information-Technology-Act-2000"
      }
    ]
  }
};

export const cyberLawLesson1 = lesson1;
