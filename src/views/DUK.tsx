// DUK.js
import React, { useState } from "react";

const COPYRIGHT_SIGN = "\u00A9"; // Copyright symbol

const faqs = [
  {
    question: "Kaip žaisti?",
    answer: "Perskaityk taisykles ?? 🤦",
  },
  {
    question: "Kokios taisyklės?",
    answer:
      "Oficialios taisyklės: Kaladėje yra 1-100 numerių, o žaidimo metu bandysite įveikti 12, 10 ar 8 žaidimo lygius su 2, 3 arba 4 žaidėjais. Kiekviename lygyje kiekvienas žaidėjas gauna tiek kortų kokiame lygyje žaidžia: vieną kortą 1 lygyje, dvi kortas 2 lygyje ir pan. Kartu jūs turite išmesti visas kortas į stalo centrą į vieną krūvą didėjančia tvarka, bet jūs negalite bendrauti vieni su kitais, kokias kortas turite. Jūs tiesiog žiūrite į vienas kito akis ir, kai jaučiate, kad laikas yra tinkamas, tu išmeti savo žemiausią kortą. Jei niekas neturi mažesnės kortos, šaunu žadimas tęsiasi. Jei kas nors turėjo žemesnę kortą, visi žaidėjai parodo žemesnes kortas, ir jūs prarandate vieną gyvybę. Žaidimą pradedate su tiek gyvybių, kiek yra žaidėjų. Ir jeigu prarandate visas gyvybes, jūs pralaimėjote. Kai naudojate šiurikeną (tai galima padaryti paspaudžiant ant šiurikeno ikonos) iš kiekvieno žaidėjo rankos išmetama mažiausia korta, jei kažkuris žaidėjas turi mažesnių kortų nei didžiausia išmesta iš mažiausių kortų, jos taip pat išmetamos.",
  },
  {
    question: "Kaip susisiekti su žaidimo pagalba?",
    answer: "Galite skambinti Mindaugui Pikturnai nr. +37060913978 ",
  },
  {
    question: "Ar reikia prisiregistruoti?",
    answer: "Ne.",
  },
  {
    question: "Kur gauti narkotikų?",
    answer: "",
    image:
      "https://scontent.fvno8-1.fna.fbcdn.net/v/t1.18169-9/13265930_10154044937540272_5126148147960708027_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7f8c78&_nc_ohc=-9BTV9k6F08AX8Qh0VY&_nc_ht=scontent.fvno8-1.fna&oh=00_AfA0rcc7YCscle8DSft9WQeqFMhn-Z1uEABaVhMZl8kdGw&oe=64FEEE5C",
  },
  {
    question: "Kokia šio gyvenimo prasmė?",
    answer:
      "Kad atsakyti į tokį sudėtingą klausimą reikalinga suprasti apie ką eina kalba. Ar gali be užsikirtimo šauti atsakymą kas yra gyvenimas ir kas yra prasmė? Aš tai ne. Todėl turiu apibrėžti šias sąvokas, kad paskui nereikėtų ginčytis ir leistis į filosofinius apmąstymus – „gyvenimas yra kaip rožės lapas virpantis vėjyje“? Ne. Pas mus viskas logiška.Žmogaus gyvenimas yra laiko tarpas nuo gyvybės užsimezgimo momento iki mirties momento. Kada yra gyvybės užsimezgimo momentas teatsako į šį klausimą medikai. Tačiau mes žinosime bent jau tai, kad iš motinos įsčių į šį pasaulį atėjęs vaikas jau tikrai gyvena. Patogumo dėlei priimkime prielaidą, kad gyvenimas prasideda gimimu, o baigiasi mirtimi.Visiškai neketinu svarstyti kas yra gyvenimas apskritai, nepririšdamas jo prie konkretaus žmogaus, nes manau, kad gyvenimas be žmogaus neegzistuoja. Kai tik žmogus gimsta – gyvenimas prasideda automatiškai, nereikia nieko daryti. Ir kai žmogus miršta, gyvenimas nutrūksta. Nepaisant viso žmogaus palikimo – meno kūrinių, įkurtų verslų, nuotraukų, prisiminimų kitų žmonių galvose, gyvenimas nutrūksta.Kaip matote, nepripažįstu tokių svaičiojimų, kaip „gyvenimas tai kova“ ar „gyvenimas tai sapnas“ ir panašių. Gyvenimas yra laiko tarpas, jis matuojamas minutėmis, sekundėmis ir metais. Tokie dalykai, kaip „no-life“, „gyvenimo ir darbo balansas“ (angl. work-life balance) su mūsų teorija nesiderina. No-life, tai ne kas kita, kaip laikas po fizinės mirties arba prieš fizinį gimimą (jokiu būdu ne laikas praleistas prie kompiuterio nebendraujant su žmonėmis). Gyvenimo ir darbo balansas neįmanomas, nes tikrai nėra taip (bent jau aš nemačiau), kad atėjęs į darbą žmogus numirtų ir negyventų, o darbo pabaigoje prisikeltų. Tai va kas tas gyvenimas.O kas yra prasmė? Prasmė, atsiranda tada, kai mes galime palyginti „su“ ir „be“. Jei norime sužinoti kokia yra, sakykim, elektros lemputės prasmė, tai palyginkim pasaulį su elektros lempute ir be elektros lemputės. Yra skirtumas? Na, su elektros lempute šviesiau. Štai ta šviesa ir yra elektros lemputės prasmė. Lygiai taip pat galima išsiaiškinti bet kurio kito daikto prasmę – palyginti pasaulį „su“ ir „be“. Kokia mobilaus telefono prasmė? „Maximos“ prasmė? Pinigų, meilės, pykčio, draugystės prasmė?Gali pažaisti – paimk vieną dalyką, kurio prasmę nori išsiaiškinti ir pabandyk įsivaizduoti, kad jo nebėra. Kas pasikeitė? Ko nebegali daryti? Ką reikėtų daryti kitaip? O gal kaip tik turi daugiau laisvės? Jei atsakei į šiuos klausimus – sveikinu, radai prasmę!Grįžkime prie elektros lemputės ir paklauskime Afrikoje gyvenančio tigro, kokia jos prasmė. Kas būtų kitaip, jei jos nebūtų? Jei mums pasiseks ir užtaikysime ant intelektualaus bei pavalgiusio tigro, jis su malonumu atsakys:– Was ist das? (vertimas iš Afrikos tigrų kalbos: Aš nežinau kas tai yra, ar negalėtumėte paaiškinti?)Taigi, Afrikos tigrui elektros lemputė jokios tiesioginės ir aiškios prasmės neturi. Buvo, nebuvo – jokio skirtumo. Na žinoma, mes galėtume atrasti ryšį – juk tam, kad paimti iš jo interviu, mes turėjome sėsti į džipą ir tris dienas važiuoti per dykumas ir džiungles link jo namų, pasišviesdami ne kuo kitu, o elektros lemputėmis. Jei nebūtų elektros lemputės, nebūtume paėmę iš tigro interviu.Visa tai atskleidžia, kad prasmė kiekvienam skirtinga. Tai kas vienam prasminga, kitam beprasmiška, tai kas vienam gera, kitam bloga. Dėl to klausimas „Kokia gyvenimo prasmė?“ atsiduria aklavietėje. Prieš tai mes turime atsakyti į klausimą – prasmė kam?Patogumo dėlei suskaidysime viską kas yra į tris dalis – tai patsai žmogus, apie kurio gyvenimą kalbame, visi kiti žmonės ir visas likęs pasaulis. Dėmesio! Jeigu skaidytume kitaip – gautume ir šiek tiek kitokius atsakymus.Ir dar viena pastabėlė. Retai kada būna, kad prasmė yra arba nėra. Prasmė išsidėsto skalėje nuo labai teigiamos, link labai neigiamos. Sakysime, kad Stalino ar Hitlerio gyvenimo prasmė buvo labai neigiama, o Gandžio arba Dalai Lamos labai teigiama. Juk negalime sakyti, kad Stalino gyvenimas buvo beprasmis: jeigu pasaulis būtų be Stalino – jis būtų visiškai kitoks.",
    image:
      "https://cdn.discordapp.com/attachments/582211042810003458/1139907274584883260/20230812_160421.jpg",
  },
  {
    question: "Ar nusileidimas ant mėnulio buvo surežisuotas?",
    answer: "Tikriausiai ne",
  },
  {
    question: "☺?",
    answer: "jo ☻",
  },
];

function DUK() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">
          Dažniausiai užduodami klausimai
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded shadow p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <h2 className="text-lg font-medium">{faq.question}</h2>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    index === activeIndex ? "transform rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {index === activeIndex && (
                <>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                  <p className="mt-2">
                    <img src={faq.image} alt="" />
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DUK;
